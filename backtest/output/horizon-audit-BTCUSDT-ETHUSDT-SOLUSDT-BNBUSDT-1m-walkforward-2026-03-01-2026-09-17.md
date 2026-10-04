# Horizon Audit — BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT 1m

> Сгенерировано: 2026-10-02T07:40:14.454Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT
> Источник: Deriv WebSocket (1m candles → resampled to 1m)
> Разбиение: walk-forward, 8 folds, purge 30 bars
> Минимальный порог (train+validation): 30 срабатываний
> Минимальный порог для теста значимости (test-выборка): 200 решённых исходов
> Значимость: точный двусторонний биномиальный тест против baseline=0.5, с поправкой Holm-Bonferroni, α = 0.05
> Wilson-критерий: нижняя граница 95% интервала Уилсона ≥ 0.500 (margin=0)
> **Вердикт** (схема 2): по ДЕДУПЛИЦИРОВАННЫМ независимым наблюдениям (--dedupe-scope=pool); Holm по дедуплицированному семейству; допуск ('valid') требует нижней границы Уилсона выше max(безубыточность, дрейф-baseline).
> Выплата (payout): 80% → безубыточная доля выигрышей 55.56%
> Индикаторы: --indicators=live (18 шт.); версия алгоритма occurrences: 15

**Загружено**: 1151360 1m свечей (суммарно по пулу), 1151360 1m свечей после ресэмплинга.

## Метаданные пула

| Инструмент | 1m свечей | 1m свечей | История обрезана? |
|---|---|---|---|
| BTCUSDT | 287842 | 287842 | нет |
| ETHUSDT | 287841 | 287841 | нет |
| SOLUSDT | 287835 | 287835 | нет |
| BNBUSDT | 287842 | 287842 | нет |

> **Предупреждение о корреляции**: Пул содержит 4 инструментов. Корреляция между инструментами (особенно forex-парами с общей валютой и крипто-парами к USDT) может завышать эффективный размер выборки. Сырой p-value НЕ корректируется на межинструментную корреляцию — он оставлен только для сравнения с прошлыми отчётами. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 41
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 10
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 0
- Значимых вверх по дедуп. (Holm), всего: 0
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 1; прошли сырой Wilson-гейт: 1
- Недостаточно данных: 21
- Нет срабатываний: 4

### Пересечение критериев

- Прошли оба (формальный + Wilson): 1
- Только формальный тест: 0
- Только Wilson-гейт: 0

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| shooting-star | — | 381 | 1002 | 113 | — | — | 2 | 54.0% | — | — | — | — | — | 44.8% | — | — | — | недостаточно данных |
| hanging-man | — | 381 | 1002 | 113 | — | — | 2 | 54.0% | — | — | — | — | — | 44.8% | — | — | — | недостаточно данных |
| liquidity-sweep | reversal-at-key-level | 276 | 1028 | 173 | — | — | 1 | 53.8% | — | — | — | — | — | 46.3% | — | — | — | недостаточно данных |
| harmonic-pattern | — | 12436 | 44924 | 9907 | 1021 | 817 | 30 | 52.6% | 0.0000 | 53.2% | 0.0688 | да | нет | 51.7% | 49.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| inverted-hammer | — | 424 | 999 | 124 | — | — | 1 | 52.4% | — | — | — | — | — | 43.7% | — | — | — | недостаточно данных |
| hammer | — | 424 | 999 | 124 | — | — | 1 | 52.4% | — | — | — | — | — | 43.7% | — | — | — | недостаточно данных |
| bearish-engulfing | — | 58 | 169 | 23 | — | — | 5 | 52.2% | — | — | — | — | — | 33.0% | — | — | — | недостаточно данных |
| bullish-harami | — | 35 | 30 | 4 | — | — | 5 | 50.0% | — | — | — | — | — | 15.0% | — | — | — | недостаточно данных |
| inside-bar | — | 99545 | 332748 | 57449 | 43845 | 25346 | 1 | 48.2% | 0.0000 | 48.7% | 0.0000 | нет | нет | 47.8% | 48.1% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| strong-order-block-reaction | — | 45467 | 158357 | 27821 | 7020 | 4056 | 1 | 48.0% | 0.0000 | 48.5% | 0.0662 | нет | нет | 47.4% | 47.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-nested | — | 2747 | 9543 | 2259 | 1037 | 851 | 30 | 50.9% | 0.4240 | 48.4% | 0.3728 | нет | нет | 48.8% | 45.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-nested | — | 21510 | 75798 | 14984 | 3771 | 2692 | 5 | 47.1% | 0.0000 | 47.9% | 0.0324 | нет | нет | 46.3% | 46.0% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-rejection | — | 9048 | 32073 | 5036 | 6607 | 3905 | 1 | 48.0% | 0.0042 | 47.7% | 0.0048 | нет | нет | 46.6% | 46.2% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| mean-reversion | — | 627 | 2070 | 480 | 540 | 419 | 20 | 49.6% | 0.8911 | 47.7% | 0.3792 | нет | нет | 45.1% | 43.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-continuation | — | 12459 | 42446 | 9525 | 4575 | 3639 | 10 | 47.9% | 0.0000 | 47.5% | 0.0023 | нет | нет | 46.9% | 45.8% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| bullish-engulfing | — | 60 | 164 | 19 | — | — | 1 | 47.4% | — | — | — | — | — | 27.3% | — | — | — | недостаточно данных |
| fvg-return | — | 76771 | 268539 | 43077 | 8021 | 5067 | 1 | 47.3% | 0.0000 | 46.9% | 0.0000 | нет | нет | 46.8% | 45.5% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-breaker | — | 4906 | 17255 | 3882 | 2940 | 2357 | 30 | 45.6% | 0.0000 | 46.5% | 0.0008 | нет | нет | 44.0% | 44.5% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-breaker-block | — | 2840 | 9789 | 2135 | 2020 | 1571 | 10 | 45.5% | 0.0000 | 46.1% | 0.0025 | нет | нет | 43.4% | 43.7% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| marubozu-bearish | — | 534 | 1606 | 384 | 424 | 279 | 2 | 48.7% | 0.6461 | 45.5% | 0.1506 | нет | нет | 43.7% | 39.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| consolidation-breakout | — | 4421 | 13392 | 2710 | 3006 | 1866 | 1 | 46.8% | 0.0010 | 45.4% | 0.0001 | нет | нет | 45.0% | 43.1% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| impulse-breakout | — | 22450 | 76042 | 14507 | 10823 | 6973 | 1 | 44.6% | 0.0000 | 45.1% | 0.0000 | нет | нет | 43.8% | 43.9% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| pin-bar | — | 416 | 1363 | 290 | 359 | 271 | 1 | 43.1% | 0.0218 | 43.9% | 0.0517 | нет | нет | 37.5% | 38.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| marubozu-bullish | — | 580 | 1975 | 423 | 461 | 322 | 2 | 42.3% | 0.0018 | 41.0% | 0.0015 | нет | нет | 37.7% | 35.8% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| bearish-harami | — | 38 | 66 | 6 | — | — | 2 | 33.3% | — | — | — | — | — | 9.7% | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 33 | 0 | 27 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| macd-deceleration-continuation | — | 10 | 2 | 8 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| piercing-line | — | 3 | 2 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-black-crows | — | 8 | 1 | 7 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| morning-star | — | 5 | 0 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-white-soldiers | — | 15 | 1 | 14 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| dark-cloud-cover | — | 6 | 1 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep | continuation | 3 | 0 | 3 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| rising-three-methods | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | continuation | 3 | 1 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| evening-star | — | 3 | 1 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| falling-three-methods | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| tweezer-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Воронка гейтов (инструментированные детекторы)

