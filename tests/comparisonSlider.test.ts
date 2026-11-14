import { describe, expect, it } from 'vitest';
import { isHorizontalDrag, positionFromPointer } from '../app/utils/comparisonSlider';

describe('comparison slider position', () => {
  it('maps the pointer to a whole percent of the frame width', () => {
    expect(positionFromPointer(100, 0, 400)).toBe(25);
    expect(positionFromPointer(260, 60, 400)).toBe(50);
    expect(positionFromPointer(333, 0, 1000)).toBe(33);
  });
  it('clamps positions outside the frame', () => {
    expect(positionFromPointer(-20, 0, 400)).toBe(0);
    expect(positionFromPointer(500, 0, 400)).toBe(100);
  });
  it('keeps the middle when the frame has no width', () => {
    expect(positionFromPointer(10, 0, 0)).toBe(50);
  });
});

describe('comparison slider touch drag', () => {
  it('starts on clear horizontal movement', () => {
    expect(isHorizontalDrag(12, 3)).toBe(true);
    expect(isHorizontalDrag(-8, -2)).toBe(true);
  });
  it('ignores tiny or vertical movement so the page can scroll', () => {
    expect(isHorizontalDrag(4, 0)).toBe(false);
    expect(isHorizontalDrag(10, 20)).toBe(false);
    expect(isHorizontalDrag(10, 10)).toBe(false);
  });
});
