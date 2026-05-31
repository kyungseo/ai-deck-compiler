import type { PptxSlide } from './registry.js';
import type { ResolvedDesignTokens } from '../compiler/types.js';

// Shared layout constants for LAYOUT_WIDE slides (13.33" × 7.5").
// All values in inches.
export const SL = {
  w:  13.33, // slide width
  h:   7.5,  // slide height
  mx:  0.67, // horizontal margin
  ty:  0.35, // title y (no section_label)
  th:  0.82, // title height (no section_label)
  cx:  0.67, // content x = margin
  cy:  1.35, // kept for zone calculations in architecture
  cw: 12.0,  // content width (w - mx*2)
  ch:  5.75, // kept for zone calculations in architecture
} as const;

// ── Card-based content area ──────────────────────────────────────────────────
// All content slides render a white card background over the slide background.
// Content lives inside the card with top padding.

export const CARD = {
  y:  1.75,  // card background Y
  h:  5.1,   // card height — bottom at 6.85 (footer at 7.15)
  iy: 2.05,  // inner content Y  (0.3 padding from card top)
  ih: 4.65,  // inner content height (ends at 6.70)
} as const;

// Strip leading '#' — pptxgenjs expects hex without it.
export const hex = (c: string): string => (c.startsWith('#') ? c.slice(1) : c);

// ── Shared render helpers ────────────────────────────────────────────────────

type HeaderOpts = {
  title: string;
  section_label?: string;
  subtitle?: string;
};

/** Renders section label (optional), title, and subtitle (optional). */
export function renderSectionHeader(
  s: PptxSlide,
  opts: HeaderOpts,
  tokens: ResolvedDesignTokens,
): void {
  const { typography: ty, colors: co } = tokens;
  const accent = hex(co['accent'] ?? '2563EB');
  const primary = hex(co['text-primary'] ?? '111827');
  const secondary = hex(co['text-secondary'] ?? '374151');
  const font = ty['title']?.font ?? 'Pretendard';

  if (opts.section_label) {
    // Small accent square marker
    s.addShape('rect', {
      x: SL.mx, y: 0.28, w: 0.12, h: 0.14,
      fill: { color: accent },
      line: { color: accent, width: 0 },
    });
    // Section label text
    s.addText(opts.section_label.toUpperCase(), {
      x: SL.mx + 0.22, y: 0.22, w: 9.0, h: 0.35,
      fontSize: 11,
      bold: true,
      fontFace: ty['label']?.font ?? 'Pretendard',
      color: accent,
      valign: 'middle',
    });
  }

  const titleY = opts.section_label ? 0.62 : SL.ty;
  const titleH = opts.subtitle ? 0.60 : SL.th;

  s.addText(opts.title, {
    x: SL.cx, y: titleY, w: SL.cw, h: titleH,
    fontSize: ty['title']?.size ?? 40,
    bold: ty['title']?.bold ?? true,
    fontFace: font,
    color: primary,
    valign: 'middle',
  });

  if (opts.subtitle) {
    s.addText(opts.subtitle, {
      x: SL.cx, y: titleY + titleH + 0.05, w: SL.cw, h: 0.38,
      fontSize: 18,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: secondary,
      valign: 'middle',
    });
  }
}

/** Renders the white content card background (Apple-style: no border, depth from bg contrast). */
export function renderCardBackground(
  s: PptxSlide,
  tokens: ResolvedDesignTokens,
): void {
  const { colors: co } = tokens;
  s.addShape('rect', {
    x: SL.mx, y: CARD.y, w: SL.cw, h: CARD.h,
    fill: { color: hex(co['card-bg'] ?? 'FFFFFF') },
    line: { color: hex(co['card-bg'] ?? 'FFFFFF'), width: 0 },
  });
}

/** Renders a panel label (small accent bar + uppercase text) inside the card. */
export function renderPanelLabel(
  s: PptxSlide,
  label: string,
  x: number,
  tokens: ResolvedDesignTokens,
): void {
  const { typography: ty, colors: co } = tokens;
  const accent = hex(co['accent'] ?? '2563EB');
  s.addShape('rect', {
    x, y: CARD.iy, w: 0.08, h: 0.30,
    fill: { color: accent },
    line: { color: accent, width: 0 },
  });
  s.addText(label.toUpperCase(), {
    x: x + 0.18, y: CARD.iy, w: 5.5, h: 0.30,
    fontSize: 14,
    bold: true,
    fontFace: ty['label']?.font ?? 'Pretendard',
    color: accent,
    valign: 'middle',
  });
}

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
