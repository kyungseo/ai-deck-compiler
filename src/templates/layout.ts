// Shared layout constants for LAYOUT_WIDE slides (13.33" × 7.5").
// All values in inches.
export const SL = {
  w:  13.33, // slide width
  h:   7.5,  // slide height
  mx:  0.67, // horizontal margin
  ty:  0.4,  // title y
  th:  0.85, // title height
  cx:  0.67, // content x = margin
  cy:  1.35, // content y (ty + th + 0.1)
  cw: 12.0,  // content width (w - mx*2)
  ch:  5.75, // content height (h - cy - 0.4)
} as const;

// Strip leading '#' — pptxgenjs expects hex without it.
export const hex = (c: string): string => (c.startsWith('#') ? c.slice(1) : c);

// ── Zone-based layout for architecture diagrams ──────────────────────────────

type Zone =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'left' | 'right';

// [col, row] — 0-indexed in a 3×3 grid
const ZONE_GRID: Record<Zone, [number, number]> = {
  'top-left':      [0, 0], 'top-center':    [1, 0], 'top-right':     [2, 0],
  'center-left':   [0, 1], 'center':        [1, 1], 'center-right':  [2, 1],
  'bottom-left':   [0, 2], 'bottom-center': [1, 2], 'bottom-right':  [2, 2],
  'left':          [0, 1], 'right':         [2, 1],
};

export function zoneCenter(zone: string): { cx: number; cy: number } {
  const entry = ZONE_GRID[zone as Zone] ?? [1, 1]; // default: center
  const [col, row] = entry;
  const cellW = SL.cw / 3;
  const cellH = SL.ch / 3;
  return {
    cx: SL.cx + cellW * col + cellW / 2,
    cy: SL.cy + cellH * row + cellH / 2,
  };
}
