import type { Candle } from '@/types/domain';
import { isCrypto, isDerivSupported, mapSymbolForDeriv } from '@/data/symbols';
import { PROVIDERS_CONFIG } from '@/data/providers.config';
import { readPage, writePage } from './candle-cache';

const BINANCE_REST = 'https://api.binance.com';
// BUGFIX (промт "Исправление по воронке гейтов", продолжение — "как был
// реализован прогон истории"): раньше здесь был один захардкоженный
// DERIV_WS = 'wss://ws.derivws.com/websockets/v3?app_id=1089' — единая
// точка отказа. Фикс с fallback-хостами (Фаза 0, 7 падающих тестов
// connection-manager.test.ts/deriv.test.ts) применили только к live-
// подключению (src/data/sources/deriv.ts) — этот отдельный, самостоятельный
// загрузчик истории для аудита его не унаследовал.
//
// Не переиспользуем buildDerivWsUrls()/resolveDerivAppId() из
// providers.config.ts напрямую: resolveDerivAppId() читает
// `import.meta.env.VITE_DERIV_APP_ID`, а это Vite-специфичная подстановка,
// которой под `tsx` (см. package.json: "tsx --tsconfig ... backtest/*.ts")
// просто нет — `import.meta.env` там `undefined`, и обращение к
// `.VITE_DERIV_APP_ID` уронило бы весь прогон TypeError'ом ещё до первого
// запроса. Эта функция раньше в backtest-коде вообще не вызывалась, поэтому
// это было бы новым, непроверенным риском, а не воспроизведением уже
// работающего пути. PROVIDERS_CONFIG — обычный объект (`as const`), без
// побочных эффектов при импорте, поэтому список хостов из него безопасно
// переиспользовать напрямую, а app_id брать из process.env (Node-эквивалент
// import.meta.env.VITE_DERIV_APP_ID для CLI-скриптов) с фолбэком на дефолт.
// BUGFIX (реальный прогон 2026-09-27, лог GBPUSD): ws.derivws.com уже
// диагностирован как 100%-недоступный с этой сети (см. комментарий у
// EMPTY_BATCH_SKIP_SECONDS ниже), но fetchDerivBatchWithFallback всё равно
// пробует его ПЕРВЫМ на КАЖДОЙ странице (см. getDerivWsUrls/PROVIDERS_CONFIG
// ниже) — то есть каждый запрос гарантированно тратит RETRY_ATTEMPTS
// попыток на заведомо мёртвый хост, прежде чем дойти до рабочего
// api.derivws.com. За ~230 страниц на один только EURUSD это заметная лишняя
// нагрузка на сеть/на рабочий хост, и вероятный вклад в последующий обрыв
// GBPUSD (оба хоста отказали в течение ~30с бэкоффа при исчерпании
// MAX_CONSECUTIVE_FETCH_ERRORS). НЕ меняем порядок/список хостов в
// providers.config.ts — это общий конфиг живого приложения (src/data/
// sources/deriv.ts), и то, что ws.derivws.com недоступен именно с ЭТОЙ сети,
// не факт для всех сетей/пользователей, чтобы жёстко зашивать это глобально.
// Вместо этого — опциональный, по умолчанию НЕ включённый флаг именно для
// backtest-скрипта: `BACKTEST_SKIP_DERIV_HOSTS=ws.derivws.com` (через запятую
// для нескольких) пропускает совпадающие хосты при построении списка URL.
export function getDerivWsUrls(): string[] {
  const appId = encodeURIComponent(process.env.VITE_DERIV_APP_ID?.trim() || PROVIDERS_CONFIG.deriv.defaultAppId);
  const noAppId: readonly number[] = PROVIDERS_CONFIG.deriv.wsEndpointsNoAppId ?? [];
  const urls = PROVIDERS_CONFIG.deriv.wsEndpoints.map((base, i) =>
    noAppId.includes(i) ? base : `${base}?app_id=${appId}`,
  );
  const skip = (process.env.BACKTEST_SKIP_DERIV_HOSTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (skip.length === 0) return urls;
  const filtered = urls.filter((u) => !skip.some((host) => u.includes(host)));
  // Не оставляем список пустым по невнимательности (опечатка в env-значении
  // ведь может совпасть со ВСЕМИ хостами) — тогда лучше вернуться к полному
  // списку и вывести предупреждение, чем упасть без единого доступного хоста.
  if (filtered.length === 0) {
    console.warn(`  [Deriv] BACKTEST_SKIP_DERIV_HOSTS исключил все хосты — игнорирую фильтр`);
    return urls;
  }
  return filtered;
}
// Deriv ticks_history accepts count up to 5000 — 5× more data per request
// than the previous 1000. Verified: the API does not silently truncate.
const MAX_PER_REQUEST = 5000;
const BINANCE_MAX_PER_REQUEST = 1000;
const REQUEST_TIMEOUT_MS = 15_000;
const DERIV_GRANULARITY = 60;
// Это аварийный предохранитель от зависшего цикла, НЕ ограничитель объёма
// данных — реальную остановку делают три легитимных условия ниже (reached
// start boundary / no progress / too many empty batches in a row). BUGFIX
// (v7, форекс-прогон 2026-03-01..2026-09-17): 200 оказалось туже, чем
// реальная потребность (~300+ итераций при среднем throughput ~958
// свечей/итерацию из-за частичных батчей на границах форекс-сессий),
// поэтому предохранитель срабатывал раньше легитимной остановки и молча
// обрезал историю. Подняли с большим запасом — это не magic number под
// текущий диапазон, а по-настоящему "это не должно происходить в принципе".
const MAX_DERIV_ITERATIONS = 3000;
const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

/**
 * Оборачивает одну сетевую попытку (одну страницу) в retry с экспоненциальной
 * паузой. До RETRY_ATTEMPTS попыток — таймаут/обрыв WS/5xx на одной странице
 * больше не роняет весь многочасовой прогон.
 */
async function fetchWithRetry<T>(fn: () => Promise<T>, attempts = RETRY_ATTEMPTS): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < attempts - 1) {
        const delayMs = RETRY_BASE_DELAY_MS * 2 ** attempt;
        console.log(`  [retry] attempt ${attempt + 1}/${attempts} failed (${err instanceof Error ? err.message : String(err)}), retrying in ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastErr;
}

export interface LoadOptions {
  symbol: string;
  fromMs: number;
  toMs: number;
}

export interface LoadResult {
  candles: Candle[];
  truncated: boolean;
}

export type HistorySource = 'binance' | 'deriv';

/**
 * Единая точка выбора источника истории (её же использует метка в отчёте и
 * ключ кэша occurrences). По умолчанию маршрут прежний: isDerivSupported()
 * проверяется первым, поэтому BTC/ETH/SOL/BNB идут через Deriv (volume ≡ 0).
 * BACKTEST_CRYPTO_SOURCE=binance переключает КРИПТУ на Binance REST (реальный
 * объём); форекс всегда остаётся на Deriv.
 */
export function resolveHistorySource(
  symbol: string,
  env: Record<string, string | undefined> = process.env,
): HistorySource {
  const preferBinance = env.BACKTEST_CRYPTO_SOURCE?.trim().toLowerCase() === 'binance';
  if (preferBinance && isCrypto(symbol)) return 'binance';
  if (isDerivSupported(symbol)) return 'deriv';
  if (isCrypto(symbol)) return 'binance';
  return 'deriv';
}

export async function loadHistory(options: LoadOptions): Promise<LoadResult> {
  if (resolveHistorySource(options.symbol) === 'binance') {
    return { candles: await loadBinanceHistory(options), truncated: false };
  }
  return loadDerivHistory(options);
}

async function loadBinanceHistory(options: LoadOptions): Promise<Candle[]> {
  const { symbol, fromMs, toMs } = options;
  const candles: Candle[] = [];
  let startTime = fromMs;
  let pagesFromCache = 0;
  let pagesFetched = 0;

  while (startTime < toMs) {
    let batch = await readPage('binance', symbol, startTime);
    if (batch) {
      pagesFromCache++;
    } else {
      batch = await fetchWithRetry(() => fetchBinanceBatch(symbol, startTime, toMs));
      await writePage('binance', symbol, startTime, batch);
      pagesFetched++;
    }
    if (batch.length === 0) break;

    for (const c of batch) {
      if (c.time * 1000 <= toMs) candles.push(c);
    }

    if (batch.length < BINANCE_MAX_PER_REQUEST) break;
    startTime = batch[batch.length - 1].time * 1000 + 60_000;
  }

  if (pagesFromCache > 0) {
    console.log(`  [Binance] ${symbol}: ${pagesFromCache} page(s) from disk cache, ${pagesFetched} fetched over network`);
  }
  return deduplicate(candles);
}

async function fetchBinanceBatch(symbol: string, startTime: number, endTime: number): Promise<Candle[]> {
  const url =
    `${BINANCE_REST}/api/v3/klines?symbol=${symbol}&interval=1m` +
    `&startTime=${startTime}&endTime=${endTime}&limit=${BINANCE_MAX_PER_REQUEST}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Binance API ${res.status} ${res.statusText}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) throw new Error('Binance API: unexpected response shape');
    return rows.map(parseKlineRow);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Binance API: request timeout');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function parseKlineRow(row: unknown): Candle {
  const r = row as (string | number)[];
  return {
    time: Math.floor(Number(r[0]) / 1000),
    open: parseFloat(String(r[1])),
    high: parseFloat(String(r[2])),
    low: parseFloat(String(r[3])),
    close: parseFloat(String(r[4])),
    volume: parseFloat(String(r[5])),
  };
}

