# Horizon Audit — BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT 1m

> Сгенерировано: 2026-10-04T23:23:05.025Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT
> Источник: Binance REST (1m candles → resampled to 1m)
> Разбиение: walk-forward, 5 folds, purge 30 bars
> Минимальный порог (train+validation): 30 срабатываний
> Минимальный порог для теста значимости (test-выборка): 200 решённых исходов
> Значимость: точный двусторонний биномиальный тест против baseline=0.5, с поправкой Holm-Bonferroni, α = 0.05
> Wilson-критерий: нижняя граница 95% интервала Уилсона ≥ 0.500 (margin=0)
> **Вердикт** (схема 2): по ДЕДУПЛИЦИРОВАННЫМ независимым наблюдениям (--dedupe-scope=pool); Holm по дедуплицированному семейству; допуск ('valid') требует нижней границы Уилсона выше max(безубыточность, дрейф-baseline).
> Выплата (payout): 80% → безубыточная доля выигрышей 55.56%
> Индикаторы: --indicators=live (18 шт.); версия алгоритма occurrences: 18

**Загружено**: 1152000 1m свечей (суммарно по пулу), 1152000 1m свечей после ресэмплинга.

## Метаданные пула

| Инструмент | 1m свечей | 1m свечей | История обрезана? |
|---|---|---|---|
| BTCUSDT | 288000 | 288000 | нет |
| ETHUSDT | 288000 | 288000 | нет |
| SOLUSDT | 288000 | 288000 | нет |
| BNBUSDT | 288000 | 288000 | нет |

> **Предупреждение о корреляции**: Пул содержит 4 инструментов. Корреляция между инструментами (особенно forex-парами с общей валютой и крипто-парами к USDT) может завышать эффективный размер выборки. Сырой p-value НЕ корректируется на межинструментную корреляцию — он оставлен только для сравнения с прошлыми отчётами. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 44
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 7
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 0
- Значимых вверх по дедуп. (Holm), всего: 0
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 1; прошли сырой Wilson-гейт: 1
- Недостаточно данных: 17
- Нет срабатываний: 9

### Пересечение критериев

- Прошли оба (формальный + Wilson): 1
- Только формальный тест: 0
- Только Wilson-гейт: 0

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| bullish-engulfing | — | 45 | 32 | 12 | — | — | 2 | 58.3% | — | — | — | — | — | 32.0% | — | — | — | недостаточно данных |
| liquidity-sweep | reversal-at-key-level | 266 | 556 | 149 | — | — | 1 | 56.4% | — | — | — | — | — | 48.4% | — | — | — | недостаточно данных |
| harmonic-pattern | — | 12366 | 25334 | 9109 | 1012 | 750 | 30 | 55.7% | 0.0000 | 53.3% | 0.0735 | да | нет | 54.7% | 49.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| pin-bar | — | 264 | 492 | 189 | — | — | 5 | 50.3% | — | — | — | — | — | 43.2% | — | — | — | недостаточно данных |
| fvg-htf-mss | — | 1571 | 2984 | 886 | 1255 | 772 | 1 | 49.4% | 0.7624 | 50.3% | 0.9140 | нет | нет | 46.2% | 46.7% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| inside-bar | — | 110558 | 211972 | 54394 | 46393 | 24270 | 1 | 50.1% | 0.6280 | 50.2% | 0.5853 | нет | нет | 49.7% | 49.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| bearish-engulfing | — | 51 | 43 | 6 | — | — | 2 | 50.0% | — | — | — | — | — | 18.8% | — | — | — | недостаточно данных |
| strong-order-block-reaction | — | 38680 | 76132 | 18808 | 6635 | 3295 | 1 | 49.3% | 0.0551 | 49.9% | 0.9168 | нет | нет | 48.6% | 48.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-nested | — | 2914 | 5607 | 1993 | 1188 | 823 | 5 | 50.5% | 0.6542 | 49.7% | 0.8891 | нет | нет | 48.3% | 46.3% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| marubozu-bullish | — | 5689 | 10051 | 3748 | 4196 | 2708 | 1 | 48.2% | 0.0324 | 48.9% | 0.2734 | нет | нет | 46.6% | 47.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| marubozu-bearish | — | 5637 | 10244 | 3716 | 4128 | 2763 | 1 | 48.0% | 0.0145 | 48.5% | 0.1100 | нет | нет | 46.4% | 46.6% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-inversion-retest | — | 25901 | 50666 | 14575 | 10155 | 6494 | 2 | 48.5% | 0.0003 | 48.3% | 0.0056 | нет | нет | 47.7% | 47.1% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-breaker-block | — | 5611 | 11327 | 4040 | 3471 | 2335 | 30 | 46.6% | 0.0000 | 48.3% | 0.0978 | нет | нет | 45.1% | 46.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-return | — | 45959 | 90993 | 25681 | 8093 | 5183 | 1 | 47.5% | 0.0000 | 48.1% | 0.0055 | нет | нет | 46.9% | 46.7% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-continuation | — | 12919 | 25307 | 9245 | 4753 | 3594 | 5 | 48.0% | 0.0002 | 48.0% | 0.0156 | нет | нет | 47.0% | 46.3% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-rejection | — | 2838 | 5723 | 1510 | 2484 | 1332 | 1 | 48.4% | 0.2265 | 47.8% | 0.1183 | нет | нет | 45.9% | 45.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-sweep-return | — | 3838 | 7705 | 2445 | 2644 | 1644 | 3 | 47.0% | 0.0028 | 47.8% | 0.0799 | нет | нет | 45.0% | 45.4% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| mean-reversion | — | 600 | 1207 | 436 | 524 | 388 | 5 | 45.9% | 0.0936 | 46.9% | 0.2429 | нет | нет | 41.3% | 42.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-breaker | — | 4676 | 9411 | 3396 | 2799 | 2033 | 30 | 46.3% | 0.0000 | 46.6% | 0.0026 | нет | нет | 44.6% | 44.5% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-nested | — | 7769 | 15564 | 5135 | 3154 | 2163 | 5 | 47.4% | 0.0002 | 46.4% | 0.0008 | нет | нет | 46.0% | 44.3% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| impulse-breakout | — | 24327 | 49450 | 14660 | 12145 | 7455 | 1 | 44.6% | 0.0000 | 45.5% | 0.0000 | нет | нет | 43.8% | 44.4% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| consolidation-breakout | — | 2799 | 5283 | 1751 | 2018 | 1369 | 1 | 46.0% | 0.0008 | 45.3% | 0.0005 | нет | нет | 43.7% | 42.7% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| bullish-harami | — | 38 | 32 | 6 | — | — | 5 | 33.3% | — | — | — | — | — | 9.7% | — | — | — | недостаточно данных |
| bearish-harami | — | 41 | 33 | 8 | — | — | 10 | 25.0% | — | — | — | — | — | 7.1% | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 17 | 7 | 10 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| macd-deceleration-continuation | — | 12 | 6 | 6 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| morning-star | — | 3 | 1 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-black-crows | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep | continuation | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-white-soldiers | — | 2 | 0 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | continuation | 2 | 1 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-top | — | 2 | 0 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-bottom | — | 3 | 3 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| evening-star | — | 1 | 1 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| piercing-line | — | 2 | 0 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| shooting-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| inverted-hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| hanging-man | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| dark-cloud-cover | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| rising-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| falling-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Воронка гейтов (инструментированные детекторы)

