# Правило тайм-аута: только open === close (2026-10-07)

Решение владельца: тайм-аут (тай) засчитывается ТОЛЬКО при точном равенстве
цены открытия свечи входа и цены закрытия свечи экспирации. Во всех остальных
случаях исход — win (long/short по направлению) или loss.

## Что изменено
- `src/decision/apply-spread.ts` — win больше не превращается в `timeout`
  при движении <= спред (спред остаётся только в `spreadCostR`).
- `src/stores/useDemoAccountStore.ts` (`resolveTrade`) — убрана зона
  «движение <= спред → тай»; тай только при `closePrice === entryPrice`.
- `src/decision/outcome-scheduler.ts` (`resolveOutcome`) — точка отсчёта
  теперь open свечи входа (первая свеча после сигнальной), а не
  `signal.entryPrice` (close ± spread/2).
- `src/stores/useTickStore.ts` — удалён `resolvePendingAsTimeout()`:
  при смене инструмента незакрытые сигналы остаются `pending` и
  досчитываются по реальным свечам при возврате.
- `backtest/horizon-audit.ts` — `resolveBinaryOutcome(entryPrice, expiryClose,
  direction)`: без зоны спреда, вход от open свечи i+1.
  `OCCURRENCE_ALGORITHM_VERSION` 18 → 19, запись в `change-registry.ts`.

## Что нужно сделать после применения
- Перегенерировать отчёты horizon-audit (кэш v18 устарел) и
  `pattern-horizon-table.ts`, если нужна актуальная таблица горизонтов.
