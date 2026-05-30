import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type AgendaSlide = Extract<Slide, { type: 'agenda' }>;

export const agendaTemplate: SlideTemplate<AgendaSlide> = {
  id: 'agenda',
  supportedType: 'agenda',
  variants: ['default'],
  render(slide: AgendaSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.items ?? [];
    const count = Math.min(items.length, 6);
    if (count === 0) return;

    // Grid: 1-3 items → single row; 4-6 items → 2 rows
    const cols = count <= 3 ? count : Math.ceil(count / 2);
    const rows = count <= 3 ? 1 : 2;
    const gap = 0.28;
    const innerPad = 0.3; // left/right padding inside the white card

    const availW = SL.cw - innerPad * 2;
    const cardW = (availW - (cols - 1) * gap) / cols;
    const cardH = (CARD.ih - (rows - 1) * gap) / rows;

    items.slice(0, count).forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = SL.cx + innerPad + col * (cardW + gap);
      const y = CARD.iy + row * (cardH + gap);

      // Card background
      pptxSlide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: hex(co['card-item-bg'] ?? 'EEF2FF') },
        line: { color: hex(co['card-item-bg'] ?? 'EEF2FF'), width: 0 },
        rectRadius: 0.1,
      });

      // Number badge
      const numStr = String(i + 1).padStart(2, '0');
      pptxSlide.addText(numStr, {
        x: x + 0.2, y: y + 0.22, w: 1.2, h: 0.38,
        fontSize: 13,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: hex(co['accent'] ?? '2563EB'),
        valign: 'middle',
      });

      // Accent underline below number
      pptxSlide.addShape('rect', {
        x: x + 0.2, y: y + 0.64, w: 0.4, h: 0.04,
        fill: { color: hex(co['accent'] ?? '2563EB') },
        line: { color: hex(co['accent'] ?? '2563EB'), width: 0 },
      });

      // Item text
      const textY = rows === 1 ? y + 0.85 : y + 0.78;
      const textH = cardH - textY + y - 0.2;
      pptxSlide.addText(item, {
        x: x + 0.2, y: textY, w: cardW - 0.4, h: textH,
        fontSize: ty['body']?.size ?? 18,
        fontFace: ty['body']?.font ?? 'Pretendard',
        color: hex(co['text-primary'] ?? '111827'),
        valign: 'top',
        wrap: true,
      });
    });
  },
};
