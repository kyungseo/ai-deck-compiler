import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground, renderBodyWithCodeBlocks } from '../layout.js';

type AppendixSlide = Extract<Slide, { type: 'appendix' }>;

export const appendixTemplate: SlideTemplate<AppendixSlide> = {
  id: 'appendix',
  supportedType: 'appendix',
  variants: ['default'],
  render(slide: AppendixSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, { ...slide, section_label: slide.section_label ?? 'APPENDIX' }, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.body ?? [];
    if (items.length === 0) return;

    renderBodyWithCodeBlocks(pptxSlide, items, tokens, {
      x: SL.cx + CARD.px, y: CARD.iy, w: SL.cw - CARD.px * 2, h: CARD.ih,
    }, {
      fontSize: tokens.typography['body']?.size ?? 14,
      color: hex(co['text-muted'] ?? '6B7280'),
    });
  },
};
