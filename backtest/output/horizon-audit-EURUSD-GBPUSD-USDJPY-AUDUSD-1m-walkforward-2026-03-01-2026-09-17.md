# Horizon Audit — EURUSD, GBPUSD, USDJPY, AUDUSD 1m

> Сгенерировано: 2026-10-05T06:02:08.729Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): EURUSD, GBPUSD, USDJPY, AUDUSD
> Источник: Deriv WebSocket (1m candles → resampled to 1m)
> Разбиение: walk-forward, 5 folds, purge 30 bars
> Минимальный порог (train+validation): 30 срабатываний
> Минимальный порог для теста значимости (test-выборка): 200 решённых исходов
> Значимость: точный двусторонний биномиальный тест против baseline=0.5, с поправкой Holm-Bonferroni, α = 0.05
> Wilson-критерий: нижняя граница 95% интервала Уилсона ≥ 0.500 (margin=0)
> **Вердикт** (схема 2): по ДЕДУПЛИЦИРОВАННЫМ независимым наблюдениям (--dedupe-scope=pool); Holm по дедуплицированному семейству; допуск ('valid') требует нижней границы Уилсона выше max(безубыточность, дрейф-baseline).
> Выплата (payout): 80% → безубыточная доля выигрышей 55.56%
> Индикаторы: --indicators=live (18 шт.); версия алгоритма occurrences: 18

**Загружено**: 783364 1m свечей (суммарно по пулу), 783364 1m свечей после ресэмплинга.

## Метаданные пула

| Инструмент | 1m свечей | 1m свечей | История обрезана? |
|---|---|---|---|
| EURUSD | 195841 | 195841 | нет |
| GBPUSD | 195841 | 195841 | нет |
| USDJPY | 195841 | 195841 | нет |
| AUDUSD | 195841 | 195841 | нет |

> **Предупреждение о корреляции**: Пул содержит 4 инструментов. Корреляция между инструментами (особенно forex-парами с общей валютой и крипто-парами к USDT) может завышать эффективный размер выборки. Сырой p-value НЕ корректируется на межинструментную корреляцию — он оставлен только для сравнения с прошлыми отчётами. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 44
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 5
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 0
- Значимых вверх по дедуп. (Holm), всего: 0
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 0; прошли сырой Wilson-гейт: 1
- Недостаточно данных: 21
- Нет срабатываний: 5

### Пересечение критериев

- Прошли оба (формальный + Wilson): 0
- Только формальный тест: 0
- Только Wilson-гейт: 1

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| bullish-harami | — | 37 | 31 | 5 | — | — | 2 | 80.0% | — | — | — | — | — | 37.6% | — | — | — | недостаточно данных |
| liquidity-sweep | reversal-at-key-level | 155 | 262 | 50 | — | — | 1 | 52.0% | — | — | — | — | — | 38.5% | — | — | — | недостаточно данных |
| marubozu-bullish | — | 470 | 938 | 218 | 415 | 203 | 3 | 51.8% | 0.6355 | 51.2% | 0.7790 | нет | нет | 45.2% | 44.4% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-rejection | — | 6118 | 12156 | 1549 | 5192 | 1317 | 1 | 50.7% | 0.6114 | 50.9% | 0.5444 | нет | нет | 48.2% | 48.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| strong-order-block-reaction | — | 28394 | 56308 | 16021 | 5373 | 1262 | 10 | 50.0% | 0.9496 | 50.3% | 0.8438 | нет | нет | 49.3% | 47.6% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-nested | — | 2253 | 4635 | 1422 | 883 | 556 | 30 | 49.3% | 0.6144 | 50.2% | 0.9662 | нет | нет | 46.7% | 46.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| bullish-engulfing | — | 52 | 40 | 6 | — | — | 1 | 50.0% | — | — | — | — | — | 18.8% | — | — | — | недостаточно данных |
| pin-bar | — | 419 | 803 | 213 | 374 | 188 | 3 | 49.8% | 1.0000 | — | — | нет | — | 43.1% | — | — | no-evidence (fewer independent observations than the significance threshold) | OK |
| inside-bar | — | 63997 | 124451 | 14669 | 32655 | 13680 | 1 | 50.2% | 0.6438 | 49.0% | 0.0187 | нет | нет | 49.4% | 48.2% | 55.6% | rejected (significant below baseline (deduplicated)) | OK |
| harmonic-pattern | — | 7612 | 15882 | 4866 | 693 | 441 | 30 | 51.6% | 0.0304 | 48.8% | 0.6340 | нет | нет | 50.2% | 44.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-return | — | 22932 | 45762 | 6229 | 5725 | 2150 | 1 | 48.4% | 0.0130 | 48.0% | 0.0734 | нет | нет | 47.2% | 45.9% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-continuation | — | 7761 | 15759 | 4871 | 3164 | 1878 | 30 | 47.3% | 0.0002 | 48.0% | 0.0835 | нет | нет | 45.9% | 45.7% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-sweep-return | — | 1973 | 3993 | 644 | 1565 | 654 | 3 | 48.6% | 0.5030 | 47.9% | 0.2911 | нет | нет | 44.8% | 44.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-nested | — | 3419 | 6781 | 2136 | 1779 | 1077 | 20 | 48.2% | 0.0957 | 47.7% | 0.1435 | нет | нет | 46.1% | 44.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| marubozu-bearish | — | 440 | 821 | 164 | — | — | 1 | 47.6% | — | — | — | — | — | 40.1% | — | — | — | недостаточно данных |
| order-block-breaker | — | 3137 | 6377 | 1820 | 2009 | 1100 | 5 | 47.5% | 0.0369 | 47.5% | 0.0972 | нет | нет | 45.2% | 44.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-inversion-retest | — | 14673 | 29069 | 4342 | 7289 | 2136 | 1 | 48.2% | 0.0186 | 46.7% | 0.0023 | нет | нет | 46.7% | 44.6% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| mean-reversion | — | 332 | 684 | 218 | 292 | 196 | 15 | 45.9% | 0.2495 | — | — | нет | — | 39.4% | — | — | no-evidence (fewer independent observations than the significance threshold) | OK |
| impulse-breakout | — | 17112 | 33949 | 7510 | 11052 | 4695 | 2 | 45.1% | 0.0000 | 45.9% | 0.0000 | нет | нет | 43.9% | 44.4% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-breaker-block | — | 3123 | 6242 | 1547 | 2266 | 1113 | 5 | 47.1% | 0.0221 | 45.6% | 0.0033 | нет | нет | 44.6% | 42.6% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-htf-mss | — | 456 | 953 | 220 | 424 | 247 | 1 | 44.5% | 0.1208 | 43.7% | 0.0561 | нет | нет | 38.1% | 37.7% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| bearish-engulfing | — | 63 | 86 | 14 | — | — | 1 | 42.9% | — | — | — | — | — | 21.4% | — | — | — | недостаточно данных |
| consolidation-breakout | — | 2336 | 4471 | 918 | 1817 | 765 | 2 | 43.0% | 0.0000 | 40.8% | 0.0000 | нет | нет | 39.9% | 37.4% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| macd-deceleration-continuation | — | 13 | 3 | 10 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| piercing-line | — | 3 | 1 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-harami | — | 22 | 4 | 18 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-black-crows | — | 2 | 2 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-white-soldiers | — | 5 | 0 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 25 | 1 | 24 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| inverted-hammer | — | 8 | 0 | 8 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hammer | — | 8 | 0 | 8 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| dark-cloud-cover | — | 6 | 1 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | continuation | 4 | 0 | 4 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| evening-star | — | 2 | 0 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| shooting-star | — | 6 | 0 | 6 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hanging-man | — | 6 | 0 | 6 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| morning-star | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| rising-three-methods | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep | continuation | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| tweezer-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| falling-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Воронка гейтов (инструментированные детекторы)

