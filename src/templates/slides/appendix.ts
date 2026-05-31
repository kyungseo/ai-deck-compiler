import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type AppendixSlide = Extract<Slide, { type: 'appendix' }>;

export const appendixTemplate: SlideTemplate<AppendixSlide> = {
  id: 'appendix',
  supportedType: 'appendix',
  variants: ['default'],
  render(slide: AppendixSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, { ...slide, section_label: slide.section_label ?? 'APPENDIX' }, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.body ?? [];
    if (items.length === 0) return;

    const bullets = items.map(text => ({
      text,
      options: {
        fontSize: ty['body']?.size ?? 14,
        fontFace: ty['body']?.font ?? 'Pretendard',
        color: hex(co['text-muted'] ?? '6B7280'),
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
