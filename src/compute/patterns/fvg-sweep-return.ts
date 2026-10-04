import type { Candle, PatternResult, IndicatorSnapshot } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { intervalSeconds } from './pattern-context';
import {
  pickFreshUnbrokenFvgs,
  fvgFormationIndex,
  zoneAlreadyTriggered,
} from './fvg-strategies-shared';
import { buildFvgEntryResult, betterOf } from './fvg-m1-entry-shared';

const MIN_HISTORY = 60;
const MAX_AGE_BARS = 15;
// Эталонный экстремум ликвидности: минимум/максимум за REF_WINDOW баров,
// предшествующих окну поиска снятия.
const REF_WINDOW = 30;
const SWEEP_WINDOW = 12;

// Идея B (ICT: liquidity sweep → displacement → FVG → return). Входим не на
// любом касании FVG, а только на возврате в FVG, который оставило
// СМЕЩЕНИЕ ПОСЛЕ снятия ликвидности (проколот прежний экстремум фитилём,
// закрытие вернулось внутрь диапазона):
//   buy:  low < min(low за REF_WINDOW) и close > этот минимум (sweep вниз),
//         затем bullish FVG, левая свеча которого не раньше свечи снятия,
//         затем возврат в FVG с закрытием не ниже CE (как в fvg-return).
// Тренд-фильтра нет намеренно: снятие ликвидности — разворотная идея.
export function detectFvgSweepReturn(
  candles: Candle[],
  snapshot: IndicatorSnapshot | undefined,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
): PatternResult | null {
  if (candles.length < MIN_HISTORY) return null;
  const lastIdx = candles.length - 1;
  const last = candles[lastIdx];
  const intervalSec = intervalSeconds(candles);

  const searchStart = lastIdx - SWEEP_WINDOW;
  const refFrom = Math.max(0, searchStart - REF_WINDOW);
  if (searchStart - refFrom < 10) return null;

  let best: PatternResult | null = null;

  for (const wantType of ['bullish', 'bearish'] as const) {
    const buy = wantType === 'bullish';
    const direction = buy ? 'buy' : 'sell';

    let ref = buy ? Infinity : -Infinity;
    for (let i = refFrom; i < searchStart; i++) {
      ref = buy ? Math.min(ref, candles[i].low) : Math.max(ref, candles[i].high);
    }
    // последняя свеча-снятие в окне: фитиль за экстремум, закрытие обратно
    let sweepIdx = -1;
    for (let i = searchStart; i < lastIdx; i++) {
      const swept = buy
        ? candles[i].low < ref && candles[i].close > ref
        : candles[i].high > ref && candles[i].close < ref;
      if (swept) sweepIdx = i;
    }
    if (sweepIdx < 0) continue;
    const sweepTime = candles[sweepIdx].time;

    const fvgs = pickFreshUnbrokenFvgs(smartMoney.fvgs, wantType, last.time, intervalSec, MAX_AGE_BARS)
      .filter((f) => f.time >= sweepTime);

    for (let k = fvgs.length - 1; k >= 0; k--) {
      const fvg = fvgs[k];
      const formed = fvgFormationIndex(candles, fvg.time);
      if (formed < 0 || formed >= lastIdx) continue; // возврат — строго после формирования

      const triggers = (c: Candle): boolean => {
        if (!(c.low <= fvg.top && c.high >= fvg.bottom)) return false;
        return buy ? c.close >= fvg.ce && c.close >= fvg.bottom : c.close <= fvg.ce && c.close <= fvg.top;
      };
      if (!triggers(last)) continue;
      if (zoneAlreadyTriggered(candles, fvg.time, lastIdx, triggers)) continue;

      const res = buildFvgEntryResult(
        'fvg-sweep-return', direction, candles, snapshot, session,
        fvg.hasDisplacement || fvg.hasBOSConfluence,
      );
      if (res) { best = betterOf(best, res); break; }
    }
  }
  return best;
}
