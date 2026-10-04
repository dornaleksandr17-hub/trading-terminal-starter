import { wilsonLowerBound, breakevenWinRateFromProfitPercent } from '@/lib/pattern-reliability-calibration';
import { MIN_THRESHOLD_BACKTEST_SAMPLES } from '@/lib/threshold-calibration';
import { computeMetrics, type BacktestMetrics } from './metrics';
import type { SimulatedTrade } from './simulator';

// Аудит 2026-09-13, п.5 ("проверка на переобучение через сам процесс
// аудита"): у backtest/simulator.ts уже был in-sample/out-of-sample split
// (inSampleRatio) — но это разбиение ВНУТРИ ОДНОГО статического
// исторического файла свечей. Это не защищает от главного риска ручного
// аудита: правку (breakeven-константа, спред-паритет, Wilson-граница —
// см. LOGIC_CHANGE_LOG ниже) можно перегонять через npm run backtest
// сколько угодно раз, подбирая параметры так, чтобы OOS-часть ТОГО ЖЕ
// файла выглядела хорошо, — это researcher degrees of freedom / проблема
// множественного тестирования, тот же оверфиттинг, только на один уровень
// абстракции выше. Настоящая защита — WALL-CLOCK forward-test: правило
// считается подтверждённым только на сделках, ВРЕМЯ ВХОДА которых позже
// момента, когда правило было заморожено (frozenAtMs) — то есть на
// данных, которые физически не могли использоваться при разработке этой
// же правки, сколько бы раз её ни перезапускали на старых файлах.
//
// См. docs/audit/WALK_FORWARD_PROTOCOL.md — полное описание протокола и
// правила добавления новых записей сюда.

export interface LogicChangeRecord {
  /** Короткий стабильный идентификатор правки (совпадает с её changelog-файлом). */
  id: string;
  /** Дата в формате YYYY-MM-DD — только для человекочитаемости отчётов. */
  date: string;
  description: string;
  filesChanged: string[];
  /**
   * Wall-clock момент (мс, UTC), после которого правка считается
   * "заморожена". НЕЛЬЗЯ датировать задним числом — при следующей правке
   * той же логики это значение переносится на новый момент деплоя, а не
   * остаётся прежним (см. протокол).
   */
  frozenAtMs: number;
}