> Сколько баров дошло до каждого этапа детектора; разница соседних строк — отсев на этом гейте. Покрыты только детекторы с вызовами `gate()` (hammer, inverted-hammer, hanging-man, shooting-star, mean-reversion); остальные в воронке не участвуют. Счётчики — суммарно по пулу, за весь период (не только test).

### abandoned-baby-bottom

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-trend | 209533 | 18.232% | 939707 |
| 02-candle-a | 42105 | 3.664% | 167428 |
| 03-doji | 2267 | 0.197% | 39838 |
| 04-gaps-and-candle-c | 61 | 0.005% | 2206 |
| 05-session | 61 | 0.005% | 0 |
| 06-volume | 61 | 0.005% | 0 |
| 07-fourth-candle | 33 | 0.003% | 28 |

### abandoned-baby-top

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-trend | 219206 | 19.074% | 930034 |
| 02-candle-a | 44565 | 3.878% | 174641 |
| 03-doji | 2394 | 0.208% | 42171 |
| 04-gaps-and-candle-c | 97 | 0.008% | 2297 |
| 05-session | 97 | 0.008% | 0 |
| 06-volume | 97 | 0.008% | 0 |
| 07-fourth-candle | 52 | 0.005% | 45 |

### falling-three-methods

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-trend | 209533 | 18.232% | 939707 |
| 02-session | 209533 | 18.232% | 0 |
| 03-candle1 | 14636 | 1.274% | 194897 |
| 04-consolidation | 47 | 0.004% | 14589 |
| 05-candle5 | 6 | 0.001% | 41 |
| 06-volume | 6 | 0.001% | 0 |
| 07-rsi | 4 | 0.000% | 2 |
| 08-macd | 4 | 0.000% | 0 |
| 09-soft-filters | 1 | 0.000% | 3 |
| 10-confidence | 1 | 0.000% | 0 |

### hammer

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-context | 705758 | 61.411% | 443482 |
| 02-session | 705758 | 61.411% | 0 |
| 03-rsi | 197167 | 17.156% | 508591 |
| 04-geometry | 12216 | 1.063% | 184951 |
| 05-confirmation | 3251 | 0.283% | 8965 |
| 06-confidence | 424 | 0.037% | 2827 |

### hanging-man

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-context | 708817 | 61.677% | 440423 |
| 02-session | 708817 | 61.677% | 0 |
| 03-rsi | 197859 | 17.217% | 510958 |
| 04-geometry | 10992 | 0.956% | 186867 |
| 05-confirmation | 2421 | 0.211% | 8571 |
| 06-confidence | 381 | 0.033% | 2040 |

### inverted-hammer

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-context | 705758 | 61.411% | 443482 |
| 02-session | 705758 | 61.411% | 0 |
| 03-rsi | 197167 | 17.156% | 508591 |
| 04-geometry | 10982 | 0.956% | 186185 |
| 05-confirmation | 2505 | 0.218% | 8477 |
| 06-confidence | 424 | 0.037% | 2081 |

### liquidity-sweep

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-indicators | 1149240 | 100.000% | 0 |
| 02-sweep-geometry | 85614 | 7.450% | 1063626 |
| 02b-rejection | 64894 | 5.647% | 20720 |
| 03-context | 41694 | 3.628% | 23200 |
| 04-depth | 41637 | 3.623% | 57 |
| 05-volume | 41637 | 3.623% | 0 |
| 06-confidence | 279 | 0.024% | 41358 |

### liquidity-sweep-inner

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 2298194 | 100.000% | — |
| 01-indicators | 2298194 | 100.000% | 0 |
| 02-sweep-geometry | 171211 | 7.450% | 2126983 |
| 02b-rejection | 129779 | 5.647% | 41432 |
| 03-context | 99396 | 4.325% | 30383 |
| 04-depth | 99062 | 4.310% | 334 |
| 05-volume | 99062 | 4.310% | 0 |
| 06-confidence | 1656 | 0.072% | 97406 |

### liquidity-sweep-reaction

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-sweep-found | 1375 | 0.120% | 1147865 |
| 02-broke-extreme | 750 | 0.065% | 625 |
| 03-displacement-direction | 543 | 0.047% | 207 |
| 04-no-retake | 543 | 0.047% | 0 |
| 05-body | 324 | 0.028% | 219 |
| 06-volume | 324 | 0.028% | 0 |
| 07-confidence | 36 | 0.003% | 288 |

### macd-deceleration-continuation

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-trend | 810701 | 70.542% | 338539 |
| 02-histogram-flip | 57315 | 4.987% | 753386 |
| 03-flip-direction | 23407 | 2.037% | 33908 |
| 04-old-series | 8976 | 0.781% | 14431 |
| 05-decay | 286 | 0.025% | 8690 |
| 06-pause-candle | 210 | 0.018% | 76 |
| 07-rsi-adx | 108 | 0.009% | 102 |
| 08-confidence | 10 | 0.001% | 98 |

### mean-reversion

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-indicators | 1149240 | 100.000% | 0 |
| 02-no-bos-block | 1145588 | 99.682% | 3652 |
| 03-adx | 654632 | 56.962% | 490956 |
| 04-bar-geometry | 81418 | 7.085% | 573214 |
| 05-band-exit-rsi | 2101 | 0.183% | 79317 |
| 06-confidence | 627 | 0.055% | 1474 |

### rising-three-methods

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-trend | 219205 | 19.074% | 930035 |
| 02-session | 219205 | 19.074% | 0 |
| 03-candle1 | 15782 | 1.373% | 203423 |
| 04-consolidation | 43 | 0.004% | 15739 |
| 05-candle5 | 2 | 0.000% | 41 |
| 06-volume | 2 | 0.000% | 0 |
| 07-rsi | 2 | 0.000% | 0 |
| 08-macd | 2 | 0.000% | 0 |
| 09-soft-filters | 2 | 0.000% | 0 |
| 10-confidence | 1 | 0.000% | 1 |