// BUGFIX (реальный прогон 2026-09-27, диагностика backtest/diag-connectivity.ts):
// изначальное допущение "forex weekend gaps produce partial batches, not
// empty ones" оказалось НЕВЕРНЫМ для ws-хоста, который реально используется
// (ws.derivws.com недоступен с этой сети на 100% попыток — см.
// providers.config.ts, всегда используется fallback api.derivws.com). Прямая
// диагностика этого хоста показала: если весь запрошенный интервал целиком
// приходится на закрытые выходные, сервер отдаёт ПОЛНОСТЬЮ пустой
// `candles: []`, а не "хвост" последней торговой сессии перед выходными —
// именно так реальный прогон обрывался на ~3 дня (iteration 6) вместо
// ~300+ итераций. Раньше пустой батч трактовался как "источник исчерпан" и
// пагинация останавливалась немедленно. Теперь: пустой батч — это ВОЗМОЖНО
// просто выходные/праздник, поэтому прыгаем на EMPTY_BATCH_SKIP_SECONDS
// назад и пробуем ещё раз; сдаёмся только после MAX_CONSECUTIVE_EMPTY_BATCHES
// пустых батчей подряд (это уже непохоже на обычные форекс-выходные).
// TUNING (реальный прогон 2026-09-27, 200-дневный форекс-диапазон
// 2026-03-01..2026-09-17): изначальный запас в 3 суток (72ч) был выбран как
// безопасная подстраховка при фиксе бага 1 ("не зациклиться на пустых
// батчах"), но не был измерен на реальных данных. Реальный форекс-гэп на
// выходных — стандартные 48ч (пт 22:00 → вс 22:00 UTC). Прогон показал:
// ожидалось ~206040 торговых минут на символ (200 суток минус 28 полных
// выходных по 48ч), реально получено 165601 — недостача 40439 мин ≈ 28
// суток, при 29 срабатываниях "empty batch ... skipping back 3d" в логе.
// Совпадение почти один-в-один с гипотезой "лишние 24ч перелёта на каждый
// прыжок (72ч запас - 48ч реальный гэп)" — то есть константа в 72ч
// систематически съедала ~14% реальной торговой истории по всему диапазону,
// причём не случайных дней, а конкретно тех, что примыкают к выходным
// (потенциально искажая паттерны с сессионной привязкой). Сужаем до 54ч:
// 48ч реальный гэп + 6ч запас на возможные расхождения в расписании/DST —
// в 4 раза меньше лишнего перелёта, чем раньше.
const EMPTY_BATCH_SKIP_SECONDS = 54 * 60 * 60; // 54 часа (48ч реальный форекс-гэп + 6ч запас)
const MAX_CONSECUTIVE_EMPTY_BATCHES = 3; // 3×54ч ≈ 6.75 суток — с запасом покрывает и праздничные закрытия (Рождество/Новый год)

