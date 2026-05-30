import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type KpiSlide = Extract<Slide, { type: 'kpi' }>;

export const kpiTemplate: SlideTemplate<KpiSlide> = {
  id: 'kpi',
  supportedType: 'kpi',
  variants: ['default'],
  render(slide: KpiSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    pptxSlide.addText(slide.title, {
      x: SL.cx, y: SL.ty, w: SL.cw, h: SL.th,
      fontSize: ty['title']?.size ?? 40,
      bold: true,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: hex(co['text-primary'] ?? '#111827'),
      valign: 'middle',
    });

    const kpis = slide.kpis ?? [];
    const count = Math.min(kpis.length, 4);
    if (count === 0) return;

    const cardW = (SL.cw - (count - 1) * 0.3) / count;
    const cardH = 3.6;
    const cardY = SL.cy + (SL.ch - cardH) / 2;

    kpis.slice(0, count).forEach((kpi, i) => {
      const x = SL.cx + i * (cardW + 0.3);

      // Card background
      pptxSlide.addShape('roundRect', {
        x, y: cardY, w: cardW, h: cardH,
        fill: { color: hex(co['surface'] ?? 'F8F9FA') },
        line: { color: hex(co['border'] ?? 'E5E7EB'), width: 1 },
        rectRadius: 0.1,
      });

      // Value
      pptxSlide.addText(kpi.value, {
        x, y: cardY + 0.6, w: cardW, h: 1.4,
        fontSize: ty['kpi-value']?.size ?? 52,
        bold: true,
        fontFace: ty['kpi-value']?.font ?? 'Pretendard',
        color: hex(co['accent'] ?? '2563EB'),
        align: 'center',
        valign: 'middle',
      });

      // Delta
      if (kpi.delta) {
        const deltaColor = kpi.trend === 'up' ? '059669'
          : kpi.trend === 'down' ? 'DC2626'
          : hex(co['text-muted'] ?? '6B7280');
        const arrow = kpi.trend === 'up' ? '▲ ' : kpi.trend === 'down' ? '▼ ' : '';
        pptxSlide.addText(`${arrow}${kpi.delta}`, {
          x, y: cardY + 2.1, w: cardW, h: 0.5,
          fontSize: ty['caption']?.size ?? 14,
          fontFace: ty['caption']?.font ?? 'Pretendard',
          color: deltaColor,
          align: 'center',
          valign: 'middle',
        });
      }

      // Label
      pptxSlide.addText(kpi.label, {
        x, y: cardY + cardH - 0.8, w: cardW, h: 0.6,
        fontSize: ty['kpi-label']?.size ?? 13,
        fontFace: ty['kpi-label']?.font ?? 'Pretendard',
        color: hex(co['text-muted'] ?? '6B7280'),
        align: 'center',
        valign: 'middle',
      });
    });
  },
};
