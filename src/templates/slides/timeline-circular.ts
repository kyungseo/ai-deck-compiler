import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type TimelineSlide = Extract<Slide, { type: 'timeline' }>;

export const timelineCircularTemplate: SlideTemplate<TimelineSlide> = {
  id: 'timeline:circular',
  supportedType: 'timeline',
  variants: ['circular'],
  render(slide: TimelineSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accent = hex(co['accent'] ?? '4F46E5');
    const font   = ty['body']?.font ?? 'Pretendard';

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.items ?? [];
    if (items.length === 0) return;

    const n        = items.length;
    const contentX = SL.mx + CARD.px;
    const contentW = SL.cw - CARD.px * 2;   // 11.5"
    const slotW    = contentW / n;

    // Oval dims: shrink proportionally so gaps stay visible at high n
    const ovalW = Math.min(2.6, slotW * 0.80);
    const ovalH = Math.min(2.2, ovalW * 0.80);

    // Whether any item carries a date — reserve space above ovals if so
    const hasDates = items.some(it => !!it.date);
    const dateH    = hasDates ? 0.40 : 0;
    const totalH   = ovalH + dateH;
    // Position block at 30% from card content top (visually upper-center)
    const ovalY    = CARD.iy + (CARD.ih - totalH) * 0.30 + dateH;

    items.forEach((item, i) => {
      const ovalX = contentX + slotW * i + (slotW - ovalW) / 2;
      const cy    = ovalY + ovalH / 2;

      // Optional date above oval
      if (item.date) {
        pptxSlide.addText(item.date, {
          x: ovalX, y: ovalY - dateH,
          w: ovalW, h: dateH - 0.05,
          fontSize: 11, bold: true,
          fontFace: font,
          color: accent,
          align: 'center', valign: 'bottom',
        });
      }

      // Oval
      pptxSlide.addShape('ellipse', {
        x: ovalX, y: ovalY, w: ovalW, h: ovalH,
        fill: { type: 'none' },
        line: { color: accent, width: 3 },
      });

      // Label — upper half of oval
      pptxSlide.addText(item.label, {
        x: ovalX + 0.1, y: ovalY + ovalH * 0.08,
        w: ovalW - 0.2, h: ovalH * 0.44,
        fontSize: ty['label']?.size ?? 13,
        bold: true,
        fontFace: font,
        color: hex(co['text-primary'] ?? '111827'),
        align: 'center', valign: 'middle',
      });

      // Description — lower half of oval
      if (item.description) {
        pptxSlide.addText(item.description, {
          x: ovalX + 0.12, y: ovalY + ovalH * 0.52,
          w: ovalW - 0.24, h: ovalH * 0.42,
          fontSize: 10,
          fontFace: font,
          color: hex(co['text-secondary'] ?? '6B7280'),
          align: 'center', valign: 'top',
          wrap: true,
        });
      }

      // Curved connector to next oval
      if (i < n - 1) {
        const nextOvalX = contentX + slotW * (i + 1) + (slotW - ovalW) / 2;
        const gapX = ovalX + ovalW;
        const gapW = nextOvalX - gapX;
        const archH = Math.max(0.22, ovalH * 0.18);
        pptxSlide.addShape('curvedConnector3', {
          x: gapX, y: cy - archH,
          w: gapW, h: archH,
          flipV: true,
          line: { color: accent, width: 2, endArrowType: 'arrow' },
        });
      }
    });
  },
};
