# Horizon Audit — EURUSD, GBPUSD, USDJPY, AUDUSD 1m

> Сгенерировано: 2026-10-02T08:16:54.601Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): EURUSD, GBPUSD, USDJPY, AUDUSD
> Источник: Deriv WebSocket (1m candles → resampled to 1m)
> Разбиение: walk-forward, 8 folds, purge 30 bars
> Минимальный порог (train+validation): 30 срабатываний
> Минимальный порог для теста значимости (test-выборка): 200 решённых исходов
> Значимость: точный двусторонний биномиальный тест против baseline=0.5, с поправкой Holm-Bonferroni, α = 0.05
> Wilson-критерий: нижняя граница 95% интервала Уилсона ≥ 0.500 (margin=0)
> **Вердикт** (схема 2): по ДЕДУПЛИЦИРОВАННЫМ независимым наблюдениям (--dedupe-scope=pool); Holm по дедуплицированному семейству; допуск ('valid') требует нижней границы Уилсона выше max(безубыточность, дрейф-baseline).
> Выплата (payout): 80% → безубыточная доля выигрышей 55.56%
> Индикаторы: --indicators=live (18 шт.); версия алгоритма occurrences: 15

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

- Паттернов в сетке: 41
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 3
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
| bullish-harami | — | 37 | 34 | 3 | — | — | 2 | 100.0% | — | — | — | — | — | 43.8% | — | — | — | недостаточно данных |
| marubozu-bullish | — | 470 | 1616 | 229 | 415 | 224 | 3 | 52.8% | 0.4279 | 52.7% | 0.4624 | нет | нет | 46.4% | 46.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| liquidity-sweep | reversal-at-key-level | 155 | 497 | 63 | — | — | 3 | 52.4% | — | — | — | — | — | 40.3% | — | — | — | недостаточно данных |
| fvg-rejection | — | 6529 | 22674 | 1786 | 5255 | 1432 | 1 | 51.2% | 0.3089 | 51.7% | 0.1953 | нет | нет | 48.9% | 49.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| bullish-engulfing | — | 52 | 115 | 10 | — | — | 1 | 50.0% | — | — | — | — | — | 23.7% | — | — | — | недостаточно данных |
| strong-order-block-reaction | — | 32509 | 113787 | 16821 | 5726 | 2847 | 10 | 50.4% | 0.3313 | 49.8% | 0.8513 | нет | нет | 49.6% | 48.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| marubozu-bearish | — | 440 | 1456 | 182 | — | — | 1 | 49.5% | — | — | — | — | — | 42.3% | — | — | — | недостаточно данных |
| order-block-nested | — | 2291 | 8237 | 1568 | 890 | 613 | 30 | 48.9% | 0.4046 | 49.4% | 0.8085 | нет | нет | 46.4% | 45.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| inside-bar | — | 63997 | 218370 | 18606 | 32655 | 13303 | 1 | 49.9% | 0.7749 | 49.2% | 0.0611 | нет | нет | 49.2% | 48.3% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-nested | — | 10697 | 37609 | 7479 | 2440 | 1615 | 20 | 49.2% | 0.1798 | 48.9% | 0.3704 | нет | нет | 48.1% | 46.4% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| harmonic-pattern | — | 7612 | 27786 | 5446 | 693 | 491 | 30 | 51.9% | 0.0059 | 48.7% | 0.5882 | нет | нет | 50.5% | 44.3% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-return | — | 44307 | 153942 | 14610 | 6420 | 2454 | 1 | 48.2% | 0.0000 | 48.2% | 0.0862 | нет | нет | 47.4% | 46.3% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-continuation | — | 7761 | 27598 | 5259 | 3164 | 2131 | 30 | 48.2% | 0.0103 | 48.1% | 0.0831 | нет | нет | 46.9% | 46.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-breaker | — | 4193 | 14904 | 2523 | 2588 | 1548 | 10 | 48.4% | 0.1112 | 47.7% | 0.0711 | нет | нет | 46.4% | 45.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| pin-bar | — | 419 | 1428 | 231 | 374 | 198 | 3 | 46.8% | 0.3570 | — | — | нет | — | 40.4% | — | — | no-evidence (fewer independent observations than the significance threshold) | OK |
| impulse-breakout | — | 17112 | 59342 | 8061 | 11052 | 5236 | 2 | 45.2% | 0.0000 | 45.9% | 0.0000 | нет | нет | 44.2% | 44.6% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-breaker-block | — | 2013 | 7012 | 1251 | 1508 | 993 | 5 | 47.6% | 0.0898 | 45.8% | 0.0092 | нет | нет | 44.8% | 42.7% | 55.6% | rejected (significant below baseline (deduplicated)) | OK |
| mean-reversion | — | 332 | 1172 | 243 | 292 | 189 | 15 | 44.4% | 0.0951 | — | — | нет | — | 38.3% | — | — | no-evidence (fewer independent observations than the significance threshold) | OK |
| consolidation-breakout | — | 2336 | 7802 | 937 | 1817 | 860 | 2 | 42.4% | 0.0000 | 41.7% | 0.0000 | нет | нет | 39.2% | 38.5% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| bearish-engulfing | — | 63 | 169 | 15 | — | — | 1 | 33.3% | — | — | — | — | — | 15.2% | — | — | — | недостаточно данных |
| macd-deceleration-continuation | — | 13 | 2 | 11 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| piercing-line | — | 3 | 1 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-harami | — | 22 | 1 | 21 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-black-crows | — | 2 | 1 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-white-soldiers | — | 5 | 0 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 25 | 0 | 25 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
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

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 155 | 140 | 90 | 54.4% |
| AUDUSD | 115 | 108 | 57 | 50.9% |
| GBPUSD | 114 | 96 | 63 | 61.9% |
| EURUSD | 86 | 73 | 54 | 48.1% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 59 | 54 | 33 | 54.5% |
| EURUSD | 35 | 30 | 20 | 50.0% |
| GBPUSD | 33 | 28 | 20 | 60.0% |
| AUDUSD | 28 | 28 | 13 | 69.2% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 1734 | 1496 | 523 | 53.2% |
| EURUSD | 1614 | 1410 | 429 | 49.7% |
| GBPUSD | 1599 | 1406 | 471 | 53.5% |
| AUDUSD | 1582 | 1380 | 363 | 47.4% |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 17 | 16 | 5 | 40.0% |
| GBPUSD | 12 | 8 | 3 | 33.3% |
| USDJPY | 12 | 12 | 6 | 83.3% |
| EURUSD | 11 | 10 | 6 | 0.0% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 8296 | 7236 | 4854 | 50.9% |
| GBPUSD | 8144 | 7047 | 5119 | 49.2% |
| EURUSD | 8114 | 7000 | 4918 | 51.5% |
| USDJPY | 7955 | 6870 | 5057 | 50.9% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 122 | 115 | 53 | 47.2% |
| EURUSD | 115 | 105 | 50 | 58.0% |
| AUDUSD | 104 | 92 | 27 | 51.9% |
| USDJPY | 99 | 81 | 52 | 42.3% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 643 | 537 | 458 | 54.8% |
| GBPUSD | 582 | 479 | 423 | 53.7% |
| AUDUSD | 548 | 481 | 397 | 40.6% |
| USDJPY | 518 | 394 | 322 | 47.2% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 16452 | 14480 | 5025 | 49.8% |
| EURUSD | 16437 | 14549 | 3842 | 49.8% |
| AUDUSD | 16043 | 14352 | 3307 | 51.0% |
| GBPUSD | 15065 | 13305 | 4317 | 50.4% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 2786 | 2421 | 1969 | 52.6% |
| GBPUSD | 2726 | 2343 | 1871 | 48.3% |
| USDJPY | 2640 | 2353 | 1905 | 45.5% |
| AUDUSD | 2545 | 2237 | 1734 | 50.6% |

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 2165 | 1821 | 1496 | 53.1% |
| AUDUSD | 1969 | 1685 | 1376 | 55.6% |
| EURUSD | 1815 | 1616 | 1322 | 49.9% |
| GBPUSD | 1663 | 1511 | 1252 | 48.3% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 11472 | 10037 | 3789 | 49.2% |
| GBPUSD | 11355 | 9908 | 3351 | 48.7% |
| EURUSD | 11078 | 9734 | 2822 | 48.4% |
| AUDUSD | 10402 | 9134 | 2507 | 47.1% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 2005 | 1708 | 1452 | 44.8% |
| GBPUSD | 1972 | 1718 | 1465 | 50.9% |
| EURUSD | 1960 | 1674 | 1372 | 49.1% |
| AUDUSD | 1824 | 1583 | 1276 | 49.6% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 1111 | 955 | 669 | 48.6% |
| GBPUSD | 1063 | 927 | 697 | 46.1% |
| EURUSD | 1026 | 883 | 633 | 50.2% |
| USDJPY | 993 | 815 | 614 | 50.2% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 123 | 101 | 59 | 49.2% |
| AUDUSD | 110 | 97 | 58 | 48.3% |
| GBPUSD | 97 | 89 | 57 | 54.4% |
| EURUSD | 89 | 78 | 49 | 46.9% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 4572 | 4050 | 2315 | 45.0% |
| GBPUSD | 4355 | 3825 | 2245 | 46.0% |
| EURUSD | 4179 | 3660 | 2017 | 44.8% |
| AUDUSD | 4006 | 3501 | 1748 | 45.3% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 538 | 457 | 303 | 43.6% |
| EURUSD | 509 | 438 | 260 | 50.0% |
| GBPUSD | 483 | 430 | 285 | 51.6% |
| AUDUSD | 483 | 411 | 239 | 48.1% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 92 | 86 | 72 | 40.3% |
| GBPUSD | 87 | 81 | 68 | 50.0% |
| AUDUSD | 77 | 68 | 50 | 48.0% |
| EURUSD | 76 | 66 | 57 | 43.9% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| USDJPY | 899 | 831 | 418 | 43.3% |
| GBPUSD | 523 | 483 | 235 | 44.7% |
| EURUSD | 479 | 430 | 184 | 44.0% |
| AUDUSD | 435 | 397 | 171 | 43.9% |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| GBPUSD | 19 | 18 | 9 | 55.6% |
| EURUSD | 16 | 14 | 7 | 28.6% |
| AUDUSD | 15 | 14 | 4 | 75.0% |
| USDJPY | 13 | 10 | 4 | 50.0% |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| AUDUSD | 5 | 4 | 0 | — |
| USDJPY | 4 | 4 | 0 | — |
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
| GBPUSD | 9 | 9 | 0 | — |
| USDJPY | 7 | 7 | 0 | — |
| EURUSD | 5 | 4 | 0 | — |
| AUDUSD | 1 | 1 | 0 | — |