> Сколько баров дошло до каждого этапа детектора; разница соседних строк — отсев на этом гейте. Покрыты только детекторы с вызовами `gate()` (hammer, inverted-hammer, hanging-man, shooting-star, mean-reversion); остальные в воронке не участвуют. Счётчики — суммарно по пулу, за весь период (не только test).

### abandoned-baby-bottom

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-trend | 210666 | 18.321% | 939214 |
| 02-candle-a | 43200 | 3.757% | 167466 |
| 03-doji | 2283 | 0.199% | 40917 |
| 04-gaps-and-candle-c | 76 | 0.007% | 2207 |
| 05-session | 76 | 0.007% | 0 |
| 06-volume | 48 | 0.004% | 28 |
| 07-fourth-candle | 25 | 0.002% | 23 |

### abandoned-baby-top

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-trend | 218281 | 18.983% | 931599 |
| 02-candle-a | 44950 | 3.909% | 173331 |
| 03-doji | 2473 | 0.215% | 42477 |
| 04-gaps-and-candle-c | 84 | 0.007% | 2389 |
| 05-session | 84 | 0.007% | 0 |
| 06-volume | 52 | 0.005% | 32 |
| 07-fourth-candle | 20 | 0.002% | 32 |

### falling-three-methods

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-trend | 210666 | 18.321% | 939214 |
| 02-session | 210666 | 18.321% | 0 |
| 03-candle1 | 14857 | 1.292% | 195809 |
| 04-consolidation | 70 | 0.006% | 14787 |

### hammer

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-context | 693008 | 60.268% | 456872 |
| 02-session | 693008 | 60.268% | 0 |
| 03-rsi | 199710 | 17.368% | 493298 |
| 04-geometry | 11283 | 0.981% | 188427 |
| 05-confirmation | 3056 | 0.266% | 8227 |

### hanging-man

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-context | 696908 | 60.607% | 452972 |
| 02-session | 696908 | 60.607% | 0 |
| 03-rsi | 200584 | 17.444% | 496324 |
| 04-geometry | 10001 | 0.870% | 190583 |
| 05-confirmation | 2373 | 0.206% | 7628 |

### inverted-hammer

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-context | 693008 | 60.268% | 456872 |
| 02-session | 693008 | 60.268% | 0 |
| 03-rsi | 199710 | 17.368% | 493298 |
| 04-geometry | 8818 | 0.767% | 190892 |
| 05-confirmation | 2178 | 0.189% | 6640 |

### liquidity-sweep

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-indicators | 1149880 | 100.000% | 0 |
| 02-sweep-geometry | 76563 | 6.658% | 1073317 |
| 02b-rejection | 58792 | 5.113% | 17771 |
| 03-context | 37026 | 3.220% | 21766 |
| 04-depth | 36938 | 3.212% | 88 |
| 05-volume | 13328 | 1.159% | 23610 |
| 06-confidence | 267 | 0.023% | 13061 |

### liquidity-sweep-inner

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 2299484 | 100.000% | — |
| 01-indicators | 2299484 | 100.000% | 0 |
| 02-sweep-geometry | 153107 | 6.658% | 2146377 |
| 02b-rejection | 117574 | 5.113% | 35533 |
| 03-context | 89458 | 3.890% | 28116 |
| 04-depth | 88930 | 3.867% | 528 |
| 05-volume | 34715 | 1.510% | 54215 |
| 06-confidence | 1678 | 0.073% | 33037 |

### liquidity-sweep-reaction

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-sweep-found | 1429 | 0.124% | 1148451 |
| 02-broke-extreme | 780 | 0.068% | 649 |
| 03-displacement-direction | 576 | 0.050% | 204 |
| 04-no-retake | 576 | 0.050% | 0 |
| 05-body | 357 | 0.031% | 219 |
| 06-volume | 60 | 0.005% | 297 |
| 07-confidence | 19 | 0.002% | 41 |

### macd-deceleration-continuation

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-trend | 777351 | 67.603% | 372529 |
| 02-histogram-flip | 54472 | 4.737% | 722879 |
| 03-flip-direction | 21509 | 1.871% | 32963 |
| 04-old-series | 8423 | 0.733% | 13086 |
| 05-decay | 267 | 0.023% | 8156 |
| 06-pause-candle | 196 | 0.017% | 71 |
| 07-rsi-adx | 103 | 0.009% | 93 |
| 08-confidence | 12 | 0.001% | 91 |

