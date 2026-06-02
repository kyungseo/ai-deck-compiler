import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type ClosingSlide = Extract<Slide, { type: 'closing' }>;

function estimateClosingTitleUnits(title: string): number {
  return Array.from(title).reduce((sum, ch) => {
    if (ch === ' ') return sum + 0.35;
    return sum + (/[\x00-\x7F]/.test(ch) ? 0.55 : 1);
  }, 0);
}

function resolveClosingTitleMetrics(title: string, baseFontSize: number): { fontSize: number; height: number } {
  const units = estimateClosingTitleUnits(title);
  if (units > 26) return { fontSize: Math.min(baseFontSize, 38), height: 1.7 };
  if (units > 18) return { fontSize: Math.min(baseFontSize, 44), height: 1.55 };
  return { fontSize: baseFontSize, height: 1.4 };
}

export const closingTemplate: SlideTemplate<ClosingSlide> = {
  id: 'closing',
  supportedType: 'closing',
  variants: ['default'],
  render(slide: ClosingSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accent = hex(co['accent'] ?? '4F46E5');
    const font = ty['title']?.font ?? 'Pretendard';

    // Full-slide accent background
    pptxSlide.addShape('rect', {
      x: 0, y: 0, w: SL.w, h: SL.h,
      fill: { color: accent },
      line: { color: accent, width: 0 },
    });

    // Optional message — small label above title
    if (slide.message) {
      pptxSlide.addText(slide.message, {
        x: SL.mx, y: 2.4, w: SL.cw, h: 0.45,
        fontSize: 16,
        fontFace: font,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        transparency: 20,
      });
    }

    // Title — large, centered
    const titleY = slide.message ? 2.9 : 2.7;
    const titleMetrics = resolveClosingTitleMetrics(slide.title, (ty['title']?.size ?? 40) + 16);
    pptxSlide.addText(slide.title, {
      x: SL.mx, y: titleY, w: SL.cw, h: titleMetrics.height,
      fontSize: titleMetrics.fontSize,
      bold: true,
      fontFace: font,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle',
    });

    // Accent divider line — title-length dynamic width, positioned close to title bottom.
    const lineY = titleY + titleMetrics.height + 0.12;
    const lineW = Math.min(Math.max(2.0, slide.title.length * 0.36), SL.cw * 0.88);
    pptxSlide.addShape('rect', {
      x: SL.w / 2 - lineW / 2, y: lineY, w: lineW, h: 0.05,
      fill: { color: 'FFFFFF' },
      line: { color: 'FFFFFF', width: 0 },
      transparency: 40,
    });

    // Subtitle — contact or closing note
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: SL.mx, y: lineY + 0.28, w: SL.cw, h: 0.5,
        fontSize: 18,
        fontFace: font,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        transparency: 20,
      });
    }
  },
};