> Сколько баров дошло до каждого этапа детектора; разница соседних строк — отсев на этом гейте. Покрыты только детекторы с вызовами `gate()` (hammer, inverted-hammer, hanging-man, shooting-star, mean-reversion); остальные в воронке не участвуют. Счётчики — суммарно по пулу, за весь период (не только test).

### abandoned-baby-bottom

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-trend | 126550 | 16.199% | 654694 |
| 02-candle-a | 24494 | 3.135% | 102056 |
| 03-doji | 1619 | 0.207% | 22875 |
| 04-gaps-and-candle-c | 9 | 0.001% | 1610 |
| 05-session | 5 | 0.001% | 4 |
| 06-volume | 5 | 0.001% | 0 |
| 07-fourth-candle | 3 | 0.000% | 2 |

### abandoned-baby-top

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-trend | 129908 | 16.628% | 651336 |
| 02-candle-a | 25015 | 3.202% | 104893 |
| 03-doji | 1681 | 0.215% | 23334 |
| 04-gaps-and-candle-c | 5 | 0.001% | 1676 |
| 05-session | 2 | 0.000% | 3 |
| 06-volume | 2 | 0.000% | 0 |
| 07-fourth-candle | 1 | 0.000% | 1 |

### falling-three-methods

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-trend | 126550 | 16.199% | 654694 |
| 02-session | 77729 | 9.949% | 48821 |
| 03-candle1 | 5161 | 0.661% | 72568 |
| 04-consolidation | 11 | 0.001% | 5150 |

### hammer

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-context | 452440 | 57.913% | 328804 |
| 02-session | 271034 | 34.693% | 181406 |
| 03-rsi | 78258 | 10.017% | 192776 |
| 04-geometry | 2938 | 0.376% | 75320 |
| 05-confirmation | 747 | 0.096% | 2191 |
| 06-confidence | 8 | 0.001% | 739 |

### hanging-man

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-context | 456408 | 58.421% | 324836 |
| 02-session | 275464 | 35.260% | 180944 |
| 03-rsi | 82691 | 10.585% | 192773 |
| 04-geometry | 3105 | 0.397% | 79586 |
| 05-confirmation | 729 | 0.093% | 2376 |
| 06-confidence | 6 | 0.001% | 723 |

### inverted-hammer

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-context | 452440 | 57.913% | 328804 |
| 02-session | 271034 | 34.693% | 181406 |
| 03-rsi | 78258 | 10.017% | 192776 |
| 04-geometry | 3047 | 0.390% | 75211 |
| 05-confirmation | 736 | 0.094% | 2311 |
| 06-confidence | 8 | 0.001% | 728 |

### liquidity-sweep

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-indicators | 781244 | 100.000% | 0 |
| 02-sweep-geometry | 55571 | 7.113% | 725673 |
| 02b-rejection | 42950 | 5.498% | 12621 |
| 03-context | 27470 | 3.516% | 15480 |
| 04-depth | 27418 | 3.510% | 52 |
| 05-volume | 27418 | 3.510% | 0 |
| 06-confidence | 156 | 0.020% | 27262 |

### liquidity-sweep-inner

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1562329 | 100.000% | — |
| 01-indicators | 1562329 | 100.000% | 0 |
| 02-sweep-geometry | 111135 | 7.113% | 1451194 |
| 02b-rejection | 85900 | 5.498% | 25235 |
| 03-context | 65169 | 4.171% | 20731 |
| 04-depth | 64972 | 4.159% | 197 |
| 05-volume | 64972 | 4.159% | 0 |
| 06-confidence | 815 | 0.052% | 64157 |

### liquidity-sweep-reaction

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-sweep-found | 680 | 0.087% | 780564 |
| 02-broke-extreme | 319 | 0.041% | 361 |
| 03-displacement-direction | 250 | 0.032% | 69 |
| 04-no-retake | 250 | 0.032% | 0 |
| 05-body | 157 | 0.020% | 93 |
| 06-volume | 157 | 0.020% | 0 |
| 07-confidence | 29 | 0.004% | 128 |