### mean-reversion

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-indicators | 1149880 | 100.000% | 0 |
| 02-no-bos-block | 1146282 | 99.687% | 3598 |
| 03-adx | 634378 | 55.169% | 511904 |
| 04-bar-geometry | 77732 | 6.760% | 556646 |
| 05-band-exit-rsi | 1999 | 0.174% | 75733 |
| 06-confidence | 600 | 0.052% | 1399 |

### rising-three-methods

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-trend | 218280 | 18.983% | 931600 |
| 02-session | 218280 | 18.983% | 0 |
| 03-candle1 | 15695 | 1.365% | 202585 |
| 04-consolidation | 63 | 0.005% | 15632 |
| 05-candle5 | 3 | 0.000% | 60 |

### shooting-star

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-context | 696908 | 60.607% | 452972 |
| 02-session | 651823 | 56.686% | 45085 |
| 03-rsi | 198845 | 17.293% | 452978 |
| 04-geometry | 10028 | 0.872% | 188817 |
| 05-confirmation | 2755 | 0.240% | 7273 |

### tweezer-bottom

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-twin-extreme | 1062167 | 92.372% | 87713 |
| 02-body-direction | 516810 | 44.945% | 545357 |
| 03-trend-context | 310396 | 26.994% | 206414 |
| 04-session | 310396 | 26.994% | 0 |
| 05-rsi | 167067 | 14.529% | 143329 |
| 06-confirmation | 84567 | 7.354% | 82500 |
| 07-confidence | 3 | 0.000% | 84564 |

### tweezer-top

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149880 | 100.000% | — |
| 01-twin-extreme | 1062237 | 92.378% | 87643 |
| 02-body-direction | 511120 | 44.450% | 551117 |
| 03-trend-context | 309186 | 26.889% | 201934 |
| 04-session | 309186 | 26.889% | 0 |
| 05-rsi | 168892 | 14.688% | 140294 |
| 06-confirmation | 85095 | 7.400% | 83797 |
| 07-confidence | 2 | 0.000% | 85093 |


> D3 (промт "Исправление по воронке гейтов", п.6-7): `htf-seen-*`/`htf-pass-*` — сколько кандидатов hammer-семейства дошло до финальной проверки confidence и сколько из них её прошло, в разбивке по классу множителя `htfAlignment()` (1.00-bos / 0.75-choch / 0.40-range / other=0.5). `05a-band-exit-only-*`/`05b-band-exit-and-rsi-*` — та же геометрия mean-reversion (вышел за полосу BB и вернулся), раздельно БЕЗ требования по RSI(7) и С ним — раньше это была одна склеенная стадия `05-band-exit-rsi`. Чисто измерительные счётчики, ни на что не влияют.

## D3 — диагностические срезы (не влияют на вердикты, только измерение)