### three-black-crows

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| EURUSD | 1 | 1 | 0 | — |
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
| GBPUSD | 6 | 6 | 0 | — |
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

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.4% | 55.4% | 184 |
| 2 | 47.5% | 53.6% | 224 |
| 3 | 46.7% | 54.2% | 264 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 38.5% | 52.5% | 59 |
| 2 | 50.0% | 52.6% | 76 |
| 3 | 54.5% | 57.0% | 86 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 53.9% | 51.2% | 1786 |
| 2 | 50.8% | 48.9% | 2463 |
| 3 | 49.6% | 48.0% | 2925 |
| 5 | 47.6% | 49.0% | 3479 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 40.0% | 20 |
| 2 | 40.0% | 25.0% | 24 |
| 3 | 40.0% | 34.8% | 23 |
| 5 | 25.0% | 44.1% | 34 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 50.0% | 8482 |
| 2 | 48.8% | 50.1% | 12311 |
| 3 | 48.4% | 50.4% | 14414 |
| 5 | 49.7% | 50.8% | 16976 |
| 10 | 50.8% | 50.6% | 19948 |
| 20 | 49.3% | 50.1% | 22392 |
| 30 | 48.1% | 49.8% | 23248 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 68.8% | 49.5% | 182 |
| 2 | 66.7% | 48.4% | 223 |
| 3 | 48.5% | 47.8% | 232 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 50.5% | 50.2% | 1161 |
| 10 | 55.5% | 49.1% | 1337 |
| 20 | 57.8% | 49.4% | 1546 |
| 30 | 59.0% | 49.4% | 1600 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.3% | 50.2% | 16491 |
| 2 | 49.2% | 49.0% | 23819 |
| 3 | 48.7% | 49.2% | 28199 |
| 5 | 49.3% | 49.0% | 33350 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 45.7% | 48.1% | 5794 |
| 10 | 45.1% | 48.6% | 6698 |
| 20 | 48.3% | 49.2% | 7479 |
| 30 | 45.6% | 49.1% | 7878 |

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 48.7% | 48.4% | 4817 |
| 20 | 50.5% | 50.6% | 5287 |
| 30 | 50.7% | 51.9% | 5446 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.3% | 48.5% | 12469 |
| 2 | 50.1% | 48.3% | 17601 |
| 3 | 50.5% | 48.2% | 20554 |
| 5 | 50.3% | 48.2% | 23908 |
| 10 | 49.5% | 47.1% | 27903 |
| 20 | 50.1% | 47.1% | 30918 |
| 30 | 50.1% | 47.0% | 32388 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 51.4% | 47.3% | 4228 |
| 10 | 51.7% | 47.6% | 4809 |
| 20 | 49.6% | 47.6% | 5299 |
| 30 | 51.0% | 48.6% | 5565 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 50.7% | 48.5% | 2268 |
| 10 | 52.6% | 48.7% | 2613 |
| 20 | 47.4% | 48.8% | 2935 |
| 30 | 48.8% | 47.9% | 3013 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 40.5% | 51.2% | 160 |
| 2 | 48.8% | 50.2% | 211 |
| 3 | 50.0% | 49.8% | 223 |
| 5 | 52.0% | 46.9% | 275 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.8% | 45.4% | 6676 |
| 2 | 49.5% | 45.3% | 8325 |
| 3 | 49.2% | 44.7% | 9220 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 51.4% | 48.2% | 1087 |
| 10 | 50.2% | 47.2% | 1312 |
| 20 | 48.8% | 45.4% | 1379 |
| 30 | 51.6% | 46.2% | 1449 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 59.1% | 38.7% | 194 |
| 10 | 50.0% | 43.0% | 237 |
| 15 | 57.7% | 45.3% | 247 |
| 20 | 51.7% | 44.3% | 244 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.8% | 43.4% | 807 |
| 2 | 47.7% | 43.8% | 1008 |
| 3 | 46.3% | 41.4% | 1146 |
| 5 | 47.7% | 42.8% | 1304 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 66.7% | 50.0% | 24 |
| 2 | 80.0% | 41.9% | 31 |
| 3 | 80.0% | 30.8% | 39 |
| 5 | 66.7% | 44.2% | 43 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 0.0% | 50.0% | 10 |
| 10 | 0.0% | 71.4% | 7 |
| 20 | 0.0% | 55.6% | 9 |
| 30 | 0.0% | 30.0% | 10 |

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
| 2 | 0.0% | 71.4% | 7 |
| 3 | 100.0% | 88.9% | 9 |
| 5 | 100.0% | 71.4% | 14 |
| 10 | 100.0% | 61.5% | 13 |

