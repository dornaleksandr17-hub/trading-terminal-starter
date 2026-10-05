# Horizon Audit — ETHUSDT 1m

> Сгенерировано: 2026-10-05T00:13:21.277Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): ETHUSDT
> Источник: Binance REST (1m candles → resampled to 1m)
> Разбиение: walk-forward, 5 folds, purge 30 bars
> Минимальный порог (train+validation): 30 срабатываний
> Минимальный порог для теста значимости (test-выборка): 200 решённых исходов
> Значимость: точный двусторонний биномиальный тест против baseline=0.5, с поправкой Holm-Bonferroni, α = 0.05
> Wilson-критерий: нижняя граница 95% интервала Уилсона ≥ 0.500 (margin=0)
> **Вердикт** (схема 2): по ДЕДУПЛИЦИРОВАННЫМ независимым наблюдениям (--dedupe-scope=pool); Holm по дедуплицированному семейству; допуск ('valid') требует нижней границы Уилсона выше max(безубыточность, дрейф-baseline).
> Выплата (payout): 80% → безубыточная доля выигрышей 55.56%
> Индикаторы: --indicators=live (18 шт.); версия алгоритма occurrences: 18

**Загружено**: 288000 1m свечей (суммарно по пулу), 288000 1m свечей после ресэмплинга.

## Метаданные пула

| Инструмент | 1m свечей | 1m свечей | История обрезана? |
|---|---|---|---|
| ETHUSDT | 288000 | 288000 | нет |

> **Предупреждение о корреляции**: Один инструмент — межинструментная корреляция не применима. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 43
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 7
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 0
- Значимых вверх по дедуп. (Holm), всего: 0
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 1; прошли сырой Wilson-гейт: 1
- Недостаточно данных: 13
- Нет срабатываний: 13

### Пересечение критериев