| Счётчик | Значение |
|---|---|
| falling-three-methods:04-fail-at-candle-2 | 13807 |
| falling-three-methods:04-fail-at-candle-3 | 832 |
| falling-three-methods:04-fail-at-candle-4 | 148 |
| falling-three-methods:04-fail-body-vs-avg | 12330 |
| falling-three-methods:04-fail-range-breach | 2457 |
| hammer:htf-seen-0.40-range | 1041 |
| hammer:htf-seen-other | 2015 |
| hanging-man:htf-seen-0.40-range | 810 |
| hanging-man:htf-seen-other | 1563 |
| htf-baseline:bars | 1149880 |
| htf-baseline:buy-0.40-range | 380895 |
| htf-baseline:buy-0.75-choch | 12603 |
| htf-baseline:buy-1.00-bos | 12936 |
| htf-baseline:buy-other | 743446 |
| htf-baseline:flag-bos | 51931 |
| htf-baseline:flag-choch | 25800 |
| htf-baseline:sell-0.40-range | 380895 |
| htf-baseline:sell-0.75-choch | 13197 |
| htf-baseline:sell-1.00-bos | 12579 |
| htf-baseline:sell-other | 743209 |
| htf-baseline:trend-down | 378541 |
| htf-baseline:trend-range | 380895 |
| htf-baseline:trend-up | 390444 |
| inverted-hammer:htf-seen-0.40-range | 697 |
| inverted-hammer:htf-seen-other | 1481 |
| macd-deceleration-continuation:04-series-len-4 | 1377 |
| macd-deceleration-continuation:04-series-len-5 | 995 |
| macd-deceleration-continuation:04-series-len-6 | 787 |
| macd-deceleration-continuation:04-series-len-7 | 725 |
| macd-deceleration-continuation:04-series-len-8+ | 4539 |
| macd-deceleration-continuation:05-fail-chain-step-1 | 4454 |
| macd-deceleration-continuation:05-fail-chain-step-2 | 1117 |
| macd-deceleration-continuation:05-fail-chain-step-3 | 811 |
| macd-deceleration-continuation:05-fail-chain-step-4 | 552 |
| macd-deceleration-continuation:05-fail-chain-step-5 | 308 |
| macd-deceleration-continuation:05-fail-chain-step-6 | 339 |
| macd-deceleration-continuation:05-fail-flip-not-below-old-last | 78 |
| macd-deceleration-continuation:05-fail-last-not-below-flip | 497 |
| macd-deceleration-continuation:08pre-confidence-0.40 | 4 |
| macd-deceleration-continuation:08pre-confidence-0.45 | 4 |
| macd-deceleration-continuation:08pre-confidence-0.50 | 9 |
| macd-deceleration-continuation:08pre-confidence-0.55 | 8 |
| macd-deceleration-continuation:08pre-confidence-0.60 | 2 |
| macd-deceleration-continuation:08pre-confidence-0.65 | 1 |
| macd-deceleration-continuation:08pre-confidence-0.75 | 1 |
| macd-deceleration-continuation:08pre-fail-confidence | 17 |
| macd-deceleration-continuation:08pre-fail-fib-786 | 63 |
| macd-deceleration-continuation:08pre-fail-news-atr | 11 |
| mean-reversion:05a-band-exit-only-buy | 4817 |
| mean-reversion:05a-band-exit-only-sell | 4585 |
| mean-reversion:05b-band-exit-and-rsi-buy | 1017 |
| mean-reversion:05b-band-exit-and-rsi-sell | 982 |
| mean-reversion:05c-band-walk-blocked-buy | 1138 |
| mean-reversion:05c-band-walk-blocked-sell | 1091 |
| mean-reversion:05d-htf-against-buy | 1605 |
| mean-reversion:05d-htf-against-sell | 1530 |
| mean-reversion:06pre-base-0.1 | 11 |
| mean-reversion:06pre-base-0.2 | 149 |
| mean-reversion:06pre-base-0.3 | 355 |
| mean-reversion:06pre-base-0.4 | 428 |
| mean-reversion:06pre-base-0.5 | 516 |
| mean-reversion:06pre-base-0.6 | 290 |
| mean-reversion:06pre-base-0.7 | 144 |
| mean-reversion:06pre-base-0.8 | 68 |
| mean-reversion:06pre-base-0.9 | 28 |
| mean-reversion:06pre-base-1.0 | 10 |
| mean-reversion:06pre-confidence-0.1 | 5 |
| mean-reversion:06pre-confidence-0.2 | 100 |
| mean-reversion:06pre-confidence-0.3 | 259 |
| mean-reversion:06pre-confidence-0.4 | 406 |
| mean-reversion:06pre-confidence-0.5 | 448 |
| mean-reversion:06pre-confidence-0.6 | 344 |
| mean-reversion:06pre-confidence-0.7 | 202 |
| mean-reversion:06pre-confidence-0.8 | 125 |
| mean-reversion:06pre-confidence-0.9 | 61 |
| mean-reversion:06pre-confidence-1.0 | 49 |
| mean-reversion:06pre-idealFlat-false | 1816 |
| mean-reversion:06pre-idealFlat-true | 183 |
| rising-three-methods:04-fail-at-candle-2 | 14617 |
| rising-three-methods:04-fail-at-candle-3 | 874 |
| rising-three-methods:04-fail-at-candle-4 | 141 |
| rising-three-methods:04-fail-body-vs-avg | 12996 |
| rising-three-methods:04-fail-range-breach | 2636 |
| shooting-star:htf-seen-0.40-range | 892 |
| shooting-star:htf-seen-other | 1863 |
| tweezer-bottom:07pre-confidence-0.0 | 3638 |
| tweezer-bottom:07pre-confidence-0.1 | 55387 |
| tweezer-bottom:07pre-confidence-0.2 | 24717 |
| tweezer-bottom:07pre-confidence-0.3 | 813 |
| tweezer-bottom:07pre-confidence-0.4 | 9 |
| tweezer-bottom:07pre-confidence-0.5 | 3 |
| tweezer-bottom:07pre-confidence-volneutral-0.1 | 63257 |
| tweezer-bottom:07pre-confidence-volneutral-0.2 | 21091 |
| tweezer-bottom:07pre-confidence-volneutral-0.3 | 214 |
| tweezer-bottom:07pre-confidence-volneutral-0.4 | 5 |
| tweezer-bottom:07pre-confirm-strong | 61205 |
| tweezer-bottom:07pre-confirm-weak | 23362 |
| tweezer-bottom:07pre-htf-0.40-range | 28041 |
| tweezer-bottom:07pre-htf-0.75-choch | 23 |
| tweezer-bottom:07pre-htf-1.00-bos | 13 |
| tweezer-bottom:07pre-htf-other | 56490 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-30-35 | 1942 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-35-50 | 25268 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-lt30 | 831 |
| tweezer-bottom:07pre-joint-htf0.75-choch+rsi-35-50 | 23 |
| tweezer-bottom:07pre-joint-htf1.00-bos+rsi-35-50 | 13 |
| tweezer-bottom:07pre-joint-htfother+rsi-30-35 | 3811 |
| tweezer-bottom:07pre-joint-htfother+rsi-35-50 | 51096 |
| tweezer-bottom:07pre-joint-htfother+rsi-lt30 | 1583 |
| tweezer-bottom:07pre-passes-actual-false | 84564 |
| tweezer-bottom:07pre-passes-actual-true | 3 |
| tweezer-bottom:07pre-passes-volneutral-false | 84567 |
| tweezer-bottom:07pre-rsi-30-35 | 5753 |
| tweezer-bottom:07pre-rsi-35-50 | 76400 |
| tweezer-bottom:07pre-rsi-lt30 | 2414 |
| tweezer-bottom:07pre-volume-real | 84567 |
| tweezer-top:07pre-confidence-0.0 | 3890 |
| tweezer-top:07pre-confidence-0.1 | 55600 |
| tweezer-top:07pre-confidence-0.2 | 24800 |
| tweezer-top:07pre-confidence-0.3 | 800 |
| tweezer-top:07pre-confidence-0.4 | 3 |
| tweezer-top:07pre-confidence-0.5 | 2 |
| tweezer-top:07pre-confidence-volneutral-0.1 | 63626 |
| tweezer-top:07pre-confidence-volneutral-0.2 | 21262 |
| tweezer-top:07pre-confidence-volneutral-0.3 | 203 |
| tweezer-top:07pre-confidence-volneutral-0.4 | 4 |
| tweezer-top:07pre-confirm-strong | 60893 |
| tweezer-top:07pre-confirm-weak | 24202 |
| tweezer-top:07pre-htf-0.40-range | 28453 |
| tweezer-top:07pre-htf-0.75-choch | 15 |
| tweezer-top:07pre-htf-1.00-bos | 15 |
| tweezer-top:07pre-htf-other | 56612 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-50-65 | 25729 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-65-70 | 1905 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-gt70 | 819 |
| tweezer-top:07pre-joint-htf0.75-choch+rsi-50-65 | 15 |
| tweezer-top:07pre-joint-htf1.00-bos+rsi-50-65 | 15 |
| tweezer-top:07pre-joint-htfother+rsi-50-65 | 51326 |
| tweezer-top:07pre-joint-htfother+rsi-65-70 | 3762 |
| tweezer-top:07pre-joint-htfother+rsi-gt70 | 1524 |
| tweezer-top:07pre-passes-actual-false | 85093 |
| tweezer-top:07pre-passes-actual-true | 2 |
| tweezer-top:07pre-passes-volneutral-false | 85095 |
| tweezer-top:07pre-rsi-50-65 | 77085 |
| tweezer-top:07pre-rsi-65-70 | 5667 |
| tweezer-top:07pre-rsi-gt70 | 2343 |
| tweezer-top:07pre-volume-real | 85095 |