// BUGFIX (реальный прогон 2026-09-27, обрыв на итерации ~125 при загрузке
// EURUSD): fetchDerivBatchWithFallback уже переживает недоступность
// ws.derivws.com (100% отказ с этой сети) через фолбэк на api.derivws.com
// с собственным бюджетом ретраев на каждый хост (fetchWithRetry). Но если
// ОБА хоста исчерпали попытки на одном конкретном батче — например,
// из-за секундного сетевого сбоя на линии пользователя посреди
// многочасового прогона, а не из-за структурной причины вроде выходных —
// fetchDerivBatchWithFallback пробрасывает ошибку, а paginateDerivHistory
// её ничем не ловил: один транзиентный сбой ронял ВЕСЬ прогон (часы
// скачивания истории по нескольким символам), а не только текущий батч.
// Это отдельная причина от "пустого батча = конец истории" (баг 1,
// обработан ниже отдельным счётчиком consecutiveEmptyBatches) — сетевая
// ошибка и легитимный пустой ответ API различимы (catch vs batch.length
// === 0) и должны обрабатываться раздельно, чтобы не путать "нет данных за
// этот период" с "не удалось спросить, есть ли данные". Симметрично
// пустым батчам: даём разумный запас попыток с нарастающим бэкоффом на
// том же endTime (не прыгаем вперёд/назад — это не про пропуск диапазона,
// а про "спросить ещё раз, когда сеть отдышится"), сдаёмся только после
// MAX_CONSECUTIVE_FETCH_ERRORS подряд — тогда это уже не блип, а
// легитимный повод остановить прогон целиком.
const FETCH_ERROR_RETRY_BASE_DELAY_MS = 2000;
const MAX_CONSECUTIVE_FETCH_ERRORS = 5;

