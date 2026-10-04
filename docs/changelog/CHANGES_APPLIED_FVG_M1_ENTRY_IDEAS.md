# FVG: три альтернативные идеи входа на M1 (2026-10-04)

Причина: backtest четырёх исходных FVG-стратегий (fvg-return, fvg-breaker-block, fvg-nested,
fvg-rejection) не проходит ни один гейт (win-rate 45–51% при безубытке 55.6%), лучший горизонт
у части — 1 бар. Правка деталей не меняет вывод, поэтому добавлены новые условия входа
отдельными паттернами (старые не тронуты — остаются базой для сравнения).

Скоринг (FVG_SCORE_WEIGHTS) и порог FVG_SCORE_MIN_ENTRY (67) — общие с исходными стратегиями,
не менялись (fvg-m1-entry-shared.ts).

| Паттерн | Идея | Вход |
|---|---|---|
| `fvg-htf-mss` | ICT: HTF PD array + LTF MSS | непробитый FVG синтетического M5, откат в него, ПЕРВОЕ M1-закрытие выше swing-high отката (sell — зеркально) |
| `fvg-sweep-return` | liquidity sweep → displacement → FVG | снят экстремум за 30 баров (фитиль за него, закрытие обратно), FVG левой свечой не раньше снятия, первый возврат с закрытием за CE |
| `fvg-inversion-retest` | Inversion FVG | FVG пробит закрытием телом ≥ 0.5 ATR (`inversionFvgs`), первый ретест с закрытием за CE |

Каждый детектор: одна зона/слом — один сигнал; при buy+sell побеждает большая confidence.
Регистрация: PatternName/PATTERN_NAMES/patternNameSchema, ALL_PATTERNS + миграция settingsStore v15,
patterns/index.ts, pattern-categories, pattern-selection, signal-builder (стартовый бонус 0.4,
без калибровки), HORIZON_GRIDS. Таблица горизонтов не перегенерирована.

Проверка: `fvg-m1-entry-ideas.test.ts`. Эффект на win-rate НЕ измерен — только horizon-audit.
