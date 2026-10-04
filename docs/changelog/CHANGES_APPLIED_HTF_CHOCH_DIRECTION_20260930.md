# htfAlignment: направление CHoCH (2026-09-30)

## Что нашли
Крипто-аудит (Binance, 4 символа, 1 149 880 баров): `htf-baseline:buy-0.75-choch` =
`sell-0.75-choch` = `flag-choch` = 25 800. В `htfAlignment` строка
`if (htfStructure.choch) return 0.75;` не проверяла направление сделки: слом структуры
против сделки усиливал её так же, как слом в её сторону.

## Что изменено
- `src/compute/patterns/pattern-context.ts`: новая `chochAlignsWithDirection()`; `htfAlignment`
  даёт 0.75 только сонаправленному CHoCH (в `computeStructure` CHoCH — слом предыдущего
  тренда: trend `down` + choch = бычий слом → buy; trend `up` + choch = медвежий → sell).
  Шкала значений (1.0 / 0.75 / 0.5 / 0.4) не менялась.
- `backtest/audit-version.ts`: `OCCURRENCE_ALGORITHM_VERSION` 7 → 8 (иначе occurrence-кэш v7
  отдавал бы результаты со старой шкалой).
- Тест `src/compute/patterns/htf-choch-direction.test.ts` (6 тестов).

## Не менялось (осознанно)
- `htfAlignmentStrict` (0.90 для любого CHoCH) — используется только в Abandoned Baby
  (`triple.ts`), 0 срабатываний в аудитах; фикстуры triple-тестов используют пару
  buy + trend `up` + choch, которую новая семантика считает несонаправленной.
- Порог confidence и формулы детекторов: потолок `0.727 × htf` у tweezer остаётся; фикс
  уменьшает число проходящих кандидатов, а не увеличивает.

## После применения
1. `npx vitest run` (весь набор), `npm run typecheck && npm run lint`.
2. Версия 8 делает закоммиченные отчёты `backtest/output/*` устаревшими (`stale`):
   `generate-pattern-horizon-table --check` будет требовать перезапуска аудита.
3. При деплое в приложение добавить запись в `LOGIC_CHANGE_LOG` (`backtest/change-registry.ts`)
   с `frozenAtMs` = день фактического деплоя: это сбросит часы форвард-теста.
