import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type SummarySlide = Extract<Slide, { type: 'summary' }>;

export const summaryTemplate: SlideTemplate<SummarySlide> = {
  id: 'summary',
  supportedType: 'summary',
  variants: ['default'],
  render(slide: SummarySlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const takeaways = slide.takeaways ?? [];
    const bodyItems = slide.body ?? [];
    const hasTakeaways = takeaways.length > 0;

    // When takeaways are present: body on left (60%), takeaway panel on right (38%)
    const innerW = SL.cw - CARD.px * 2;
    const bodyW = hasTakeaways ? innerW * 0.58 : innerW;
    const panelX = SL.cx + CARD.px + bodyW + 0.3;
    const panelW = innerW - bodyW - 0.3 - 0.15;

    if (bodyItems.length > 0) {
      const bullets = bodyItems.map(text => ({
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
        x: SL.cx + CARD.px, y: CARD.iy, w: bodyW, h: CARD.ih, valign: 'top',
      });
    }

    if (hasTakeaways) {
      // Takeaway panel with accent header
      pptxSlide.addShape('roundRect', {
        x: panelX, y: CARD.iy, w: panelW, h: CARD.ih,
        fill: { color: hex(co['card-item-bg'] ?? 'EEF2FF') },
        line: { color: hex(co['card-item-bg'] ?? 'EEF2FF'), width: 0 },
        rectRadius: 0.1,
      });

      // Accent header bar
      pptxSlide.addShape('roundRect', {
        x: panelX, y: CARD.iy, w: panelW, h: 0.5,
        fill: { color: hex(co['accent'] ?? '2563EB') },
        line: { color: hex(co['accent'] ?? '2563EB'), width: 0 },
        rectRadius: 0.1,
      });
      pptxSlide.addText('Key Takeaways', {
        x: panelX, y: CARD.iy, w: panelW, h: 0.5,
        fontSize: ty['label']?.size ?? 12,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
      });

      const itemH = Math.min(0.9, (CARD.ih - 0.65) / takeaways.length);
      const checkSize = 0.24;
      takeaways.forEach((item, i) => {
        const itemY = CARD.iy + 0.6 + i * itemH;
        const checkY = itemY + (itemH - checkSize) / 2;
        pptxSlide.addShape('rect', {
          x: panelX + 0.22, y: checkY, w: checkSize, h: checkSize,
          fill: { color: hex(co['accent'] ?? '4F46E5') },
          line: { color: hex(co['accent'] ?? '4F46E5'), width: 0 },
        });
        pptxSlide.addText('✓', {
          x: panelX + 0.22, y: checkY, w: checkSize, h: checkSize,
          fontSize: 9,
          bold: true,
          fontFace: ty['label']?.font ?? 'Pretendard',
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
        });
        pptxSlide.addText(item, {
          x: panelX + 0.56, y: itemY, w: panelW - 0.72, h: itemH,
          fontSize: ty['body']?.size ? ty['body'].size - 2 : 16,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: hex(co['text-primary'] ?? '111827'),
          valign: 'middle',
          wrap: true,
        });
      });
    }
  },
};
