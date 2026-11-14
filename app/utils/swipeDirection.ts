/**
 * Classify a touch by its first movement, like Embla: true = horizontal (the page takes
 * the gesture and must call preventDefault right away, before in-app browsers such as
 * Telegram start their own swipe-to-close), false = vertical (native scroll/zoom),
 * null = no movement yet.
 */
export function firstMoveIsHorizontal(dx: number, dy: number): boolean | null {
  if (dx === 0 && dy === 0) return null;
  return Math.abs(dx) > Math.abs(dy);
}

/**
 * Decide whether a finished touch movement is a horizontal swipe.
 * Returns 1 for the next item (finger moved left), -1 for the previous one, 0 otherwise.
 */
export function swipeDirection(dx: number, dy: number, zoom = 1): -1 | 0 | 1 {
  // A pinch-zoomed view pans instead of switching items.
  if (zoom > 1.01) return 0;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return 0;
  return dx < 0 ? 1 : -1;
}