export async function paginateDerivHistory(
  options: LoadOptions,
  fetchPage: (endTime: number) => Promise<{ batch: Candle[]; fromCache: boolean }>,
): Promise<{ candles: Candle[]; truncated: boolean }> {
  const { fromMs, toMs } = options;
  const allCandles: Candle[] = [];
  let endTime = Math.floor(toMs / 1000);
  const startSec = Math.floor(fromMs / 1000);
  let iterations = 0;
  let prevEndTime = endTime + 1;
  let pagesFromCache = 0;
  let pagesFetched = 0;
  let truncated = false;
  let consecutiveEmptyBatches = 0;
  let consecutiveFetchErrors = 0;
  // Единственное состояние, которое доказывает полноту истории — реально
  // дошедший до startSec самый старый полученный батч (reachedStart=true).
  // Любой guard/предохранитель (iteration cap / consecutive-empty /
  // no-progress) — это ПРЕДПОЛОЖЕНИЕ, что дальше данных нет, а не
  // доказательство: раньше (см. баг 3/4 в этом же проекте) truncated
  // выставлялся только по iteration cap, из-за чего два других guard'а
  // молча сообщали truncated=false, даже не дойдя до startSec. Тот же класс
  // бага здесь воспроизвёлся в третий раз для нового
  // consecutiveEmptyBatches guard'а — фиксируем единообразно.
  let reachedStart = false;

  while (endTime > startSec && iterations < MAX_DERIV_ITERATIONS) {
    iterations++;
    let batch: Candle[];
    let fromCache: boolean;
    try {
      const page = await fetchPage(endTime);
      batch = page.batch;
      fromCache = page.fromCache;
    } catch (err) {
      consecutiveFetchErrors++;
      const message = err instanceof Error ? err.message : String(err);
      if (consecutiveFetchErrors >= MAX_CONSECUTIVE_FETCH_ERRORS) {
        console.log(`  [Deriv] giving up after ${consecutiveFetchErrors} consecutive fetch errors at iteration ${iterations} (endTime=${endTime}): ${message} — this looks like a real outage, not a blip`);
        throw err;
      }
      const delayMs = FETCH_ERROR_RETRY_BASE_DELAY_MS * 2 ** (consecutiveFetchErrors - 1);
      console.log(`  [Deriv] fetch error at iteration ${iterations} (${consecutiveFetchErrors}/${MAX_CONSECUTIVE_FETCH_ERRORS} consecutive, endTime=${endTime}): ${message} — retrying same batch in ${delayMs}ms`);
      iterations--;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }
    consecutiveFetchErrors = 0;
    if (fromCache) {
      pagesFromCache++;
    } else {
      pagesFetched++;
    }
    if (batch.length === 0) {
      consecutiveEmptyBatches++;
      if (consecutiveEmptyBatches >= MAX_CONSECUTIVE_EMPTY_BATCHES) {
        console.log(`  [Deriv] stopping: ${consecutiveEmptyBatches} consecutive empty batches at iteration ${iterations} (endTime=${endTime}) — API likely exhausted`);
        break;
      }
      console.log(`  [Deriv] empty batch at iteration ${iterations} (endTime=${endTime}) — likely a forex weekend/holiday gap, skipping back ${EMPTY_BATCH_SKIP_SECONDS / 86400}d and retrying`);
      endTime -= EMPTY_BATCH_SKIP_SECONDS;
      continue;
    }
    consecutiveEmptyBatches = 0;

    const oldest = batch[0].time;
    for (const c of batch) {
      if (c.time >= startSec && c.time <= endTime) allCandles.push(c);
    }

    if (oldest <= startSec) {
      reachedStart = true;
      console.log(`  [Deriv] stopping: reached start boundary at iteration ${iterations} (oldest=${oldest}, start=${startSec})`);
      break;
    }

    // No-progress guard: if oldest didn't move backward, we'd loop forever
    if (oldest >= prevEndTime) {
      console.log(`  [Deriv] stopping: no progress at iteration ${iterations} (oldest=${oldest} >= prevEndTime=${prevEndTime})`);
      break;
    }

    // Do NOT break on short (but non-empty) batch — forex weekend gaps can
    // produce partial batches mid-history too. Only a fully empty batch
    // triggers the skip-back-and-retry above.
    prevEndTime = endTime;
    endTime = oldest - 1;
  }

  // Edge-случай: если последний непустой батч дал oldest === startSec + 1,
  // явная ветка выше (oldest <= startSec) не сработает, но endTime = oldest -
  // 1 = startSec, и внешний while-цикл естественно завершится по условию
  // `endTime > startSec` — это ТОЖЕ полное покрытие диапазона (потерян
  // максимум один пограничный тик), а не guard. Учитываем отдельно, чтобы не
  // штамповать ложный truncated=true на почти-идеальном результате.
  if (!reachedStart && endTime <= startSec) {
    reachedStart = true;
  }

  if (iterations >= MAX_DERIV_ITERATIONS) {
    truncated = true;
    console.log(`  [Deriv] stopping: hit iteration cap (${MAX_DERIV_ITERATIONS}) — history is INCOMPLETE, oldest fetched candle did not reach start boundary`);
  } else if (!reachedStart) {
    // Цикл завершился НЕ через подтверждённое достижение startSec — это
    // guard (consecutive-empty / no-progress), а не доказанная полнота
    // истории.
    truncated = true;
    console.log(`  [Deriv] stopping: history incomplete — did not reach requested start (${startSec}), stopped at endTime=${endTime}`);
  }

  console.log(`  [Deriv] finished after ${iterations} iterations, ${allCandles.length} candles (${pagesFromCache} page(s) from disk cache, ${pagesFetched} fetched over network)${truncated ? ' [TRUNCATED]' : ''}`);
  return { candles: deduplicate(allCandles), truncated };
}