## Разбивка по инструментам

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 16 | 15 | 15 | 53.3% |
| BNBUSDT | 13 | 13 | 11 | 63.6% |
| ETHUSDT | 9 | 8 | 7 | 71.4% |
| SOLUSDT | 7 | 6 | 4 | 50.0% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 78 | 52 | 40 | 50.0% |
| BTCUSDT | 69 | 51 | 51 | 68.6% |
| BNBUSDT | 60 | 49 | 37 | 54.1% |
| SOLUSDT | 59 | 45 | 21 | 42.9% |

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3449 | 2774 | 2769 | 57.0% |
| BNBUSDT | 3177 | 2536 | 2310 | 53.0% |
| SOLUSDT | 2892 | 2284 | 1829 | 58.2% |
| ETHUSDT | 2848 | 2308 | 2201 | 54.8% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 81 | 71 | 61 | 54.1% |
| BTCUSDT | 66 | 50 | 50 | 48.0% |
| ETHUSDT | 62 | 56 | 52 | 46.2% |
| SOLUSDT | 55 | 45 | 29 | 58.6% |

### fvg-htf-mss

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 457 | 374 | 352 | 50.3% |
| BNBUSDT | 433 | 338 | 221 | 48.0% |
| ETHUSDT | 349 | 297 | 220 | 48.2% |
| SOLUSDT | 332 | 254 | 93 | 52.7% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 30063 | 25068 | 22161 | 51.4% |
| BNBUSDT | 28686 | 23169 | 13569 | 50.2% |
| SOLUSDT | 26600 | 21761 | 5078 | 48.8% |
| ETHUSDT | 25209 | 20780 | 13586 | 48.4% |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 16 | 14 | 14 | 50.0% |
| BNBUSDT | 16 | 14 | 14 | 57.1% |
| SOLUSDT | 10 | 7 | 4 | 50.0% |
| ETHUSDT | 9 | 9 | 8 | 37.5% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 10528 | 8430 | 2069 | 49.3% |
| ETHUSDT | 9818 | 7773 | 5456 | 49.0% |
| BNBUSDT | 9238 | 7435 | 4546 | 49.5% |
| BTCUSDT | 9096 | 7247 | 6737 | 49.4% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 810 | 677 | 389 | 46.3% |
| BNBUSDT | 773 | 647 | 552 | 52.9% |
| ETHUSDT | 715 | 613 | 527 | 52.8% |
| BTCUSDT | 616 | 531 | 525 | 49.0% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2028 | 1808 | 1709 | 48.7% |
| BNBUSDT | 1571 | 1291 | 874 | 48.3% |
| ETHUSDT | 1310 | 1133 | 848 | 49.8% |
| SOLUSDT | 780 | 655 | 217 | 47.0% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2144 | 1898 | 1789 | 48.6% |
| BNBUSDT | 1530 | 1238 | 819 | 46.8% |
| ETHUSDT | 1266 | 1098 | 829 | 47.6% |
| SOLUSDT | 697 | 591 | 204 | 46.1% |

### fvg-inversion-retest

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 7272 | 6023 | 5794 | 48.3% |
| BNBUSDT | 6882 | 5516 | 3983 | 48.0% |
| ETHUSDT | 6397 | 5251 | 4078 | 47.7% |
| SOLUSDT | 5350 | 4312 | 1711 | 49.2% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1543 | 1226 | 1132 | 47.7% |
| BTCUSDT | 1492 | 1193 | 1187 | 43.0% |
| ETHUSDT | 1373 | 1095 | 1037 | 44.5% |
| SOLUSDT | 1203 | 962 | 790 | 45.1% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 13258 | 10937 | 10138 | 47.6% |
| BNBUSDT | 12311 | 9891 | 6428 | 48.0% |
| ETHUSDT | 11738 | 9587 | 6844 | 46.5% |
| SOLUSDT | 8652 | 6947 | 2271 | 48.8% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3592 | 2945 | 2902 | 46.8% |
| BNBUSDT | 3478 | 2835 | 2348 | 48.8% |
| ETHUSDT | 3229 | 2636 | 2249 | 46.0% |
| SOLUSDT | 2620 | 2100 | 1205 | 46.0% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 763 | 595 | 397 | 48.9% |
| BTCUSDT | 744 | 593 | 550 | 47.6% |
| ETHUSDT | 667 | 544 | 385 | 49.1% |
| SOLUSDT | 664 | 523 | 178 | 48.3% |

