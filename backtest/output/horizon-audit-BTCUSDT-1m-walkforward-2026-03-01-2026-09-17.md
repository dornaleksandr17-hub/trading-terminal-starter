# Horizon Audit — BTCUSDT 1m

> Сгенерировано: 2026-10-05T00:14:03.629Z
> Период: 2026-03-01 → 2026-09-17
> Инструменты (пул): BTCUSDT
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
| BTCUSDT | 288000 | 288000 | нет |

> **Предупреждение о корреляции**: Один инструмент — межинструментная корреляция не применима. Вердикт строится по дедуплицированным наблюдениям с независимостью ПО ВСЕМУ ПУЛУ (--dedupe-scope=pool): сигналы разных инструментов в пределах горизонта считаются одним событием — это консервативная поправка на межинструментную корреляцию.

## Сводка

- Паттернов в сетке: 43
- **Вердикт valid** (дедуп. + Holm + Wilson + безубыточность 55.56%): **1**
- Вердикт rejected (значимо ХУЖЕ 50% на независимых наблюдениях): 5
- Значимых вверх по дедуп. (Holm), но не выше безубыточности: 1
- Значимых вверх по дедуп. (Holm), всего: 2
- Для сравнения — значимых по СЫРЫМ наблюдениям (Holm, без дедупа): 2; прошли сырой Wilson-гейт: 3
- Недостаточно данных: 13
- Нет срабатываний: 13

### Пересечение критериев

- Прошли оба (формальный + Wilson): 2
- Только формальный тест: 0
- Только Wilson-гейт: 1

## Результаты по паттернам

