import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type TimelineSlide = Extract<Slide, { type: 'timeline' }>;

export const timelineTemplate: SlideTemplate<TimelineSlide> = {
  id: 'timeline',
  supportedType: 'timeline',
  variants: ['default'],
  render(slide: TimelineSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accent = hex(co['accent'] ?? '4F46E5');
    const font = ty['body']?.font ?? 'Pretendard';

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.items ?? [];
    if (items.length === 0) return;

    const n = items.length;
    const lineY = CARD.iy + CARD.ih * 0.38;   // horizontal line vertical position
    const markerR = 0.14;                        // marker circle radius
    const itemW = SL.cw / n;

    // Horizontal timeline line
    pptxSlide.addShape('line', {
      x: SL.cx, y: lineY,
      w: SL.cw, h: 0,
      line: { color: hex(co['divider-light'] ?? 'E5E7EB'), width: 2 },
    });

    items.forEach((item, i) => {
      const cx = SL.cx + itemW * i + itemW / 2;

      // Accent marker circle
      pptxSlide.addShape('ellipse', {
        x: cx - markerR, y: lineY - markerR,
        w: markerR * 2, h: markerR * 2,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      // Vertical connector from line to date area
      pptxSlide.addShape('line', {
        x: cx, y: lineY - markerR,
        w: 0, h: 0.28,
        line: { color: accent, width: 1.5 },
        flipV: true,
      });

      // Date — above the line
      pptxSlide.addText(item.date, {
        x: cx - itemW / 2 + 0.1, y: lineY - markerR - 0.48,
        w: itemW - 0.2, h: 0.35,
        fontSize: 11,
        bold: true,
        fontFace: font,
        color: accent,
        align: 'center',
        valign: 'middle',
      });

      // Label — below the marker
      pptxSlide.addText(item.label, {
        x: cx - itemW / 2 + 0.1, y: lineY + markerR + 0.1,
        w: itemW - 0.2, h: 0.42,
        fontSize: ty['body']?.size ?? 14,
        bold: true,
        fontFace: font,
        color: hex(co['text-primary'] ?? '1A1A1A'),
        align: 'center',
        valign: 'top',
      });

      // Description — below label
      if (item.description) {
        pptxSlide.addText(item.description, {
          x: cx - itemW / 2 + 0.1, y: lineY + markerR + 0.58,
          w: itemW - 0.2, h: 1.6,
          fontSize: 12,
          fontFace: font,
          color: hex(co['text-secondary'] ?? '4B5563'),
          align: 'center',
          valign: 'top',
          wrap: true,
        });
      }
    });
  },
};