async function loadDerivHistory(options: LoadOptions): Promise<LoadResult> {
  const { symbol } = options;
  return paginateDerivHistory(options, async (endTime) => {
    const cached = await readPage('deriv', symbol, endTime);
    if (cached) return { batch: cached, fromCache: true };
    const batch = await fetchDerivBatchWithFallback(symbol, endTime);
    await writePage('deriv', symbol, endTime, batch);
    return { batch, fromCache: false };
  });
}

interface DerivPending {
  resolve: (data: Record<string, unknown>) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * D1/data-loader fix (см. комментарий у getDerivWsUrls выше): перебирает
 * список Deriv WS-хостов по порядку. Для каждого хоста сначала даётся его
 * собственный бюджет ретраев (fetchWithRetry — транзиентные обрывы/таймауты
 * на ОДНОМ хосте), и только если хост исчерпал все попытки — переходим к
 * следующему. Раньше при недоступности единственного хоста весь прогон
 * (часы скачивания истории) падал целиком.
 */
async function fetchDerivBatchWithFallback(symbol: string, endEpoch: number): Promise<Candle[]> {
  const urls = getDerivWsUrls();
  let lastErr: unknown;
  for (let i = 0; i < urls.length; i++) {
    try {
      return await fetchWithRetry(() => fetchDerivBatch(symbol, endEpoch, urls[i]));
    } catch (err) {
      lastErr = err;
      if (i < urls.length - 1) {
        console.log(`  [Deriv] host ${new URL(urls[i]).host} исчерпал попытки (${err instanceof Error ? err.message : String(err)}), пробуем следующий хост`);
      }
    }
  }
  throw lastErr;
}

async function fetchDerivBatch(symbol: string, endEpoch: number, wsUrl: string): Promise<Candle[]> {
  const derivSymbol = mapSymbolForDeriv(symbol);
  return new Promise<Candle[]>((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map<number, DerivPending>();
    let settled = false;

    const cleanup = () => {
      pending.forEach((p) => { clearTimeout(p.timer); });
      pending.clear();
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Deriv WS: request timeout'));
    }, REQUEST_TIMEOUT_MS);

    ws.onopen = () => {
      const reqId = 1;
      pending.set(reqId, {
        resolve: (data) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          const candlesRaw = data.candles as Array<Record<string, unknown>> | undefined;
          if (!Array.isArray(candlesRaw)) {
            reject(new Error('Deriv: unexpected history shape'));
            return;
          }
          const candles = candlesRaw.map((c) => ({
            time: Number(c.epoch),
            open: Number(c.open),
            high: Number(c.high),
            low: Number(c.low),
            close: Number(c.close),
            volume: 0,
          }));
          resolve(candles);
        },
        reject: (err) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(err);
        },
        timer,
      });
      ws.send(JSON.stringify({
        ticks_history: derivSymbol,
        end: String(endEpoch),
        style: 'candles',
        granularity: DERIV_GRANULARITY,
        count: MAX_PER_REQUEST,
        req_id: 1,
      }));
    };

    ws.onmessage = (e) => {
      if (typeof e.data !== 'string') return;
      let data: unknown;
      try { data = JSON.parse(e.data); } catch { return; }
      if (!data || typeof data !== 'object') return;
      const msg = data as Record<string, unknown>;
      const reqId = typeof msg.req_id === 'number' ? msg.req_id : (typeof msg.req_id === 'string' ? Number(msg.req_id) : undefined);
      if (reqId && pending.has(reqId)) {
        const p = pending.get(reqId)!;
        pending.delete(reqId);
        if (msg.error) {
          const errMessage = (msg.error as Record<string, unknown>).message;
          p.reject(new Error(typeof errMessage === 'string' ? errMessage : 'Deriv error'));
        } else {
          p.resolve(msg);
        }
      }
    };

    ws.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error('Deriv WS: connection failed'));
    };

    ws.onclose = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error('Deriv WS: connection closed unexpectedly'));
      }
    };
  });
}

function deduplicate(candles: Candle[]): Candle[] {
  const seen = new Set<number>();
  const result: Candle[] = [];
  for (const c of candles) {
    if (!seen.has(c.time)) {
      seen.add(c.time);
      result.push(c);
    }
  }
  return result.sort((a, b) => a.time - b.time);
}