| Паттерн | Setup | Всего | Σ train по фолдам | Test | Независ. (все) | Независ. test | Лучший expiry | Test acc | p-value | Acc дедуп. | p (дедуп.) | Значим (сырой) | Значим (дедуп.) | Wilson LB | Wilson LB дедуп. | Нужно > | Вердикт | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| harmonic-pattern | — | 3449 | 7085 | 2766 | 296 | 234 | 20 | 55.9% | 0.0000 | 62.0% | 0.0003 | да | да | 54.0% | 55.6% | 55.6% | valid | OK |
| inside-bar | — | 30063 | 56925 | 22160 | 24340 | 17931 | 1 | 51.4% | 0.0000 | 51.1% | 0.0033 | да | да | 50.7% | 50.4% | 55.6% | no-evidence (significant but Wilson lower bound not above breakeven) | OK |
| liquidity-sweep | reversal-at-key-level | 69 | 134 | 37 | — | — | 1 | 67.6% | — | — | — | — | — | 51.5% | — | — | — | недостаточно данных |
| mean-reversion | — | 181 | 359 | 148 | — | — | 5 | 53.4% | — | — | — | — | — | 45.4% | — | — | — | недостаточно данных |
| fvg-htf-mss | — | 457 | 830 | 361 | 417 | 332 | 10 | 47.6% | 0.3998 | 50.6% | 0.8693 | нет | нет | 42.5% | 45.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| strong-order-block-reaction | — | 9096 | 18380 | 6737 | 2753 | 2060 | 1 | 49.4% | 0.3420 | 50.4% | 0.7410 | нет | нет | 48.2% | 48.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-sweep-return | — | 1197 | 2249 | 962 | 1082 | 868 | 3 | 48.4% | 0.3498 | 49.0% | 0.5640 | нет | нет | 45.3% | 45.6% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-nested | — | 2435 | 4645 | 1990 | 1348 | 1079 | 5 | 47.2% | 0.0145 | 48.2% | 0.2473 | нет | нет | 45.1% | 45.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| order-block-continuation | — | 3592 | 6957 | 2934 | 1863 | 1535 | 30 | 48.8% | 0.1899 | 48.0% | 0.1256 | нет | нет | 47.0% | 45.5% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-nested | — | 616 | 1165 | 531 | 301 | 246 | 30 | 53.3% | 0.1400 | 48.0% | 0.5662 | нет | нет | 49.0% | 41.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-return | — | 13258 | 25695 | 10629 | 4764 | 3817 | 2 | 47.2% | 0.0000 | 47.9% | 0.0116 | нет | нет | 46.2% | 46.4% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-breaker-block | — | 1492 | 2981 | 1183 | 1297 | 1036 | 5 | 47.5% | 0.0917 | 47.9% | 0.1815 | нет | нет | 44.7% | 44.8% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| fvg-inversion-retest | — | 7272 | 13936 | 5915 | 5063 | 4000 | 2 | 47.6% | 0.0003 | 47.8% | 0.0062 | нет | нет | 46.4% | 46.3% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| fvg-rejection | — | 744 | 1480 | 558 | 728 | 538 | 1 | 46.8% | 0.1384 | 47.6% | 0.2811 | нет | нет | 42.7% | 43.4% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| marubozu-bearish | — | 2144 | 3653 | 1797 | 1902 | 1587 | 1 | 47.9% | 0.0730 | 47.3% | 0.0308 | нет | нет | 45.6% | 44.8% | 55.6% | rejected (significant below baseline (deduplicated)) | OK |
| consolidation-breakout | — | 981 | 1666 | 836 | 926 | 786 | 3 | 46.7% | 0.0571 | 46.7% | 0.0688 | нет | нет | 43.3% | 43.2% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK |
| order-block-breaker | — | 1063 | 2219 | 811 | 853 | 654 | 30 | 45.6% | 0.0139 | 46.5% | 0.0784 | нет | нет | 42.2% | 42.7% | 55.6% | no-evidence (not distinguishable from baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| marubozu-bullish | — | 2028 | 3351 | 1742 | 1827 | 1561 | 1 | 47.8% | 0.0650 | 45.5% | 0.0004 | нет | нет | 45.4% | 43.0% | 55.6% | rejected (significant below baseline (deduplicated)) | OK |
| impulse-breakout | — | 6997 | 13466 | 5441 | 5969 | 4652 | 1 | 44.9% | 0.0000 | 44.7% | 0.0000 | нет | нет | 43.6% | 43.3% | 55.6% | rejected (significant below baseline (deduplicated)) | OK (значимо ХУЖЕ 50%) |
| pin-bar | — | 66 | 91 | 27 | — | — | 2 | 44.4% | — | — | — | — | — | 27.6% | — | — | — | недостаточно данных |
| bearish-harami | — | 10 | 2 | 8 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep-reaction | reversal-at-key-level | 8 | 3 | 5 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bearish-engulfing | — | 16 | 2 | 14 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-harami | — | 11 | 1 | 10 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| macd-deceleration-continuation | — | 2 | 2 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| morning-star | — | 1 | 1 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| bullish-engulfing | — | 16 | 1 | 15 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-black-crows | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| liquidity-sweep | continuation | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| three-white-soldiers | — | 1 | 0 | 1 | — | — | — | — | — | — | — | — | — | — | — | — | — | недостаточно данных |
| hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| shooting-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| evening-star | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| inverted-hammer | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| hanging-man | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| piercing-line | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| dark-cloud-cover | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| tweezer-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| tweezer-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-bottom | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| abandoned-baby-top | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| rising-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |
| falling-three-methods | — | 0 | 0 | 0 | — | — | — | — | — | — | — | — | — | — | — | — | — | нет срабатываний |

## Разбивка по инструментам

### harmonic-pattern

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3449 | 2774 | 2764 | 56.6% |

### inside-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 30063 | 25067 | 22160 | 51.4% |

### liquidity-sweep (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 69 | 51 | 51 | 68.6% |

### mean-reversion

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 181 | 150 | 148 | 60.1% |

### fvg-htf-mss

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 457 | 374 | 370 | 45.4% |

### strong-order-block-reaction

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 9096 | 7247 | 6737 | 49.4% |

### fvg-sweep-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1197 | 993 | 962 | 49.9% |

### fvg-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2435 | 2034 | 1989 | 48.0% |

### order-block-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 3592 | 2945 | 2934 | 48.8% |

### order-block-nested

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 616 | 531 | 530 | 53.6% |

### fvg-return

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 13258 | 10937 | 10574 | 47.7% |

### fvg-breaker-block

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1492 | 1193 | 1181 | 47.9% |

### fvg-inversion-retest

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 7272 | 6022 | 5793 | 48.2% |

### fvg-rejection

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 744 | 593 | 550 | 47.6% |

### marubozu-bearish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2144 | 1898 | 1789 | 48.6% |

### consolidation-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 981 | 848 | 836 | 46.7% |

### order-block-breaker

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1063 | 813 | 811 | 45.6% |

### marubozu-bullish

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2028 | 1808 | 1709 | 48.7% |

### impulse-breakout

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 6997 | 5769 | 5441 | 44.9% |

### pin-bar

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 66 | 50 | 49 | 46.9% |

### bearish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 10 | 8 | 0 | — |

### liquidity-sweep-reaction (reversal-at-key-level)

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 8 | 5 | 0 | — |

### bearish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 16 | 14 | 0 | — |

### bullish-harami

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 11 | 10 | 0 | — |

### macd-deceleration-continuation

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 2 | 0 | 0 | — |

### morning-star

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 1 | 0 | 0 | — |

### bullish-engulfing

| Инструмент | Всего | Test | Test decided | Test accuracy |
|---|---|---|---|---|
| BTCUSDT | 16 | 15 | 0 | — |

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

## Детализация по горизонтам

### harmonic-pattern

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 10 | 49.9% | 54.4% | 2752 |
| 20 | 56.8% | 56.6% | 2764 |
| 30 | 56.1% | 57.0% | 2769 |

### inside-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 49.2% | 51.4% | 22160 |
| 2 | 46.4% | 49.8% | 23665 |
| 3 | 46.1% | 49.5% | 24160 |
| 5 | 47.5% | 49.6% | 24555 |

### liquidity-sweep (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 55.6% | 68.6% | 51 |
| 2 | 50.0% | 62.7% | 51 |
| 3 | 38.9% | 51.0% | 51 |

### mean-reversion

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 38.7% | 60.1% | 148 |
| 10 | 35.5% | 52.7% | 148 |
| 15 | 36.7% | 48.3% | 149 |
| 20 | 51.6% | 38.7% | 150 |

### fvg-htf-mss

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 50.0% | 50.3% | 352 |
| 2 | 48.2% | 50.6% | 360 |
| 3 | 46.9% | 51.5% | 365 |
| 5 | 47.0% | 49.2% | 368 |
| 10 | 50.6% | 45.4% | 370 |
| 20 | 48.2% | 45.2% | 374 |

### strong-order-block-reaction

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.4% | 49.4% | 6737 |
| 2 | 50.3% | 48.7% | 7013 |
| 3 | 49.8% | 48.7% | 7092 |
| 5 | 50.3% | 48.2% | 7175 |
| 10 | 48.1% | 47.2% | 7198 |
| 20 | 47.5% | 46.2% | 7226 |
| 30 | 49.4% | 45.2% | 7220 |

### fvg-sweep-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 42.0% | 49.9% | 911 |
| 2 | 40.1% | 47.8% | 949 |
| 3 | 45.3% | 49.9% | 962 |
| 5 | 46.0% | 47.4% | 976 |
| 10 | 40.9% | 46.9% | 982 |
| 20 | 36.8% | 48.2% | 983 |

### fvg-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 49.5% | 48.0% | 1989 |
| 10 | 49.6% | 46.5% | 2014 |
| 20 | 48.2% | 47.0% | 2018 |
| 30 | 44.5% | 47.4% | 2021 |

### order-block-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 46.7% | 46.8% | 2902 |
| 10 | 45.9% | 47.6% | 2914 |
| 20 | 46.1% | 49.0% | 2931 |
| 30 | 49.5% | 48.8% | 2934 |

### order-block-nested

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 45.2% | 49.0% | 525 |
| 10 | 52.9% | 45.4% | 526 |
| 20 | 55.3% | 53.9% | 531 |
| 30 | 57.1% | 53.6% | 530 |

### fvg-return

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.8% | 47.6% | 10138 |
| 2 | 47.4% | 47.7% | 10574 |
| 3 | 46.9% | 47.7% | 10692 |
| 5 | 48.3% | 46.9% | 10786 |
| 10 | 45.6% | 45.9% | 10860 |
| 20 | 45.0% | 45.5% | 10889 |
| 30 | 46.6% | 45.9% | 10883 |

### fvg-breaker-block

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 46.3% | 47.9% | 1181 |
| 10 | 45.0% | 47.9% | 1183 |
| 20 | 40.3% | 45.4% | 1189 |
| 30 | 43.6% | 43.0% | 1187 |

### fvg-inversion-retest

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 47.6% | 49.0% | 5524 |
| 2 | 50.0% | 48.2% | 5793 |
| 3 | 48.7% | 48.4% | 5871 |
| 5 | 48.4% | 48.0% | 5953 |
| 10 | 49.0% | 48.1% | 5966 |
| 20 | 47.1% | 48.5% | 5998 |

### fvg-rejection

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 51.7% | 47.6% | 550 |
| 2 | 46.7% | 46.6% | 567 |
| 3 | 47.3% | 44.3% | 582 |
| 5 | 52.3% | 44.0% | 584 |

### marubozu-bearish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.1% | 48.6% | 1789 |
| 2 | 47.1% | 48.8% | 1849 |
| 3 | 48.6% | 47.6% | 1860 |

### consolidation-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 48.8% | 46.2% | 801 |
| 2 | 50.8% | 46.2% | 826 |
| 3 | 53.8% | 46.7% | 836 |
| 5 | 50.8% | 46.3% | 843 |

### order-block-breaker

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 39.5% | 47.0% | 807 |
| 10 | 39.1% | 45.5% | 808 |
| 20 | 37.8% | 48.6% | 812 |
| 30 | 42.0% | 45.6% | 811 |

### marubozu-bullish

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 45.2% | 48.7% | 1709 |
| 2 | 44.7% | 48.1% | 1754 |
| 3 | 42.9% | 46.8% | 1773 |

### impulse-breakout

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 45.4% | 44.9% | 5441 |
| 2 | 45.3% | 45.1% | 5585 |
| 3 | 44.9% | 44.4% | 5634 |

### pin-bar

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 37.5% | 40.8% | 49 |
| 2 | 56.3% | 46.9% | 49 |
| 3 | 56.3% | 42.9% | 49 |
| 5 | 62.5% | 48.0% | 50 |

### bearish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 50.0% | 37.5% | 8 |
| 3 | 50.0% | 37.5% | 8 |
| 5 | 50.0% | 37.5% | 8 |
| 10 | 50.0% | 37.5% | 8 |

### liquidity-sweep-reaction (reversal-at-key-level)

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 33.3% | 60.0% | 5 |
| 2 | 33.3% | 80.0% | 5 |
| 3 | 33.3% | 75.0% | 4 |

### bearish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 100.0% | 38.5% | 13 |
| 2 | 100.0% | 50.0% | 14 |
| 3 | 100.0% | 35.7% | 14 |
| 5 | 50.0% | 35.7% | 14 |

### bullish-harami

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 2 | 100.0% | 50.0% | 10 |
| 3 | 0.0% | 40.0% | 10 |
| 5 | 100.0% | 40.0% | 10 |
| 10 | 0.0% | 30.0% | 10 |

### macd-deceleration-continuation

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 5 | 100.0% | 0.0% | 0 |
| 10 | 50.0% | 0.0% | 0 |
| 20 | 50.0% | 0.0% | 0 |
| 30 | 50.0% | 0.0% | 0 |

### morning-star

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 3 | 0.0% | 0.0% | 0 |
| 5 | 0.0% | 0.0% | 0 |
| 10 | 0.0% | 0.0% | 0 |

### bullish-engulfing

| Expiry bars | Train+Val accuracy | Test accuracy | Test decided |
|---|---|---|---|
| 1 | 0.0% | 50.0% | 14 |
| 2 | 100.0% | 53.3% | 15 |
| 3 | 100.0% | 50.0% | 14 |
| 5 | 100.0% | 35.7% | 14 |

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
| 3 | 0.0% | 100.0% | 1 |
| 5 | 0.0% | 100.0% | 1 |
| 10 | 0.0% | 100.0% | 1 |

## Разбивка по folds (walk-forward)

> Если `bestExpiryBars` заметно меняется между folds — это признак нестабильности выбора горизонта для этого паттерна, а не единственное "истинное" число. Итоговый `bestExpiryBars` в сводной таблице выше — мода (самый частый выбор) по всем оценённым folds.

### harmonic-pattern

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 675 | 20 | 763 | 394 | 51.6% |
| 2 | 1440 | 20 | 720 | 425 | 59.0% |
| 3 | 2161 | 30 | 646 | 342 | 52.9% |
| 4 | 2809 | 20 | 637 | 384 | 60.3% |

### inside-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 4994 | 1 | 5745 | 2814 | 49.0% |
| 2 | 11358 | 1 | 5345 | 2649 | 49.6% |
| 3 | 17067 | 1 | 5685 | 2981 | 52.4% |
| 4 | 23506 | 1 | 5385 | 2945 | 54.7% |

### liquidity-sweep (reversal-at-key-level)

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 18 | пропущен (мало train) | 0 | 0 | — |
| 2 | 32 | 1 | 14 | 7 | 50.0% |
| 3 | 46 | 1 | 10 | 8 | 80.0% |
| 4 | 56 | 1 | 13 | 10 | 76.9% |

### mean-reversion

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 31 | 20 | 40 | 13 | 32.5% |
| 2 | 71 | 5 | 39 | 23 | 59.0% |
| 3 | 111 | 5 | 35 | 22 | 62.9% |
| 4 | 146 | 5 | 34 | 21 | 61.8% |

### fvg-htf-mss

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 83 | 10 | 82 | 40 | 48.8% |
| 2 | 165 | 1 | 78 | 41 | 52.6% |
| 3 | 245 | 10 | 92 | 36 | 39.1% |
| 4 | 337 | 1 | 109 | 55 | 50.5% |

### strong-order-block-reaction

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1849 | 1 | 1701 | 843 | 49.6% |
| 2 | 3680 | 1 | 1810 | 869 | 48.0% |
| 3 | 5567 | 1 | 1573 | 799 | 50.8% |
| 4 | 7284 | 1 | 1653 | 818 | 49.5% |

### fvg-sweep-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 204 | 5 | 256 | 129 | 50.4% |
| 2 | 462 | 3 | 205 | 97 | 47.3% |
| 3 | 670 | 3 | 231 | 114 | 49.4% |
| 4 | 913 | 3 | 270 | 126 | 46.7% |

### fvg-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 401 | 10 | 581 | 269 | 46.3% |
| 2 | 988 | 5 | 385 | 189 | 49.1% |
| 3 | 1378 | 5 | 493 | 218 | 44.2% |
| 4 | 1878 | 5 | 531 | 264 | 49.7% |

### order-block-continuation

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 647 | 30 | 687 | 329 | 47.9% |
| 2 | 1337 | 30 | 761 | 375 | 49.3% |
| 3 | 2100 | 30 | 770 | 370 | 48.1% |
| 4 | 2873 | 30 | 716 | 357 | 49.9% |

### order-block-nested

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 85 | 30 | 157 | 89 | 56.7% |
| 2 | 242 | 30 | 106 | 55 | 51.9% |
| 3 | 348 | 20 | 142 | 76 | 53.5% |
| 4 | 490 | 20 | 126 | 63 | 50.0% |

### fvg-return

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 2321 | 5 | 2714 | 1245 | 45.9% |
| 2 | 5056 | 2 | 2684 | 1216 | 45.3% |
| 3 | 7787 | 2 | 2636 | 1261 | 47.8% |
| 4 | 10531 | 2 | 2595 | 1290 | 49.7% |

### fvg-breaker-block

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 299 | 5 | 299 | 136 | 45.5% |
| 2 | 602 | 5 | 294 | 130 | 44.2% |
| 3 | 896 | 10 | 286 | 143 | 50.0% |
| 4 | 1184 | 10 | 304 | 153 | 50.3% |

### fvg-inversion-retest

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1248 | 2 | 1411 | 705 | 50.0% |
| 2 | 2702 | 2 | 1484 | 700 | 47.2% |
| 3 | 4222 | 20 | 1533 | 727 | 47.4% |
| 4 | 5764 | 10 | 1487 | 685 | 46.1% |

### fvg-rejection

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 151 | 5 | 143 | 55 | 38.5% |
| 2 | 295 | 1 | 145 | 69 | 47.6% |
| 3 | 446 | 1 | 126 | 57 | 45.2% |
| 4 | 588 | 1 | 144 | 80 | 55.6% |

### marubozu-bearish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 246 | 3 | 437 | 198 | 45.3% |
| 2 | 690 | 1 | 417 | 198 | 47.5% |
| 3 | 1125 | 1 | 443 | 205 | 46.3% |
| 4 | 1592 | 1 | 500 | 259 | 51.8% |

### consolidation-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 133 | 3 | 169 | 88 | 52.1% |
| 2 | 303 | 3 | 189 | 79 | 41.8% |
| 3 | 494 | 3 | 238 | 111 | 46.6% |
| 4 | 736 | 3 | 240 | 112 | 46.7% |

### order-block-breaker

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 250 | 30 | 194 | 89 | 45.9% |
| 2 | 444 | 30 | 224 | 111 | 49.6% |
| 3 | 668 | 30 | 189 | 78 | 41.3% |
| 4 | 857 | 30 | 204 | 92 | 45.1% |

### marubozu-bullish

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 220 | 1 | 417 | 196 | 47.0% |
| 2 | 651 | 1 | 327 | 140 | 42.8% |
| 3 | 993 | 2 | 476 | 229 | 48.1% |
| 4 | 1487 | 2 | 522 | 267 | 51.1% |

### impulse-breakout

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 1228 | 1 | 1421 | 642 | 45.2% |
| 2 | 2694 | 1 | 1321 | 579 | 43.8% |
| 3 | 4053 | 1 | 1366 | 595 | 43.6% |
| 4 | 5491 | 1 | 1333 | 628 | 47.1% |

### pin-bar

| Fold | Train count | Best expiry | Test decided | Test wins | Fold accuracy |
|---|---|---|---|---|---|
| 1 | 16 | пропущен (мало train) | 0 | 0 | — |
| 2 | 25 | пропущен (мало train) | 0 | 0 | — |
| 3 | 39 | 2 | 13 | 5 | 38.5% |
| 4 | 52 | 2 | 14 | 7 | 50.0% |
