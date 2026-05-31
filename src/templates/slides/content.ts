import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type ContentSlide = Extract<Slide, { type: 'content' }>;

export const contentTemplate: SlideTemplate<ContentSlide> = {
  id: 'content',
  supportedType: 'content',
  variants: ['default'],
  render(slide: ContentSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.body ?? [];
    if (items.length === 0) return;

    const bullets = items.map(text => ({
      text,
      options: {
        fontSize: ty['body']?.size ?? 18,
        fontFace: ty['body']?.font ?? 'Pretendard',
        color: hex(co['text-secondary'] ?? '374151'),
        bullet: { code: '2022', indent: 15 },
        paraSpaceAfter: 8,
      },
    }));

    pptxSlide.addText(bullets, {
      x: SL.cx, y: CARD.iy, w: SL.cw, h: CARD.ih,
      valign: 'top',
    });
  },
};