### macd-deceleration-continuation

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-trend | 523537 | 67.013% | 257707 |
| 02-histogram-flip | 36220 | 4.636% | 487317 |
| 03-flip-direction | 13953 | 1.786% | 22267 |
| 04-old-series | 5446 | 0.697% | 8507 |
| 05-decay | 156 | 0.020% | 5290 |
| 06-pause-candle | 112 | 0.014% | 44 |
| 07-rsi-adx | 59 | 0.008% | 53 |
| 08-confidence | 13 | 0.002% | 46 |

### mean-reversion

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-indicators | 781244 | 100.000% | 0 |
| 02-no-bos-block | 778931 | 99.704% | 2313 |
| 03-adx | 458618 | 58.704% | 320313 |
| 04-bar-geometry | 54567 | 6.985% | 404051 |
| 05-band-exit-rsi | 1454 | 0.186% | 53113 |
| 06-confidence | 332 | 0.042% | 1122 |

### rising-three-methods

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-trend | 129910 | 16.629% | 651334 |
| 02-session | 81040 | 10.373% | 48870 |
| 03-candle1 | 5352 | 0.685% | 75688 |
| 04-consolidation | 13 | 0.002% | 5339 |
| 05-candle5 | 1 | 0.000% | 12 |
| 06-volume | 1 | 0.000% | 0 |
| 07-rsi | 1 | 0.000% | 0 |
| 08-macd | 1 | 0.000% | 0 |
| 09-soft-filters | 1 | 0.000% | 0 |
| 10-confidence | 1 | 0.000% | 0 |

### shooting-star

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-context | 456408 | 58.421% | 324836 |
| 02-session | 257007 | 32.897% | 199401 |
| 03-rsi | 82121 | 10.512% | 174886 |
| 04-geometry | 3147 | 0.403% | 78974 |
| 05-confirmation | 782 | 0.100% | 2365 |
| 06-confidence | 6 | 0.001% | 776 |

### tweezer-bottom

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-twin-extreme | 780613 | 99.919% | 631 |
| 02-body-direction | 360508 | 46.145% | 420105 |
| 03-trend-context | 207925 | 26.615% | 152583 |
| 04-session | 126400 | 16.179% | 81525 |
| 05-rsi | 67612 | 8.654% | 58788 |
| 06-confirmation | 32155 | 4.116% | 35457 |

### tweezer-top

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 781244 | 100.000% | — |
| 01-twin-extreme | 780662 | 99.926% | 582 |
| 02-body-direction | 357951 | 45.818% | 422711 |
| 03-trend-context | 208398 | 26.675% | 149553 |
| 04-session | 127312 | 16.296% | 81086 |
| 05-rsi | 69732 | 8.926% | 57580 |
| 06-confirmation | 32764 | 4.194% | 36968 |


> D3 (промт "Исправление по воронке гейтов", п.6-7): `htf-seen-*`/`htf-pass-*` — сколько кандидатов hammer-семейства дошло до финальной проверки confidence и сколько из них её прошло, в разбивке по классу множителя `htfAlignment()` (1.00-bos / 0.75-choch / 0.40-range / other=0.5). `05a-band-exit-only-*`/`05b-band-exit-and-rsi-*` — та же геометрия mean-reversion (вышел за полосу BB и вернулся), раздельно БЕЗ требования по RSI(7) и С ним — раньше это была одна склеенная стадия `05-band-exit-rsi`. Чисто измерительные счётчики, ни на что не влияют.

## D3 — диагностические срезы (не влияют на вердикты, только измерение)

