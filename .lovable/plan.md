# Аудит 15 стратегий и рекомендации (только анализ, логика не меняется)

## Что будет сделано
1. **Прочитать целиком все 15 детекторов** (src/compute/patterns/*: impulse-breakout, consolidation-breakout, liquidity-sweep, liquidity-sweep-reaction, mean-reversion, strong-order-block-reaction, order-block-continuation, order-block-breaker, order-block-nested, fvg-return, fvg-breaker-block, fvg-nested, fvg-rejection, macd-deceleration-continuation, harmonic-pattern) и общие модули (pattern-context, fvg-strategies-shared, fvg-m1-entry-shared, smart-money, session-regime).
2. **Прогнать проверки**: `npm run ci` (typecheck + lint + test + gen-horizon-table:check), отдельно regression/golden-тесты occurrences. Результаты — как есть, без правок кода.
3. **Бэктесты**: в этой среде нет сети до Deriv/Binance — horizon-audit будет помечен «не запускался». Анализ опирается на уже закоммиченные отчёты backtest/output/horizon-audit-* (крипта и форекс, 2026-03-01…2026-09-17). Цифры берутся только из них.
4. **Отчёт** docs/audit/AUDIT_15_STRATEGIES_<дата>.md, по каждой стратегии:
   - что реально проверяет детектор (с точными порогами из кода) и расхождения со спецификацией из вашего документа;
   - текущие числа из аудита: n дедуп., acc, Wilson LB, статус;
   - найденные дефекты (утечки будущего, повторные срабатывания одной зоны, объёмные гейты на volume=0, HTF-привязка, корреляция фильтров);
   - взгляд 11 ролей: какие контекстные срезы стоит проверить (сессия/Kill Zone, ADX-режим, HTF-класс, глубина прокола, возраст FVG/OB, harmonicType, spread/ATR).
5. **Рекомендации и идеи** к цели 53–56%: приоритизированный список гипотез для condition-scan (границы бакетов фиксируются заранее, Holm, ≥200 независимых test-наблюдений), с явным напоминанием: безубыточность при 80% = 55.56%, диапазон 53–56% в основном ниже неё; инверсия пробойных — только post-hoc пометка.

## Чего не будет
- Изменений порогов, весов, confidence, гейтов, LOGIC_CHANGE_LOG, выплаты.
- Выдуманных результатов: где выборки нет — «недостаточно данных», где не запускалось — «не запущено».
- Реализации condition-scan (это следующий отдельный шаг по вашему заданию A–B, если одобрите).

## Технические детали
- Команды: `bun run ci`, `bunx vitest run backtest/build-occurrences-regression.test.ts`.
- Выходные команды для владельца (локально): `npm run backtest:horizon-audit -- --symbols BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT --timeframe 1m --from 2026-03-01 --to 2026-09-17 --dedupe-scope=pool --funnel` и тот же прогон с `BACKTEST_CRYPTO_SOURCE=binance`.
