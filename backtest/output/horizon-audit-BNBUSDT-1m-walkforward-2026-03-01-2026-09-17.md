# Horizon Audit — BNBUSDT 1m

> Сгенерировано: 2026-10-05T00:13:25.472Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): BNBUSDT
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
| BNBUSDT | 288000 | 288000 | нет |

> **Предупреждение о корреляции**: Один инструмент — межинструментная корреляция не применима. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 42
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 3
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 0
- Значимых вверх по дедуп. (Holm), всего: 0
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 1; прошли сырой Wilson-гейт: 1
- Недостаточно данных: 12
- Нет срабатываний: 13

### Пересечение критериев

- Прошли оба (формальный + Wilson): 1
- Только формальный тест: 0
- Только Wilson-гейт: 0

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| liquidity-sweep | reversal-at-key-level | 60 | 83 | 17 | — | — | 3 | 58.8% | — | — | — | — | — | 36.0% | — | — | — | недостаточно данных |
| harmonic-pattern | — | 3177 | 6383 | 2310 | 290 | 208 | 30 | 53.0% | 0.0044 | 53.4% | 0.3674 | да | нет | 50.9% | 46.6% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-rejection | — | 763 | 1570 | 451 | 749 | 441 | 2 | 51.2% | 0.6378 | 50.6% | 0.8490 | нет | нет | 46.6% | 45.9% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-continuation | — | 3478 | 6852 | 2473 | 1804 | 1208 | 10 | 48.6% | 0.1844 | 50.0% | 1.0000 | нет | нет | 46.7% | 47.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| inside-bar | — | 28686 | 56077 | 15958 | 23503 | 14026 | 1 | 49.7% | 0.3970 | 49.7% | 0.4834 | нет | нет | 48.9% | 48.9% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-breaker-block | — | 1543 | 3107 | 1046 | 1337 | 890 | 5 | 47.0% | 0.0592 | 49.1% | 0.6151 | нет | нет | 44.0% | 45.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-inversion-retest | — | 6882 | 13745 | 4401 | 4903 | 2732 | 5 | 47.7% | 0.0023 | 49.0% | 0.3292 | нет | нет | 46.2% | 47.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-breaker | — | 1140 | 2237 | 845 | 887 | 656 | 10 | 47.7% | 0.1911 | 48.9% | 0.6118 | нет | нет | 44.3% | 45.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-return | — | 12311 | 25012 | 6784 | 4553 | 2734 | 1 | 47.2% | 0.0000 | 48.4% | 0.1040 | нет | нет | 46.0% | 46.6% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| strong-order-block-reaction | — | 9238 | 17999 | 5135 | 2805 | 1737 | 1 | 47.5% | 0.0003 | 48.4% | 0.1790 | нет | нет | 46.1% | 46.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-nested | — | 773 | 1555 | 552 | 374 | 279 | 5 | 52.9% | 0.1870 | 48.0% | 0.5495 | нет | нет | 48.7% | 42.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| marubozu-bearish | — | 1530 | 2989 | 902 | 1407 | 820 | 1 | 48.6% | 0.4052 | 47.9% | 0.2491 | нет | нет | 45.3% | 44.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| pin-bar | — | 81 | 131 | 44 | — | — | 5 | 47.7% | — | — | — | — | — | 33.8% | — | — | — | недостаточно данных |
| marubozu-bullish | — | 1571 | 2995 | 874 | 1463 | 817 | 1 | 48.3% | 0.3266 | 47.2% | 0.1237 | нет | нет | 45.0% | 43.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-htf-mss | — | 433 | 879 | 322 | 401 | 302 | 20 | 47.2% | 0.3435 | 46.4% | 0.2268 | нет | нет | 41.8% | 40.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| impulse-breakout | — | 5684 | 12001 | 3204 | 4972 | 2785 | 1 | 45.6% | 0.0000 | 46.1% | 0.0000 | нет | нет | 43.9% | 44.2% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| consolidation-breakout | — | 689 | 1365 | 435 | 669 | 425 | 5 | 46.0% | 0.1030 | 45.9% | 0.0990 | нет | нет | 41.3% | 41.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-nested | — | 1968 | 3896 | 1271 | 1140 | 742 | 5 | 45.4% | 0.0011 | 45.7% | 0.0207 | нет | нет | 42.7% | 42.1% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-sweep-return | — | 1030 | 2118 | 609 | 947 | 515 | 5 | 43.3% | 0.0012 | 44.7% | 0.0173 | нет | нет | 39.5% | 40.4% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| mean-reversion | — | 158 | 344 | 111 | — | — | 10 | 44.1% | — | — | — | — | — | 35.3% | — | — | — | недостаточно данных |
| bullish-harami | — | 14 | 3 | 11 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-bottom | — | 2 | 2 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-engulfing | — | 16 | 2 | 14 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-harami | — | 9 | 2 | 7 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 2 | 1 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| macd-deceleration-continuation | — | 4 | 1 | 3 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-engulfing | — | 13 | 0 | 13 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| piercing-line | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| tweezer-top | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| shooting-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| morning-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| evening-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| inverted-hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| hanging-man | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| dark-cloud-cover | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| three-white-soldiers | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| three-black-crows | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| rising-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| falling-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Разбивка по инструментам

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 60 | 49 | 36 | 61.1% |

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 3177 | 2536 | 2310 | 53.0% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 763 | 595 | 428 | 51.2% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 3478 | 2835 | 2473 | 48.6% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 28686 | 23169 | 13569 | 50.2% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1543 | 1226 | 1031 | 48.0% |

