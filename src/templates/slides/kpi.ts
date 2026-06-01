import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type KpiSlide = Extract<Slide, { type: 'kpi' }>;

export const kpiTemplate: SlideTemplate<KpiSlide> = {
  id: 'kpi',
  supportedType: 'kpi',
  variants: ['default'],
  render(slide: KpiSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accentText = hex(co['accent-text'] ?? co['accent'] ?? '2563EB');

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const kpis = slide.kpis ?? [];
    const count = Math.min(kpis.length, 4);
    if (count === 0) return;

    const gap = 0.3;
    const innerW = SL.cw - CARD.px * 2;
    const cardW = (innerW - (count - 1) * gap) / count;
    const cardH = CARD.ih - 0.15;
    const cardY = CARD.iy + 0.08;

    kpis.slice(0, count).forEach((kpi, i) => {
      const x = SL.cx + CARD.px + i * (cardW + gap);

      pptxSlide.addShape('roundRect', {
        x, y: cardY, w: cardW, h: cardH,
        fill: { color: hex(co['card-item-bg'] ?? 'EEF2FF') },
        line: { color: hex(co['card-item-bg'] ?? 'EEF2FF'), width: 0 },
        rectRadius: 0.1,
      });

      // Accent top bar
      pptxSlide.addShape('rect', {
        x, y: cardY, w: cardW, h: 0.06,
        fill: { color: hex(co['accent'] ?? '2563EB') },
        line: { color: hex(co['accent'] ?? '2563EB'), width: 0 },
      });

      // Value
      pptxSlide.addText(kpi.value, {
        x, y: cardY + 0.55, w: cardW, h: 1.4,
        fontSize: ty['kpi-value']?.size ?? 52,
        bold: true,
        fontFace: ty['kpi-value']?.font ?? 'Pretendard',
        color: accentText,
        align: 'center',
        valign: 'middle',
      });

      // Delta
      if (kpi.delta) {
        const deltaColor = kpi.trend === 'up' ? hex(co['success'] ?? '059669')
          : kpi.trend === 'down' ? hex(co['danger'] ?? 'DC2626')
          : hex(co['text-muted'] ?? '6B7280');
        const arrow = kpi.trend === 'up' ? '▲ ' : kpi.trend === 'down' ? '▼ ' : '';
        pptxSlide.addText(`${arrow}${kpi.delta}`, {
          x, y: cardY + 2.05, w: cardW, h: 0.5,
          fontSize: ty['caption']?.size ?? 14,
          fontFace: ty['caption']?.font ?? 'Pretendard',
          color: deltaColor,
          align: 'center',
          valign: 'middle',
        });
      }

      // Label
      pptxSlide.addText(kpi.label, {
        x, y: cardY + cardH - 0.75, w: cardW, h: 0.6,
        fontSize: ty['kpi-label']?.size ?? 13,
        fontFace: ty['kpi-label']?.font ?? 'Pretendard',
        color: hex(co['text-muted'] ?? '6B7280'),
        align: 'center',
        valign: 'middle',
      });
    });
  },
};
