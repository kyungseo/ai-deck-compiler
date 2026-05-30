import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, hex } from '../layout.js';

type SummarySlide = Extract<Slide, { type: 'summary' }>;

export const summaryTemplate: SlideTemplate<SummarySlide> = {
  id: 'summary',
  supportedType: 'summary',
  variants: ['default'],
  render(slide: SummarySlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
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

    const hasTakeaways = (slide.takeaways ?? []).length > 0;
    const bodyW = hasTakeaways ? SL.cw * 0.55 : SL.cw;
    const takeawayX = SL.cx + bodyW + 0.3;
    const takeawayW = SL.cw - bodyW - 0.3;

    // Body
    const bodyItems = slide.body ?? [];
    if (bodyItems.length > 0) {
      const bullets = bodyItems.map(text => ({
        text,
        options: {
          fontSize: ty['body']?.size ?? 18,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: hex(co['text-secondary'] ?? '#374151'),
          bullet: { code: '2022', indent: 15 },
          paraSpaceAfter: 6,
        },
      }));
      pptxSlide.addText(bullets, {
        x: SL.cx, y: SL.cy, w: bodyW, h: SL.ch, valign: 'top',
      });
    }

    // Takeaways panel
    if (hasTakeaways) {
      pptxSlide.addShape('roundRect', {
        x: takeawayX, y: SL.cy, w: takeawayW, h: SL.ch,
        fill: { color: hex(co['surface'] ?? 'F8F9FA') },
        line: { color: hex(co['border'] ?? 'E5E7EB'), width: 1 },
        rectRadius: 0.1,
      });
      pptxSlide.addText('Key Takeaways', {
        x: takeawayX, y: SL.cy + 0.2, w: takeawayW, h: 0.45,
        fontSize: ty['label']?.size ?? 12,
        bold: true,
        fontFace: ty['label']?.font ?? 'Pretendard',
        color: hex(co['accent'] ?? '2563EB'),
        align: 'center',
      });

      slide.takeaways!.forEach((item, i) => {
        pptxSlide.addText(`${i + 1}. ${item}`, {
          x: takeawayX + 0.2,
          y: SL.cy + 0.75 + i * 0.75,
          w: takeawayW - 0.4,
          h: 0.65,
          fontSize: ty['body']?.size ?? 18,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: hex(co['text-secondary'] ?? '374151'),
          valign: 'top',
        });
      });
    }
  },
};
