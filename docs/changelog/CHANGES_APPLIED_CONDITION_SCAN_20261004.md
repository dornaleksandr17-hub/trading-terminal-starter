# Condition scan — 2026-10-04

Read-only исследование (навык tts-condition-scan). Логика детекторов, ENTRY_THRESHOLD, веса, confidence и гейты НЕ менялись; OCCURRENCE_ALGORITHM_VERSION не менялся (18), LOGIC_CHANGE_LOG не требуется.

## Добавлено
- `backtest/condition-scan-core.ts` — чистое ядро: бакеты (зафиксированы до запуска), перебор срезов из 1–2 признаков, walk-forward отбор по train, оценка на test, дрейф-baseline, Holm по всему семейству.
- `backtest/condition-scan.ts` + `npm run backtest:condition-scan` — читает occurrence-кэш horizon-audit (детекция не перезапускается; для гармоник harmonicType/PRZ-конфлюэнс восстановлены тем же detectAllPatterns на тех же барах — 1012/1012 совпали по направлению и confidence).
- `backtest/condition-scan.test.ts` — детерминизм, нет утечки test в отбор, размер семейства Holm, вход не мутируется.

## Признаки
session, 4-часовое окно UTC, ADX (<20/20–25/≥25), ATR к медиане за 500 баров (<0.8/0.8–1.25/≥1.25), volume/SMA20 (<0.8/0.8–1.5/≥1.5, n/a при volume≡0), цена относительно EMA200 по направлению сделки, символ, направление, бакет confidence; для гармоник — harmonicType и PRZ-конфлюэнс (ob/fvg/none). HTF-класс не реализован (not run).

## Прогон
Крипта BTC/ETH/SOL/BNB, 1m, 2026-03-01…2026-09-17, BACKTEST_CRYPTO_SOURCE=binance (реальный объём), walk-forward 8 фолдов, purge 30, дедуп по пулу, отбор fold'а при train-точности ≥53%, минимум 200 независимых test-исходов. Отчёт: `backtest/output/condition-scan-BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-2026-03-01-2026-09-17.md/.json`.
Deriv/форекс: not run (Deriv недоступен из песочницы).

## Результат
- Семейство Holm — 569 срезов; Holm-значимых — 0.
- Срезы «direction=buy & …» у гармоник (до 61.6%) полностью объясняются ростом рынка за период: дрейф-baseline равен их точности.
- Лучшие кандидаты с Wilson LB выше дрейфа (без Holm, только для форвард-теста): harmonic `symbol=BTCUSDT` 60.2% на 231 (LB 53.7%), harmonic `adx>=25 & volume<0.8` 58.8% на 308 (LB 53.2%), strong-order-block-reaction `conf 0.60–0.70 & session=closed` 57.6% на 446 (LB 53.0%). Ни у одного LB не выше безубыточности 55.56%.

## Дополнение: HTF-класс (2026-10-04)
- Добавлены признаки `htf` (htfClassOf(htfAlignment(computeHtfStructure(окно), направление)) — та же функция, что у детекторов: 1.00-bos / 0.75-choch / 0.40-range / other) и `htfDir` (with / against / range — направление сделки относительно тренда HTF).
- Occurrence-кэш был утерян и пересчитан тем же horizon-audit (те же fingerprint, версия 18); сводный аудит-отчёт не менялся.
- Перезапуск: семейство Holm — 770 срезов, Holm-значимых — 0.
- Гармоники: `htfDir=against` 59.8% на 261 (Wilson LB 53.7%, дрейф 50.0%), `htfDir=with` 50.6% на 241 (LB 44.4%). Разница согласуется с идеей разворотного паттерна, но после Holm не значима; LB ниже безубыточности 55.56%. Кандидат для форвард-теста, не фильтр.
