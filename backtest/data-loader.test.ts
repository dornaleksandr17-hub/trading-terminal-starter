import { describe, it, expect, vi, afterEach } from 'vitest';
import { paginateDerivHistory, getDerivWsUrls } from './data-loader';
import type { Candle } from '@/types/domain';

function makeCandle(time: number): Candle {
  return { time, open: 1, high: 1.1, low: 0.9, close: 1, volume: 0 };
}

/** count свечей секундной "гранулярности", заканчивающихся на endTime (включительно), идущих назад. */
function makeBatch(endTime: number, count: number): Candle[] {
  const batch: Candle[] = [];
  for (let i = count - 1; i >= 0; i--) {
    batch.push(makeCandle(endTime - i));
  }
  return batch;
}

describe('paginateDerivHistory', () => {
  it('stops at the start boundary (legitimate stop, not truncated)', async () => {
    // Один запрос покрывает весь запрошенный диапазон целиком.
    const fromMs = 1_000 * 1000;
    const toMs = 1_100 * 1000;
    const result = await paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (endTime) => Promise.resolve({
      batch: makeBatch(endTime, 200),
      fromCache: false,
    }));
    expect(result.truncated).toBe(false);
    expect(result.candles.length).toBeGreaterThan(0);
    expect(result.candles[0].time).toBeGreaterThanOrEqual(Math.floor(fromMs / 1000));
  });

  // BUGFIX (реальный прогон 2026-09-27, диагностика backtest/diag-connectivity.ts):
  // раньше ОДИН пустой батч трактовался как "источник исчерпан" и пагинация
  // немедленно останавливалась. Прямая диагностика реального Deriv-хоста
  // показала: если весь запрошенный интервал целиком приходится на закрытые
  // выходные, сервер отдаёт полностью пустой `candles: []`, а не "хвост"
  // последней торговой сессии — то есть пустой батч мог означать ПРОСТО
  // TUNING (реальный прогон 2026-09-27): раньше здесь стоял прыжок на 3
  // суток (72ч) — безопасная, но неизмеренная подстраховка. Реальный прогон
  // на 200-дневном форекс-диапазоне показал, что это систематически съедает
  // ~1 торговые сутки на каждый выходной (72ч запас - 48ч реальный гэп =
  // 24ч лишнего перелёта), около 14% данных по всему диапазону. Тест ниже
  // проверяет уточнённое значение — падает на старом коде (72ч), проходит
  // на новом (54ч = 48ч реальный форекс-гэп + 6ч запас).
  it('skips over a single empty batch (weekend gap) and keeps collecting further back, not truncated', async () => {
    const fromMs = 0;
    const toMs = 2_000_000 * 1000;
    const startSec = 0;
    let calls = 0;
    const seenEndTimes: number[] = [];
    const result = await paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (endTime) => {
      calls++;
      seenEndTimes.push(endTime);
      if (calls === 1) return Promise.resolve({ batch: makeBatch(endTime, 100), fromCache: false });
      if (calls === 2) return Promise.resolve({ batch: [], fromCache: false }); // выходные
      // После пропуска данные снова есть — сразу покрываем весь оставшийся
      // диапазон, чтобы тест завершился детерминированно.
      return Promise.resolve({ batch: [makeCandle(startSec), makeCandle(endTime)], fromCache: false });
    });
    expect(result.truncated).toBe(false);
    expect(calls).toBe(3);
    // Между пустым батчем (2-й вызов) и повтором (3-й вызов) endTime должен
    // сдвинуться ровно на 54 часа назад (48ч реальный форекс-гэп + 6ч
    // запас) — это и есть "прыжок", а не прежний избыточный прыжок на 72ч.
    expect(seenEndTimes[1] - seenEndTimes[2]).toBe(54 * 60 * 60);
    // Собраны свечи из обоих реальных батчей (до и после пропуска выходных).
    expect(result.candles.length).toBeGreaterThan(100);
  });

  // БАГ (найден в этой сессии, тот же класс, что баг 3/4): guard — это
  // предположение "дальше данных нет", а не доказательство. Раньше этот
  // тест ожидал truncated=false, хотя startSec=0 здесь НЕ достигнут (данные
  // обрываются на endTime далеко выше 0) — то есть сдача по guard'у молча
  // маскировала бы реальную нехватку истории точно так же, как раньше
  // маскировал iteration cap (баг 3).
  it('gives up after 3 consecutive empty batches (real end of history, not a weekend) and reports truncated=true', async () => {
    const fromMs = 0;
    const toMs = 2_000_000 * 1000;
    let calls = 0;
    const result = await paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (endTime) => {
      calls++;
      if (calls === 1) return Promise.resolve({ batch: makeBatch(endTime, 50), fromCache: false });
      // Три пустых батча подряд (~6.75 суток без единой свечи, 3×54ч) — это
      // уже не обычные форекс-выходные или праздники, а признак настоящего
      // конца истории. Но мы это лишь ПРЕДПОЛАГАЕМ, не проверив; startSec=0
      // здесь так и не достигнут — значит, это truncated.
      return Promise.resolve({ batch: [], fromCache: false });
    });
    expect(result.truncated).toBe(true);
    expect(calls).toBe(4); // 1 реальный + 3 пустых подряд, затем сдаёмся
    expect(result.candles.length).toBe(50);
  });

  // BUGFIX (реальный прогон 2026-09-27, обрыв на итерации ~125 при загрузке
  // EURUSD): один транзиентный сбой fetchPage (оба Deriv-хоста одновременно
  // исчерпали ретраи на ОДНОМ батче) раньше пробрасывался наружу без единой
  // попытки повторить — падал весь многочасовой прогон. На старом коде этот
  // тест падает: paginateDerivHistory пробрасывает ошибку уже на первом же
  // сбое, не давая шанса на восстановление после трёх, что не то поведение,
  // какое мы хотим для транзиентного сбоя.
  it('retries the same batch after transient fetch errors and keeps collecting (not truncated)', async () => {
    // Настоящий бэкофф (2с/4с/...) реально ждать в юнит-тесте не нужно и не
    // должно — таймеры подделываем, чтобы проверить именно логику повторов,
    // а не тратить время прогона тестов на реальные секунды ожидания.
    vi.useFakeTimers();
    try {
      const fromMs = 1_000 * 1000;
      const toMs = 1_100 * 1000;
      let calls = 0;
      const seenEndTimes: number[] = [];
      const resultPromise = paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (endTime) => {
        calls++;
        seenEndTimes.push(endTime);
        // Первые 2 попытки — транзиентный сетевой сбой (оба Deriv-хоста
        // одновременно не ответили на этот конкретный батч); 3-я попытка —
        // сеть отдышалась, батч приходит нормально.
        if (calls <= 2) return Promise.reject(new Error('Deriv WS: connection failed'));
        return Promise.resolve({ batch: makeBatch(endTime, 200), fromCache: false });
      });
      await vi.runAllTimersAsync();
      const result = await resultPromise;
      expect(calls).toBe(3);
      // Повторяем ТОТ ЖЕ endTime при сбое — это не пропуск диапазона (как
      // для пустых батчей), а просто "спросить ещё раз".
      expect(seenEndTimes[0]).toBe(seenEndTimes[1]);
      expect(seenEndTimes[1]).toBe(seenEndTimes[2]);
      expect(result.truncated).toBe(false);
      expect(result.candles.length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('gives up after 5 consecutive fetch errors and rethrows (real outage, not a blip)', async () => {
    vi.useFakeTimers();
    try {
      const fromMs = 1_000 * 1000;
      const toMs = 1_100 * 1000;
      let calls = 0;
      const failure = new Error('Deriv WS: connection failed');
      const resultPromise = paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (_endTime) => {
        calls++;
        return Promise.reject(failure);
      });
      // На отвергнутый промис нужен обработчик ДО того, как таймеры дадут
      // ему возможность реально отклониться — иначе Node пожалуется на
      // unhandled rejection в промежутке между стартом и await ниже.
      const assertion = expect(resultPromise).rejects.toThrow(failure);
      await vi.runAllTimersAsync();
      await assertion;
      expect(calls).toBe(5);
    } finally {
      vi.useRealTimers();
    }
  });

  // Guard/предохранитель — это предположение, а не доказательство полноты
  // истории: раньше он молча помечал результат как truncated=false, что
  // маскирует именно тот сценарий, для которого этот тест написан (баг 2 —
  // протухший/повреждённый кэш-хит отдаёт прежнюю страницу вместо новой).
  // Теперь он честно помечается как truncated=true.
  it('stops on the no-progress guard and reports truncated=true (guard is not proof of completeness)', async () => {
    const fromMs = 0;
    const toMs = 1_000 * 1000;
    let calls = 0;
    const result = await paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, () => {
      calls++;
      // Первая страница честно продвигается назад до oldest=901.
      if (calls === 1) return Promise.resolve({ batch: makeBatch(1000, 100), fromCache: false });
      // Вторая страница (буквально любой endTime) возвращает ту же "старую"
      // свечу, что и первая — не продвигается назад относительно prevEndTime.
      // Реалистичный аналог: протухший/повреждённый кэш-хит отдаёт прежнюю
      // страницу вместо новой (см. баг 2 в этом же проекте).
      return Promise.resolve({ batch: [makeCandle(1000)], fromCache: false });
    });
    expect(result.truncated).toBe(true);
    expect(calls).toBe(2);
  });

  // Edge-случай, вскрытый при переносе этого фикса из соседней ветки: если
  // последний непустой батч даёт oldest РОВНО startSec+1, явная ветка
  // "oldest <= startSec" не срабатывает, но endTime после декремента как раз
  // равен startSec, и внешний while естественно завершает цикл БЕЗ явного
  // break. Это тоже полное покрытие диапазона (потерян максимум один
  // пограничный тик) — должно остаться truncated=false, а не ложно
  // штамповаться как guard.
  it('treats oldest === startSec + 1 as reaching the start (natural loop exit, not truncated)', async () => {
    const fromMs = 1000; // startSec = 1
    const toMs = 100_000;
    const result = await paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (endTime) => {
      // Один батч сразу доходит до oldest=2 (startSec+1) и покрывает весь
      // остаток диапазона одним запросом.
      return Promise.resolve({ batch: makeBatch(endTime, endTime - 1), fromCache: false });
    });
    expect(result.truncated).toBe(false);
    expect(result.candles[0].time).toBe(2);
  });

  // Регрессия на баг 3: MAX_DERIV_ITERATIONS срабатывал раньше, чем любое из
  // трёх легитимных условий остановки, и молча обрезал историю (в реальном
  // прогоне — форекс, 200-дневный диапазон, лимит 200 итераций при throughput
  // ~958 свечей/итерацию). Здесь диапазон намеренно на порядки больше того,
  // что можно пройти до реального (низкого) MAX_DERIV_ITERATIONS при
  // прогрессе в одну секунду за итерацию — так тест не завязан на конкретное
  // числовое значение константы и не станет false-negative при его изменении.
  it('hits the iteration cap on an enormous range and reports truncated=true', async () => {
    const DAY_MS = 24 * 60 * 60 * 1000;
    const fromMs = 0;
    const toMs = 100_000 * DAY_MS;
    const result = await paginateDerivHistory({ symbol: 'EURUSD', fromMs, toMs }, (endTime) => Promise.resolve({
      // Прогресс есть (не triggers no-progress), батч не пуст (не triggers
      // empty-batch), но диапазон настолько велик, что до startSec дойти
      // за разумное число итераций нельзя — должен сработать iteration cap.
      batch: makeBatch(endTime, 1),
      fromCache: false,
    }));
    expect(result.truncated).toBe(true);
    expect(result.candles.length).toBeGreaterThan(0);
  });

  /** count свечей ГРАНУЛЯРНОСТЬЮ 60с (как DERIV_GRANULARITY), заканчивающихся на endTime, идущих назад. */
  function makeMinuteBatch(endTime: number, count: number): Candle[] {
    const batch: Candle[] = [];
    for (let i = count - 1; i >= 0; i--) {
      batch.push(makeCandle(endTime - i * 60));
    }
    return batch;
  }

  // Тот же баг 3, но воспроизведённый на реалистичных числах из аудита, а не
  // на заведомо огромном диапазоне: ~200 форекс-дней 1-минутных свечей
  // (granularity=60, как в проде — см. DERIV_GRANULARITY в data-loader.ts)
  // при среднем throughput ~958 свечей/итерацию (частичные батчи на границах
  // форекс-сессий, как видно из логов реального прогона) требуют ~300+
  // итераций. Старый предел 200 обрывал сбор здесь; текущий 3000 — нет. Этот
  // тест — единственный, что явно завязан на числовое значение
  // MAX_DERIV_ITERATIONS: он должен падать при откате константы на 200 и
  // проходить на текущем значении 3000.
  it('does not truncate a realistic 200-day forex range at the current MAX_DERIV_ITERATIONS', async () => {
    const DAY_SEC = 24 * 60 * 60;
    const fromSec = 0;
    const toSec = 200 * DAY_SEC; // ~200 форекс-дней, как в реальном прогоне
    const result = await paginateDerivHistory(
      { symbol: 'EURUSD', fromMs: fromSec * 1000, toMs: toSec * 1000 },
      (endTime) => {
        const remainingMinuteCandles = Math.floor((endTime - fromSec) / 60) + 1;
        // ~958 свечей за страницу — средний throughput из реального прогона
        // (частичные батчи на границах форекс-сессий), не полные 5000.
        const count = Math.max(1, Math.min(958, remainingMinuteCandles));
        return Promise.resolve({ batch: makeMinuteBatch(endTime, count), fromCache: false });
      },
    );
    expect(result.truncated).toBe(false);
  });
});