- Прошли оба (формальный + Wilson): 1
- Только формальный тест: 0
- Только Wilson-гейт: 0

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| pin-bar | — | 62 | 89 | 20 | — | — | 1 | 60.0% | — | — | — | — | — | 38.7% | — | — | — | недостаточно данных |
| harmonic-pattern | — | 2848 | 5871 | 2201 | 258 | 200 | 30 | 54.8% | 0.0000 | 51.0% | 0.8321 | да | нет | 52.8% | 44.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| mean-reversion | — | 157 | 283 | 92 | — | — | 20 | 48.9% | — | — | — | — | — | 38.9% | — | — | — | недостаточно данных |
| fvg-nested | — | 2015 | 4271 | 1393 | 1170 | 778 | 30 | 47.3% | 0.0474 | 48.7% | 0.4958 | нет | нет | 44.7% | 45.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-continuation | — | 3229 | 6268 | 2456 | 1673 | 1270 | 20 | 49.1% | 0.4081 | 48.7% | 0.3544 | нет | нет | 47.2% | 45.9% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-rejection | — | 667 | 1305 | 385 | 657 | 378 | 1 | 49.1% | 0.7598 | 48.4% | 0.5716 | нет | нет | 44.1% | 43.4% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| strong-order-block-reaction | — | 9818 | 19209 | 5456 | 2785 | 1551 | 1 | 49.0% | 0.1552 | 48.2% | 0.1550 | нет | нет | 47.7% | 45.7% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| marubozu-bullish | — | 1310 | 2318 | 885 | 1221 | 826 | 1 | 48.2% | 0.3132 | 47.8% | 0.2233 | нет | нет | 45.0% | 44.4% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-nested | — | 715 | 1374 | 544 | 346 | 270 | 5 | 49.4% | 0.8303 | 47.8% | 0.5033 | нет | нет | 45.3% | 41.9% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-htf-mss | — | 349 | 604 | 238 | 322 | 214 | 2 | 45.4% | 0.1733 | 47.7% | 0.5385 | нет | нет | 39.2% | 41.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| inside-bar | — | 25209 | 48224 | 14969 | 21215 | 12681 | 3 | 48.0% | 0.0000 | 47.6% | 0.0000 | нет | нет | 47.2% | 46.7% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| marubozu-bearish | — | 1266 | 2278 | 866 | 1182 | 809 | 1 | 46.9% | 0.0716 | 47.3% | 0.1397 | нет | нет | 43.6% | 43.9% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-breaker | — | 1165 | 2343 | 857 | 917 | 686 | 30 | 46.4% | 0.0403 | 47.2% | 0.1577 | нет | нет | 43.1% | 43.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-inversion-retest | — | 6397 | 12511 | 3878 | 4633 | 2805 | 1 | 47.3% | 0.0007 | 46.7% | 0.0006 | нет | нет | 45.7% | 44.9% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| liquidity-sweep | reversal-at-key-level | 78 | 142 | 33 | — | — | 1 | 45.5% | — | — | — | — | — | 29.8% | — | — | — | недостаточно данных |
| fvg-breaker-block | — | 1373 | 2805 | 1010 | 1236 | 907 | 30 | 45.0% | 0.0018 | 45.2% | 0.0043 | нет | нет | 42.0% | 42.0% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| consolidation-breakout | — | 742 | 1435 | 531 | 711 | 508 | 3 | 44.8% | 0.0190 | 44.5% | 0.0146 | нет | нет | 40.6% | 40.2% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| impulse-breakout | — | 6696 | 13742 | 4332 | 5697 | 3646 | 1 | 43.7% | 0.0000 | 44.5% | 0.0000 | нет | нет | 42.3% | 42.9% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-return | — | 11738 | 23036 | 6844 | 4474 | 2755 | 1 | 46.5% | 0.0000 | 44.4% | 0.0000 | нет | нет | 45.3% | 42.6% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-sweep-return | — | 909 | 1845 | 653 | 840 | 562 | 10 | 44.7% | 0.0077 | 43.8% | 0.0036 | нет | нет | 40.9% | 39.7% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| macd-deceleration-continuation | — | 4 | 2 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | continuation | 2 | 1 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-engulfing | — | 9 | 1 | 8 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-harami | — | 8 | 2 | 6 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 3 | 1 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-harami | — | 15 | 2 | 13 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-engulfing | — | 9 | 0 | 9 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| morning-star | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-white-soldiers | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-top | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| shooting-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| evening-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| inverted-hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| hanging-man | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| piercing-line | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| dark-cloud-cover | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| tweezer-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| three-black-crows | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| rising-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| falling-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Разбивка по инструментам

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 62 | 56 | 50 | 54.0% |

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 2848 | 2308 | 2201 | 54.8% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 157 | 142 | 132 | 49.2% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 2015 | 1576 | 1487 | 46.8% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 3229 | 2636 | 2460 | 49.6% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 667 | 544 | 385 | 49.1% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 9818 | 7773 | 5456 | 49.0% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1310 | 1133 | 848 | 49.8% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 715 | 613 | 527 | 52.8% |

### fvg-htf-mss

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 349 | 297 | 248 | 42.7% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 25209 | 20780 | 16471 | 47.6% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1266 | 1098 | 829 | 47.6% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1165 | 924 | 870 | 47.6% |

### fvg-inversion-retest

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 6397 | 5251 | 3617 | 48.3% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 78 | 52 | 40 | 50.0% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1373 | 1095 | 1037 | 44.5% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 742 | 601 | 531 | 44.8% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 6696 | 5264 | 4277 | 44.0% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 11738 | 9587 | 6844 | 46.5% |

### fvg-sweep-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 909 | 739 | 662 | 46.4% |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 4 | 2 | 0 | — |

### liquidity-sweep-reaction (continuation)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 2 | 1 | 0 | — |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 9 | 8 | 0 | — |

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 8 | 6 | 0 | — |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 3 | 2 | 0 | — |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 15 | 13 | 0 | — |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 9 | 9 | 0 | — |

### morning-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1 | 1 | 0 | — |

### three-white-soldiers

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1 | 1 | 0 | — |

### tweezer-top

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| ETHUSDT | 1 | 1 | 0 | — |