| Счётчик | Значение |
|---|---|
| falling-three-methods:04-fail-at-candle-2 | 4825 |
| falling-three-methods:04-fail-at-candle-3 | 279 |
| falling-three-methods:04-fail-at-candle-4 | 46 |
| falling-three-methods:04-fail-body-vs-avg | 4103 |
| falling-three-methods:04-fail-range-breach | 1047 |
| hammer:htf-pass-0.40-range | 3 |
| hammer:htf-pass-other | 5 |
| hammer:htf-seen-0.40-range | 240 |
| hammer:htf-seen-other | 507 |
| hanging-man:htf-pass-0.40-range | 2 |
| hanging-man:htf-pass-other | 4 |
| hanging-man:htf-seen-0.40-range | 228 |
| hanging-man:htf-seen-other | 501 |
| htf-baseline:bars | 781244 |
| htf-baseline:buy-0.40-range | 263643 |
| htf-baseline:buy-0.75-choch | 9005 |
| htf-baseline:buy-1.00-bos | 9937 |
| htf-baseline:buy-other | 498659 |
| htf-baseline:flag-bos | 37794 |
| htf-baseline:flag-choch | 17236 |
| htf-baseline:sell-0.40-range | 263643 |
| htf-baseline:sell-0.75-choch | 8231 |
| htf-baseline:sell-1.00-bos | 9959 |
| htf-baseline:sell-other | 499411 |
| htf-baseline:trend-down | 258131 |
| htf-baseline:trend-range | 263643 |
| htf-baseline:trend-up | 259470 |
| inverted-hammer:htf-pass-0.40-range | 3 |
| inverted-hammer:htf-pass-other | 5 |
| inverted-hammer:htf-seen-0.40-range | 230 |
| inverted-hammer:htf-seen-other | 506 |
| macd-deceleration-continuation:04-series-len-4 | 891 |
| macd-deceleration-continuation:04-series-len-5 | 637 |
| macd-deceleration-continuation:04-series-len-6 | 500 |
| macd-deceleration-continuation:04-series-len-7 | 513 |
| macd-deceleration-continuation:04-series-len-8+ | 2905 |
| macd-deceleration-continuation:05-fail-chain-step-1 | 2769 |
| macd-deceleration-continuation:05-fail-chain-step-2 | 757 |
| macd-deceleration-continuation:05-fail-chain-step-3 | 530 |
| macd-deceleration-continuation:05-fail-chain-step-4 | 330 |
| macd-deceleration-continuation:05-fail-chain-step-5 | 232 |
| macd-deceleration-continuation:05-fail-chain-step-6 | 241 |
| macd-deceleration-continuation:05-fail-flip-not-below-old-last | 76 |
| macd-deceleration-continuation:05-fail-last-not-below-flip | 355 |
| macd-deceleration-continuation:08pre-confidence-0.40 | 3 |
| macd-deceleration-continuation:08pre-confidence-0.45 | 4 |
| macd-deceleration-continuation:08pre-confidence-0.50 | 7 |
| macd-deceleration-continuation:08pre-confidence-0.55 | 10 |
| macd-deceleration-continuation:08pre-confidence-0.60 | 1 |
| macd-deceleration-continuation:08pre-confidence-0.65 | 1 |
| macd-deceleration-continuation:08pre-confidence-0.70 | 1 |
| macd-deceleration-continuation:08pre-fail-confidence | 14 |
| macd-deceleration-continuation:08pre-fail-fib-786 | 29 |
| macd-deceleration-continuation:08pre-fail-news-atr | 3 |
| mean-reversion:05a-band-exit-only-buy | 3326 |
| mean-reversion:05a-band-exit-only-sell | 3173 |
| mean-reversion:05b-band-exit-and-rsi-buy | 742 |
| mean-reversion:05b-band-exit-and-rsi-sell | 712 |
| mean-reversion:05c-band-walk-blocked-buy | 746 |
| mean-reversion:05c-band-walk-blocked-sell | 720 |
| mean-reversion:05d-htf-against-buy | 1028 |
| mean-reversion:05d-htf-against-sell | 1033 |
| mean-reversion:06pre-base-0.1 | 16 |
| mean-reversion:06pre-base-0.2 | 137 |
| mean-reversion:06pre-base-0.3 | 303 |
| mean-reversion:06pre-base-0.4 | 325 |
| mean-reversion:06pre-base-0.5 | 289 |
| mean-reversion:06pre-base-0.6 | 221 |
| mean-reversion:06pre-base-0.7 | 96 |
| mean-reversion:06pre-base-0.8 | 45 |
| mean-reversion:06pre-base-0.9 | 7 |
| mean-reversion:06pre-base-1.0 | 15 |
| mean-reversion:06pre-confidence-0.1 | 99 |
| mean-reversion:06pre-confidence-0.2 | 248 |
| mean-reversion:06pre-confidence-0.3 | 260 |
| mean-reversion:06pre-confidence-0.4 | 252 |
| mean-reversion:06pre-confidence-0.5 | 166 |
| mean-reversion:06pre-confidence-0.6 | 176 |
| mean-reversion:06pre-confidence-0.7 | 112 |
| mean-reversion:06pre-confidence-0.8 | 70 |
| mean-reversion:06pre-confidence-0.9 | 34 |
| mean-reversion:06pre-confidence-1.0 | 37 |
| mean-reversion:06pre-idealFlat-false | 1312 |
| mean-reversion:06pre-idealFlat-true | 142 |
| rising-three-methods:04-fail-at-candle-2 | 4999 |
| rising-three-methods:04-fail-at-candle-3 | 301 |
| rising-three-methods:04-fail-at-candle-4 | 39 |
| rising-three-methods:04-fail-body-vs-avg | 4202 |
| rising-three-methods:04-fail-range-breach | 1137 |
| shooting-star:htf-pass-0.40-range | 2 |
| shooting-star:htf-pass-other | 4 |
| shooting-star:htf-seen-0.40-range | 247 |
| shooting-star:htf-seen-other | 535 |
| tweezer-bottom:07pre-confidence-0.1 | 15474 |
| tweezer-bottom:07pre-confidence-0.2 | 16659 |
| tweezer-bottom:07pre-confidence-0.3 | 15 |
| tweezer-bottom:07pre-confidence-0.4 | 7 |
| tweezer-bottom:07pre-confidence-volneutral-0.1 | 12743 |
| tweezer-bottom:07pre-confidence-volneutral-0.2 | 19197 |
| tweezer-bottom:07pre-confidence-volneutral-0.3 | 206 |
| tweezer-bottom:07pre-confidence-volneutral-0.4 | 9 |
| tweezer-bottom:07pre-confirm-strong | 23203 |
| tweezer-bottom:07pre-confirm-weak | 8952 |
| tweezer-bottom:07pre-htf-0.40-range | 10418 |
| tweezer-bottom:07pre-htf-0.75-choch | 14 |
| tweezer-bottom:07pre-htf-1.00-bos | 12 |
| tweezer-bottom:07pre-htf-other | 21711 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-30-35 | 636 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-35-50 | 9530 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-lt30 | 252 |
| tweezer-bottom:07pre-joint-htf0.75-choch+rsi-35-50 | 14 |
| tweezer-bottom:07pre-joint-htf1.00-bos+rsi-35-50 | 12 |
| tweezer-bottom:07pre-joint-htfother+rsi-30-35 | 1390 |
| tweezer-bottom:07pre-joint-htfother+rsi-35-50 | 19715 |
| tweezer-bottom:07pre-joint-htfother+rsi-lt30 | 606 |
| tweezer-bottom:07pre-passes-actual-false | 32155 |
| tweezer-bottom:07pre-passes-volneutral-false | 32155 |
| tweezer-bottom:07pre-rsi-30-35 | 2026 |
| tweezer-bottom:07pre-rsi-35-50 | 29271 |
| tweezer-bottom:07pre-rsi-lt30 | 858 |
| tweezer-bottom:07pre-volume-none | 32155 |
| tweezer-top:07pre-confidence-0.1 | 15792 |
| tweezer-top:07pre-confidence-0.2 | 16957 |
| tweezer-top:07pre-confidence-0.3 | 10 |
| tweezer-top:07pre-confidence-0.4 | 5 |
| tweezer-top:07pre-confidence-volneutral-0.1 | 12947 |
| tweezer-top:07pre-confidence-volneutral-0.2 | 19600 |
| tweezer-top:07pre-confidence-volneutral-0.3 | 212 |
| tweezer-top:07pre-confidence-volneutral-0.4 | 5 |
| tweezer-top:07pre-confirm-strong | 23522 |
| tweezer-top:07pre-confirm-weak | 9242 |
| tweezer-top:07pre-htf-0.40-range | 10638 |
| tweezer-top:07pre-htf-0.75-choch | 14 |
| tweezer-top:07pre-htf-1.00-bos | 5 |
| tweezer-top:07pre-htf-other | 22107 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-50-65 | 9687 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-65-70 | 690 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-gt70 | 261 |
| tweezer-top:07pre-joint-htf0.75-choch+rsi-50-65 | 14 |
| tweezer-top:07pre-joint-htf1.00-bos+rsi-50-65 | 5 |
| tweezer-top:07pre-joint-htfother+rsi-50-65 | 19906 |
| tweezer-top:07pre-joint-htfother+rsi-65-70 | 1577 |
| tweezer-top:07pre-joint-htfother+rsi-gt70 | 624 |
| tweezer-top:07pre-passes-actual-false | 32764 |
| tweezer-top:07pre-passes-volneutral-false | 32764 |
| tweezer-top:07pre-rsi-50-65 | 29612 |
| tweezer-top:07pre-rsi-65-70 | 2267 |
| tweezer-top:07pre-rsi-gt70 | 885 |
| tweezer-top:07pre-volume-none | 32764 |

