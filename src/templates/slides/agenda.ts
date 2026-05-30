import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type AgendaSlide = Extract<Slide, { type: 'agenda' }>;

export const agendaTemplate: SlideTemplate<AgendaSlide> = {
  id: 'agenda',
  supportedType: 'agenda',
  variants: ['default'],
  render(slide: AgendaSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
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

    const items = slide.items ?? [];
    const itemH = 0.65;
    const startY = SL.cy + 0.1;

    items.forEach((item, i) => {
      const y = startY + i * (itemH + 0.15);

      // Number badge
      pptxSlide.addShape('ellipse', {
        x: SL.cx, y: y, w: 0.55, h: 0.55,
        fill: { color: hex(co['accent'] ?? '2563EB') },
        line: { color: hex(co['accent'] ?? '2563EB'), width: 0 },
      });
      pptxSlide.addText(String(i + 1), {
        x: SL.cx, y: y, w: 0.55, h: 0.55,
        fontSize: ty['label']?.size ?? 12,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
      });

      // Item text
      pptxSlide.addText(item, {
        x: SL.cx + 0.75, y: y, w: SL.cw - 0.75, h: 0.55,
        fontSize: ty['body']?.size ?? 18,
        fontFace: ty['body']?.font ?? 'Pretendard',
        color: hex(co['text-primary'] ?? '#111827'),
        valign: 'middle',
      });
    });
  },
};
