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
    const accent = hex(co['accent'] ?? '4F46E5');

    // Version badge — top-right corner stamp
    if (slide.doc_version) {
      pptxSlide.addShape('roundRect', {
        x: SL.w - SL.mx - 1.7, y: 0.28, w: 1.6, h: 0.38,
        fill: { color: hex(co['card-item-bg'] ?? 'EEF2FF') },
        line: { color: hex(co['card-item-bg'] ?? 'EEF2FF'), width: 0 },
        rectRadius: 0.06,
      });
      pptxSlide.addText(slide.doc_version, {
        x: SL.w - SL.mx - 1.7, y: 0.28, w: 1.6, h: 0.38,
        fontSize: 12,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: accent,
        align: 'center',
        valign: 'middle',
      });
    }

    // Title — centered, vertically balanced
    pptxSlide.addText(slide.title, {
      x: SL.mx, y: 2.0, w: SL.cw, h: 1.3,
      fontSize: ty['title']?.size ?? 40,
      bold: true,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: hex(co['text-primary'] ?? '1A1A1A'),
      align: 'center',
      valign: 'middle',
    });

    // Accent line — below title
    pptxSlide.addShape('rect', {
      x: SL.w / 2 - 1.5, y: 3.38, w: 3.0, h: 0.05,
      fill: { color: accent },
      line: { color: accent, width: 0 },
    });

    // Subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: SL.mx, y: 3.55, w: SL.cw, h: 0.65,
        fontSize: ty['subtitle']?.size ?? 24,
        fontFace: ty['subtitle']?.font ?? 'Pretendard',
        color: hex(co['text-secondary'] ?? '4B4B5A'),
        align: 'center',
        valign: 'middle',
      });
    }

    // CTA
    if (slide.cta) {
      pptxSlide.addText(slide.cta, {
        x: SL.mx, y: 4.3, w: SL.cw, h: 0.42,
        fontSize: ty['label']?.size ?? 12,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: accent,
        align: 'center',
        valign: 'middle',
      });
    }

    // Author — below CTA, muted
    const author = slide.author ?? tokens.brand.author;
    if (author) {
      pptxSlide.addText(author, {
        x: SL.mx, y: 4.85, w: SL.cw, h: 0.4,
        fontSize: ty['caption']?.size ?? 14,
        fontFace: ty['caption']?.font ?? 'Pretendard',
        color: hex(co['text-muted'] ?? '8A8A9A'),
        align: 'center',
        valign: 'middle',
      });
    }
  },
};