### fvg-inversion-retest

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 6882 | 5516 | 4578 | 48.1% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1140 | 931 | 833 | 49.0% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 12311 | 9891 | 6428 | 48.0% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 9238 | 7435 | 4546 | 49.5% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 773 | 647 | 552 | 52.9% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1530 | 1238 | 819 | 46.8% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 81 | 71 | 61 | 54.1% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1571 | 1291 | 874 | 48.3% |

### fvg-htf-mss

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 433 | 338 | 322 | 47.2% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 5684 | 4374 | 3204 | 45.6% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 689 | 537 | 451 | 47.5% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1968 | 1585 | 1271 | 45.4% |

### fvg-sweep-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1030 | 809 | 668 | 43.4% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 158 | 126 | 111 | 44.1% |

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 14 | 11 | 0 | — |

### tweezer-bottom

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 2 | 0 | 0 | — |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 16 | 14 | 0 | — |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 9 | 7 | 0 | — |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 2 | 1 | 0 | — |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 4 | 3 | 0 | — |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 13 | 13 | 0 | — |

### piercing-line

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1 | 1 | 0 | — |

### tweezer-top

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BNBUSDT | 1 | 1 | 0 | — |

## Детализация по горизонтам

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 30.0% | 54.1% | 37 |
| 2 | 12.5% | 60.5% | 38 |
| 3 | 50.0% | 61.1% | 36 |

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 48.2% | 47.2% | 2207 |
| 20 | 50.7% | 52.6% | 2285 |
| 30 | 54.5% | 53.0% | 2310 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.6% | 48.9% | 397 |
| 2 | 52.8% | 51.2% | 428 |
| 3 | 51.1% | 50.0% | 462 |
| 5 | 53.1% | 50.7% | 509 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.5% | 48.8% | 2348 |
| 10 | 49.8% | 48.6% | 2473 |
| 20 | 46.2% | 47.8% | 2573 |
| 30 | 48.2% | 47.9% | 2636 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.6% | 50.2% | 13569 |
| 2 | 47.5% | 49.8% | 16346 |
| 3 | 47.5% | 50.2% | 17633 |
| 5 | 47.9% | 50.0% | 18832 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.1% | 48.0% | 1031 |
| 10 | 48.8% | 47.8% | 1092 |
| 20 | 43.8% | 46.0% | 1129 |
| 30 | 45.8% | 47.7% | 1132 |

### fvg-inversion-retest

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.8% | 48.9% | 3434 |
| 2 | 49.2% | 48.0% | 3983 |
| 3 | 49.2% | 47.8% | 4243 |
| 5 | 51.7% | 48.1% | 4578 |
| 10 | 47.3% | 48.2% | 4813 |
| 20 | 47.8% | 47.2% | 4998 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 40.3% | 46.6% | 807 |
| 10 | 44.0% | 49.0% | 833 |
| 20 | 44.1% | 46.2% | 860 |
| 30 | 42.2% | 46.5% | 866 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.5% | 48.0% | 6428 |
| 2 | 48.0% | 47.4% | 7411 |
| 3 | 48.4% | 47.1% | 7869 |
| 5 | 47.4% | 47.4% | 8292 |
| 10 | 47.3% | 45.6% | 8793 |
| 20 | 46.4% | 44.7% | 9100 |
| 30 | 46.6% | 46.6% | 9218 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.3% | 49.5% | 4546 |
| 2 | 48.8% | 50.2% | 5375 |
| 3 | 48.5% | 49.9% | 5796 |
| 5 | 48.4% | 49.4% | 6161 |
| 10 | 50.3% | 48.0% | 6463 |
| 20 | 51.0% | 48.6% | 6809 |
| 30 | 51.8% | 48.8% | 6876 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 51.8% | 52.9% | 552 |
| 10 | 50.8% | 46.5% | 583 |
| 20 | 48.0% | 52.3% | 577 |
| 30 | 43.4% | 50.8% | 591 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 46.8% | 819 |
| 2 | 45.2% | 50.2% | 941 |
| 3 | 44.6% | 49.2% | 990 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 40.0% | 44.0% | 50 |
| 2 | 50.0% | 44.6% | 56 |
| 3 | 40.0% | 47.4% | 57 |
| 5 | 50.0% | 54.1% | 61 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 43.1% | 48.3% | 874 |
| 2 | 43.1% | 47.6% | 1015 |
| 3 | 42.4% | 47.2% | 1052 |