## Разбивка по инструментам

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 12 | 11 | 5 | 100.0% |
| GBPUSD | 9 | 9 | 4 | 75.0% |
| EURUSD | 8 | 4 | 2 | 100.0% |
| AUDUSD | 8 | 7 | 3 | 100.0% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 59 | 51 | 20 | 40.0% |
| EURUSD | 35 | 26 | 15 | 46.7% |
| GBPUSD | 33 | 25 | 12 | 50.0% |
| AUDUSD | 28 | 27 | 8 | 87.5% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 155 | 123 | 77 | 55.8% |
| AUDUSD | 115 | 95 | 46 | 43.5% |
| GBPUSD | 114 | 85 | 55 | 61.8% |
| EURUSD | 86 | 66 | 49 | 46.9% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 1584 | 1251 | 448 | 52.5% |
| EURUSD | 1542 | 1217 | 381 | 48.6% |
| GBPUSD | 1508 | 1213 | 402 | 53.7% |
| AUDUSD | 1484 | 1197 | 318 | 46.9% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 7248 | 5843 | 3872 | 50.4% |
| GBPUSD | 7079 | 5660 | 4119 | 48.6% |
| EURUSD | 7048 | 5606 | 3925 | 50.8% |
| USDJPY | 7019 | 5689 | 4105 | 50.5% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 635 | 510 | 432 | 53.7% |
| GBPUSD | 565 | 432 | 378 | 54.2% |
| AUDUSD | 545 | 429 | 352 | 40.9% |
| USDJPY | 508 | 349 | 286 | 50.7% |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 17 | 15 | 5 | 40.0% |
| GBPUSD | 12 | 8 | 3 | 33.3% |
| USDJPY | 12 | 11 | 5 | 80.0% |
| EURUSD | 11 | 9 | 5 | 0.0% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 123 | 96 | 56 | 50.0% |
| AUDUSD | 110 | 91 | 55 | 47.3% |
| GBPUSD | 97 | 83 | 55 | 52.7% |
| EURUSD | 89 | 74 | 47 | 48.9% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 16452 | 13252 | 4491 | 49.5% |
| EURUSD | 16437 | 13348 | 3407 | 49.4% |
| AUDUSD | 16043 | 13225 | 2912 | 51.5% |
| GBPUSD | 15065 | 12226 | 3859 | 50.8% |

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 2165 | 1584 | 1267 | 52.2% |
| AUDUSD | 1969 | 1553 | 1272 | 55.3% |
| EURUSD | 1815 | 1440 | 1187 | 51.5% |
| GBPUSD | 1663 | 1386 | 1140 | 46.8% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 6008 | 4827 | 1742 | 48.7% |
| USDJPY | 5902 | 4629 | 1819 | 49.5% |
| EURUSD | 5735 | 4598 | 1430 | 48.3% |
| AUDUSD | 5287 | 4253 | 1238 | 46.6% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 2005 | 1580 | 1338 | 44.5% |
| GBPUSD | 1972 | 1577 | 1343 | 50.7% |
| EURUSD | 1960 | 1535 | 1247 | 48.7% |
| AUDUSD | 1824 | 1467 | 1181 | 50.0% |

### fvg-sweep-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 534 | 404 | 210 | 43.3% |
| GBPUSD | 510 | 412 | 231 | 46.3% |
| AUDUSD | 479 | 376 | 203 | 51.2% |
| USDJPY | 450 | 347 | 185 | 48.1% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 889 | 697 | 556 | 51.3% |
| GBPUSD | 875 | 701 | 578 | 49.8% |
| USDJPY | 870 | 734 | 597 | 46.6% |
| AUDUSD | 785 | 644 | 506 | 49.0% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 122 | 103 | 47 | 46.8% |
| EURUSD | 115 | 99 | 48 | 56.3% |
| AUDUSD | 104 | 84 | 23 | 47.8% |
| USDJPY | 99 | 72 | 46 | 39.1% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 806 | 640 | 437 | 43.5% |
| AUDUSD | 790 | 630 | 358 | 47.5% |
| EURUSD | 785 | 619 | 369 | 51.2% |
| USDJPY | 756 | 576 | 379 | 49.3% |

### fvg-inversion-retest

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 3767 | 3010 | 1034 | 48.7% |
| EURUSD | 3756 | 2999 | 848 | 50.1% |
| USDJPY | 3613 | 2830 | 1014 | 49.4% |
| AUDUSD | 3537 | 2832 | 705 | 49.9% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 92 | 78 | 67 | 41.8% |
| GBPUSD | 87 | 71 | 60 | 51.7% |
| AUDUSD | 77 | 61 | 43 | 48.8% |
| EURUSD | 76 | 57 | 48 | 41.7% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 4572 | 3678 | 2080 | 44.7% |
| GBPUSD | 4355 | 3497 | 2026 | 46.0% |
| EURUSD | 4179 | 3368 | 1824 | 44.3% |
| AUDUSD | 4006 | 3224 | 1580 | 45.3% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 829 | 651 | 431 | 44.1% |
| EURUSD | 800 | 619 | 359 | 47.9% |
| GBPUSD | 761 | 619 | 426 | 50.0% |
| AUDUSD | 733 | 590 | 331 | 46.2% |

