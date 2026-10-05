# Horizon Audit — SOLUSDT 1m

> Сгенерировано: 2026-10-05T00:12:47.234Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): SOLUSDT
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
| SOLUSDT | 288000 | 288000 | нет |

> **Предупреждение о корреляции**: Один инструмент — межинструментная корреляция не применима. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 42
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **0**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 5
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 0
- Значимых вверх по дедуп. (Holm), всего: 0
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 1; прошли сырой Wilson-гейт: 1
- Недостаточно данных: 16
- Нет срабатываний: 12

### Пересечение критериев

- Прошли оба (формальный + Wilson): 1
- Только формальный тест: 0
- Только Wilson-гейт: 0

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| harmonic-pattern | — | 2892 | 5995 | 1710 | 283 | 166 | 30 | 55.1% | 0.0000 | — | — | да | — | 52.7% | — | — | no-evidence (fewer independent observations than the significance threshold) | OK |
| fvg-sweep-return | — | 702 | 1493 | 256 | 656 | 234 | 3 | 53.1% | 0.3485 | 53.4% | 0.3268 | нет | нет | 47.0% | 47.0% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-htf-mss | — | 332 | 671 | 93 | — | — | 1 | 52.7% | — | — | — | — | — | 42.6% | — | — | — | недостаточно данных |
| mean-reversion | — | 104 | 189 | 43 | — | — | 10 | 51.2% | — | — | — | — | — | 36.8% | — | — | — | недостаточно данных |
| inside-bar | — | 26600 | 50750 | 5078 | 22167 | 4284 | 1 | 48.8% | 0.0794 | 48.4% | 0.0421 | нет | нет | 47.4% | 46.9% | 55.6% | rejected (significant below baseline (deduplicated)) | OK |
| fvg-inversion-retest | — | 5350 | 10475 | 1320 | 4114 | 1306 | 1 | 49.2% | 0.5633 | 48.2% | 0.2130 | нет | нет | 46.5% | 45.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-breaker | — | 1308 | 2612 | 749 | 1006 | 617 | 30 | 44.2% | 0.0017 | 47.0% | 0.1472 | нет | нет | 40.7% | 43.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-continuation | — | 2620 | 5230 | 1205 | 1371 | 684 | 5 | 46.0% | 0.0057 | 46.8% | 0.1001 | нет | нет | 43.2% | 43.1% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-rejection | — | 664 | 1368 | 194 | — | — | 1 | 46.4% | — | — | — | — | — | 39.5% | — | — | — | недостаточно данных |
| order-block-nested | — | 810 | 1513 | 389 | 355 | 167 | 5 | 46.3% | 0.1556 | — | — | нет | — | 41.4% | — | — | no-evidence (fewer independent observations than the significance threshold) | OK |
| strong-order-block-reaction | — | 10528 | 20544 | 4135 | 2714 | 1015 | 20 | 47.3% | 0.0006 | 46.2% | 0.0170 | нет | нет | 45.8% | 43.2% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-nested | — | 1351 | 2752 | 588 | 902 | 384 | 5 | 47.8% | 0.3025 | 46.1% | 0.1388 | нет | нет | 43.8% | 41.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-return | — | 8652 | 17253 | 2271 | 3716 | 1303 | 1 | 48.8% | 0.2571 | 46.0% | 0.0039 | нет | нет | 46.7% | 43.3% | 55.6% | rejected (significant below baseline (deduplicated)) | OK |
| fvg-breaker-block | — | 1203 | 2434 | 790 | 1079 | 709 | 30 | 45.1% | 0.0061 | 45.3% | 0.0131 | нет | нет | 41.6% | 41.6% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| marubozu-bearish | — | 697 | 1324 | 264 | 685 | 259 | 2 | 45.1% | 0.1237 | 45.2% | 0.1357 | нет | нет | 39.2% | 39.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| consolidation-breakout | — | 387 | 817 | 124 | — | — | 1 | 45.2% | — | — | — | — | — | 36.7% | — | — | — | недостаточно данных |
| marubozu-bullish | — | 780 | 1387 | 229 | 747 | 218 | 1 | 45.0% | 0.1458 | 45.0% | 0.1548 | нет | нет | 38.7% | 38.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| impulse-breakout | — | 4950 | 10242 | 1738 | 4320 | 1455 | 1 | 43.2% | 0.0000 | 43.3% | 0.0000 | нет | нет | 40.8% | 40.8% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| pin-bar | — | 55 | 69 | 15 | — | — | 1 | 40.0% | — | — | — | — | — | 19.8% | — | — | — | недостаточно данных |
| liquidity-sweep | reversal-at-key-level | 59 | 79 | 12 | — | — | 1 | 33.3% | — | — | — | — | — | 13.8% | — | — | — | недостаточно данных |
| tweezer-bottom | — | 1 | 1 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-harami | — | 7 | 2 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-harami | — | 5 | 1 | 4 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 4 | 2 | 2 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-engulfing | — | 7 | 1 | 6 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| evening-star | — | 1 | 1 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-engulfing | — | 10 | 3 | 7 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| macd-deceleration-continuation | — | 2 | 1 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| morning-star | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| piercing-line | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| shooting-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| inverted-hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| hanging-man | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| dark-cloud-cover | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| tweezer-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| three-white-soldiers | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| three-black-crows | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| rising-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| falling-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Разбивка по инструментам

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 2892 | 2284 | 1829 | 58.2% |

