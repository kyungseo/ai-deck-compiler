import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground, renderPanelLabel } from '../layout.js';

type TwoColumnSlide = Extract<Slide, { type: 'two-column' }>;

const colW = SL.cw / 2 - 0.15;

export const twoColumnTemplate: SlideTemplate<TwoColumnSlide> = {
  id: 'two-column',
  supportedType: 'two-column',
  variants: ['default'],
  render(slide: TwoColumnSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const dividerX = SL.cx + colW + 0.15;
    const hasLabels = !!(slide.left.label || slide.right.label);
    const contentY = hasLabels ? CARD.iy + 0.55 : CARD.iy;
    const contentH = CARD.ih - (hasLabels ? 0.55 : 0);

    // Panel labels
    if (slide.left.label) {
      renderPanelLabel(pptxSlide, slide.left.label, SL.cx, tokens);
    }
    if (slide.right.label) {
      renderPanelLabel(pptxSlide, slide.right.label, dividerX + 0.15, tokens);
    }

    // Divider — very subtle
    pptxSlide.addShape('rect', {
      x: dividerX, y: CARD.iy, w: 0.01, h: CARD.ih,
      fill: { color: hex(co['divider-light'] ?? 'E8F0FE') },
      line: { color: hex(co['divider-light'] ?? 'E8F0FE'), width: 0 },
    });

    const renderCol = (items: string[], x: number) => {
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
        x, y: contentY, w: colW, h: contentH, valign: 'top',
      });
    };

    renderCol(slide.left.body, SL.cx);
    renderCol(slide.right.body, dividerX + 0.3);
  },
};