### fvg-htf-mss

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 136 | 105 | 40 | 52.5% |
| GBPUSD | 115 | 90 | 36 | 44.4% |
| AUDUSD | 107 | 93 | 34 | 52.9% |
| USDJPY | 98 | 69 | 24 | 29.2% |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 19 | 15 | 8 | 50.0% |
| EURUSD | 16 | 13 | 7 | 28.6% |
| AUDUSD | 15 | 12 | 3 | 66.7% |
| USDJPY | 13 | 10 | 4 | 50.0% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 899 | 765 | 383 | 41.3% |
| GBPUSD | 523 | 450 | 217 | 45.2% |
| EURUSD | 479 | 396 | 166 | 45.2% |
| AUDUSD | 435 | 359 | 152 | 42.1% |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 5 | 4 | 0 | — |
| USDJPY | 4 | 3 | 0 | — |
| GBPUSD | 3 | 3 | 0 | — |
| EURUSD | 1 | 0 | 0 | — |

### piercing-line

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 1 | 0 | 0 | — |
| USDJPY | 1 | 1 | 0 | — |
| AUDUSD | 1 | 1 | 0 | — |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 9 | 6 | 0 | — |
| USDJPY | 7 | 7 | 0 | — |
| EURUSD | 5 | 4 | 0 | — |
| AUDUSD | 1 | 1 | 0 | — |

### three-black-crows

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 1 | 0 | 0 | — |
| AUDUSD | 1 | 0 | 0 | — |

### three-white-soldiers

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 3 | 3 | 0 | — |
| GBPUSD | 1 | 1 | 0 | — |
| USDJPY | 1 | 1 | 0 | — |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 10 | 10 | 0 | — |
| GBPUSD | 6 | 5 | 0 | — |
| EURUSD | 5 | 5 | 0 | — |
| AUDUSD | 4 | 4 | 0 | — |

### inverted-hammer

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 4 | 4 | 0 | — |
| AUDUSD | 4 | 4 | 0 | — |

### hammer

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 4 | 4 | 0 | — |
| AUDUSD | 4 | 4 | 0 | — |

### dark-cloud-cover

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 2 | 2 | 0 | — |
| GBPUSD | 2 | 1 | 0 | — |
| USDJPY | 1 | 1 | 0 | — |
| AUDUSD | 1 | 1 | 0 | — |

### liquidity-sweep-reaction (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 1 | 1 | 0 | — |
| GBPUSD | 1 | 1 | 0 | — |
| USDJPY | 1 | 1 | 0 | — |
| AUDUSD | 1 | 1 | 0 | — |

### evening-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 1 | 1 | 0 | — |
| AUDUSD | 1 | 1 | 0 | — |

### shooting-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 5 | 5 | 0 | — |
| GBPUSD | 1 | 1 | 0 | — |

### hanging-man

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 5 | 5 | 0 | — |
| GBPUSD | 1 | 1 | 0 | — |

### morning-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 1 | 1 | 0 | — |

### rising-three-methods

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 1 | 1 | 0 | — |

### liquidity-sweep (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 1 | 1 | 0 | — |

## Детализация по горизонтам

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 66.7% | 92.9% | 14 |
| 3 | 66.7% | 87.5% | 16 |
| 5 | 50.0% | 83.3% | 18 |
| 10 | 83.3% | 68.2% | 22 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.1% | 50.9% | 55 |
| 2 | 50.0% | 52.9% | 70 |
| 3 | 57.9% | 56.4% | 78 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 56.4% | 163 |
| 2 | 56.2% | 51.3% | 191 |
| 3 | 53.7% | 52.9% | 227 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 52.7% | 50.7% | 1549 |
| 2 | 50.4% | 48.5% | 2179 |
| 3 | 49.3% | 47.5% | 2549 |
| 5 | 49.5% | 48.0% | 3006 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.4% | 49.7% | 6714 |
| 2 | 49.6% | 49.9% | 9824 |
| 3 | 49.9% | 50.0% | 11520 |
| 5 | 50.9% | 50.3% | 13608 |
| 10 | 52.1% | 50.0% | 16021 |
| 20 | 50.8% | 49.8% | 18023 |
| 30 | 50.1% | 49.5% | 18734 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 48.7% | 51.4% | 1049 |
| 10 | 49.5% | 51.1% | 1210 |
| 20 | 55.1% | 49.9% | 1398 |
| 30 | 55.3% | 50.1% | 1448 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 66.7% | 38.9% | 18 |
| 2 | 25.0% | 28.6% | 21 |
| 3 | 28.6% | 38.1% | 21 |
| 5 | 42.9% | 41.9% | 31 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 42.6% | 51.3% | 150 |
| 2 | 49.1% | 50.3% | 197 |
| 3 | 50.0% | 49.8% | 213 |
| 5 | 46.2% | 48.1% | 260 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.6% | 50.2% | 14669 |
| 2 | 49.2% | 49.0% | 21395 |
| 3 | 49.0% | 49.1% | 25440 |
| 5 | 49.2% | 49.1% | 30199 |

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 47.1% | 48.9% | 4283 |
| 20 | 50.6% | 50.6% | 4725 |
| 30 | 52.2% | 51.6% | 4866 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.5% | 48.4% | 6229 |
| 2 | 49.7% | 48.2% | 8556 |
| 3 | 49.7% | 48.0% | 10014 |
| 5 | 49.6% | 47.6% | 11596 |
| 10 | 47.7% | 46.6% | 13315 |
| 20 | 48.9% | 46.3% | 14783 |
| 30 | 49.4% | 46.2% | 15363 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 50.5% | 47.2% | 3860 |
| 10 | 50.9% | 47.5% | 4401 |
| 20 | 51.2% | 47.0% | 4863 |
| 30 | 50.8% | 48.4% | 5109 |