### fvg-sweep-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 702 | 540 | 256 | 53.1% |

### fvg-htf-mss

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 332 | 254 | 93 | 52.7% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 104 | 87 | 58 | 46.6% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 26600 | 21761 | 5078 | 48.8% |

### fvg-inversion-retest

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 5350 | 4312 | 1161 | 49.6% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1308 | 1035 | 849 | 45.3% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 2620 | 2100 | 1205 | 46.0% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 664 | 523 | 178 | 48.3% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 810 | 677 | 389 | 46.3% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 10528 | 8430 | 6320 | 47.8% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1351 | 1052 | 574 | 47.0% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 8652 | 6947 | 2271 | 48.8% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1203 | 962 | 790 | 45.1% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 697 | 591 | 264 | 45.1% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 387 | 296 | 124 | 45.2% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 780 | 655 | 217 | 47.0% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 4950 | 3859 | 1738 | 43.2% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 55 | 45 | 16 | 50.0% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 59 | 45 | 21 | 42.9% |

### tweezer-bottom

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1 | 0 | 0 | — |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 7 | 5 | 0 | — |

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 5 | 4 | 0 | — |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 4 | 2 | 0 | — |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 7 | 6 | 0 | — |

### evening-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1 | 0 | 0 | — |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 10 | 7 | 0 | — |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 2 | 1 | 0 | — |

### morning-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1 | 1 | 0 | — |

### piercing-line

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| SOLUSDT | 1 | 1 | 0 | — |

## Детализация по горизонтам

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 59.4% | 53.6% | 1531 |
| 20 | 56.2% | 58.3% | 1755 |
| 30 | 55.0% | 58.2% | 1829 |

### fvg-sweep-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 36.5% | 50.0% | 154 |
| 2 | 35.6% | 52.7% | 224 |
| 3 | 38.7% | 53.1% | 256 |
| 5 | 37.6% | 50.5% | 315 |
| 10 | 36.9% | 48.0% | 375 |
| 20 | 36.3% | 49.0% | 414 |

### fvg-htf-mss

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 46.4% | 52.7% | 93 |
| 2 | 44.1% | 53.8% | 117 |
| 3 | 44.2% | 50.4% | 139 |
| 5 | 41.2% | 50.3% | 169 |
| 10 | 35.0% | 47.3% | 186 |
| 20 | 43.1% | 41.0% | 210 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 12.5% | 57.4% | 54 |
| 10 | 35.7% | 46.6% | 58 |
| 15 | 33.3% | 41.3% | 63 |
| 20 | 36.4% | 39.7% | 63 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 52.4% | 48.8% | 5078 |
| 2 | 49.4% | 48.4% | 7826 |
| 3 | 48.9% | 48.4% | 9520 |
| 5 | 48.5% | 47.6% | 11563 |

