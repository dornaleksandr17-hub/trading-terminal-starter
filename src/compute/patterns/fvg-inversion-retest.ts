import type { Candle, PatternResult, IndicatorSnapshot } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { intervalSeconds } from './pattern-context';
import { fvgAgeBars } from './fvg-strategies-shared';
import { buildFvgEntryResult, betterOf } from './fvg-m1-entry-shared';

const MIN_HISTORY = 40;
const MAX_AGE_BARS = 15;
// Свеча, пробившая FVG закрытием, должна быть содержательной (не «ленивый
// тик» за край): тело ≥ 0.5 ATR. При отсутствии ATR проверка пропускается.
const MIN_BREAK_BODY_ATR = 0.5;

// Идея C (ICT: Inversion FVG). FVG, пробитый закрытием, меняет полярность
// (smart-money.ts → inversionFvgs). Бывший bearish-FVG, закрытый выше, —
// bullish-инверсия (поддержка): входим на ПЕРВОМ возврате в неё с
// закрытием не ниже CE; для sell — зеркально. Уже отработанная более ранним
// ретестом зона и зона, пробитая обратно, пропускаются.
export function detectFvgInversionRetest(
  candles: Candle[],
  snapshot: IndicatorSnapshot | undefined,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
): PatternResult | null {
  if (candles.length < MIN_HISTORY) return null;
  const lastIdx = candles.length - 1;
  const last = candles[lastIdx];
  const intervalSec = intervalSeconds(candles);
  const atrValue = snapshot?.atr ?? null;

  let best: PatternResult | null = null;

  for (const wantType of ['bullish', 'bearish'] as const) {
    const buy = wantType === 'bullish';
    const direction = buy ? 'buy' : 'sell';

    const cands = smartMoney.inversionFvgs
      .filter((f) => {
        if (f.type !== wantType || f.broken) return false;
        const age = fvgAgeBars(f.time, last.time, intervalSec);
        return age >= 1 && age <= MAX_AGE_BARS;
      })
      .reverse();

    for (const ifvg of cands) {
      const breakIdx = candles.findIndex((c) => c.time === ifvg.time);
      if (breakIdx < 0 || breakIdx >= lastIdx) continue;

      if (atrValue != null && atrValue > 0) {
        const b = candles[breakIdx];
        if (Math.abs(b.close - b.open) < MIN_BREAK_BODY_ATR * atrValue) continue;
      }

      const triggers = (c: Candle): boolean => {
        if (!(c.low <= ifvg.top && c.high >= ifvg.bottom)) return false;
        return buy ? c.close >= ifvg.ce && c.close >= ifvg.bottom : c.close <= ifvg.ce && c.close <= ifvg.top;
      };
      if (!triggers(last)) continue;

      let already = false;
      for (let i = breakIdx + 1; i < lastIdx; i++) {
        if (triggers(candles[i])) { already = true; break; }
      }
      if (already) continue;

      const res = buildFvgEntryResult('fvg-inversion-retest', direction, candles, snapshot, session, ifvg.hasDisplacement);
      if (res) { best = betterOf(best, res); break; }
    }
  }
  return best;
}