### shooting-star

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-context | 708817 | 61.677% | 440423 |
| 02-session | 658899 | 57.333% | 49918 |
| 03-rsi | 196065 | 17.060% | 462834 |
| 04-geometry | 12275 | 1.068% | 183790 |
| 05-confirmation | 3220 | 0.280% | 9055 |
| 06-confidence | 381 | 0.033% | 2839 |

### tweezer-bottom

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-twin-extreme | 1063408 | 92.531% | 85832 |
| 02-body-direction | 520505 | 45.291% | 542903 |
| 03-trend-context | 319672 | 27.816% | 200833 |
| 04-session | 319672 | 27.816% | 0 |
| 05-rsi | 172256 | 14.989% | 147416 |
| 06-confirmation | 86154 | 7.497% | 86102 |

### tweezer-top

| Этап (кандидат дошёл до) | Дошло | % от вызовов | Отсеяно на этом гейте |
|---|---|---|---|
| 00-evaluated | 1149240 | 100.000% | — |
| 01-twin-extreme | 1063169 | 92.511% | 86071 |
| 02-body-direction | 512962 | 44.635% | 550207 |
| 03-trend-context | 317006 | 27.584% | 195956 |
| 04-session | 317006 | 27.584% | 0 |
| 05-rsi | 172343 | 14.996% | 144663 |
| 06-confirmation | 85921 | 7.476% | 86422 |


> D3 (промт "Исправление по воронке гейтов", п.6-7): `htf-seen-*`/`htf-pass-*` — сколько кандидатов hammer-семейства дошло до финальной проверки confidence и сколько из них её прошло, в разбивке по классу множителя `htfAlignment()` (1.00-bos / 0.75-choch / 0.40-range / other=0.5). `05a-band-exit-only-*`/`05b-band-exit-and-rsi-*` — та же геометрия mean-reversion (вышел за полосу BB и вернулся), раздельно БЕЗ требования по RSI(7) и С ним — раньше это была одна склеенная стадия `05-band-exit-rsi`. Чисто измерительные счётчики, ни на что не влияют.

## D3 — диагностические срезы (не влияют на вердикты, только измерение)