### fvg-htf-mss

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.3% | 48.0% | 221 |
| 2 | 42.1% | 45.2% | 261 |
| 3 | 42.2% | 43.8% | 265 |
| 5 | 47.7% | 45.5% | 288 |
| 10 | 45.8% | 47.2% | 301 |
| 20 | 53.8% | 47.2% | 322 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.0% | 45.6% | 3204 |
| 2 | 43.4% | 45.9% | 3524 |
| 3 | 43.3% | 45.7% | 3682 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 45.5% | 46.4% | 358 |
| 2 | 36.2% | 46.0% | 430 |
| 3 | 38.3% | 45.5% | 435 |
| 5 | 41.7% | 47.5% | 451 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 47.8% | 45.4% | 1271 |
| 10 | 45.1% | 44.5% | 1370 |
| 20 | 46.8% | 44.0% | 1460 |
| 30 | 44.6% | 43.8% | 1454 |

### fvg-sweep-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.4% | 47.3% | 499 |
| 2 | 43.7% | 44.8% | 580 |
| 3 | 51.1% | 43.5% | 625 |
| 5 | 51.3% | 43.4% | 668 |
| 10 | 45.4% | 44.3% | 716 |
| 20 | 46.8% | 46.1% | 733 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 63.0% | 41.5% | 106 |
| 10 | 63.3% | 44.1% | 111 |
| 15 | 50.0% | 38.3% | 115 |
| 20 | 56.7% | 43.7% | 119 |

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 33.3% | 37.5% | 8 |
| 3 | 50.0% | 42.9% | 7 |
| 5 | 33.3% | 50.0% | 10 |
| 10 | 50.0% | 10.0% | 10 |

### tweezer-bottom

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 0.0% | 0 |
| 2 | 50.0% | 0.0% | 0 |
| 3 | 0.0% | 0.0% | 0 |
| 5 | 50.0% | 0.0% | 0 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 45.5% | 11 |
| 2 | 100.0% | 57.1% | 14 |
| 3 | 100.0% | 55.6% | 9 |
| 5 | 100.0% | 72.7% | 11 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 100.0% | 0.0% | 5 |
| 3 | 100.0% | 16.7% | 6 |
| 5 | 50.0% | 16.7% | 6 |
| 10 | 100.0% | 16.7% | 6 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 0.0% | 1 |
| 2 | 100.0% | 0.0% | 0 |
| 3 | 100.0% | 0.0% | 1 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 100.0% | 66.7% | 3 |
| 10 | 0.0% | 66.7% | 3 |
| 20 | 100.0% | 66.7% | 3 |
| 30 | 100.0% | 33.3% | 3 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 40.0% | 10 |
| 2 | 0.0% | 63.6% | 11 |
| 3 | 0.0% | 71.4% | 7 |
| 5 | 0.0% | 70.0% | 10 |

### piercing-line

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 1 |
| 2 | 0.0% | 100.0% | 1 |
| 3 | 0.0% | 100.0% | 1 |
| 5 | 0.0% | 100.0% | 1 |

### tweezer-top

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 1 |
| 2 | 0.0% | 0.0% | 0 |
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 100.0% | 1 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 11 | пропущен (мало train) | 0 | 0 | — |
| 2 | 22 | пропущен (мало train) | 0 | 0 | — |
| 3 | 34 | 3 | 9 | 5 | 55.6% |
| 4 | 49 | 3 | 8 | 5 | 62.5% |

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 641 | 30 | 500 | 280 | 56.0% |
| 2 | 1201 | 30 | 658 | 386 | 58.7% |
| 3 | 1891 | 30 | 677 | 246 | 36.3% |
| 4 | 2650 | 30 | 475 | 312 | 65.7% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 168 | 5 | 137 | 80 | 58.4% |
| 2 | 328 | 2 | 106 | 50 | 47.2% |
| 3 | 467 | 2 | 97 | 49 | 50.5% |
| 4 | 607 | 2 | 111 | 52 | 46.8% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 643 | 10 | 619 | 281 | 45.4% |
| 2 | 1363 | 10 | 621 | 317 | 51.0% |
| 3 | 2051 | 10 | 630 | 305 | 48.4% |
| 4 | 2795 | 10 | 603 | 300 | 49.8% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 5512 | 1 | 3456 | 1695 | 49.0% |
| 2 | 11525 | 5 | 4213 | 2104 | 49.9% |
| 3 | 16399 | 5 | 4829 | 2364 | 49.0% |
| 4 | 22641 | 1 | 3460 | 1762 | 50.9% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 317 | 5 | 263 | 128 | 48.7% |
| 2 | 631 | 10 | 284 | 129 | 45.4% |
| 3 | 936 | 5 | 234 | 113 | 48.3% |
| 4 | 1223 | 5 | 265 | 122 | 46.0% |

