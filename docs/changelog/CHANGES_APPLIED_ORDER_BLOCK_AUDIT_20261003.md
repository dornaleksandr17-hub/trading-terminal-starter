# Аудит стратегий Order Block — группа A (2026-10-03)

Охват: `strong-order-block-reaction`, `order-block-breaker`, `order-block-nested`
(+ поле `hasBreakDisplacement` в `smart-money.ts`). Веса, пороги, `MIN_SCORE`,
`FVG_SCORE_MIN_ENTRY` не менялись. `OCCURRENCE_ALGORITHM_VERSION` 15 → 16.

## Что исправлено

| # | Стратегия | Было | Стало |
|---|-----------|------|-------|
| 1 | strong-OB | `tested-hold` считался по всем свечам после блока, включая саму реакцию → +2 за собственный триггер | `heldBefore(block, prev.time)` — только удержания строго до реакционной свечи |
| 2 | strong-OB | «OB/FVG-конфлюэнс» = любой OB рядом (в т.ч. сам блок) | `hasFvgAtBlock`: `block.hasFvgConfluence` или живой FVG того же направления, перекрывающий зону |
| 3 | strong-OB | любой `structure.bos` давал +1 | `bosAlignsWithDirection` (учитывает `bosDirection`) |
| 4 | strong-OB | `overlap` не давал балла за сессию | `isHighLiquiditySession` (как у остальных OB-стратегий) |
| 5 | strong-OB | +2 за HTF даже без `htfStructure` | +2 только при переданной HTF-структуре; гейт остаётся fail-open |
| 6 | breaker | `confluenceBonus` = флаги исходного блока (истинны у 100% брейкеров) | `hasBreakDisplacement` — displacement пробивающей свечи (1.2×ATR, как `hasDisplacement`) |
| 7 | breaker | проверялся только последний элемент массива | перебираются все свежие кандидаты, самый свежий пробой — первым |
| 8 | nested | HTF-статус `broken` не видел M1-хвост неполной последней M5-группы | M1-закрытия после последней полной группы тоже ломают зону |

## Сознательно не вошло

- Дедупликация «одна зона — один сигнал»: живое подавление повторов есть в
  `decision/signal-cooldown.ts`; в horizon-audit дубли учтены колонкой «Независ.».
- Группа B (сужает поток, вводить по одному после сравнения воронки): HTF-bias и
  `touchCount===0` в continuation, подтверждение реакции в nested, свип/первый
  ретест в breaker как жёсткие условия, возраст блока и premium/discount по ноге
  импульса в strong-OB.
- Таблица горизонтов не перегенерирована — нужен прогон `backtest:horizon-audit`
  на версии 16 и сравнение воронки с версией 15.

## Тесты

Новые регрессии (все падают на коде версии 15 и проходят на 16):
`strategies.test.ts` (6, strong-OB), `order-block-strategies.test.ts` (3,
breaker/nested), `smart-money.test.ts` (2, `hasBreakDisplacement`). В существующих
фикстурах strong-OB добавлено «предыдущее удержание» и явный `htfStructure` — старые
фикстуры проходили за счёт самоподтверждения и безусловных +2.