// BUGFIX (реальный прогон 2026-09-27, лог GBPUSD): ws.derivws.com уже
// диагностирован как 100%-недоступный с этой сети, но пробовался первым на
// каждой странице — лишние ретраи на каждый запрос. BACKTEST_SKIP_DERIV_HOSTS
// позволяет пропустить заведомо мёртвый хост без изменения общего
// providers.config.ts (используется живым приложением тоже).
describe('getDerivWsUrls', () => {
  const ORIGINAL_ENV = process.env.BACKTEST_SKIP_DERIV_HOSTS;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) delete process.env.BACKTEST_SKIP_DERIV_HOSTS;
    else process.env.BACKTEST_SKIP_DERIV_HOSTS = ORIGINAL_ENV;
  });

  it('returns all configured hosts when the env var is unset (default, unchanged behavior)', () => {
    delete process.env.BACKTEST_SKIP_DERIV_HOSTS;
    const urls = getDerivWsUrls();
    expect(urls.length).toBeGreaterThanOrEqual(2);
    expect(urls.some((u) => u.includes('ws.derivws.com'))).toBe(true);
    expect(urls.some((u) => u.includes('api.derivws.com'))).toBe(true);
  });

  it('filters out a host matched by BACKTEST_SKIP_DERIV_HOSTS', () => {
    process.env.BACKTEST_SKIP_DERIV_HOSTS = 'ws.derivws.com';
    const urls = getDerivWsUrls();
    expect(urls.some((u) => u.includes('ws.derivws.com'))).toBe(false);
    expect(urls.some((u) => u.includes('api.derivws.com'))).toBe(true);
  });

  it('falls back to the full list if the filter would remove every host (typo safety)', () => {
    process.env.BACKTEST_SKIP_DERIV_HOSTS = 'derivws.com'; // matches both хоста
    const urls = getDerivWsUrls();
    expect(urls.length).toBeGreaterThanOrEqual(2);
  });
});