| Счётчик | Значение |
|---|---|
| falling-three-methods:04-fail-at-candle-2 | 13784 |
| falling-three-methods:04-fail-at-candle-3 | 690 |
| falling-three-methods:04-fail-at-candle-4 | 115 |
| falling-three-methods:04-fail-body-vs-avg | 12088 |
| falling-three-methods:04-fail-range-breach | 2501 |
| hammer:htf-pass-0.40-range | 154 |
| hammer:htf-pass-other | 270 |
| hammer:htf-seen-0.40-range | 1139 |
| hammer:htf-seen-other | 2112 |
| hanging-man:htf-pass-0.40-range | 132 |
| hanging-man:htf-pass-other | 249 |
| hanging-man:htf-seen-0.40-range | 799 |
| hanging-man:htf-seen-other | 1622 |
| htf-baseline:bars | 1149240 |
| htf-baseline:buy-0.40-range | 379751 |
| htf-baseline:buy-0.75-choch | 12707 |
| htf-baseline:buy-1.00-bos | 13124 |
| htf-baseline:buy-other | 743658 |
| htf-baseline:flag-bos | 52162 |
| htf-baseline:flag-choch | 26066 |
| htf-baseline:sell-0.40-range | 379751 |
| htf-baseline:sell-0.75-choch | 13359 |
| htf-baseline:sell-1.00-bos | 12606 |
| htf-baseline:sell-other | 743524 |
| htf-baseline:trend-down | 379387 |
| htf-baseline:trend-range | 379751 |
| htf-baseline:trend-up | 390102 |
| inverted-hammer:htf-pass-0.40-range | 154 |
| inverted-hammer:htf-pass-other | 270 |
| inverted-hammer:htf-seen-0.40-range | 811 |
| inverted-hammer:htf-seen-other | 1694 |
| macd-deceleration-continuation:04-series-len-4 | 1496 |
| macd-deceleration-continuation:04-series-len-5 | 1051 |
| macd-deceleration-continuation:04-series-len-6 | 815 |
| macd-deceleration-continuation:04-series-len-7 | 777 |
| macd-deceleration-continuation:04-series-len-8+ | 4837 |
| macd-deceleration-continuation:05-fail-chain-step-1 | 4542 |
| macd-deceleration-continuation:05-fail-chain-step-2 | 1265 |
| macd-deceleration-continuation:05-fail-chain-step-3 | 930 |
| macd-deceleration-continuation:05-fail-chain-step-4 | 596 |
| macd-deceleration-continuation:05-fail-chain-step-5 | 345 |
| macd-deceleration-continuation:05-fail-chain-step-6 | 380 |
| macd-deceleration-continuation:05-fail-flip-not-below-old-last | 79 |
| macd-deceleration-continuation:05-fail-last-not-below-flip | 553 |
| macd-deceleration-continuation:08pre-confidence-0.40 | 3 |
| macd-deceleration-continuation:08pre-confidence-0.45 | 7 |
| macd-deceleration-continuation:08pre-confidence-0.50 | 12 |
| macd-deceleration-continuation:08pre-confidence-0.55 | 6 |
| macd-deceleration-continuation:08pre-confidence-0.60 | 3 |
| macd-deceleration-continuation:08pre-confidence-0.75 | 1 |
| macd-deceleration-continuation:08pre-fail-confidence | 22 |
| macd-deceleration-continuation:08pre-fail-fib-786 | 64 |
| macd-deceleration-continuation:08pre-fail-news-atr | 12 |
| mean-reversion:05a-band-exit-only-buy | 5169 |
| mean-reversion:05a-band-exit-only-sell | 4930 |
| mean-reversion:05b-band-exit-and-rsi-buy | 1062 |
| mean-reversion:05b-band-exit-and-rsi-sell | 1039 |
| mean-reversion:05c-band-walk-blocked-buy | 1189 |
| mean-reversion:05c-band-walk-blocked-sell | 1218 |
| mean-reversion:05d-htf-against-buy | 1782 |
| mean-reversion:05d-htf-against-sell | 1647 |
| mean-reversion:06pre-base-0.1 | 13 |
| mean-reversion:06pre-base-0.2 | 154 |
| mean-reversion:06pre-base-0.3 | 377 |
| mean-reversion:06pre-base-0.4 | 476 |
| mean-reversion:06pre-base-0.5 | 493 |
| mean-reversion:06pre-base-0.6 | 358 |
| mean-reversion:06pre-base-0.7 | 138 |
| mean-reversion:06pre-base-0.8 | 61 |
| mean-reversion:06pre-base-0.9 | 21 |
| mean-reversion:06pre-base-1.0 | 10 |
| mean-reversion:06pre-confidence-0.1 | 7 |
| mean-reversion:06pre-confidence-0.2 | 98 |
| mean-reversion:06pre-confidence-0.3 | 288 |
| mean-reversion:06pre-confidence-0.4 | 423 |
| mean-reversion:06pre-confidence-0.5 | 460 |
| mean-reversion:06pre-confidence-0.6 | 364 |
| mean-reversion:06pre-confidence-0.7 | 221 |
| mean-reversion:06pre-confidence-0.8 | 137 |
| mean-reversion:06pre-confidence-0.9 | 62 |
| mean-reversion:06pre-confidence-1.0 | 41 |
| mean-reversion:06pre-idealFlat-false | 1889 |
| mean-reversion:06pre-idealFlat-true | 212 |
| rising-three-methods:04-fail-at-candle-2 | 14845 |
| rising-three-methods:04-fail-at-candle-3 | 775 |
| rising-three-methods:04-fail-at-candle-4 | 119 |
| rising-three-methods:04-fail-body-vs-avg | 12999 |
| rising-three-methods:04-fail-range-breach | 2740 |
| shooting-star:htf-pass-0.40-range | 132 |
| shooting-star:htf-pass-other | 249 |
| shooting-star:htf-seen-0.40-range | 1052 |
| shooting-star:htf-seen-other | 2168 |
| tweezer-bottom:07pre-confidence-0.0 | 4187 |
| tweezer-bottom:07pre-confidence-0.1 | 63244 |
| tweezer-bottom:07pre-confidence-0.2 | 18702 |
| tweezer-bottom:07pre-confidence-0.3 | 12 |
| tweezer-bottom:07pre-confidence-0.4 | 9 |
| tweezer-bottom:07pre-confidence-volneutral-0.1 | 64859 |
| tweezer-bottom:07pre-confidence-volneutral-0.2 | 21084 |
| tweezer-bottom:07pre-confidence-volneutral-0.3 | 201 |
| tweezer-bottom:07pre-confidence-volneutral-0.4 | 10 |
| tweezer-bottom:07pre-confirm-strong | 62914 |
| tweezer-bottom:07pre-confirm-weak | 23240 |
| tweezer-bottom:07pre-htf-0.40-range | 28628 |
| tweezer-bottom:07pre-htf-0.75-choch | 16 |
| tweezer-bottom:07pre-htf-1.00-bos | 19 |
| tweezer-bottom:07pre-htf-other | 57491 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-30-35 | 1908 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-35-50 | 25917 |
| tweezer-bottom:07pre-joint-htf0.40-range+rsi-lt30 | 803 |
| tweezer-bottom:07pre-joint-htf0.75-choch+rsi-35-50 | 16 |
| tweezer-bottom:07pre-joint-htf1.00-bos+rsi-35-50 | 19 |
| tweezer-bottom:07pre-joint-htfother+rsi-30-35 | 3680 |
| tweezer-bottom:07pre-joint-htfother+rsi-35-50 | 52325 |
| tweezer-bottom:07pre-joint-htfother+rsi-lt30 | 1486 |
| tweezer-bottom:07pre-passes-actual-false | 86154 |
| tweezer-bottom:07pre-passes-volneutral-false | 86154 |
| tweezer-bottom:07pre-rsi-30-35 | 5588 |
| tweezer-bottom:07pre-rsi-35-50 | 78277 |
| tweezer-bottom:07pre-rsi-lt30 | 2289 |
| tweezer-bottom:07pre-volume-none | 86154 |
| tweezer-top:07pre-confidence-0.0 | 4310 |
| tweezer-top:07pre-confidence-0.1 | 62663 |
| tweezer-top:07pre-confidence-0.2 | 18940 |
| tweezer-top:07pre-confidence-0.3 | 4 |
| tweezer-top:07pre-confidence-0.4 | 4 |
| tweezer-top:07pre-confidence-volneutral-0.1 | 64181 |
| tweezer-top:07pre-confidence-volneutral-0.2 | 21550 |
| tweezer-top:07pre-confidence-volneutral-0.3 | 185 |
| tweezer-top:07pre-confidence-volneutral-0.4 | 5 |
| tweezer-top:07pre-confirm-strong | 61948 |
| tweezer-top:07pre-confirm-weak | 23973 |
| tweezer-top:07pre-htf-0.40-range | 28308 |
| tweezer-top:07pre-htf-0.75-choch | 16 |
| tweezer-top:07pre-htf-1.00-bos | 20 |
| tweezer-top:07pre-htf-other | 57577 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-50-65 | 25679 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-65-70 | 1841 |
| tweezer-top:07pre-joint-htf0.40-range+rsi-gt70 | 788 |
| tweezer-top:07pre-joint-htf0.75-choch+rsi-50-65 | 16 |
| tweezer-top:07pre-joint-htf1.00-bos+rsi-50-65 | 20 |
| tweezer-top:07pre-joint-htfother+rsi-50-65 | 52533 |
| tweezer-top:07pre-joint-htfother+rsi-65-70 | 3621 |
| tweezer-top:07pre-joint-htfother+rsi-gt70 | 1423 |
| tweezer-top:07pre-passes-actual-false | 85921 |
| tweezer-top:07pre-passes-volneutral-false | 85921 |
| tweezer-top:07pre-rsi-50-65 | 78248 |
| tweezer-top:07pre-rsi-65-70 | 5462 |
| tweezer-top:07pre-rsi-gt70 | 2211 |
| tweezer-top:07pre-volume-none | 85921 |

## Разбивка по инструментам

### shooting-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 188 | 178 | 95 | 58.9% |
| SOLUSDT | 118 | 114 | 9 | 33.3% |
| ETHUSDT | 67 | 66 | 33 | 42.4% |
| BTCUSDT | 8 | 7 | 6 | 33.3% |

### hanging-man

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 188 | 178 | 95 | 58.9% |
| SOLUSDT | 118 | 114 | 9 | 33.3% |
| ETHUSDT | 67 | 66 | 33 | 42.4% |
| BTCUSDT | 8 | 7 | 6 | 33.3% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 72 | 62 | 61 | 60.7% |
| ETHUSDT | 69 | 58 | 45 | 37.8% |
| SOLUSDT | 68 | 55 | 23 | 56.5% |
| BNBUSDT | 67 | 60 | 44 | 59.1% |

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3469 | 2956 | 2943 | 53.8% |
| SOLUSDT | 3134 | 2691 | 2143 | 55.9% |
| ETHUSDT | 2939 | 2664 | 2519 | 52.0% |
| BNBUSDT | 2894 | 2546 | 2341 | 51.2% |

### inverted-hammer

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 222 | 216 | 87 | 57.5% |
| SOLUSDT | 136 | 133 | 9 | 55.6% |
| ETHUSDT | 61 | 60 | 20 | 50.0% |
| BTCUSDT | 5 | 5 | 5 | 80.0% |

