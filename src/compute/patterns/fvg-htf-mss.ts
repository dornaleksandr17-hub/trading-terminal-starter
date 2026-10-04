import type { Candle, PatternResult, IndicatorSnapshot } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { intervalSeconds } from './pattern-context';
import { detectHtfFvgZones, HTF_FACTOR } from './fvg-nested';
import { fvgAgeBars } from './fvg-strategies-shared';
import { buildFvgEntryResult, betterOf } from './fvg-m1-entry-shared';

const MIN_HISTORY = 60;
// Зона старшего (синтетический M5) FVG живёт не дольше 24 баров M5 = 120 M1.
const MAX_ZONE_AGE_M1 = 120;
// Касание зоны должно быть недавним, иначе MSS уже не связан с ней.
const TAP_WINDOW = 20;
// Сколько баров ДО экстремума отката смотрим назад в поисках локального
// swing-экстремума, пробой которого и есть MSS (Market Structure Shift).
const SWING_LOOKBACK = 8;
// Конфлюэнс: M1-FVG, оставленный самой смещающей (MSS) свечой.
const M1_FVG_MAX_AGE = 3;

// Идея A (ICT: HTF PD array + LTF MSS). Вместо входа на первом касании зоны
// (fvg-return/fvg-nested) ждём подтверждения, что зона УДЕРЖАЛАСЬ:
//   1. Цена зашла в НЕпробитый FVG старшего таймфрейма (синтетический M5).
//   2. После отката в зону на M1 закрытие впервые выше (для buy) локального
//      swing-high, образованного на пути вниз, — слом структуры (MSS/CHoCH).
//   3. Зона не пробита закрытием за дальний край; свеча слома — по направлению.
// Один слом — один сигнал: условие «предыдущее закрытие ещё не выше уровня»
// срабатывает ровно на первой свече пробоя.
export function detectFvgHtfMss(
  candles: Candle[],
  snapshot: IndicatorSnapshot | undefined,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
): PatternResult | null {
  if (candles.length < MIN_HISTORY) return null;
  const lastIdx = candles.length - 1;
  const last = candles[lastIdx];
  const prev = candles[lastIdx - 1];
  const intervalSec = intervalSeconds(candles);

  const zones = detectHtfFvgZones(candles)
    .filter((z) => {
      const ageM1 = (last.time - z.time) / intervalSec;
      return ageM1 >= 0 && ageM1 <= MAX_ZONE_AGE_M1;
    })
    .reverse(); // ближайшая (самая свежая) первой

  let best: PatternResult | null = null;

  for (const wantType of ['bullish', 'bearish'] as const) {
    const buy = wantType === 'bullish';
    const direction = buy ? 'buy' : 'sell';
    if (buy ? !(last.close > last.open) : !(last.close < last.open)) continue;

    for (const z of zones) {
      if (z.type !== wantType) continue;

      // 1. первое недавнее касание зоны
      // Касание считается только ПОСЛЕ закрытия правого бара зоны: бары самого
      // импульса лежат внутри зоны по построению и «касанием» не являются.
      const formedAt = z.time + 3 * HTF_FACTOR * intervalSec;
      let tapStart = -1;
      for (let i = Math.max(0, lastIdx - TAP_WINDOW); i < lastIdx; i++) {
        if (candles[i].time < formedAt) continue;
        if (candles[i].low <= z.top && candles[i].high >= z.bottom) { tapStart = i; break; }
      }
      if (tapStart < 0) continue;

      // 3. зона не пробита закрытием за дальний край (с момента касания)
      let invalid = false;
      for (let i = tapStart; i <= lastIdx; i++) {
        if (buy ? candles[i].close < z.bottom : candles[i].close > z.top) { invalid = true; break; }
      }
      if (invalid) continue;

      // экстремум отката внутри окна касания
      let extremeIdx = tapStart;
      for (let i = tapStart; i < lastIdx; i++) {
        if (buy ? candles[i].low < candles[extremeIdx].low : candles[i].high > candles[extremeIdx].high) extremeIdx = i;
      }

      // 2. уровень MSS — экстремум «нисходящей ноги» ВНУТРИ зоны: наивысший high
      //    (для sell — низший low) от первого касания до экстремума отката, не
      //    глубже SWING_LOOKBACK баров назад. Предшествующий подход к зоне
      //    (пик до касания) в уровень не входит — иначе MSS требовал бы
      //    вернуться к прежнему максимуму, а это уже не слом, а восстановление.
      const from = Math.max(tapStart, extremeIdx - SWING_LOOKBACK);
      let ref = buy ? -Infinity : Infinity;
      for (let i = from; i <= extremeIdx; i++) {
        ref = buy ? Math.max(ref, candles[i].high) : Math.min(ref, candles[i].low);
      }
      const firstBreak = buy
        ? last.close > ref && prev.close <= ref
        : last.close < ref && prev.close >= ref;
      if (!firstBreak) continue;

      const confluence = smartMoney.fvgs.some(
        (f) => f.type === wantType && !f.broken && fvgAgeBars(f.time, last.time, intervalSec) <= M1_FVG_MAX_AGE,
      );
      const res = buildFvgEntryResult('fvg-htf-mss', direction, candles, snapshot, session, confluence);
      if (res) { best = betterOf(best, res); break; }
    }
  }
  return best;
}
