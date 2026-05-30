import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type ContentSlide = Extract<Slide, { type: 'content' }>;

export const contentTemplate: SlideTemplate<ContentSlide> = {
  id: 'content',
  supportedType: 'content',
  variants: ['default'],
  render(slide: ContentSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
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

    const items = slide.body ?? [];
    if (items.length === 0) return;

    // Bullet list as a single addText with paragraph array
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
      x: SL.cx, y: SL.cy, w: SL.cw, h: SL.ch,
      valign: 'top',
    });
  },
};
