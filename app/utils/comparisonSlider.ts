/** Divider position (0–100, whole percent) for a pointer X inside the comparison frame. */
export function positionFromPointer(clientX: number, left: number, width: number): number {
  if (width <= 0) return 50;
  return Math.round(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
}

/**
 * A touch starts moving the divider only once it is clearly horizontal;
 * vertical movement stays a page scroll.
 */
export function isHorizontalDrag(dx: number, dy: number, threshold = 6): boolean {
  return Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy);
}