### fvg-sweep-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1197 | 993 | 962 | 49.9% |
| BNBUSDT | 1030 | 809 | 625 | 43.5% |
| ETHUSDT | 909 | 739 | 602 | 43.2% |
| SOLUSDT | 702 | 540 | 256 | 53.1% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 181 | 150 | 148 | 60.1% |
| BNBUSDT | 158 | 126 | 106 | 41.5% |
| ETHUSDT | 157 | 142 | 118 | 44.1% |
| SOLUSDT | 104 | 87 | 54 | 57.4% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1308 | 1035 | 849 | 45.3% |
| ETHUSDT | 1165 | 924 | 870 | 47.6% |
| BNBUSDT | 1140 | 931 | 866 | 46.5% |
| BTCUSDT | 1063 | 813 | 811 | 45.6% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2435 | 2034 | 1989 | 48.0% |
| ETHUSDT | 2015 | 1576 | 1301 | 48.7% |
| BNBUSDT | 1968 | 1585 | 1271 | 45.4% |
| SOLUSDT | 1351 | 1052 | 574 | 47.0% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 6997 | 5769 | 5441 | 44.9% |
| ETHUSDT | 6696 | 5264 | 4277 | 44.0% |
| BNBUSDT | 5684 | 4374 | 3204 | 45.6% |
| SOLUSDT | 4950 | 3859 | 1738 | 43.2% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 981 | 848 | 801 | 46.2% |
| ETHUSDT | 742 | 601 | 468 | 45.5% |
| BNBUSDT | 689 | 537 | 358 | 46.4% |
| SOLUSDT | 387 | 296 | 124 | 45.2% |

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 14 | 11 | 10 | 50.0% |
| BTCUSDT | 11 | 10 | 10 | 40.0% |
| ETHUSDT | 8 | 6 | 6 | 66.7% |
| SOLUSDT | 5 | 4 | 1 | 100.0% |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 15 | 13 | 11 | 54.5% |
| BTCUSDT | 10 | 8 | 8 | 37.5% |
| BNBUSDT | 9 | 7 | 6 | 16.7% |
| SOLUSDT | 7 | 5 | 3 | 66.7% |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 8 | 5 | 0 | — |
| SOLUSDT | 4 | 2 | 0 | — |
| ETHUSDT | 3 | 2 | 0 | — |
| BNBUSDT | 2 | 1 | 0 | — |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 4 | 2 | 0 | — |
| BNBUSDT | 4 | 3 | 0 | — |
| BTCUSDT | 2 | 0 | 0 | — |
| SOLUSDT | 2 | 1 | 0 | — |

### morning-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1 | 0 | 0 | — |
| ETHUSDT | 1 | 1 | 0 | — |
| SOLUSDT | 1 | 1 | 0 | — |

### three-black-crows

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1 | 1 | 0 | — |

### liquidity-sweep (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1 | 1 | 0 | — |

### three-white-soldiers

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1 | 1 | 0 | — |
| ETHUSDT | 1 | 1 | 0 | — |

### liquidity-sweep-reaction (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 2 | 1 | 0 | — |

### tweezer-top

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1 | 1 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

### tweezer-bottom

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 2 | 0 | 0 | — |
| SOLUSDT | 1 | 0 | 0 | — |

### evening-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1 | 0 | 0 | — |

### piercing-line

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1 | 1 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

## Детализация по горизонтам

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 44.1% | 34 |
| 2 | 100.0% | 59.5% | 37 |
| 3 | 100.0% | 54.5% | 33 |
| 5 | 100.0% | 51.4% | 37 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 53.6% | 56.4% | 149 |
| 2 | 45.8% | 55.5% | 164 |
| 3 | 41.7% | 53.7% | 162 |

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 52.5% | 52.2% | 8556 |
| 20 | 54.9% | 55.0% | 8930 |
| 30 | 56.0% | 55.7% | 9109 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 38.9% | 46.7% | 165 |
| 2 | 48.6% | 45.8% | 179 |
| 3 | 46.3% | 46.0% | 176 |
| 5 | 51.4% | 51.0% | 192 |

### fvg-htf-mss

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.4% | 49.4% | 886 |
| 2 | 46.4% | 47.6% | 986 |
| 3 | 44.8% | 46.9% | 1013 |
| 5 | 45.5% | 46.8% | 1082 |
| 10 | 44.8% | 46.1% | 1123 |
| 20 | 47.6% | 45.0% | 1182 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.1% | 50.1% | 54394 |
| 2 | 47.3% | 49.1% | 63380 |
| 3 | 47.5% | 49.1% | 67785 |
| 5 | 47.9% | 48.9% | 72457 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 80.0% | 48.6% | 35 |
| 2 | 71.4% | 50.0% | 40 |
| 3 | 71.4% | 48.6% | 37 |
| 5 | 57.1% | 55.9% | 34 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.1% | 49.3% | 18808 |
| 2 | 49.8% | 49.3% | 21782 |
| 3 | 49.3% | 49.2% | 23072 |
| 5 | 49.4% | 48.7% | 24668 |
| 10 | 49.5% | 47.6% | 26219 |
| 20 | 50.2% | 47.7% | 27602 |
| 30 | 49.9% | 47.6% | 28170 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.5% | 50.5% | 1993 |
| 10 | 46.9% | 46.7% | 2147 |
| 20 | 47.4% | 50.5% | 2183 |
| 30 | 45.6% | 49.1% | 2244 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 44.4% | 48.8% | 3648 |
| 2 | 44.7% | 48.0% | 4003 |
| 3 | 43.7% | 46.6% | 4139 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.1% | 47.8% | 3641 |
| 2 | 47.4% | 48.5% | 3948 |
| 3 | 47.4% | 48.0% | 4068 |

