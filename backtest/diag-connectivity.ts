#!/usr/bin/env tsx
/**
 * Диагностика подключения к Deriv WS, изолированная от пагинации/кэша.
 *
 * Зачем: реальный прогон backtest:horizon-audit показал, что ws.derivws.com
 * (основной хост, app_id=1089, предположительно полная глубина истории)
 * НИ РАЗУ не открывает сокет — 100% отказ на всех итерациях, всех символах.
 * Каждый запрос откатывается на api.derivws.com/.../public (второй хост,
 * без app_id/auth). Это может объяснять "empty batch" на ~3 дня как предел
 * глубины истории публичного эндпоинта, а не как настоящий конец данных.
 *
 * Скрипт ничего не пишет на диск и не трогает кэш — чистое измерение.
 */

const HOSTS: { label: string; url: string }[] = [
  { label: 'ws.derivws.com (app_id=1089)', url: 'wss://ws.derivws.com/websockets/v3?app_id=1089' },
  { label: 'api.derivws.com (public, no app_id)', url: 'wss://api.derivws.com/trading/v1/options/ws/public' },
];

const CONNECT_TIMEOUT_MS = 8000;
const REQUEST_TIMEOUT_MS = 10000;

function openSocket(url: string): Promise<{ ok: true; ws: WebSocket } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    let settled = false;
    const ws = new WebSocket(url);
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { ws.close(); } catch { /* noop */ }
      resolve({ ok: false, error: `timeout after ${CONNECT_TIMEOUT_MS}ms` });
    }, CONNECT_TIMEOUT_MS);

    ws.onopen = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: true, ws });
    };
    ws.onerror = (ev) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: false, error: String((ev as unknown as { message?: string })?.message ?? 'connection failed') });
    };
    ws.onclose = (ev) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: false, error: `closed before open (code=${ev.code}, reason=${ev.reason || 'n/a'})` });
    };
  });
}

function requestTicksHistory(ws: WebSocket, endSec: number, count: number): Promise<{ ok: true; count: number; oldestIso: string | null; newestIso: string | null } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    let settled = false;
    const req = { ticks_history: 'frxEURUSD', end: String(endSec), count, style: 'candles', granularity: 60 };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, error: `no response after ${REQUEST_TIMEOUT_MS}ms` });
    }, REQUEST_TIMEOUT_MS);

    const onMessage = (ev: MessageEvent) => {
      if (settled) return;
      let msg: unknown;
      try {
        msg = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      const m = msg as { msg_type?: string; error?: { message?: string }; candles?: { epoch: number }[] };
      if (m.msg_type !== 'candles' && !m.error) return; // не наш ответ, ждём дальше
      settled = true;
      clearTimeout(timer);
      ws.removeEventListener('message', onMessage);
      if (m.error) {
        resolve({ ok: false, error: m.error.message ?? 'unknown API error' });
        return;
      }
      const candles = m.candles ?? [];
      resolve({
        ok: true,
        count: candles.length,
        oldestIso: candles[0] ? new Date(candles[0].epoch * 1000).toISOString() : null,
        newestIso: candles[candles.length - 1] ? new Date(candles[candles.length - 1].epoch * 1000).toISOString() : null,
      });
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify(req));
  });
}

async function main(): Promise<void> {
  console.log('=== Deriv connectivity diagnostic ===\n');

  for (const host of HOSTS) {
    console.log(`--- ${host.label} ---`);
    console.log(`URL: ${host.url}`);
    const t0 = Date.now();
    const conn = await openSocket(host.url);
    const elapsed = Date.now() - t0;

    if (!conn.ok) {
      console.log(`❌ FAILED to open socket after ${elapsed}ms: ${conn.error}\n`);
      continue;
    }
    console.log(`✅ Socket opened in ${elapsed}ms`);

    // Насколько глубоко реально отдаёт историю этот хост для EURUSD.
    // Запрашиваем максимальный count (5000) заканчивающийся "сейчас", затем
    // ещё раз на 60/120/200 дней раньше — если во всех случаях приходит
    // одинаковое (небольшое) число свечей независимо от того, как далеко
    // мы просим "end" — это предел глубины истории эндпоинта, а не реальный
    // конец рынка.
    const now = Math.floor(Date.now() / 1000);
    const probes = [
      { label: 'end=now', end: now },
      { label: 'end=now-60d', end: now - 60 * 86400 },
      { label: 'end=now-120d', end: now - 120 * 86400 },
      { label: 'end=now-200d', end: now - 200 * 86400 },
    ];
    for (const probe of probes) {
      const r = await requestTicksHistory(conn.ws, probe.end, 5000);
      if (!r.ok) {
        console.log(`  [${probe.label}] ❌ ${r.error}`);
        continue;
      }
      console.log(`  [${probe.label}] ${r.count} candles, oldest=${r.oldestIso ?? 'n/a'}, newest=${r.newestIso ?? 'n/a'}`);
    }
    try { conn.ws.close(); } catch { /* noop */ }
    console.log('');
  }

  console.log('=== Как читать результат ===');
  console.log('- Если ws.derivws.com не открылся ни разу → это сетевая/ISP/firewall блокировка');
  console.log('  именно этого хоста от вашей сети, не связанная с кодом проекта.');
  console.log('- Если api.derivws.com открылся, но во всех 4 запросах "count" примерно одинаковый');
  console.log('  и заметно меньше 5000, а "oldest" не сдвигается назад пропорционально запрошенному');
  console.log('  end → это предел глубины истории публичного (no app_id) эндпоинта, а не выходные.');
  console.log('- Если "oldest" сдвигается назад пропорционально end на каждом пробе → глубина есть,');
  console.log('  и дело было именно в обработке пустых батчей (выходные), а не в лимите API.');
}

main().catch((e: unknown) => { console.error(e); process.exit(1); });
