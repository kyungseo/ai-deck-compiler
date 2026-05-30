import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type TwoColumnSlide = Extract<Slide, { type: 'two-column' }>;

const colW = SL.cw / 2 - 0.15;

export const twoColumnTemplate: SlideTemplate<TwoColumnSlide> = {
  id: 'two-column',
  supportedType: 'two-column',
  variants: ['default'],
  render(slide: TwoColumnSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    pptxSlide.addText(slide.title, {
      x: SL.cx, y: SL.ty, w: SL.cw, h: SL.th,
      fontSize: ty['title']?.size ?? 40,
      bold: true,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: hex(co['text-primary'] ?? '#111827'),
      valign: 'middle',
    });

    // Divider
    pptxSlide.addShape('rect', {
      x: SL.cx + colW + 0.15, y: SL.cy, w: 0.01, h: SL.ch,
      fill: { color: hex(co['border'] ?? 'E5E7EB') },
      line: { color: hex(co['border'] ?? 'E5E7EB'), width: 0 },
    });

    const renderCol = (items: string[], x: number) => {
      if (items.length === 0) return;
      const bullets = items.map(text => ({
        text,
        options: {
          fontSize: ty['body']?.size ?? 18,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: hex(co['text-secondary'] ?? '#374151'),
          bullet: { code: '2022', indent: 15 },
          paraSpaceAfter: 6,
        },
      }));
      pptxSlide.addText(bullets, {
        x, y: SL.cy, w: colW, h: SL.ch, valign: 'top',
      });
    };

    renderCol(slide.left.body, SL.cx);
    renderCol(slide.right.body, SL.cx + colW + 0.3);
  },
};