### hammer

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 222 | 216 | 87 | 57.5% |
| SOLUSDT | 136 | 133 | 9 | 55.6% |
| ETHUSDT | 61 | 60 | 20 | 50.0% |
| BTCUSDT | 5 | 5 | 5 | 80.0% |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 18 | 13 | 11 | 63.6% |
| SOLUSDT | 15 | 12 | 10 | 70.0% |
| BTCUSDT | 13 | 13 | 13 | 61.5% |
| ETHUSDT | 12 | 10 | 8 | 50.0% |

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 13 | 12 | 8 | 25.0% |
| ETHUSDT | 11 | 10 | 8 | 50.0% |
| BTCUSDT | 8 | 8 | 8 | 37.5% |
| SOLUSDT | 3 | 3 | 1 | 100.0% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 28884 | 25887 | 5867 | 49.0% |
| BNBUSDT | 25632 | 22765 | 13323 | 49.0% |
| ETHUSDT | 22800 | 20386 | 13549 | 47.4% |
| BTCUSDT | 22229 | 19847 | 18481 | 48.8% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 11689 | 10257 | 9740 | 47.8% |
| ETHUSDT | 11464 | 9966 | 7119 | 48.8% |
| SOLUSDT | 11388 | 9996 | 2607 | 48.2% |
| BNBUSDT | 10926 | 9498 | 5948 | 48.6% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 732 | 645 | 644 | 49.7% |
| ETHUSDT | 701 | 639 | 614 | 50.7% |
| BNBUSDT | 664 | 604 | 560 | 52.9% |
| SOLUSDT | 650 | 540 | 441 | 50.3% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 5939 | 5256 | 2788 | 47.0% |
| BNBUSDT | 5357 | 4721 | 3914 | 46.4% |
| ETHUSDT | 5193 | 4628 | 3902 | 46.1% |
| BTCUSDT | 5021 | 4470 | 4380 | 48.7% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 2365 | 2055 | 594 | 51.7% |
| BTCUSDT | 2279 | 1986 | 1864 | 48.0% |
| BNBUSDT | 2238 | 1937 | 1246 | 49.1% |
| ETHUSDT | 2166 | 1871 | 1332 | 45.3% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 165 | 148 | 131 | 44.3% |
| BTCUSDT | 159 | 141 | 141 | 46.1% |
| SOLUSDT | 158 | 140 | 90 | 48.9% |
| ETHUSDT | 145 | 141 | 125 | 53.6% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3384 | 3000 | 2981 | 47.1% |
| BNBUSDT | 3302 | 2898 | 2544 | 48.7% |
| ETHUSDT | 2977 | 2633 | 2389 | 48.3% |
| SOLUSDT | 2796 | 2491 | 1666 | 46.8% |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 18 | 18 | 18 | 55.6% |
| SOLUSDT | 16 | 15 | 4 | 50.0% |
| BNBUSDT | 16 | 16 | 11 | 36.4% |
| BTCUSDT | 10 | 9 | 7 | 28.6% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 19786 | 17400 | 16244 | 47.6% |
| BNBUSDT | 19772 | 17373 | 10909 | 47.6% |
| ETHUSDT | 18644 | 16238 | 11372 | 46.1% |
| SOLUSDT | 18569 | 16333 | 4552 | 48.6% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1327 | 1143 | 929 | 47.6% |
| ETHUSDT | 1267 | 1083 | 1008 | 45.6% |
| BTCUSDT | 1196 | 1039 | 1037 | 43.8% |
| BNBUSDT | 1116 | 969 | 910 | 46.5% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 790 | 692 | 618 | 48.4% |
| SOLUSDT | 752 | 666 | 453 | 45.3% |
| BTCUSDT | 666 | 584 | 576 | 45.1% |
| ETHUSDT | 632 | 548 | 488 | 42.6% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 193 | 183 | 138 | 49.3% |
| BTCUSDT | 146 | 135 | 132 | 50.8% |
| SOLUSDT | 103 | 99 | 40 | 52.5% |
| ETHUSDT | 92 | 87 | 74 | 50.0% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1300 | 1221 | 1126 | 46.7% |
| BNBUSDT | 1198 | 1094 | 664 | 47.1% |
| ETHUSDT | 978 | 890 | 650 | 47.8% |
| SOLUSDT | 945 | 863 | 270 | 44.1% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 6066 | 5387 | 3860 | 45.9% |
| BTCUSDT | 5635 | 5011 | 4858 | 44.6% |
| SOLUSDT | 5494 | 4893 | 2034 | 44.6% |
| ETHUSDT | 5255 | 4644 | 3755 | 43.2% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 109 | 97 | 94 | 48.9% |
| BNBUSDT | 106 | 100 | 74 | 41.9% |
| SOLUSDT | 101 | 88 | 28 | 42.9% |
| ETHUSDT | 100 | 94 | 83 | 45.8% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 224 | 206 | 164 | 48.2% |
| BTCUSDT | 134 | 127 | 125 | 39.2% |
| SOLUSDT | 132 | 124 | 61 | 47.5% |
| ETHUSDT | 90 | 84 | 76 | 42.1% |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 13 | 13 | 11 | 45.5% |
| BTCUSDT | 9 | 7 | 7 | 42.9% |
| SOLUSDT | 8 | 7 | 4 | 75.0% |
| BNBUSDT | 8 | 6 | 4 | 25.0% |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 12 | 10 | 0 | — |
| BTCUSDT | 8 | 6 | 0 | — |
| BNBUSDT | 8 | 7 | 0 | — |
| ETHUSDT | 5 | 4 | 0 | — |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3 | 1 | 0 | — |
| SOLUSDT | 3 | 3 | 0 | — |
| BNBUSDT | 3 | 3 | 0 | — |
| ETHUSDT | 1 | 1 | 0 | — |

### piercing-line

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 2 | 1 | 0 | — |
| BTCUSDT | 1 | 0 | 0 | — |

### three-black-crows

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 3 | 3 | 0 | — |
| BTCUSDT | 2 | 1 | 0 | — |
| ETHUSDT | 2 | 2 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

### morning-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3 | 3 | 0 | — |
| SOLUSDT | 1 | 1 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

### three-white-soldiers

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 6 | 6 | 0 | — |
| BNBUSDT | 4 | 4 | 0 | — |
| SOLUSDT | 3 | 2 | 0 | — |
| BTCUSDT | 2 | 2 | 0 | — |

### dark-cloud-cover

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 3 | 3 | 0 | — |
| BTCUSDT | 2 | 2 | 0 | — |
| ETHUSDT | 1 | 0 | 0 | — |

### liquidity-sweep (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2 | 2 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

### rising-three-methods

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1 | 1 | 0 | — |

### liquidity-sweep-reaction (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 2 | 1 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

### evening-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 2 | 1 | 0 | — |
| BNBUSDT | 1 | 1 | 0 | — |

### falling-three-methods

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1 | 1 | 0 | — |