## Детализация по горизонтам

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 66.7% | 54.0% | 50 |
| 2 | 60.0% | 45.1% | 51 |
| 3 | 80.0% | 50.0% | 50 |
| 5 | 80.0% | 46.2% | 52 |

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 54.8% | 53.4% | 2066 |
| 20 | 55.9% | 52.8% | 2126 |
| 30 | 58.6% | 54.8% | 2201 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 66.7% | 44.1% | 118 |
| 10 | 63.6% | 43.8% | 130 |
| 15 | 53.8% | 45.0% | 131 |
| 20 | 61.5% | 49.2% | 132 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 46.2% | 48.7% | 1301 |
| 10 | 45.7% | 47.2% | 1393 |
| 20 | 48.0% | 46.0% | 1440 |
| 30 | 48.3% | 46.8% | 1487 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.3% | 46.0% | 2249 |
| 10 | 49.4% | 47.4% | 2361 |
| 20 | 49.1% | 49.6% | 2460 |
| 30 | 49.5% | 49.1% | 2475 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.5% | 49.1% | 385 |
| 2 | 45.7% | 46.4% | 425 |
| 3 | 47.3% | 44.7% | 454 |
| 5 | 46.8% | 47.3% | 480 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 52.8% | 49.0% | 5456 |
| 2 | 50.2% | 49.6% | 6165 |
| 3 | 49.7% | 49.5% | 6342 |
| 5 | 49.5% | 49.0% | 6730 |
| 10 | 49.3% | 48.2% | 7023 |
| 20 | 50.6% | 48.5% | 7247 |
| 30 | 49.3% | 48.6% | 7342 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 45.9% | 49.8% | 848 |
| 2 | 45.9% | 48.6% | 948 |
| 3 | 47.3% | 47.3% | 976 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 43.8% | 52.8% | 527 |
| 10 | 34.0% | 48.0% | 569 |
| 20 | 44.4% | 47.1% | 560 |
| 30 | 41.8% | 46.4% | 582 |

### fvg-htf-mss

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 44.7% | 48.2% | 220 |
| 2 | 52.2% | 42.7% | 248 |
| 3 | 46.5% | 41.4% | 244 |
| 5 | 43.5% | 42.4% | 257 |
| 10 | 45.5% | 45.1% | 266 |
| 20 | 41.2% | 45.3% | 276 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.9% | 48.4% | 13586 |
| 2 | 47.1% | 47.5% | 15542 |
| 3 | 48.4% | 47.6% | 16471 |
| 5 | 47.9% | 47.7% | 17506 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.5% | 47.6% | 829 |
| 2 | 48.3% | 46.9% | 894 |
| 3 | 47.7% | 48.7% | 924 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 45.7% | 45.2% | 821 |
| 10 | 43.8% | 46.3% | 853 |
| 20 | 42.5% | 48.0% | 873 |
| 30 | 45.2% | 47.6% | 870 |

### fvg-inversion-retest

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.3% | 48.3% | 3617 |
| 2 | 48.3% | 47.7% | 4078 |
| 3 | 49.7% | 46.6% | 4285 |
| 5 | 46.7% | 45.8% | 4469 |
| 10 | 46.4% | 46.5% | 4686 |
| 20 | 46.2% | 46.4% | 4848 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 56.5% | 50.0% | 40 |
| 2 | 52.0% | 52.2% | 46 |
| 3 | 37.5% | 54.3% | 46 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 43.4% | 45.1% | 964 |
| 10 | 42.2% | 47.0% | 995 |
| 20 | 43.9% | 46.3% | 1003 |
| 30 | 44.9% | 44.5% | 1037 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 53.4% | 45.5% | 468 |
| 2 | 50.4% | 43.4% | 498 |
| 3 | 55.6% | 44.8% | 531 |
| 5 | 49.2% | 45.5% | 541 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 43.9% | 44.0% | 4277 |
| 2 | 44.5% | 42.8% | 4467 |
| 3 | 42.7% | 41.9% | 4570 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.0% | 46.5% | 6844 |
| 2 | 45.6% | 45.7% | 7573 |
| 3 | 45.1% | 45.8% | 7911 |
| 5 | 43.6% | 44.9% | 8293 |
| 10 | 43.6% | 45.4% | 8668 |
| 20 | 44.2% | 44.7% | 8919 |
| 30 | 45.2% | 45.0% | 9067 |

