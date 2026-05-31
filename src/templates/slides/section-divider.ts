import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type SectionDividerSlide = Extract<Slide, { type: 'section-divider' }>;

export const sectionDividerTemplate: SlideTemplate<SectionDividerSlide> = {
  id: 'section-divider',
  supportedType: 'section-divider',
  variants: ['default'],
  render(slide: SectionDividerSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accent = hex(co['accent'] ?? '2563EB');

    // Left accent column (full height)
    pptxSlide.addShape('rect', {
      x: 0, y: 0, w: 3.5, h: SL.h,
      fill: { color: accent },
      line: { color: accent, width: 0 },
    });

    // Section number (large, muted, inside accent column)
    if (slide.number) {
      pptxSlide.addText(slide.number, {
        x: 0, y: SL.h - 1.8, w: 3.5, h: 1.5,
        fontSize: 96,
        bold: true,
        fontFace: ty['title']?.font ?? 'Pretendard',
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        transparency: 25,
      });
    }

    // Section label (e.g., "SECTION 01") above title
    if (slide.section) {
      pptxSlide.addText(slide.section.toUpperCase(), {
        x: 4.0, y: 2.4, w: 8.6, h: 0.4,
        fontSize: 12,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: accent,
        valign: 'middle',
      });
    }

    // Accent divider line
    pptxSlide.addShape('rect', {
      x: 4.0, y: 2.85, w: 1.5, h: 0.05,
      fill: { color: accent },
      line: { color: accent, width: 0 },
    });

    // Title
    pptxSlide.addText(slide.title, {
      x: 4.0, y: 2.95, w: 8.6, h: 1.6,
      fontSize: (ty['title']?.size ?? 40) + 4,
      bold: ty['title']?.bold ?? true,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: hex(co['text-primary'] ?? '1A1A1A'),
      valign: 'middle',
    });

    // Subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: 4.0, y: 4.65, w: 8.6, h: 0.55,
        fontSize: 18,
        fontFace: ty['title']?.font ?? 'Pretendard',
        color: hex(co['text-secondary'] ?? '4B4B5A'),
        valign: 'middle',
      });
    }
  },
};
