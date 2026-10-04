# direction-prediction: направление CHoCH (2026-09-30)

## Что нашли
`computeDirectionScore` трактовал CHoCH наоборот: trend `up` + choch → «CHoCH bullish» (+0.5).
В `computeStructure` при trend `up` CHoCH — закрытие ниже swingLow (медвежий слом), при
trend `down` — выше swingHigh (бычий). `signal-filters.ts` читает пару так же, как
`computeStructure`; расходился только direction-prediction.

## Что изменено
- `src/decision/direction-prediction.ts`: trend `down` + choch → buy (+0.5, «CHoCH bullish»),
  trend `up` + choch → sell (−0.5, «CHoCH bearish»).
- `src/decision/direction-prediction.test.ts`: пары trend/choch в двух тестах поменяны местами,
  добавлена проверка направления фактора `choch` и случай choch в range (компонента нет).

## Эффект и что делать при деплое
Прогноз направления в приложении по CHoCH теперь противоположен прежнему (вес 0.5 в
`components.structure`). Записать в `LOGIC_CHANGE_LOG` (`backtest/change-registry.ts`) с
`frozenAtMs` = день деплоя. Аудит паттернов (`backtest/horizon-audit`) этот модуль не
использует, перепрогон не нужен.