### fvg-sweep-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.4% | 46.4% | 494 |
| 2 | 47.5% | 43.3% | 557 |
| 3 | 52.9% | 43.2% | 602 |
| 5 | 45.9% | 43.6% | 635 |
| 10 | 47.4% | 46.4% | 662 |
| 20 | 44.7% | 45.3% | 658 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 100.0% | 100.0% | 1 |
| 10 | 50.0% | 100.0% | 1 |
| 20 | 0.0% | 100.0% | 1 |
| 30 | 50.0% | 50.0% | 2 |

### liquidity-sweep-reaction (continuation)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 100.0% | 1 |
| 2 | 100.0% | 100.0% | 1 |
| 3 | 0.0% | 100.0% | 1 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 37.5% | 8 |
| 2 | 100.0% | 71.4% | 7 |
| 3 | 100.0% | 37.5% | 8 |
| 5 | 100.0% | 50.0% | 8 |

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 100.0% | 40.0% | 5 |
| 3 | 50.0% | 50.0% | 4 |
| 5 | 100.0% | 66.7% | 6 |
| 10 | 50.0% | 66.7% | 6 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 0.0% | 1 |
| 2 | 0.0% | 0.0% | 1 |
| 3 | 0.0% | 0.0% | 2 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 50.0% | 58.3% | 12 |
| 3 | 50.0% | 50.0% | 12 |
| 5 | 50.0% | 58.3% | 12 |
| 10 | 50.0% | 54.5% | 11 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 71.4% | 7 |
| 2 | 0.0% | 37.5% | 8 |
| 3 | 0.0% | 55.6% | 9 |
| 5 | 0.0% | 66.7% | 6 |

### morning-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 1 |
| 5 | 0.0% | 0.0% | 1 |
| 10 | 0.0% | 0.0% | 1 |

### three-white-soldiers

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 1 |
| 5 | 0.0% | 0.0% | 1 |
| 10 | 0.0% | 100.0% | 1 |

### tweezer-top

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 0 |
| 2 | 0.0% | 0.0% | 0 |
| 3 | 0.0% | 0.0% | 1 |
| 5 | 0.0% | 0.0% | 1 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 6 | пропущен (мало train) | 0 | 0 | — |
| 2 | 24 | пропущен (мало train) | 0 | 0 | — |
| 3 | 38 | 1 | 10 | 7 | 70.0% |
| 4 | 51 | 1 | 10 | 5 | 50.0% |

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 540 | 30 | 606 | 331 | 54.6% |
| 2 | 1181 | 30 | 588 | 358 | 60.9% |
| 3 | 1784 | 30 | 552 | 295 | 53.4% |
| 4 | 2366 | 30 | 455 | 223 | 49.0% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 15 | пропущен (мало train) | 0 | 0 | — |
| 2 | 54 | 15 | 36 | 17 | 47.2% |
| 3 | 94 | 20 | 34 | 20 | 58.8% |
| 4 | 135 | 20 | 22 | 8 | 36.4% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 438 | 30 | 440 | 195 | 44.3% |
| 2 | 909 | 5 | 302 | 157 | 52.0% |
| 3 | 1273 | 30 | 364 | 169 | 46.4% |
| 4 | 1651 | 5 | 287 | 138 | 48.1% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 593 | 30 | 585 | 292 | 49.9% |
| 2 | 1210 | 20 | 655 | 303 | 46.3% |
| 3 | 1914 | 20 | 591 | 285 | 48.2% |
| 4 | 2551 | 20 | 625 | 327 | 52.3% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 123 | 1 | 96 | 47 | 49.0% |
| 2 | 251 | 1 | 111 | 56 | 50.5% |
| 3 | 399 | 1 | 88 | 42 | 47.7% |
| 4 | 532 | 1 | 90 | 44 | 48.9% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2038 | 1 | 1228 | 592 | 48.2% |
| 2 | 3717 | 1 | 1437 | 725 | 50.5% |
| 3 | 5692 | 1 | 1353 | 667 | 49.3% |
| 4 | 7762 | 1 | 1438 | 691 | 48.1% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 177 | 3 | 243 | 98 | 40.3% |
| 2 | 454 | 1 | 184 | 92 | 50.0% |
| 3 | 695 | 1 | 218 | 109 | 50.0% |
| 4 | 992 | 1 | 240 | 128 | 53.3% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 102 | 20 | 176 | 75 | 42.6% |
| 2 | 292 | 5 | 92 | 57 | 62.0% |
| 3 | 408 | 5 | 142 | 70 | 49.3% |
| 4 | 572 | 5 | 134 | 67 | 50.0% |

