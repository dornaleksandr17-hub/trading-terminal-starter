# Диагностика без confidence-гейта (`--ungated-diag`) — 2026-10-01

Только измерение. Пороги, формулы, детекторы, вердикты, occurrence-кэш и `OCCURRENCE_ALGORITHM_VERSION` не меняются.

## Что добавлено
- `src/compute/patterns/ungated-diag.ts` — буфер кандидатов ДО confidence-гейта. Детекторы вызывают `ungatedCandidate()` прямо перед своим гейтом и возвращают то же, что раньше (вне трассировки — один `if`).
- Хуки в детекторах: tweezer-bottom/top (порог 0.5), bullish/bearish-harami, hammer, inverted-hammer, hanging-man, shooting-star (порог 0.45).
- `backtest/ungated-diag.ts` — дедупликация (зазор = expiry баров, по символу и направлению), агрегация по паттерну × HTF-класс × подмножество (`all` / `passed-gate`) × expiry, markdown-отчёт (точность среди решённых, Wilson 95%, маркер † при Wilson выше безубыточности).
- `backtest/horizon-audit.ts`: флаг `--ungated-diag`. Кэш occurrences не читается и не пишется, вердикты/таблица горизонтов не строятся, отчёт пишется отдельным файлом `ungated-diag-<символы>-<ТФ>-<from>-<to>.md` (по умолчанию в `backtest/output-run/ungated`, каталог не коммитится).
- Тесты: `backtest/ungated-diag.test.ts`, `src/compute/patterns/ungated-diag.test.ts`.

## Как читать результат
Результаты исследовательские: поправки на множественные сравнения нет, число ячеек велико, часть «†» возникнет случайно. На решения о формуле confidence они влиять могут только после отдельного обсуждения.