// Записи ниже соответствуют трём правкам, уже применённым и
// задокументированным в docs/changelog/ за 2026-09-13 (одна и та же
// сессия аудита — отсюда одинаковая дата заморозки у всех трёх).
export const LOGIC_CHANGE_LOG: LogicChangeRecord[] = [
  {
    id: 'breakeven-payout-aware',
    date: '2026-09-13',
    description:
      'BREAKEVEN_WIN_RATE выведен из profitPercent демо-счёта (100/(100+profitPercent)) вместо хардкода 0.5.',
    filesChanged: ['src/lib/pattern-reliability-calibration.ts', 'src/ui/CalibrationPanel.tsx'],
    frozenAtMs: Date.UTC(2026, 8, 13),
  },
  {
    id: 'spread-balance-parity',
    date: '2026-09-13',
    description:
      'resolveTrade() в useDemoAccountStore.ts теперь применяет спред-логику (движение <= спред → тай) к самому балансу, а не только к обучающей метке калибровки.',
    filesChanged: ['src/stores/useDemoAccountStore.ts'],
    frozenAtMs: Date.UTC(2026, 8, 13),
  },
  {
    id: 'wilson-min-samples',
    date: '2026-09-13',
    description:
      'computeReliabilitySuggestions считает множитель от нижней границы интервала Уилсона, а не от сырого winRate; MIN_FACTOR_SAMPLES поднят с 5 до 20.',
    filesChanged: ['src/lib/pattern-reliability-calibration.ts', 'src/ui/factor-analytics.ts'],
    frozenAtMs: Date.UTC(2026, 8, 13),
  },
  {
    id: 'audit-review-fixes',
    date: '2026-09-20',
    description:
      'Сверка по итогам отчётов A′.5: зеркальная симметрия sell-подтверждения (weakClose); объёмные гейты пропускаются при volume≡0 (engulfing, piercing, dark-cloud, morning/evening-star, abandoned-baby, consolidation-breakout) — пороги при реальном объёме не менялись; pin-bar: htfStructure + направленная близость к swing; таблица горизонтов перегенерирована по прогону A′.5; опциональный режим requireHorizonEvidence (по умолчанию выключен). OCCURRENCE_ALGORITHM_VERSION поднят с 3 до 4 — правки детекторов меняют состав detectAllPatterns, поэтому старый occurrence-кэш версии 3 молча отдавал бы результаты прежних детекторов. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-09-20 перенести на реальную дату (задним числом датировать нельзя).',
    filesChanged: [
      'src/compute/patterns/pattern-context.ts',
      'src/compute/patterns/double.ts',
      'src/compute/patterns/triple.ts',
      'src/compute/patterns/consolidation-breakout.ts',
      'src/compute/patterns/pin-bar.ts',
      'src/decision/pattern-horizon-table.ts',
      'src/decision/signal-builder.ts',
      'src/decision/engine.ts',
      'backtest/horizon-audit.ts',
    ],
    // Перенесено на день фактического деплоя (2026-09-21) вместе с horizon-table-schema2: правки 2026-09-20
    // в приложение до этого дня не попадали, датировать их задним числом нельзя.
    frozenAtMs: Date.UTC(2026, 8, 21),
  },
  {
    id: 'horizon-table-schema2',
    date: '2026-09-21',
    description:
      'Таблица горизонтов перегенерирована по отчётам аудита схемы 2 (дедуплицированные наблюдения, безубыточность при payout 80%, версия алгоритма occurrences 5, полный набор индикаторов). Итог аудита: valid=0 на обоих пулах, доказанного преимущества выше безубыточности нет ни у одного паттерна. Изменения в поведении: harmonic-pattern (crypto и forex) больше не valid — горизонт из таблицы не берётся, fallback-экспирация; подавляются (rejected) crypto fvg-return, fvg-nested, order-block-breaker, fvg-breaker-block, consolidation-breakout и forex consolidation-breakout; подавление crypto strong-order-block-reaction снято (по независимым наблюдениям p=0.274). Пороги детекторов, веса и фильтры не менялись.',
    filesChanged: ['src/decision/pattern-horizon-table.ts'],
    frozenAtMs: Date.UTC(2026, 8, 21),
  },
  {
    id: 'sweep-family-obvious-bugs',
    date: '2026-10-02',
    description:
      'Очевидные баги стратегий «ликвидность» и «возврат к среднему» (fix-plan-liquidity-meanreversion.md, F06/F10/F15/F16/F17/F19): mean-reversion требует свечу возврата в сторону сделки; liquidity-sweep — направленная близость к swing в reversal-гейте (buy у swingLow, sell у swingHigh); liquidity-sweep-reaction — BOS/CHoCH только в сторону сделки (BOS в range не подтверждает до решения D2), сессионный множитель и OB/FVG-конфлюэнс применяются один раз (внутри свипа), sessionAgnostic передаётся в стадию свипа, бар смещения проверяется на направление и на повторный уход за экстремум свипа, промежуточный бар — на повторный уход за экстремум. Пороги и веса не менялись. OCCURRENCE_ALGORITHM_VERSION 8→9. Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату (задним числом датировать нельзя).',
    filesChanged: [
      'src/compute/patterns/pattern-context.ts',
      'src/compute/patterns/liquidity-sweep.ts',
      'src/compute/patterns/liquidity-sweep-reaction.ts',
      'src/compute/patterns/mean-reversion.ts',
      'src/compute/patterns/index.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'mean-reversion-regime-veto-exempt',
    date: '2026-10-02',
    description:
      'Решение D1=A (fix-plan-liquidity-meanreversion.md, F02): сигнал с паттерном mean-reversion в направлении сделки исключён из range-вето/штрафа по ADX в signal-filters (детектор требует ADX<=25 и бустит ADX<15, а вето режет именно флэт). Остальные паттерны и режимы (в т.ч. high-volatility) не затронуты. Пороги и веса не менялись. OCCURRENCE_ALGORITHM_VERSION 9→10 (occurrences детекторов не меняются, меняется итоговое решение). Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату.',
    filesChanged: ['src/decision/signal-filters.ts', 'backtest/audit-version.ts'],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'market-structure-bos-direction',
    date: '2026-10-02',
    description:
      'Решение D2 (fix-plan-liquidity-meanreversion.md, F15): MarketStructure получила опциональное поле bosDirection (up/down), computeStructure заполняет его при bos=true, в том числе для пробоя из range. bosAlignsWithDirection использует bosDirection, если оно есть; поэтому BOS в range теперь подтверждает liquidity-sweep-reaction в сторону пробоя (раньше не подтверждал вовсе). Других потребителей bos поведение не меняется (они читают trend). Пороги и веса не менялись. OCCURRENCE_ALGORITHM_VERSION 10→11. Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату.',
    filesChanged: [
      'src/types/domain.ts',
      'src/compute/indicators/trend-structure.ts',
      'src/compute/patterns/pattern-context.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'liquidity-pools-equal-lows-fix',
    date: '2026-10-02',
    description:
      'Решение D5 (fix-plan-liquidity-meanreversion.md, F23): liquidityPools искал «equal lows» как локальные МАКСИМУМЫ ряда лоу (общая проверка с highs); теперь для lows ищется локальный минимум. Имена типов (buy-side из lows, sell-side из highs) и знак вклада ±0.3 в direction-prediction не менялись — это политика/веса, переименование меняло бы знак вклада. Затрагивает только фичу liquidity-pools (components.liquidity). Пороги и веса не менялись. OCCURRENCE_ALGORITHM_VERSION 11→12. Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату.',
    filesChanged: ['src/compute/indicators/liquidity-pools.ts', 'backtest/audit-version.ts'],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'mean-reversion-stage2-exit-bar',
    date: '2026-10-02',
    description:
      'Этап 2 (fix-plan-liquidity-meanreversion.md, F01/F03/F04/F05): mean-reversion считает RSI(7) и полосу Боллинджера на баре выхода за полосу (раньше RSI брался на баре возврата, полоса — последнего бара); добавлена проверка «первого выхода» (закрытие перед баром выхода внутри полосы, иначе это хождение по полосе); фейд не допускается при HTF-тренде против сделки (buy при trend=down, sell при trend=up). Пороги и веса не менялись. F07 (bollingerMiddle для экспирации) не входит. OCCURRENCE_ALGORITHM_VERSION 12→13. Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату.',
    filesChanged: [
      'src/compute/patterns/mean-reversion.ts',
      'src/compute/patterns/index.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'liquidity-sweep-stage3-rejection-trend-window',
    date: '2026-10-02',
    description:
      'Этап 3 (fix-plan-liquidity-meanreversion.md, F12/F13): liquidity-sweep требует отказ от прокола — закрытие свип-бара не ниже середины его диапазона для buy и не выше середины для sell (раньше закрытие на 0.01 за уровнем считалось свипом); окно «5 из 7 баров» тренд-контекста считается по 7 барам ДО свип-бара, а не включая его. Затрагивает liquidity-sweep и внутренний свип liquidity-sweep-reaction. Пороги и веса не менялись (0.5 — геометрическая середина бара, не подбираемый порог). F08/F11/F21 не входят. OCCURRENCE_ALGORITHM_VERSION 13→14. Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату.',
    filesChanged: [
      'src/compute/patterns/liquidity-sweep.ts',
      'src/compute/patterns/liquidity-sweep-stage3.test.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'liquidity-sweep-reaction-stage4-body-gate',
    date: '2026-10-02',
    description:
      'Этап 4 (fix-plan-liquidity-meanreversion.md, решение владельца D7=2): у бара смещения liquidity-sweep-reaction убран жёсткий гейт «тело ≥ 1 ATR». Доминирование тела в диапазоне бара (≥0.6), объёмный гейт и ENTRY_THRESHOLD не менялись; слабое тело по-прежнему снижает confidence через body/ATR/2. Новых порогов нет. Замер на Binance (ETH, BTC, 288 тыс. баров, без OB/FVG, сессия london): сигналов 9 и 11, как до правки — главным отсевом остаётся объёмный гейт (≈84%). Эффект на точность не измерялся. OCCURRENCE_ALGORITHM_VERSION 14→15. Таблица горизонтов не перегенерирована. ВАЖНО: frozenAtMs — день фактического деплоя; при деплое позже 2026-10-02 перенести на реальную дату.',
    filesChanged: [
      'src/compute/patterns/liquidity-sweep-reaction.ts',
      'src/compute/patterns/liquidity-sweep-reaction-stage4.test.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 2),
  },
  {
    id: 'order-block-audit-20261003',
    date: '2026-10-03',
    description:
      'Аудит стратегий Order Block (группа A, без смены весов и порогов): strong-order-block-reaction — tested-hold только по удержаниям до реакционной свечи (heldBefore), FVG-конфлюэнс через hasFvgAtBlock вместо OB-самоконфлюэнса, BOS только в сторону сделки (bosAlignsWithDirection), сессия через isHighLiquiditySession, +2 за HTF только при переданной htfStructure; order-block-breaker — бонус за displacement пробивающей свечи (hasBreakDisplacement) вместо константно-истинных флагов исходного блока, перебор всех свежих брейкеров; order-block-nested — HTF-зона, пробитая M1-хвостом после последней полной M5-группы, отбрасывается. Поле hasBreakDisplacement добавлено в SmartMoneyOrderBlock. OCCURRENCE_ALGORITHM_VERSION 15→16. Таблица горизонтов не перегенерирована.',
    filesChanged: [
      'src/compute/indicators/smart-money.ts',
      'src/compute/patterns/strong-order-block-reaction.ts',
      'src/compute/patterns/order-block-breaker.ts',
      'src/compute/patterns/order-block-nested.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 3),
  },
  {
    id: 'fvg-audit-20261004',
    date: '2026-10-04',
    description:
      'Аудит стратегий FVG (без смены весов и порогов): fvg-return/fvg-breaker-block/fvg-nested/fvg-rejection — одна зона даёт не более одного сигнала (zoneAlreadyTriggered), перебор всех свежих зон от ближней вместо последней, при двойном совпадении buy/sell побеждает большая confidence; fvg-nested — закрытие за CE зоны перекрытия; fvg-breaker-block — тело (open и close) целиком снаружи зоны; smart-money.ts — hasBOSConfluence учитывает BOS на средней/правой свече FVG (bosIndex <= leftIndex+2). OCCURRENCE_ALGORITHM_VERSION 16→17. Таблица горизонтов не перегенерирована.',
    filesChanged: [
      'src/compute/indicators/smart-money.ts',
      'src/compute/patterns/fvg-strategies-shared.ts',
      'src/compute/patterns/fvg-return.ts',
      'src/compute/patterns/fvg-breaker-block.ts',
      'src/compute/patterns/fvg-nested.ts',
      'src/compute/patterns/fvg-rejection.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 4),
  },
  {
    id: 'fvg-m1-entry-ideas-20261004',
    date: '2026-10-04',
    description:
      'Три альтернативные идеи входа на M1 для FVG (веса и пороги скоринга общие с fvg-return, не менялись): fvg-htf-mss (непробитый HTF-FVG + первый M1-слом структуры), fvg-sweep-return (снятие ликвидности + возврат в FVG, оставленный смещением после снятия), fvg-inversion-retest (первый ретест инверсного FVG). Регистрация: PatternName/PATTERN_NAMES/patternNameSchema, ALL_PATTERNS + миграция settingsStore v15, patterns/index.ts, pattern-categories, pattern-selection, signal-builder (стартовый бонус 0.4), HORIZON_GRIDS. OCCURRENCE_ALGORITHM_VERSION 17→18. Таблица горизонтов не перегенерирована: у новых паттернов нет записи до первого horizon-audit.',
    filesChanged: [
      'src/compute/patterns/fvg-m1-entry-shared.ts',
      'src/compute/patterns/fvg-htf-mss.ts',
      'src/compute/patterns/fvg-sweep-return.ts',
      'src/compute/patterns/fvg-inversion-retest.ts',
      'src/compute/patterns/fvg-nested.ts',
      'src/compute/patterns/index.ts',
      'src/types/domain.ts',
      'src/stores/settingsStore.ts',
      'src/lib/pattern-categories.ts',
      'src/decision/pattern-selection.ts',
      'src/decision/signal-builder.ts',
      'backtest/horizon-audit.ts',
      'backtest/audit-version.ts',
    ],
    frozenAtMs: Date.UTC(2026, 9, 4),
  },
];

/**
 * Момент заморозки ДЕЙСТВУЮЩЕГО набора правил в целом — максимум по всем
 * записям. Намеренно не считается "по каждой правке отдельно": итоговая
 * система оценивается как единое целое (правки взаимодействуют друг с
 * другом — например, spread-balance-parity меняет, какие сделки вообще
 * попадают в 'win'/'loss', что напрямую влияет на выборку, от которой
 * wilson-min-samples считает свою границу). Самая свежая правка сбрасывает
 * часы для всех: до неё накопленный форвард-тест валиден для СТАРОЙ
 * комбинации правил, не для новой.
 */
export function currentFreezeMs(log: LogicChangeRecord[] = LOGIC_CHANGE_LOG): number {
  if (log.length === 0) return 0;
  return Math.max(...log.map((r) => r.frozenAtMs));
}

/** entryTime у SimulatedTrade — в секундах (как candle.time), не в мс. */
export function isForwardTestTrade(entryTimeSec: number, freezeAtMs: number): boolean {
  return entryTimeSec * 1000 >= freezeAtMs;
}

export type ForwardTestVerdict =
  | 'insufficient-data'
  | 'below-breakeven'
  | 'above-breakeven-not-significant'
  | 'significantly-above-breakeven';

export interface ForwardTestReport {
  freezeAtMs: number;
  freezeAtIso: string;
  forwardTradeCount: number;
  decidedCount: number;
  metrics: BacktestMetrics;
  breakevenWinRate: number;
  /** null, пока decidedCount === 0 — Wilson-границу не от чего считать. */
  reliableWinRateLowerBound: number | null;
  hasEnoughSamples: boolean;
  verdict: ForwardTestVerdict;
}

/**
 * Честная оценка "подтверждена ли текущая логика форвард-тестом", а не
 * ретроспективным бэктестом. Использует ТЕ ЖЕ функции (wilsonLowerBound,
 * breakevenWinRateFromProfitPercent), что и калибровка в
 * pattern-reliability-calibration.ts — намеренно: то же самое разночтение
 * "сырой winRate против реальной точки безубыточности", которое чинил
 * фикс breakeven-payout-aware, актуально и здесь, и дублировать эту логику
 * было бы ровно той же ошибкой (см. 20-кратное расхождение
 * MIN_FACTOR_SAMPLES/MIN_SAMPLES, которое чинил wilson-min-samples).
 *
 * profitPercent передаётся и в computeMetrics() (влияет на averageR —
 * см. BUGFIX в metrics.ts, "R-модель не совпадала с реальной экономикой
 * демо-счёта") — один и тот же payout теперь единообразно определяет и
 * точку безубыточности для вердикта, и доходность в самих метриках,
 * вместо двух независимых допущений об экономике счёта.
 */
export function computeForwardTestReport(
  trades: SimulatedTrade[],
  freezeAtMs: number,
  profitPercent: number,
): ForwardTestReport {
  const forward = trades.filter((t) => isForwardTestTrade(t.entryTime, freezeAtMs));
  const metrics = computeMetrics(forward, profitPercent);
  const decidedCount = metrics.wins + metrics.losses;
  const breakevenWinRate = breakevenWinRateFromProfitPercent(profitPercent);
  const hasEnoughSamples = decidedCount >= MIN_THRESHOLD_BACKTEST_SAMPLES;
  const reliableWinRateLowerBound = decidedCount > 0 ? wilsonLowerBound(metrics.wins, decidedCount) : null;

  let verdict: ForwardTestVerdict;
  if (!hasEnoughSamples || reliableWinRateLowerBound === null) {
    verdict = 'insufficient-data';
  } else if (metrics.winRate < breakevenWinRate) {
    verdict = 'below-breakeven';
  } else if (reliableWinRateLowerBound < breakevenWinRate) {
    // Сырой winRate формально выше безубытка, но недостаточно уверенно —
    // нижняя граница интервала Уилсона всё ещё ниже точки безубыточности.
    verdict = 'above-breakeven-not-significant';
  } else {
    verdict = 'significantly-above-breakeven';
  }

  return {
    freezeAtMs,
    freezeAtIso: new Date(freezeAtMs).toISOString(),
    forwardTradeCount: forward.length,
    decidedCount,
    metrics,
    breakevenWinRate,
    reliableWinRateLowerBound,
    hasEnoughSamples,
    verdict,
  };
}