### fvg-inversion-retest

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.3% | 48.8% | 13737 |
| 2 | 48.9% | 48.1% | 15566 |
| 3 | 48.8% | 47.9% | 16428 |
| 5 | 48.5% | 47.4% | 17447 |
| 10 | 47.5% | 47.6% | 18424 |
| 20 | 47.0% | 47.5% | 19152 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 45.0% | 46.8% | 3786 |
| 10 | 44.9% | 47.0% | 3966 |
| 20 | 43.2% | 45.2% | 4094 |
| 30 | 46.1% | 45.0% | 4146 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.4% | 47.5% | 25681 |
| 2 | 47.1% | 47.0% | 28664 |
| 3 | 46.8% | 46.9% | 30123 |
| 5 | 46.3% | 46.3% | 31555 |
| 10 | 45.4% | 45.5% | 33191 |
| 20 | 45.0% | 45.0% | 34392 |
| 30 | 46.1% | 45.9% | 34870 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.3% | 47.0% | 8704 |
| 10 | 48.4% | 47.5% | 9173 |
| 20 | 47.1% | 48.6% | 9573 |
| 30 | 49.0% | 48.5% | 9737 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.7% | 48.4% | 1510 |
| 2 | 48.2% | 48.4% | 1643 |
| 3 | 47.4% | 46.5% | 1780 |
| 5 | 48.5% | 46.4% | 1892 |

### fvg-sweep-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 43.9% | 48.4% | 2058 |
| 2 | 42.2% | 46.5% | 2310 |
| 3 | 47.8% | 47.0% | 2445 |
| 5 | 46.3% | 45.8% | 2594 |
| 10 | 43.0% | 46.3% | 2735 |
| 20 | 41.5% | 47.1% | 2788 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 48.7% | 50.7% | 426 |
| 10 | 48.8% | 47.2% | 447 |
| 15 | 43.5% | 43.9% | 458 |
| 20 | 52.9% | 43.1% | 464 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 42.8% | 46.3% | 3058 |
| 10 | 41.7% | 46.7% | 3211 |
| 20 | 41.8% | 47.3% | 3337 |
| 30 | 44.1% | 46.3% | 3396 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 48.1% | 47.4% | 5135 |
| 10 | 46.5% | 46.6% | 5450 |
| 20 | 47.3% | 46.0% | 5725 |
| 30 | 46.0% | 46.4% | 5786 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.1% | 44.6% | 14660 |
| 2 | 44.7% | 44.3% | 15741 |
| 3 | 44.0% | 43.8% | 16245 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.2% | 46.0% | 1751 |
| 2 | 47.4% | 45.0% | 1910 |
| 3 | 49.2% | 45.2% | 1977 |
| 5 | 47.7% | 45.8% | 2030 |

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 57.1% | 44.0% | 25 |
| 3 | 40.0% | 45.8% | 24 |
| 5 | 66.7% | 51.9% | 27 |
| 10 | 33.3% | 32.1% | 28 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 57.1% | 44.8% | 29 |
| 3 | 57.1% | 45.2% | 31 |
| 5 | 50.0% | 48.4% | 31 |
| 10 | 71.4% | 42.9% | 28 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 60.0% | 50.0% | 8 |
| 2 | 60.0% | 62.5% | 8 |
| 3 | 42.9% | 44.4% | 9 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 100.0% | 80.0% | 5 |
| 10 | 60.0% | 60.0% | 5 |
| 20 | 50.0% | 60.0% | 5 |
| 30 | 66.7% | 40.0% | 5 |

### morning-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 50.0% | 2 |
| 5 | 0.0% | 50.0% | 2 |
| 10 | 0.0% | 50.0% | 2 |

### three-black-crows

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 1 |
| 5 | 0.0% | 0.0% | 1 |
| 10 | 0.0% | 100.0% | 1 |

### liquidity-sweep (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 1 |
| 2 | 0.0% | 0.0% | 1 |
| 3 | 0.0% | 0.0% | 1 |

### three-white-soldiers

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 50.0% | 2 |
| 5 | 0.0% | 50.0% | 2 |
| 10 | 0.0% | 100.0% | 2 |

### liquidity-sweep-reaction (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 100.0% | 1 |
| 2 | 100.0% | 100.0% | 1 |
| 3 | 0.0% | 100.0% | 1 |

### tweezer-top

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 1 |
| 2 | 0.0% | 0.0% | 0 |
| 3 | 0.0% | 0.0% | 1 |
| 5 | 0.0% | 50.0% | 2 |

### tweezer-bottom

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 33.3% | 0.0% | 0 |
| 2 | 33.3% | 0.0% | 0 |
| 3 | 0.0% | 0.0% | 0 |
| 5 | 33.3% | 0.0% | 0 |

### evening-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 0 |
| 10 | 0.0% | 0.0% | 0 |

### piercing-line

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 2 |
| 2 | 0.0% | 100.0% | 2 |
| 3 | 0.0% | 100.0% | 1 |
| 5 | 0.0% | 50.0% | 2 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### bullish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 3 | пропущен (мало train) | 0 | 0 | — |
| 2 | 17 | пропущен (мало train) | 0 | 0 | — |
| 3 | 21 | пропущен (мало train) | 0 | 0 | — |
| 4 | 32 | 2 | 12 | 7 | 58.3% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 69 | 1 | 41 | 24 | 58.5% |
| 2 | 118 | 1 | 33 | 17 | 51.5% |
| 3 | 161 | 1 | 32 | 20 | 62.5% |
| 4 | 208 | 1 | 43 | 23 | 53.5% |

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2464 | 30 | 2402 | 1342 | 55.9% |
| 2 | 5085 | 30 | 2392 | 1457 | 60.9% |
| 3 | 7578 | 30 | 2319 | 1122 | 48.4% |
| 4 | 10207 | 30 | 1996 | 1152 | 57.7% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 42 | 5 | 49 | 24 | 49.0% |
| 2 | 100 | 2 | 41 | 17 | 41.5% |
| 3 | 148 | 5 | 47 | 25 | 53.2% |
| 4 | 202 | 5 | 52 | 29 | 55.8% |

