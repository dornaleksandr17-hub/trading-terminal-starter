import { describe, it, expect } from 'vitest';
import type { MarketStructure } from '@/types/domain';
import { chochAlignsWithDirection, htfAlignment } from './pattern-context';

const S = (trend: MarketStructure['trend'], bos: boolean, choch: boolean): MarketStructure => ({
  trend, bos, choch, swingHigh: null, swingLow: null, provisional: false,
});

describe('htfAlignment: направление CHoCH', () => {
  it('бычий CHoCH (trend down + choch) усиливает buy, но не sell', () => {
    expect(htfAlignment(S('down', false, true), 'buy')).toBe(0.75);
    expect(htfAlignment(S('down', false, true), 'sell')).toBe(0.5);
  });

  it('медвежий CHoCH (trend up + choch) усиливает sell, но не buy', () => {
    expect(htfAlignment(S('up', false, true), 'sell')).toBe(0.75);
    expect(htfAlignment(S('up', false, true), 'buy')).toBe(0.5);
  });

  it('BOS в сторону сделки по-прежнему 1.0 и приоритетнее CHoCH', () => {
    expect(htfAlignment(S('up', true, true), 'buy')).toBe(1.0);
    expect(htfAlignment(S('down', true, true), 'sell')).toBe(1.0);
  });

  it('без CHoCH шкала не изменилась: range 0.4, иначе 0.5', () => {
    expect(htfAlignment(S('range', false, false), 'buy')).toBe(0.4);
    expect(htfAlignment(S('up', false, false), 'sell')).toBe(0.5);
  });

  it('зеркальная симметрия: buy/down ⇔ sell/up дают одинаковый множитель', () => {
    for (const bos of [false, true]) {
      for (const choch of [false, true]) {
        expect(htfAlignment(S('down', bos, choch), 'buy')).toBe(htfAlignment(S('up', bos, choch), 'sell'));
        expect(htfAlignment(S('up', bos, choch), 'buy')).toBe(htfAlignment(S('down', bos, choch), 'sell'));
      }
    }
  });

  it('chochAlignsWithDirection: в range и без флага всегда false', () => {
    expect(chochAlignsWithDirection(S('range', false, true), 'buy')).toBe(false);
    expect(chochAlignsWithDirection(S('down', false, false), 'buy')).toBe(false);
  });
});
