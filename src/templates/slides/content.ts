import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { Slide } from '../../schema/blueprint.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import { SL, CARD, renderSectionHeader, renderCardBackground, renderCalloutBar, renderBodyWithCodeBlocks } from '../layout.js';

type ContentSlide = Extract<Slide, { type: 'content' }>;

export const contentTemplate: SlideTemplate<ContentSlide> = {
  id: 'content',
  supportedType: 'content',
  variants: ['default'],
  render(slide: ContentSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);
    if (slide.callout) renderCalloutBar(pptxSlide, slide.callout, tokens);

    const items = slide.body ?? [];
    if (items.length === 0) return;

    renderBodyWithCodeBlocks(pptxSlide, items, tokens, {
      x: SL.cx + CARD.px, y: CARD.iy, w: SL.cw - CARD.px * 2, h: CARD.ih,
    }, { fontSize: tokens.typography['body']?.size ?? 18 });
  },
};