### fvg-htf-mss

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 308 | 1 | 196 | 101 | 51.5% |
| 2 | 595 | 1 | 209 | 104 | 49.8% |
| 3 | 874 | 1 | 227 | 111 | 48.9% |
| 4 | 1207 | 1 | 254 | 122 | 48.0% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 19769 | 1 | 13913 | 6811 | 49.0% |
| 2 | 42582 | 1 | 13474 | 6645 | 49.3% |
| 3 | 62929 | 1 | 13323 | 6711 | 50.4% |
| 4 | 86692 | 1 | 13684 | 7087 | 51.8% |

### bearish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 7 | пропущен (мало train) | 0 | 0 | — |
| 2 | 19 | пропущен (мало train) | 0 | 0 | — |
| 3 | 27 | пропущен (мало train) | 0 | 0 | — |
| 4 | 43 | 2 | 6 | 3 | 50.0% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 7787 | 1 | 4361 | 2159 | 49.5% |
| 2 | 14976 | 1 | 5097 | 2535 | 49.7% |
| 3 | 22713 | 1 | 4395 | 2149 | 48.9% |
| 4 | 30656 | 1 | 4955 | 2429 | 49.0% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 446 | 5 | 561 | 277 | 49.4% |
| 2 | 1129 | 5 | 455 | 238 | 52.3% |
| 3 | 1692 | 5 | 508 | 261 | 51.4% |
| 4 | 2340 | 5 | 469 | 231 | 49.3% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 802 | 2 | 995 | 456 | 45.8% |
| 2 | 1991 | 1 | 772 | 343 | 44.4% |
| 3 | 2973 | 1 | 944 | 453 | 48.0% |
| 4 | 4285 | 1 | 1037 | 556 | 53.6% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 812 | 1 | 911 | 429 | 47.1% |
| 2 | 1986 | 1 | 875 | 404 | 46.2% |
| 3 | 3090 | 1 | 883 | 414 | 46.9% |
| 4 | 4356 | 2 | 1047 | 536 | 51.2% |

### fvg-inversion-retest

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 4796 | 2 | 3836 | 1880 | 49.0% |
| 2 | 10075 | 2 | 4046 | 1904 | 47.1% |
| 3 | 15222 | 1 | 3244 | 1578 | 48.6% |
| 4 | 20573 | 1 | 3449 | 1705 | 49.4% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1135 | 30 | 1045 | 484 | 46.3% |
| 2 | 2268 | 30 | 1056 | 465 | 44.0% |
| 3 | 3405 | 10 | 963 | 457 | 47.5% |
| 4 | 4519 | 10 | 976 | 478 | 49.0% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 8595 | 1 | 6584 | 3116 | 47.3% |
| 2 | 18138 | 1 | 6656 | 3092 | 46.5% |
| 3 | 27330 | 1 | 6255 | 2951 | 47.2% |
| 4 | 36930 | 1 | 6186 | 3046 | 49.2% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2403 | 5 | 2109 | 999 | 47.4% |
| 2 | 4926 | 5 | 2328 | 1068 | 45.9% |
| 3 | 7662 | 30 | 2409 | 1175 | 48.8% |
| 4 | 10316 | 30 | 2399 | 1199 | 50.0% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 583 | 1 | 388 | 179 | 46.1% |
| 2 | 1150 | 1 | 416 | 202 | 48.6% |
| 3 | 1723 | 1 | 323 | 158 | 48.9% |
| 4 | 2267 | 1 | 383 | 192 | 50.1% |

### fvg-sweep-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 757 | 3 | 659 | 322 | 48.9% |
| 2 | 1590 | 3 | 575 | 258 | 44.9% |
| 3 | 2284 | 3 | 596 | 277 | 46.5% |
| 4 | 3074 | 3 | 615 | 291 | 47.3% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 95 | 20 | 135 | 50 | 37.0% |
| 2 | 245 | 10 | 110 | 41 | 37.3% |
| 3 | 369 | 5 | 103 | 62 | 60.2% |
| 4 | 498 | 5 | 88 | 47 | 53.4% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 973 | 30 | 768 | 363 | 47.3% |
| 2 | 1799 | 30 | 980 | 459 | 46.8% |
| 3 | 2854 | 30 | 831 | 350 | 42.1% |
| 4 | 3785 | 30 | 817 | 400 | 49.0% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1520 | 5 | 1435 | 673 | 46.9% |
| 2 | 3245 | 5 | 1130 | 547 | 48.4% |
| 3 | 4589 | 5 | 1315 | 603 | 45.9% |
| 4 | 6210 | 5 | 1255 | 611 | 48.7% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 5058 | 1 | 3819 | 1730 | 45.3% |
| 2 | 10044 | 1 | 3785 | 1625 | 42.9% |
| 3 | 14793 | 1 | 3511 | 1505 | 42.9% |
| 4 | 19555 | 1 | 3545 | 1677 | 47.3% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 517 | 1 | 402 | 186 | 46.3% |
| 2 | 1038 | 1 | 420 | 185 | 44.0% |
| 3 | 1557 | 1 | 469 | 195 | 41.6% |
| 4 | 2171 | 1 | 460 | 239 | 52.0% |

### bullish-harami

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 7 | пропущен (мало train) | 0 | 0 | — |
| 2 | 12 | пропущен (мало train) | 0 | 0 | — |
| 3 | 20 | пропущен (мало train) | 0 | 0 | — |
| 4 | 32 | 5 | 6 | 2 | 33.3% |

### bearish-harami

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 8 | пропущен (мало train) | 0 | 0 | — |
| 2 | 17 | пропущен (мало train) | 0 | 0 | — |
| 3 | 25 | пропущен (мало train) | 0 | 0 | — |
| 4 | 33 | 10 | 8 | 2 | 25.0% |
