import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type ComparisonSlide = Extract<Slide, { type: 'comparison' }>;

export const comparisonTemplate: SlideTemplate<ComparisonSlide> = {
  id: 'comparison',
  supportedType: 'comparison',
  variants: ['default'],
  render(slide: ComparisonSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accent = hex(co['accent'] ?? '2563EB');
    const muted = hex(co['text-muted'] ?? '6B7280');
    const onAccent = hex(co['text-on-accent'] ?? 'FFFFFF');

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const innerW = SL.cw - CARD.px * 2;
    const colW = innerW / 2 - 0.15;
    const leftX = SL.cx + CARD.px;
    const dividerX = leftX + colW + 0.15;

    // Vertical divider
    pptxSlide.addShape('rect', {
      x: dividerX, y: CARD.iy, w: 0.01, h: CARD.ih,
      fill: { color: hex(co['divider-light'] ?? 'E8F0FE') },
      line: { color: hex(co['divider-light'] ?? 'E8F0FE'), width: 0 },
    });

    const renderPanel = (
      panel: { label?: string; body: string[] } | undefined,
      x: number,
      isLeft: boolean,
    ) => {
      if (!panel) return;

      const labelColor = isLeft ? muted : accent;
      const labelDefault = isLeft ? 'BEFORE' : 'AFTER';
      const label = panel.label ?? labelDefault;

      // Panel label header bar — filled with accent/muted so header is visually distinct from items
      pptxSlide.addShape('rect', {
        x, y: CARD.iy, w: colW, h: 0.48,
        fill: { color: labelColor },
        line: { color: labelColor, width: 0 },
      });

      // Panel label accent bar (on-accent contrast color)
      pptxSlide.addShape('rect', {
        x: x + 0.15, y: CARD.iy + 0.09, w: 0.08, h: 0.30,
        fill: { color: onAccent },
        line: { color: onAccent, width: 0 },
      });
      pptxSlide.addText(label.toUpperCase(), {
        x: x + 0.33, y: CARD.iy, w: colW - 0.35, h: 0.48,
        fontSize: 18,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: onAccent,
        valign: 'middle',
      });

      // Items
      const itemStartY = CARD.iy + 0.60;
      const itemH = 0.72;
      panel.body.forEach((item, i) => {
        const itemY = itemStartY + i * itemH;
        if (itemY + itemH > CARD.iy + CARD.ih) return;

        // Row background (alternating)
        if (i % 2 === 0) {
          pptxSlide.addShape('rect', {
            x, y: itemY, w: colW, h: itemH,
            fill: { color: isLeft ? hex(co['surface'] ?? 'F0F4F8') : hex(co['card-item-bg'] ?? 'EEF4FE') },
            line: { color: hex(co['divider-light'] ?? 'E8F0FE'), width: 0 },
          });
        }

        // Check/cross badge
        const badge = isLeft ? '×' : '✓';
        const badgeColor = isLeft ? muted : accent;
        pptxSlide.addShape('rect', {
          x: x + 0.15, y: itemY + 0.14, w: 0.32, h: 0.32,
          fill: { color: badgeColor },
          line: { color: badgeColor, width: 0 },
        });
        pptxSlide.addText(badge, {
          x: x + 0.15, y: itemY + 0.14, w: 0.32, h: 0.32,
          fontSize: 11,
          bold: true,
          fontFace: ty['label']?.font ?? 'Pretendard',
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
        });

        // Item text
        pptxSlide.addText(item, {
          x: x + 0.6, y: itemY, w: colW - 0.75, h: itemH,
          fontSize: ty['body']?.size ?? 18,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: isLeft ? muted : hex(co['text-primary'] ?? '111827'),
          valign: 'middle',
          wrap: true,
        });
      });
    };

    renderPanel(slide.left, leftX, true);
    renderPanel(slide.right, dividerX + 0.15, false);
  },
};