## Детализация по горизонтам

### shooting-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 57.1% | 49.5% | 107 |
| 2 | 55.6% | 52.4% | 143 |
| 3 | 44.4% | 49.2% | 187 |
| 5 | 12.5% | 52.2% | 209 |

### hanging-man

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 57.1% | 49.5% | 107 |
| 2 | 55.6% | 52.4% | 143 |
| 3 | 44.4% | 49.2% | 187 |
| 5 | 12.5% | 52.2% | 209 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 53.8% | 173 |
| 2 | 43.2% | 48.4% | 190 |
| 3 | 29.7% | 45.7% | 186 |

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 55.5% | 51.6% | 9350 |
| 20 | 57.7% | 53.2% | 9809 |
| 30 | 58.6% | 53.2% | 9946 |

### inverted-hammer

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 57.0% | 121 |
| 2 | 66.7% | 55.8% | 163 |
| 3 | 60.0% | 57.3% | 192 |
| 5 | 80.0% | 50.6% | 243 |

### hammer

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 57.0% | 121 |
| 2 | 66.7% | 55.8% | 163 |
| 3 | 60.0% | 57.3% | 192 |
| 5 | 80.0% | 50.6% | 243 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 50.0% | 36 |
| 2 | 55.6% | 51.3% | 39 |
| 3 | 55.6% | 56.1% | 41 |
| 5 | 50.0% | 61.9% | 42 |

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 50.0% | 42.9% | 28 |
| 3 | 50.0% | 39.3% | 28 |
| 5 | 50.0% | 40.0% | 25 |
| 10 | 50.0% | 29.0% | 31 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.2% | 48.5% | 51220 |
| 2 | 47.3% | 47.7% | 59721 |
| 3 | 48.0% | 48.0% | 64140 |
| 5 | 48.3% | 47.8% | 68724 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.6% | 48.3% | 25414 |
| 2 | 48.6% | 48.2% | 28757 |
| 3 | 48.2% | 48.1% | 30308 |
| 5 | 48.3% | 48.3% | 32192 |
| 10 | 49.7% | 47.9% | 34223 |
| 20 | 49.4% | 47.7% | 35803 |
| 30 | 48.5% | 47.4% | 36433 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 52.3% | 50.4% | 1988 |
| 10 | 52.9% | 49.6% | 2110 |
| 20 | 59.2% | 50.9% | 2183 |
| 30 | 61.2% | 50.9% | 2259 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 51.1% | 47.1% | 14984 |
| 10 | 50.2% | 45.3% | 16026 |
| 20 | 44.4% | 45.9% | 16846 |
| 30 | 43.2% | 46.6% | 17237 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 45.9% | 48.0% | 5036 |
| 2 | 44.8% | 46.8% | 5727 |
| 3 | 44.6% | 45.6% | 6053 |
| 5 | 45.1% | 45.6% | 6466 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 45.5% | 49.8% | 466 |
| 10 | 40.8% | 48.2% | 477 |
| 15 | 43.1% | 48.3% | 487 |
| 20 | 46.2% | 48.0% | 487 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.7% | 46.8% | 9078 |
| 10 | 47.1% | 47.8% | 9580 |
| 20 | 47.1% | 47.8% | 9978 |
| 30 | 48.0% | 48.3% | 10241 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 45.0% | 40 |
| 2 | 100.0% | 37.0% | 46 |
| 3 | 100.0% | 34.0% | 47 |
| 5 | 100.0% | 34.7% | 49 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.2% | 47.3% | 43077 |
| 2 | 46.9% | 46.6% | 49025 |
| 3 | 46.3% | 46.5% | 51777 |
| 5 | 46.8% | 46.0% | 54957 |
| 10 | 45.6% | 45.1% | 58198 |
| 20 | 44.5% | 45.2% | 60829 |
| 30 | 43.4% | 45.8% | 61964 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 42.3% | 44.6% | 3499 |
| 10 | 42.1% | 44.9% | 3687 |
| 20 | 42.7% | 46.1% | 3836 |
| 30 | 45.4% | 45.8% | 3884 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 43.1% | 46.2% | 2061 |
| 10 | 46.4% | 45.5% | 2135 |
| 20 | 44.3% | 44.9% | 2242 |
| 30 | 42.8% | 45.5% | 2301 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 62.5% | 44.1% | 372 |
| 2 | 64.3% | 50.3% | 384 |
| 3 | 62.1% | 50.5% | 418 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 55.7% | 46.8% | 2710 |
| 2 | 48.5% | 45.8% | 3041 |
| 3 | 47.4% | 46.0% | 3221 |
| 5 | 46.8% | 46.0% | 3342 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 44.7% | 44.6% | 14507 |
| 2 | 44.0% | 43.9% | 15784 |
| 3 | 42.5% | 43.7% | 16336 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.7% | 45.5% | 279 |
| 2 | 46.9% | 44.9% | 314 |
| 3 | 41.2% | 45.6% | 318 |
| 5 | 31.4% | 44.1% | 320 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 36.4% | 46.5% | 385 |
| 2 | 48.5% | 44.4% | 426 |
| 3 | 50.0% | 41.2% | 452 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 60.0% | 46.2% | 26 |
| 3 | 60.0% | 40.0% | 25 |
| 5 | 40.0% | 50.0% | 30 |
| 10 | 75.0% | 43.3% | 30 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 40.0% | 33.3% | 15 |
| 2 | 60.0% | 38.9% | 18 |
| 3 | 33.3% | 23.8% | 21 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 50.0% | 50.0% | 8 |
| 10 | 0.0% | 37.5% | 8 |
| 20 | 0.0% | 37.5% | 8 |
| 30 | 0.0% | 42.9% | 7 |

### piercing-line

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 0.0% | 1 |
| 2 | 50.0% | 0.0% | 0 |
| 3 | 50.0% | 100.0% | 1 |
| 5 | 100.0% | 100.0% | 1 |

### three-black-crows

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 100.0% | 75.0% | 4 |
| 5 | 100.0% | 40.0% | 5 |
| 10 | 100.0% | 33.3% | 6 |

### morning-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 60.0% | 5 |
| 5 | 0.0% | 50.0% | 4 |
| 10 | 0.0% | 40.0% | 5 |

### three-white-soldiers

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 33.3% | 12 |
| 5 | 0.0% | 63.6% | 11 |
| 10 | 100.0% | 66.7% | 12 |

### dark-cloud-cover

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 40.0% | 5 |
| 2 | 100.0% | 50.0% | 4 |
| 3 | 100.0% | 40.0% | 5 |
| 5 | 100.0% | 50.0% | 4 |

### liquidity-sweep (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 33.3% | 3 |
| 2 | 0.0% | 33.3% | 3 |
| 3 | 0.0% | 50.0% | 2 |

