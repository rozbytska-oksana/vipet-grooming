import { describe, expect, it } from 'vitest';
import { swipeDirection } from '../app/utils/swipeDirection';

describe('swipe direction', () => {
  it('moves to the next item when the finger moves left', () => {
    expect(swipeDirection(-80, 10)).toBe(1);
  });
  it('moves to the previous item when the finger moves right', () => {
    expect(swipeDirection(80, -10)).toBe(-1);
  });
  it('ignores taps and short movements', () => {
    expect(swipeDirection(0, 0)).toBe(0);
    expect(swipeDirection(-49, 0)).toBe(0);
  });
  it('ignores mostly vertical movements', () => {
    expect(swipeDirection(-60, 50)).toBe(0);
    expect(swipeDirection(90, -120)).toBe(0);
  });
  it('does not switch while the view is pinch-zoomed', () => {
    expect(swipeDirection(-120, 0, 2)).toBe(0);
  });
});