### three-black-crows

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 1 |
| 5 | 0.0% | 0.0% | 1 |
| 10 | 0.0% | 0.0% | 1 |

### three-white-soldiers

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 75.0% | 4 |
| 5 | 0.0% | 75.0% | 4 |
| 10 | 0.0% | 66.7% | 3 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 37.5% | 8 |
| 2 | 0.0% | 40.0% | 10 |
| 3 | 0.0% | 35.3% | 17 |

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
| 2 | 6 | пропущен (мало train) | 0 | 0 | — |
| 3 | 12 | пропущен (мало train) | 0 | 0 | — |
| 4 | 18 | пропущен (мало train) | 0 | 0 | — |
| 5 | 21 | пропущен (мало train) | 0 | 0 | — |
| 6 | 28 | пропущен (мало train) | 0 | 0 | — |
| 7 | 34 | 2 | 3 | 3 | 100.0% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 53 | 1 | 32 | 15 | 46.9% |
| 2 | 123 | 2 | 36 | 14 | 38.9% |
| 3 | 190 | 3 | 22 | 13 | 59.1% |
| 4 | 224 | 3 | 33 | 20 | 60.6% |
| 5 | 285 | 3 | 26 | 11 | 42.3% |
| 6 | 333 | 3 | 47 | 26 | 55.3% |
| 7 | 408 | 1 | 33 | 22 | 66.7% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 15 | пропущен (мало train) | 0 | 0 | — |
| 2 | 33 | 3 | 12 | 6 | 50.0% |
| 3 | 51 | 1 | 5 | 2 | 40.0% |
| 4 | 71 | 1 | 9 | 5 | 55.6% |
| 5 | 90 | 1 | 13 | 5 | 38.5% |
| 6 | 114 | 3 | 15 | 11 | 73.3% |
| 7 | 138 | 3 | 9 | 4 | 44.4% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 837 | 1 | 256 | 137 | 53.5% |
| 2 | 1547 | 1 | 317 | 162 | 51.1% |
| 3 | 2409 | 1 | 252 | 121 | 48.0% |
| 4 | 3246 | 1 | 249 | 114 | 45.8% |
| 5 | 4073 | 1 | 211 | 120 | 56.9% |
| 6 | 4880 | 1 | 244 | 134 | 54.9% |
| 7 | 5682 | 1 | 257 | 127 | 49.4% |