### rising-three-methods

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 0.0% | 0.0% | 1 |
| 20 | 0.0% | 0.0% | 1 |
| 30 | 0.0% | 0.0% | 1 |

### liquidity-sweep-reaction (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 50.0% | 2 |
| 2 | 100.0% | 50.0% | 2 |
| 3 | 0.0% | 50.0% | 2 |

### evening-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 2 |
| 5 | 0.0% | 0.0% | 2 |
| 10 | 0.0% | 0.0% | 2 |

### falling-three-methods

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 0.0% | 0.0% | 1 |
| 20 | 0.0% | 0.0% | 1 |
| 30 | 0.0% | 0.0% | 1 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### shooting-star

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 16 | пропущен (мало train) | 0 | 0 | — |
| 2 | 52 | 1 | 12 | 6 | 50.0% |
| 3 | 111 | 2 | 7 | 4 | 57.1% |
| 4 | 128 | 2 | 7 | 3 | 42.9% |
| 5 | 143 | 2 | 27 | 19 | 70.4% |
| 6 | 214 | 2 | 45 | 20 | 44.4% |
| 7 | 354 | 2 | 15 | 9 | 60.0% |

### hanging-man

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 16 | пропущен (мало train) | 0 | 0 | — |
| 2 | 52 | 1 | 12 | 6 | 50.0% |
| 3 | 111 | 2 | 7 | 4 | 57.1% |
| 4 | 128 | 2 | 7 | 3 | 42.9% |
| 5 | 143 | 2 | 27 | 19 | 70.4% |
| 6 | 214 | 2 | 45 | 20 | 44.4% |
| 7 | 354 | 2 | 15 | 9 | 60.0% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 41 | 1 | 28 | 19 | 67.9% |
| 2 | 79 | 1 | 28 | 15 | 53.6% |
| 3 | 113 | 1 | 34 | 16 | 47.1% |
| 4 | 158 | 1 | 15 | 6 | 40.0% |
| 5 | 178 | 1 | 22 | 14 | 63.6% |
| 6 | 208 | 1 | 26 | 10 | 38.5% |
| 7 | 251 | 1 | 20 | 13 | 65.0% |

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1579 | 30 | 1401 | 626 | 44.7% |
| 2 | 3110 | 20 | 1616 | 831 | 51.4% |
| 3 | 4899 | 30 | 1567 | 878 | 56.0% |
| 4 | 6572 | 30 | 1430 | 803 | 56.2% |
| 5 | 8075 | 30 | 1394 | 713 | 51.1% |
| 6 | 9625 | 30 | 1242 | 660 | 53.1% |
| 7 | 11064 | 30 | 1257 | 704 | 56.0% |

### inverted-hammer

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 10 | пропущен (мало train) | 0 | 0 | — |
| 2 | 40 | 3 | 34 | 16 | 47.1% |
| 3 | 103 | 1 | 5 | 2 | 40.0% |
| 4 | 123 | 3 | 8 | 3 | 37.5% |
| 5 | 137 | 1 | 27 | 13 | 48.1% |
| 6 | 212 | 1 | 33 | 21 | 63.6% |
| 7 | 384 | 1 | 17 | 10 | 58.8% |

### hammer

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 10 | пропущен (мало train) | 0 | 0 | — |
| 2 | 40 | 3 | 34 | 16 | 47.1% |
| 3 | 103 | 1 | 5 | 2 | 40.0% |
| 4 | 123 | 3 | 8 | 3 | 37.5% |
| 5 | 137 | 1 | 27 | 13 | 48.1% |
| 6 | 212 | 1 | 33 | 21 | 63.6% |
| 7 | 384 | 1 | 17 | 10 | 58.8% |

### bearish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 10 | пропущен (мало train) | 0 | 0 | — |
| 2 | 15 | пропущен (мало train) | 0 | 0 | — |
| 3 | 24 | пропущен (мало train) | 0 | 0 | — |
| 4 | 30 | 3 | 4 | 2 | 50.0% |
| 5 | 37 | 5 | 8 | 2 | 25.0% |
| 6 | 47 | 5 | 8 | 5 | 62.5% |
| 7 | 55 | 5 | 3 | 3 | 100.0% |

### bullish-harami

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2 | пропущен (мало train) | 0 | 0 | — |
| 2 | 7 | пропущен (мало train) | 0 | 0 | — |
| 3 | 10 | пропущен (мало train) | 0 | 0 | — |
| 4 | 17 | пропущен (мало train) | 0 | 0 | — |
| 5 | 20 | пропущен (мало train) | 0 | 0 | — |
| 6 | 25 | пропущен (мало train) | 0 | 0 | — |
| 7 | 30 | 5 | 4 | 2 | 50.0% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 10651 | 5 | 9245 | 4322 | 46.7% |
| 2 | 22301 | 1 | 7302 | 3498 | 47.9% |
| 3 | 35132 | 5 | 9614 | 4569 | 47.5% |
| 4 | 46929 | 5 | 9170 | 4322 | 47.1% |
| 5 | 58253 | 1 | 7126 | 3435 | 48.2% |
| 6 | 72002 | 1 | 7081 | 3622 | 51.2% |
| 7 | 87480 | 1 | 7911 | 3904 | 49.3% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 5739 | 10 | 4842 | 2393 | 49.4% |
| 2 | 11360 | 10 | 4693 | 2128 | 45.3% |
| 3 | 16744 | 1 | 3953 | 1919 | 48.5% |
| 4 | 22561 | 1 | 3975 | 1912 | 48.1% |
| 5 | 28501 | 1 | 3150 | 1502 | 47.7% |
| 6 | 34002 | 1 | 2922 | 1436 | 49.1% |
| 7 | 39450 | 1 | 4286 | 2071 | 48.3% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 319 | 30 | 254 | 130 | 51.2% |
| 2 | 590 | 30 | 404 | 199 | 49.3% |
| 3 | 1020 | 30 | 289 | 150 | 51.9% |
| 4 | 1344 | 30 | 390 | 209 | 53.6% |
| 5 | 1764 | 30 | 309 | 154 | 49.8% |
| 6 | 2093 | 30 | 291 | 155 | 53.3% |
| 7 | 2413 | 30 | 322 | 152 | 47.2% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2435 | 5 | 2543 | 1128 | 44.4% |
| 2 | 5620 | 5 | 2271 | 1071 | 47.2% |
| 3 | 8477 | 5 | 1629 | 732 | 44.9% |
| 4 | 10506 | 5 | 2093 | 991 | 47.3% |
| 5 | 13088 | 5 | 2355 | 1145 | 48.6% |
| 6 | 16138 | 5 | 2378 | 1195 | 50.3% |
| 7 | 19534 | 5 | 1715 | 799 | 46.6% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1198 | 1 | 719 | 335 | 46.6% |
| 2 | 2319 | 1 | 675 | 313 | 46.4% |
| 3 | 3402 | 1 | 797 | 387 | 48.6% |
| 4 | 4550 | 1 | 823 | 379 | 46.1% |
| 5 | 5774 | 1 | 645 | 324 | 50.2% |
| 6 | 6861 | 1 | 609 | 306 | 50.2% |
| 7 | 7969 | 1 | 768 | 372 | 48.4% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 57 | 20 | 56 | 29 | 51.8% |
| 2 | 119 | 20 | 68 | 29 | 42.6% |
| 3 | 204 | 20 | 82 | 42 | 51.2% |
| 4 | 296 | 20 | 66 | 31 | 47.0% |
| 5 | 372 | 20 | 75 | 37 | 49.3% |
| 6 | 462 | 5 | 70 | 45 | 64.3% |
| 7 | 560 | 5 | 63 | 25 | 39.7% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1433 | 5 | 1180 | 553 | 46.9% |
| 2 | 2863 | 5 | 1253 | 596 | 47.6% |
| 3 | 4374 | 10 | 1423 | 686 | 48.2% |
| 4 | 5988 | 10 | 1507 | 710 | 47.1% |
| 5 | 7685 | 10 | 1286 | 594 | 46.2% |
| 6 | 9200 | 10 | 1418 | 675 | 47.6% |
| 7 | 10903 | 30 | 1458 | 746 | 51.2% |