### fvg-inversion-retest

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.6% | 49.6% | 1161 |
| 2 | 47.3% | 49.2% | 1711 |
| 3 | 46.9% | 49.0% | 2028 |
| 5 | 46.3% | 47.6% | 2446 |
| 10 | 46.7% | 47.4% | 2958 |
| 20 | 46.5% | 47.4% | 3307 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 46.1% | 46.4% | 623 |
| 10 | 40.6% | 45.9% | 717 |
| 20 | 43.4% | 46.3% | 792 |
| 30 | 46.8% | 45.3% | 849 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 54.2% | 46.0% | 1205 |
| 10 | 48.8% | 45.3% | 1425 |
| 20 | 47.2% | 47.5% | 1609 |
| 30 | 48.8% | 48.3% | 1692 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.3% | 48.3% | 178 |
| 2 | 47.2% | 51.6% | 223 |
| 3 | 41.8% | 47.9% | 282 |
| 5 | 37.5% | 42.3% | 319 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 56.3% | 46.3% | 389 |
| 10 | 49.1% | 46.7% | 469 |
| 20 | 43.2% | 48.5% | 515 |
| 30 | 42.6% | 45.8% | 541 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.2% | 49.3% | 2069 |
| 2 | 49.4% | 48.6% | 3229 |
| 3 | 48.9% | 48.5% | 3842 |
| 5 | 49.3% | 47.9% | 4602 |
| 10 | 50.7% | 47.0% | 5535 |
| 20 | 51.8% | 47.8% | 6320 |
| 30 | 49.2% | 47.7% | 6732 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.8% | 47.0% | 574 |
| 10 | 44.3% | 49.6% | 673 |
| 20 | 45.0% | 46.7% | 807 |
| 30 | 46.7% | 47.6% | 824 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.5% | 48.8% | 2271 |
| 2 | 47.7% | 47.1% | 3106 |
| 3 | 46.6% | 46.9% | 3651 |
| 5 | 44.8% | 45.2% | 4184 |
| 10 | 44.6% | 44.8% | 4870 |
| 20 | 44.2% | 45.1% | 5484 |
| 30 | 46.0% | 46.2% | 5702 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 38.7% | 44.9% | 610 |
| 10 | 42.9% | 44.1% | 696 |
| 20 | 45.8% | 42.3% | 773 |
| 30 | 51.4% | 45.1% | 790 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 53.4% | 46.1% | 204 |
| 2 | 54.1% | 45.1% | 264 |
| 3 | 52.5% | 43.9% | 294 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 66.7% | 45.2% | 124 |
| 2 | 59.6% | 40.4% | 156 |
| 3 | 50.0% | 38.9% | 175 |
| 5 | 50.0% | 40.5% | 195 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 41.8% | 47.0% | 217 |
| 2 | 46.8% | 46.2% | 286 |
| 3 | 42.7% | 41.4% | 338 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.9% | 43.2% | 1738 |
| 2 | 46.3% | 42.5% | 2165 |
| 3 | 45.7% | 42.8% | 2359 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 28.6% | 50.0% | 16 |
| 2 | 25.0% | 47.8% | 23 |
| 3 | 20.0% | 40.0% | 20 |
| 5 | 12.5% | 58.6% | 29 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 80.0% | 42.9% | 21 |
| 2 | 50.0% | 41.4% | 29 |
| 3 | 50.0% | 48.3% | 29 |

### tweezer-bottom

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 0.0% | 0 |
| 2 | 0.0% | 0.0% | 0 |
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 0 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 0.0% | 75.0% | 4 |
| 3 | 0.0% | 80.0% | 5 |
| 5 | 50.0% | 80.0% | 5 |
| 10 | 100.0% | 66.7% | 3 |

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 0.0% | 50.0% | 2 |
| 3 | 0.0% | 66.7% | 3 |
| 5 | 100.0% | 100.0% | 1 |
| 10 | 0.0% | 50.0% | 2 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 1 |
| 2 | 100.0% | 50.0% | 2 |
| 3 | 50.0% | 50.0% | 2 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 50.0% | 2 |
| 2 | 100.0% | 50.0% | 4 |
| 3 | 100.0% | 75.0% | 4 |
| 5 | 100.0% | 60.0% | 5 |

### evening-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 0 |
| 10 | 0.0% | 0.0% | 0 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 50.0% | 4 |
| 2 | 33.3% | 50.0% | 4 |
| 3 | 33.3% | 60.0% | 5 |
| 5 | 33.3% | 66.7% | 3 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 100.0% | 100.0% | 1 |
| 10 | 100.0% | 0.0% | 1 |
| 20 | 100.0% | 0.0% | 1 |
| 30 | 100.0% | 0.0% | 0 |

### morning-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 100.0% | 1 |
| 5 | 0.0% | 100.0% | 1 |
| 10 | 0.0% | 100.0% | 1 |

### piercing-line

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 100.0% | 1 |
| 2 | 0.0% | 100.0% | 1 |
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 1 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 608 | 10 | 437 | 221 | 50.6% |
| 2 | 1263 | 30 | 425 | 276 | 64.9% |
| 3 | 1742 | 30 | 444 | 239 | 53.8% |
| 4 | 2382 | 20 | 404 | 206 | 51.0% |

### fvg-sweep-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 162 | 3 | 60 | 31 | 51.7% |
| 2 | 309 | 3 | 84 | 41 | 48.8% |
| 3 | 447 | 3 | 45 | 27 | 60.0% |
| 4 | 575 | 3 | 67 | 37 | 55.2% |

