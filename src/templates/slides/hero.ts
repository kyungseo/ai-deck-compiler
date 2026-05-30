import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type HeroSlide = Extract<Slide, { type: 'hero' }>;

export const heroTemplate: SlideTemplate<HeroSlide> = {
  id: 'hero',
  supportedType: 'hero',
  variants: ['default'],
  render(slide: HeroSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    // Title — centered, large
    pptxSlide.addText(slide.title, {
      x: SL.mx, y: 2.2, w: SL.cw, h: 1.4,
      fontSize: ty['title']?.size ?? 40,
      bold: true,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: hex(co['text-primary'] ?? '#111827'),
      align: 'center',
      valign: 'middle',
    });

    // Subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: SL.mx, y: 3.7, w: SL.cw, h: 0.8,
        fontSize: ty['subtitle']?.size ?? 24,
        fontFace: ty['subtitle']?.font ?? 'Pretendard',
        color: hex(co['text-secondary'] ?? '#374151'),
        align: 'center',
        valign: 'middle',
      });
    }

    // CTA
    if (slide.cta) {
      pptxSlide.addText(slide.cta, {
        x: SL.mx, y: 4.65, w: SL.cw, h: 0.5,
        fontSize: ty['label']?.size ?? 12,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: hex(co['accent'] ?? '#2563EB'),
        align: 'center',
        valign: 'middle',
      });
    }

    // Accent line
    pptxSlide.addShape('rect', {
      x: SL.w / 2 - 1.5, y: 2.05, w: 3.0, h: 0.05,
      fill: { color: hex(co['accent'] ?? '2563EB') },
      line: { color: hex(co['accent'] ?? '2563EB'), width: 0 },
    });
  },
};