### bullish-engulfing

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2 | пропущен (мало train) | 0 | 0 | — |
| 2 | 14 | пропущен (мало train) | 0 | 0 | — |
| 3 | 23 | пропущен (мало train) | 0 | 0 | — |
| 4 | 32 | 1 | 2 | 1 | 50.0% |
| 5 | 36 | 1 | 4 | 2 | 50.0% |
| 6 | 42 | 1 | 8 | 6 | 75.0% |
| 7 | 54 | 1 | 5 | 0 | 0.0% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 9421 | 1 | 6355 | 2948 | 46.4% |
| 2 | 19082 | 1 | 5989 | 2773 | 46.3% |
| 3 | 28626 | 1 | 6427 | 3105 | 48.3% |
| 4 | 38054 | 1 | 6624 | 3103 | 46.8% |
| 5 | 47753 | 1 | 5841 | 2724 | 46.6% |
| 6 | 57645 | 1 | 5580 | 2689 | 48.2% |
| 7 | 67958 | 1 | 6261 | 3031 | 48.4% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 672 | 30 | 542 | 239 | 44.1% |
| 2 | 1263 | 30 | 496 | 228 | 46.0% |
| 3 | 1806 | 30 | 627 | 287 | 45.8% |
| 4 | 2468 | 30 | 640 | 296 | 46.3% |
| 5 | 3154 | 20 | 466 | 205 | 44.0% |
| 6 | 3685 | 30 | 458 | 212 | 46.3% |
| 7 | 4207 | 30 | 653 | 303 | 46.4% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 350 | 10 | 286 | 126 | 44.1% |
| 2 | 674 | 10 | 299 | 128 | 42.8% |
| 3 | 1021 | 10 | 312 | 153 | 49.0% |
| 4 | 1394 | 10 | 311 | 133 | 42.8% |
| 5 | 1742 | 10 | 314 | 146 | 46.5% |
| 6 | 2101 | 10 | 321 | 161 | 50.2% |
| 7 | 2507 | 10 | 292 | 125 | 42.8% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 30 | 2 | 40 | 23 | 57.5% |
| 2 | 78 | 1 | 58 | 23 | 39.7% |
| 3 | 153 | 2 | 51 | 25 | 49.0% |
| 4 | 215 | 2 | 55 | 20 | 36.4% |
| 5 | 290 | 2 | 61 | 35 | 57.4% |
| 6 | 374 | 2 | 62 | 30 | 48.4% |
| 7 | 466 | 2 | 57 | 31 | 54.4% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 353 | 1 | 351 | 174 | 49.6% |
| 2 | 836 | 1 | 349 | 167 | 47.9% |
| 3 | 1376 | 1 | 291 | 115 | 39.5% |
| 4 | 1785 | 1 | 369 | 162 | 43.9% |
| 5 | 2259 | 1 | 399 | 172 | 43.1% |
| 6 | 2893 | 1 | 564 | 281 | 49.8% |
| 7 | 3890 | 1 | 387 | 198 | 51.2% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2515 | 1 | 1997 | 921 | 46.1% |
| 2 | 5134 | 1 | 2087 | 955 | 45.8% |
| 3 | 8019 | 1 | 1954 | 844 | 43.2% |
| 4 | 10607 | 1 | 2259 | 945 | 41.8% |
| 5 | 13504 | 1 | 1986 | 838 | 42.2% |
| 6 | 16447 | 1 | 2157 | 1003 | 46.5% |
| 7 | 19816 | 1 | 2067 | 968 | 46.8% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 37 | 2 | 40 | 17 | 42.5% |
| 2 | 81 | 1 | 46 | 18 | 39.1% |
| 3 | 151 | 2 | 37 | 11 | 29.7% |
| 4 | 194 | 1 | 41 | 18 | 43.9% |
| 5 | 248 | 1 | 38 | 22 | 57.9% |
| 6 | 297 | 1 | 40 | 20 | 50.0% |
| 7 | 355 | 1 | 48 | 19 | 39.6% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 39 | 3 | 69 | 26 | 37.7% |
| 2 | 118 | 2 | 85 | 40 | 47.1% |
| 3 | 231 | 2 | 61 | 20 | 32.8% |
| 4 | 312 | 1 | 31 | 10 | 32.3% |
| 5 | 356 | 1 | 26 | 11 | 42.3% |
| 6 | 399 | 2 | 97 | 52 | 53.6% |
| 7 | 520 | 2 | 54 | 20 | 37.0% |

### bearish-harami

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 5 | пропущен (мало train) | 0 | 0 | — |
| 2 | 13 | пропущен (мало train) | 0 | 0 | — |
| 3 | 18 | пропущен (мало train) | 0 | 0 | — |
| 4 | 23 | пропущен (мало train) | 0 | 0 | — |
| 5 | 28 | пропущен (мало train) | 0 | 0 | — |
| 6 | 32 | 2 | 2 | 1 | 50.0% |
| 7 | 34 | 2 | 4 | 1 | 25.0% |

### liquidity-sweep-reaction (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 6 | пропущен (мало train) | 0 | 0 | — |
| 2 | 11 | пропущен (мало train) | 0 | 0 | — |
| 3 | 13 | пропущен (мало train) | 0 | 0 | — |
| 4 | 20 | пропущен (мало train) | 0 | 0 | — |
| 5 | 21 | пропущен (мало train) | 0 | 0 | — |
| 6 | 25 | пропущен (мало train) | 0 | 0 | — |
| 7 | 29 | пропущен (мало train) | 0 | 0 | — |