### fvg-sweep-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.6% | 51.0% | 484 |
| 2 | 48.2% | 46.6% | 682 |
| 3 | 51.7% | 47.2% | 829 |
| 5 | 48.1% | 46.6% | 965 |
| 10 | 44.7% | 46.7% | 1098 |
| 20 | 46.9% | 46.0% | 1206 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 48.1% | 47.6% | 1757 |
| 10 | 46.6% | 48.5% | 1978 |
| 20 | 47.3% | 49.1% | 2237 |
| 30 | 45.7% | 49.8% | 2326 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 68.0% | 47.6% | 164 |
| 2 | 60.0% | 48.0% | 198 |
| 3 | 49.2% | 47.6% | 206 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 51.6% | 47.7% | 1543 |
| 10 | 50.1% | 48.3% | 1765 |
| 20 | 47.9% | 49.5% | 2009 |
| 30 | 48.3% | 48.7% | 2086 |

### fvg-inversion-retest

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.1% | 49.5% | 3601 |
| 2 | 47.2% | 48.7% | 5160 |
| 3 | 48.7% | 48.2% | 6025 |
| 5 | 49.8% | 47.7% | 7125 |
| 10 | 47.9% | 47.4% | 8327 |
| 20 | 47.9% | 47.0% | 9276 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 46.9% | 38.9% | 167 |
| 10 | 42.6% | 44.0% | 207 |
| 15 | 49.1% | 45.9% | 218 |
| 20 | 48.2% | 44.2% | 217 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.5% | 45.2% | 5987 |
| 2 | 48.8% | 45.1% | 7510 |
| 3 | 48.1% | 44.5% | 8353 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 51.8% | 47.1% | 1547 |
| 10 | 49.3% | 45.5% | 1795 |
| 20 | 51.0% | 45.7% | 1971 |
| 30 | 50.3% | 46.4% | 2045 |

### fvg-htf-mss

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 55.3% | 46.3% | 134 |
| 2 | 36.2% | 38.3% | 183 |
| 3 | 39.7% | 40.2% | 209 |
| 5 | 45.9% | 43.7% | 231 |
| 10 | 42.7% | 46.7% | 261 |
| 20 | 53.4% | 44.9% | 294 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 80.0% | 45.5% | 22 |
| 2 | 87.5% | 35.7% | 28 |
| 3 | 87.5% | 25.0% | 36 |
| 5 | 72.7% | 39.5% | 38 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.1% | 43.4% | 740 |
| 2 | 49.5% | 43.0% | 918 |
| 3 | 45.9% | 41.1% | 1049 |
| 5 | 46.7% | 42.5% | 1194 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 50.0% | 44.4% | 9 |
| 10 | 33.3% | 66.7% | 6 |
| 20 | 33.3% | 50.0% | 8 |
| 30 | 0.0% | 33.3% | 9 |

### piercing-line

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 0.0% | 0 |
| 2 | 100.0% | 100.0% | 1 |
| 3 | 100.0% | 100.0% | 1 |
| 5 | 100.0% | 50.0% | 2 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 100.0% | 66.7% | 6 |
| 3 | 100.0% | 87.5% | 8 |
| 5 | 66.7% | 75.0% | 12 |
| 10 | 100.0% | 54.5% | 11 |

### three-black-crows

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 0 |
| 10 | 0.0% | 0.0% | 0 |

### three-white-soldiers

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 75.0% | 4 |
| 5 | 0.0% | 75.0% | 4 |
| 10 | 0.0% | 66.7% | 3 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 42.9% | 7 |
| 2 | 0.0% | 44.4% | 9 |
| 3 | 0.0% | 37.5% | 16 |

### inverted-hammer

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 1 |
| 2 | 0.0% | 100.0% | 1 |
| 3 | 0.0% | 100.0% | 1 |
| 5 | 0.0% | 66.7% | 3 |

### hammer

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 1 |
| 2 | 0.0% | 100.0% | 1 |
| 3 | 0.0% | 100.0% | 1 |
| 5 | 0.0% | 66.7% | 3 |

### dark-cloud-cover

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 2 |
| 2 | 0.0% | 33.3% | 3 |
| 3 | 0.0% | 33.3% | 3 |
| 5 | 0.0% | 0.0% | 2 |

### liquidity-sweep-reaction (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 2 |
| 2 | 0.0% | 100.0% | 3 |
| 3 | 0.0% | 66.7% | 3 |

### evening-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 2 |
| 5 | 0.0% | 50.0% | 2 |
| 10 | 0.0% | 50.0% | 2 |

### shooting-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 0 |
| 2 | 0.0% | 75.0% | 4 |
| 3 | 0.0% | 100.0% | 2 |
| 5 | 0.0% | 100.0% | 2 |

### hanging-man

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 0 |
| 2 | 0.0% | 75.0% | 4 |
| 3 | 0.0% | 100.0% | 2 |
| 5 | 0.0% | 100.0% | 2 |

### morning-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 0 |
| 10 | 0.0% | 0.0% | 1 |

### rising-three-methods

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 0.0% | 0.0% | 0 |
| 20 | 0.0% | 0.0% | 1 |
| 30 | 0.0% | 0.0% | 0 |