### fvg-inversion-retest

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1365 | 5 | 1213 | 592 | 48.8% |
| 2 | 2794 | 1 | 933 | 429 | 46.0% |
| 3 | 4089 | 5 | 1119 | 518 | 46.3% |
| 4 | 5497 | 5 | 1136 | 560 | 49.3% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 209 | 20 | 188 | 94 | 50.0% |
| 2 | 408 | 10 | 253 | 121 | 47.8% |
| 3 | 687 | 10 | 215 | 94 | 43.7% |
| 4 | 933 | 10 | 189 | 94 | 49.7% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2420 | 3 | 2061 | 974 | 47.3% |
| 2 | 5104 | 1 | 1690 | 790 | 46.7% |
| 3 | 7466 | 1 | 1521 | 712 | 46.8% |
| 4 | 10022 | 1 | 1512 | 723 | 47.8% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1802 | 30 | 1569 | 682 | 43.5% |
| 2 | 3495 | 1 | 1298 | 665 | 51.2% |
| 3 | 5392 | 1 | 1066 | 499 | 46.8% |
| 4 | 7310 | 1 | 1202 | 592 | 49.3% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 126 | 5 | 156 | 82 | 52.6% |
| 2 | 308 | 5 | 149 | 77 | 51.7% |
| 3 | 476 | 5 | 139 | 73 | 52.5% |
| 4 | 645 | 5 | 108 | 60 | 55.6% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 292 | 1 | 212 | 89 | 42.0% |
| 2 | 603 | 1 | 199 | 85 | 42.7% |
| 3 | 867 | 2 | 265 | 150 | 56.6% |
| 4 | 1227 | 2 | 226 | 114 | 50.4% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 10 | пропущен (мало train) | 0 | 0 | — |
| 2 | 30 | 5 | 10 | 5 | 50.0% |
| 3 | 41 | 5 | 17 | 7 | 41.2% |
| 4 | 60 | 5 | 17 | 9 | 52.9% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 280 | 1 | 223 | 113 | 50.7% |
| 2 | 623 | 1 | 202 | 87 | 43.1% |
| 3 | 877 | 1 | 216 | 101 | 46.8% |
| 4 | 1215 | 1 | 233 | 121 | 51.9% |

### fvg-htf-mss

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 95 | 20 | 83 | 43 | 51.8% |
| 2 | 180 | 20 | 73 | 42 | 57.5% |
| 3 | 254 | 20 | 88 | 37 | 42.0% |
| 4 | 350 | 20 | 78 | 30 | 38.5% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1309 | 1 | 830 | 379 | 45.7% |
| 2 | 2458 | 1 | 891 | 391 | 43.9% |
| 3 | 3574 | 1 | 747 | 316 | 42.3% |
| 4 | 4660 | 1 | 736 | 376 | 51.1% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 152 | 1 | 88 | 36 | 40.9% |
| 2 | 276 | 5 | 102 | 48 | 47.1% |
| 3 | 389 | 5 | 129 | 51 | 39.5% |
| 4 | 548 | 5 | 116 | 65 | 56.0% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 382 | 5 | 326 | 147 | 45.1% |
| 2 | 785 | 5 | 289 | 135 | 46.7% |
| 3 | 1128 | 5 | 377 | 163 | 43.2% |
| 4 | 1601 | 5 | 279 | 132 | 47.3% |

### fvg-sweep-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 221 | 5 | 188 | 80 | 42.6% |
| 2 | 442 | 1 | 121 | 46 | 38.0% |
| 3 | 610 | 5 | 186 | 82 | 44.1% |
| 4 | 845 | 1 | 114 | 56 | 49.1% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 32 | 10 | 41 | 20 | 48.8% |
| 2 | 79 | 10 | 20 | 4 | 20.0% |
| 3 | 101 | 10 | 27 | 15 | 55.6% |
| 4 | 132 | 10 | 23 | 10 | 43.5% |