### fvg-htf-mss

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 52 | 2 | 56 | 27 | 48.2% |
| 2 | 113 | 2 | 56 | 20 | 35.7% |
| 3 | 179 | 1 | 62 | 28 | 45.2% |
| 4 | 260 | 1 | 64 | 33 | 51.6% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 4426 | 3 | 4298 | 2064 | 48.0% |
| 2 | 9630 | 3 | 3997 | 1860 | 46.5% |
| 3 | 14514 | 1 | 3321 | 1582 | 47.6% |
| 4 | 19654 | 1 | 3353 | 1677 | 50.0% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 168 | 2 | 231 | 108 | 46.8% |
| 2 | 452 | 1 | 184 | 86 | 46.7% |
| 3 | 692 | 1 | 197 | 87 | 44.2% |
| 4 | 966 | 3 | 254 | 125 | 49.2% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 241 | 5 | 193 | 88 | 45.6% |
| 2 | 456 | 30 | 244 | 110 | 45.1% |
| 3 | 711 | 30 | 201 | 84 | 41.8% |
| 4 | 935 | 30 | 219 | 116 | 53.0% |

### fvg-inversion-retest

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1145 | 3 | 1124 | 524 | 46.6% |
| 2 | 2502 | 2 | 1015 | 474 | 46.7% |
| 3 | 3784 | 1 | 857 | 424 | 49.5% |
| 4 | 5080 | 1 | 882 | 411 | 46.6% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 26 | пропущен (мало train) | 0 | 0 | — |
| 2 | 37 | 1 | 7 | 3 | 42.9% |
| 3 | 46 | 2 | 11 | 6 | 54.5% |
| 4 | 59 | 1 | 15 | 6 | 40.0% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 278 | 30 | 264 | 125 | 47.3% |
| 2 | 556 | 30 | 269 | 111 | 41.3% |
| 3 | 840 | 20 | 260 | 125 | 48.1% |
| 4 | 1131 | 20 | 217 | 94 | 43.3% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 141 | 3 | 127 | 61 | 48.0% |
| 2 | 284 | 3 | 130 | 55 | 42.3% |
| 3 | 432 | 3 | 131 | 54 | 41.2% |
| 4 | 578 | 3 | 143 | 68 | 47.6% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1431 | 2 | 1188 | 513 | 43.2% |
| 2 | 2801 | 1 | 1084 | 458 | 42.3% |
| 3 | 4104 | 1 | 1037 | 458 | 44.2% |
| 4 | 5406 | 1 | 1023 | 465 | 45.5% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2150 | 1 | 1763 | 802 | 45.5% |
| 2 | 4567 | 1 | 1707 | 804 | 47.1% |
| 3 | 6901 | 1 | 1774 | 827 | 46.6% |
| 4 | 9418 | 1 | 1600 | 751 | 46.9% |

### fvg-sweep-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 170 | 3 | 183 | 76 | 41.5% |
| 2 | 377 | 10 | 163 | 83 | 50.9% |
| 3 | 557 | 10 | 161 | 71 | 44.1% |
| 4 | 741 | 10 | 146 | 62 | 42.5% |
