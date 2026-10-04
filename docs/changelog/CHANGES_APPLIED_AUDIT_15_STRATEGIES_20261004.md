# Аудит 15 стратегий — 2026-10-04

Логика детекторов, пороги, веса, confidence, экономика и OCCURRENCE_ALGORITHM_VERSION не менялись.

- Отчёт: docs/audit/AUDIT_15_STRATEGIES_20261004.md.
- Перезапущен horizon-audit по крипте (Binance, реальный объём, версия алгоритма 18) — обновлены backtest/output/horizon-audit-BTCUSDT-…-walkforward-2026-03-01-2026-09-17.md/.json. Форекс не перезапускался (нет доступа к Deriv), таблица горизонтов не перегенерирована.
- Тесты под Vitest 4: конструируемые заглушки (`function` вместо стрелок) в WorkerClient.test.ts и useTickStore.test.ts, сброс накопленных вызовов шпиона в tick-store/outcomes.test.ts.
- Lint: убраны лишние приведения типов в src/lib/error-capture.ts, `void` у router.invalidate() в src/routes/__root.tsx.