### fvg-htf-mss

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 78 | 1 | 18 | 11 | 61.1% |
| 2 | 137 | 1 | 27 | 14 | 51.9% |
| 3 | 196 | 1 | 19 | 12 | 63.2% |
| 4 | 260 | 1 | 29 | 12 | 41.4% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 17 | пропущен (мало train) | 0 | 0 | — |
| 2 | 41 | 10 | 13 | 5 | 38.5% |
| 3 | 63 | 10 | 17 | 8 | 47.1% |
| 4 | 85 | 5 | 13 | 9 | 69.2% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 4838 | 1 | 1143 | 594 | 52.0% |
| 2 | 10071 | 1 | 1453 | 706 | 48.6% |
| 3 | 14950 | 1 | 997 | 473 | 47.4% |
| 4 | 20891 | 1 | 1485 | 703 | 47.3% |

### fvg-inversion-retest

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1038 | 1 | 265 | 121 | 45.7% |
| 2 | 2077 | 2 | 506 | 248 | 49.0% |
| 3 | 3127 | 1 | 205 | 114 | 55.6% |
| 4 | 4233 | 1 | 344 | 166 | 48.3% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 273 | 30 | 180 | 76 | 42.2% |
| 2 | 491 | 5 | 195 | 77 | 39.5% |
| 3 | 788 | 30 | 215 | 92 | 42.8% |
| 4 | 1060 | 5 | 159 | 86 | 54.1% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 520 | 5 | 290 | 128 | 44.1% |
| 2 | 1016 | 5 | 362 | 175 | 48.3% |
| 3 | 1597 | 5 | 250 | 109 | 43.6% |
| 4 | 2097 | 5 | 303 | 142 | 46.9% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 141 | 1 | 46 | 21 | 45.7% |
| 2 | 276 | 2 | 69 | 35 | 50.7% |
| 3 | 411 | 1 | 31 | 16 | 51.6% |
| 4 | 540 | 1 | 48 | 18 | 37.5% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 133 | 5 | 91 | 36 | 39.6% |
| 2 | 287 | 5 | 108 | 53 | 49.1% |
| 3 | 460 | 5 | 88 | 48 | 54.5% |
| 4 | 633 | 5 | 102 | 43 | 42.2% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2098 | 20 | 1493 | 736 | 49.3% |
| 2 | 4084 | 20 | 1577 | 708 | 44.9% |
| 3 | 6062 | 1 | 403 | 184 | 45.7% |
| 4 | 8300 | 1 | 662 | 328 | 49.5% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 299 | 5 | 127 | 56 | 44.1% |
| 2 | 563 | 5 | 154 | 66 | 42.9% |
| 3 | 810 | 5 | 135 | 71 | 52.6% |
| 4 | 1080 | 10 | 172 | 88 | 51.2% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1705 | 1 | 566 | 268 | 47.3% |
| 2 | 3411 | 1 | 655 | 317 | 48.4% |
| 3 | 5178 | 1 | 417 | 197 | 47.2% |
| 4 | 6959 | 1 | 633 | 326 | 51.5% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 241 | 30 | 187 | 80 | 42.8% |
| 2 | 479 | 30 | 217 | 93 | 42.9% |
| 3 | 733 | 30 | 202 | 95 | 47.0% |
| 4 | 981 | 30 | 184 | 88 | 47.8% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 106 | 2 | 71 | 30 | 42.3% |
| 2 | 241 | 2 | 90 | 41 | 45.6% |
| 3 | 406 | 2 | 52 | 27 | 51.9% |
| 4 | 571 | 2 | 51 | 21 | 41.2% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 91 | 1 | 36 | 21 | 58.3% |
| 2 | 175 | 1 | 38 | 13 | 34.2% |
| 3 | 242 | 1 | 21 | 6 | 28.6% |
| 4 | 309 | 1 | 29 | 16 | 55.2% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 125 | 2 | 61 | 26 | 42.6% |
| 2 | 263 | 1 | 59 | 24 | 40.7% |
| 3 | 408 | 1 | 47 | 18 | 38.3% |
| 4 | 591 | 1 | 62 | 35 | 56.5% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1091 | 1 | 436 | 210 | 48.2% |
| 2 | 2091 | 1 | 487 | 196 | 40.2% |
| 3 | 3062 | 1 | 362 | 136 | 37.6% |
| 4 | 3998 | 1 | 453 | 208 | 45.9% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 10 | пропущен (мало train) | 0 | 0 | — |
| 2 | 21 | пропущен (мало train) | 0 | 0 | — |
| 3 | 30 | 1 | 4 | 1 | 25.0% |
| 4 | 39 | 5 | 11 | 5 | 45.5% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 14 | пропущен (мало train) | 0 | 0 | — |
| 2 | 27 | пропущен (мало train) | 0 | 0 | — |
| 3 | 35 | 1 | 3 | 1 | 33.3% |
| 4 | 44 | 1 | 9 | 3 | 33.3% |