### bullish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 6 | пропущен (мало train) | 0 | 0 | — |
| 2 | 12 | пропущен (мало train) | 0 | 0 | — |
| 3 | 17 | пропущен (мало train) | 0 | 0 | — |
| 4 | 23 | пропущен (мало train) | 0 | 0 | — |
| 5 | 32 | 1 | 2 | 2 | 100.0% |
| 6 | 37 | 1 | 5 | 1 | 20.0% |
| 7 | 46 | 1 | 3 | 2 | 66.7% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 4356 | 10 | 2771 | 1453 | 52.4% |
| 2 | 7936 | 10 | 3146 | 1614 | 51.3% |
| 3 | 12273 | 10 | 2710 | 1263 | 46.6% |
| 4 | 16315 | 1 | 1210 | 581 | 48.0% |
| 5 | 20479 | 5 | 2171 | 1145 | 52.7% |
| 6 | 24157 | 5 | 2355 | 1204 | 51.1% |
| 7 | 28271 | 5 | 2458 | 1214 | 49.4% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 47 | 1 | 23 | 13 | 56.5% |
| 2 | 93 | 1 | 27 | 14 | 51.9% |
| 3 | 146 | 1 | 34 | 16 | 47.1% |
| 4 | 204 | 1 | 26 | 13 | 50.0% |
| 5 | 264 | 1 | 20 | 13 | 65.0% |
| 6 | 321 | 1 | 25 | 11 | 44.0% |
| 7 | 381 | 1 | 27 | 10 | 37.0% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 400 | 30 | 189 | 82 | 43.4% |
| 2 | 610 | 30 | 245 | 128 | 52.2% |
| 3 | 900 | 30 | 229 | 122 | 53.3% |
| 4 | 1187 | 30 | 223 | 120 | 53.8% |
| 5 | 1450 | 30 | 208 | 87 | 41.8% |
| 6 | 1718 | 20 | 202 | 102 | 50.5% |
| 7 | 1972 | 20 | 272 | 126 | 46.3% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 7299 | 5 | 4901 | 2392 | 48.8% |
| 2 | 14693 | 1 | 2816 | 1412 | 50.1% |
| 3 | 23128 | 1 | 2052 | 1011 | 49.3% |
| 4 | 30870 | 1 | 2453 | 1196 | 48.8% |
| 5 | 39279 | 1 | 2075 | 1051 | 50.7% |
| 6 | 47488 | 1 | 2160 | 1139 | 52.7% |
| 7 | 55613 | 1 | 2149 | 1082 | 50.3% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1322 | 20 | 942 | 473 | 50.2% |
| 2 | 2454 | 20 | 1269 | 667 | 52.6% |
| 3 | 3949 | 20 | 1049 | 474 | 45.2% |
| 4 | 5341 | 20 | 1239 | 561 | 45.3% |
| 5 | 6895 | 20 | 976 | 483 | 49.5% |
| 6 | 8143 | 20 | 1059 | 560 | 52.9% |
| 7 | 9505 | 20 | 945 | 463 | 49.0% |

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 979 | 30 | 987 | 504 | 51.1% |
| 2 | 2111 | 30 | 915 | 431 | 47.1% |
| 3 | 3180 | 30 | 644 | 342 | 53.1% |
| 4 | 4042 | 30 | 680 | 404 | 59.4% |
| 5 | 4908 | 30 | 774 | 463 | 59.8% |
| 6 | 5864 | 30 | 672 | 326 | 48.5% |
| 7 | 6702 | 30 | 774 | 355 | 45.9% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 5488 | 3 | 3085 | 1527 | 49.5% |
| 2 | 10675 | 1 | 2189 | 1088 | 49.7% |
| 3 | 16565 | 3 | 2666 | 1225 | 45.9% |
| 4 | 21999 | 1 | 1798 | 843 | 46.9% |
| 5 | 27634 | 1 | 1481 | 735 | 49.6% |
| 6 | 33071 | 1 | 1615 | 780 | 48.3% |
| 7 | 38510 | 1 | 1776 | 851 | 47.9% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1078 | 10 | 676 | 332 | 49.1% |
| 2 | 1959 | 10 | 818 | 399 | 48.8% |
| 3 | 3040 | 10 | 651 | 314 | 48.2% |
| 4 | 3988 | 30 | 805 | 379 | 47.1% |
| 5 | 4932 | 30 | 733 | 336 | 45.8% |
| 6 | 5826 | 30 | 786 | 389 | 49.5% |
| 7 | 6775 | 30 | 790 | 387 | 49.0% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 613 | 10 | 394 | 195 | 49.5% |
| 2 | 1106 | 10 | 389 | 201 | 51.7% |
| 3 | 1614 | 10 | 361 | 168 | 46.5% |
| 4 | 2119 | 5 | 336 | 167 | 49.7% |
| 5 | 2660 | 5 | 298 | 135 | 45.3% |
| 6 | 3146 | 10 | 359 | 179 | 49.9% |
| 7 | 3646 | 10 | 386 | 176 | 45.6% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 54 | 5 | 32 | 10 | 31.3% |
| 2 | 99 | 3 | 35 | 18 | 51.4% |
| 3 | 148 | 2 | 26 | 9 | 34.6% |
| 4 | 200 | 3 | 34 | 19 | 55.9% |
| 5 | 255 | 3 | 33 | 12 | 36.4% |
| 6 | 307 | 3 | 37 | 22 | 59.5% |
| 7 | 365 | 3 | 34 | 18 | 52.9% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2076 | 2 | 1256 | 592 | 47.1% |
| 2 | 4071 | 2 | 1372 | 632 | 46.1% |
| 3 | 6291 | 2 | 1113 | 466 | 41.9% |
| 4 | 8307 | 2 | 1303 | 580 | 44.5% |
| 5 | 10709 | 2 | 1070 | 479 | 44.8% |
| 6 | 12852 | 2 | 1151 | 512 | 44.5% |
| 7 | 15036 | 1 | 796 | 386 | 48.5% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 277 | 30 | 169 | 73 | 43.2% |
| 2 | 476 | 5 | 170 | 73 | 42.9% |
| 3 | 735 | 10 | 197 | 107 | 54.3% |
| 4 | 982 | 10 | 201 | 97 | 48.3% |
| 5 | 1257 | 10 | 186 | 85 | 45.7% |
| 6 | 1510 | 5 | 166 | 85 | 51.2% |
| 7 | 1775 | 5 | 162 | 75 | 46.3% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 31 | 5 | 32 | 12 | 37.5% |
| 2 | 74 | 15 | 37 | 11 | 29.7% |
| 3 | 116 | 15 | 40 | 19 | 47.5% |
| 4 | 171 | 15 | 39 | 19 | 48.7% |
| 5 | 215 | 15 | 37 | 15 | 40.5% |
| 6 | 262 | 15 | 33 | 16 | 48.5% |
| 7 | 303 | 15 | 25 | 16 | 64.0% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 195 | 1 | 104 | 46 | 44.2% |
| 2 | 446 | 2 | 182 | 82 | 45.1% |
| 3 | 773 | 2 | 135 | 49 | 36.3% |
| 4 | 1102 | 2 | 174 | 84 | 48.3% |
| 5 | 1467 | 2 | 132 | 57 | 43.2% |
| 6 | 1772 | 2 | 134 | 50 | 37.3% |
| 7 | 2047 | 1 | 76 | 29 | 38.2% |

### bearish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 7 | пропущен (мало train) | 0 | 0 | — |
| 2 | 15 | пропущен (мало train) | 0 | 0 | — |
| 3 | 21 | пропущен (мало train) | 0 | 0 | — |
| 4 | 30 | 1 | 6 | 1 | 16.7% |
| 5 | 37 | 2 | 2 | 1 | 50.0% |
| 6 | 46 | 1 | 5 | 2 | 40.0% |
| 7 | 56 | 1 | 2 | 1 | 50.0% |