### liquidity-sweep (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 1 |
| 2 | 0.0% | 0.0% | 1 |
| 3 | 0.0% | 0.0% | 1 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### bullish-harami

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 6 | пропущен (мало train) | 0 | 0 | — |
| 2 | 12 | пропущен (мало train) | 0 | 0 | — |
| 3 | 20 | пропущен (мало train) | 0 | 0 | — |
| 4 | 31 | 2 | 5 | 4 | 80.0% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 26 | пропущен (мало train) | 0 | 0 | — |
| 2 | 53 | 1 | 14 | 7 | 50.0% |
| 3 | 87 | 1 | 17 | 6 | 35.3% |
| 4 | 122 | 3 | 19 | 13 | 68.4% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 101 | 2 | 55 | 21 | 38.2% |
| 2 | 197 | 3 | 44 | 27 | 61.4% |
| 3 | 272 | 3 | 56 | 25 | 44.6% |
| 4 | 368 | 3 | 63 | 40 | 63.5% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1240 | 1 | 425 | 211 | 49.6% |
| 2 | 2380 | 1 | 370 | 175 | 47.3% |
| 3 | 3628 | 1 | 393 | 212 | 53.9% |
| 4 | 4908 | 1 | 361 | 187 | 51.8% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 5596 | 10 | 4160 | 2081 | 50.0% |
| 2 | 11231 | 10 | 3883 | 1891 | 48.7% |
| 3 | 16901 | 10 | 4035 | 2060 | 51.1% |
| 4 | 22580 | 10 | 3943 | 1983 | 50.3% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 533 | 30 | 350 | 189 | 54.0% |
| 2 | 936 | 30 | 334 | 166 | 49.7% |
| 3 | 1354 | 30 | 375 | 174 | 46.4% |
| 4 | 1812 | 20 | 363 | 172 | 47.4% |

### bullish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 9 | пропущен (мало train) | 0 | 0 | — |
| 2 | 17 | пропущен (мало train) | 0 | 0 | — |
| 3 | 29 | пропущен (мало train) | 0 | 0 | — |
| 4 | 40 | 1 | 6 | 3 | 50.0% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 75 | 3 | 49 | 24 | 49.0% |
| 2 | 153 | 3 | 50 | 23 | 46.0% |
| 3 | 240 | 3 | 65 | 36 | 55.4% |
| 4 | 335 | 3 | 49 | 23 | 46.9% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 11946 | 1 | 4254 | 2132 | 50.1% |
| 2 | 24396 | 1 | 3433 | 1678 | 48.9% |
| 3 | 37209 | 1 | 3722 | 1860 | 50.0% |
| 4 | 50900 | 1 | 3260 | 1693 | 51.9% |

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1649 | 30 | 1424 | 689 | 48.4% |
| 2 | 3287 | 30 | 1068 | 593 | 55.5% |
| 3 | 4724 | 30 | 1214 | 678 | 55.8% |
| 4 | 6222 | 30 | 1160 | 549 | 47.3% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 4625 | 1 | 1820 | 901 | 49.5% |
| 2 | 9143 | 1 | 1450 | 707 | 48.8% |
| 3 | 13675 | 1 | 1522 | 761 | 50.0% |
| 4 | 18319 | 1 | 1437 | 647 | 45.0% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1602 | 20 | 1313 | 624 | 47.5% |
| 2 | 3197 | 10 | 1037 | 472 | 45.5% |
| 3 | 4685 | 30 | 1314 | 629 | 47.9% |
| 4 | 6275 | 30 | 1207 | 581 | 48.1% |

### fvg-sweep-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 434 | 3 | 218 | 103 | 47.2% |
| 2 | 804 | 3 | 185 | 90 | 48.6% |
| 3 | 1166 | 1 | 125 | 59 | 47.2% |
| 4 | 1589 | 1 | 116 | 61 | 52.6% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 643 | 5 | 478 | 212 | 44.4% |
| 2 | 1339 | 30 | 572 | 266 | 46.5% |
| 3 | 2031 | 20 | 574 | 287 | 50.0% |
| 4 | 2768 | 20 | 512 | 264 | 51.6% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 82 | 1 | 35 | 18 | 51.4% |
| 2 | 151 | 1 | 52 | 24 | 46.2% |
| 3 | 246 | 1 | 37 | 20 | 54.1% |
| 4 | 342 | 1 | 40 | 16 | 40.0% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 672 | 5 | 397 | 199 | 50.1% |
| 2 | 1259 | 30 | 540 | 246 | 45.6% |
| 3 | 1903 | 5 | 396 | 188 | 47.5% |
| 4 | 2543 | 20 | 487 | 232 | 47.6% |

### fvg-inversion-retest

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 3002 | 5 | 1791 | 841 | 47.0% |
| 2 | 5738 | 1 | 874 | 444 | 50.8% |
| 3 | 8651 | 1 | 878 | 428 | 48.7% |
| 4 | 11678 | 1 | 799 | 380 | 47.6% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 65 | 15 | 54 | 21 | 38.9% |
| 2 | 126 | 15 | 63 | 30 | 47.6% |
| 3 | 208 | 15 | 65 | 29 | 44.6% |
| 4 | 285 | 15 | 36 | 20 | 55.6% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 3345 | 2 | 2032 | 930 | 45.8% |
| 2 | 6646 | 2 | 1894 | 811 | 42.8% |
| 3 | 10107 | 2 | 1937 | 869 | 44.9% |
| 4 | 13851 | 2 | 1647 | 774 | 47.0% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 644 | 5 | 390 | 181 | 46.4% |
| 2 | 1210 | 5 | 373 | 179 | 48.0% |
| 3 | 1865 | 5 | 413 | 198 | 47.9% |
| 4 | 2523 | 5 | 371 | 170 | 45.8% |

### fvg-htf-mss

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 99 | 1 | 40 | 12 | 30.0% |
| 2 | 188 | 20 | 84 | 40 | 47.6% |
| 3 | 290 | 1 | 31 | 12 | 38.7% |
| 4 | 376 | 20 | 65 | 34 | 52.3% |

### bearish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 13 | пропущен (мало train) | 0 | 0 | — |
| 2 | 21 | пропущен (мало train) | 0 | 0 | — |
| 3 | 34 | 1 | 10 | 4 | 40.0% |
| 4 | 52 | 1 | 4 | 2 | 50.0% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 366 | 2 | 247 | 111 | 44.9% |
| 2 | 826 | 2 | 249 | 111 | 44.6% |
| 3 | 1388 | 2 | 241 | 97 | 40.2% |
| 4 | 1891 | 2 | 181 | 76 | 42.0% |
