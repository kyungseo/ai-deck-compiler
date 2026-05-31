import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type DecisionSlide = Extract<Slide, { type: 'decision' }>;

export const decisionTemplate: SlideTemplate<DecisionSlide> = {
  id: 'decision',
  supportedType: 'decision',
  variants: ['default'],
  render(slide: DecisionSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;
    const accent = hex(co['accent'] ?? '4F46E5');
    const font = ty['body']?.font ?? 'Pretendard';

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const options = slide.options ?? [];
    const hasRec = !!slide.recommendation;
    const recH = hasRec ? 0.55 : 0;
    const cardH = CARD.ih - recH - (hasRec ? 0.2 : 0);

    if (options.length === 0) return;

    const n = Math.min(options.length, 3);
    const gap = 0.2;
    const cardW = (SL.cw - gap * (n - 1)) / n;

    options.slice(0, n).forEach((opt, i) => {
      const cx = SL.cx + i * (cardW + gap);
      const cy = CARD.iy;

      // Option card background
      pptxSlide.addShape('roundRect', {
        x: cx, y: cy, w: cardW, h: cardH,
        fill: { color: hex(co['card-item-bg'] ?? 'EEF2FF') },
        line: { color: hex(co['card-item-bg'] ?? 'EEF2FF'), width: 0 },
        rectRadius: 0.1,
      });

      // Option label header bar
      pptxSlide.addShape('roundRect', {
        x: cx, y: cy, w: cardW, h: 0.50,
        fill: { color: accent },
        line: { color: accent, width: 0 },
        rectRadius: 0.1,
      });
      pptxSlide.addText(opt.label, {
        x: cx, y: cy, w: cardW, h: 0.50,
        fontSize: 14,
        bold: true,
        fontFace: font,
        color: 'FFFFFF',
        align: 'center', valign: 'middle',
      });

      let rowY = cy + 0.62;
      const rowH = 0.32;
      const prosColor = hex(co['success'] ?? '059669');
      const consColor = hex(co['text-muted'] ?? '9CA3AF');
      const bodySize = 13;

      // Pros
      (opt.pros ?? []).forEach(pro => {
        pptxSlide.addText('✓  ' + pro, {
          x: cx + 0.18, y: rowY, w: cardW - 0.3, h: rowH,
          fontSize: bodySize,
          fontFace: font,
          color: prosColor,
          valign: 'middle',
          wrap: true,
        });
        rowY += rowH + 0.05;
      });

      // Divider between pros and cons
      if ((opt.pros ?? []).length > 0 && (opt.cons ?? []).length > 0) {
        pptxSlide.addShape('line', {
          x: cx + 0.18, y: rowY, w: cardW - 0.36, h: 0,
          line: { color: hex(co['divider-light'] ?? 'E5E7EB'), width: 1 },
        });
        rowY += 0.15;
      }

      // Cons
      (opt.cons ?? []).forEach(con => {
        pptxSlide.addText('✗  ' + con, {
          x: cx + 0.18, y: rowY, w: cardW - 0.3, h: rowH,
          fontSize: bodySize,
          fontFace: font,
          color: consColor,
          valign: 'middle',
          wrap: true,
        });
        rowY += rowH + 0.05;
      });
    });

    // Recommendation banner
    if (slide.recommendation) {
      const recY = CARD.iy + cardH + 0.2;
      pptxSlide.addShape('roundRect', {
        x: SL.cx, y: recY, w: SL.cw, h: recH,
        fill: { color: accent },
        line: { color: accent, width: 0 },
        rectRadius: 0.08,
      });
      pptxSlide.addText('► ' + slide.recommendation, {
        x: SL.cx + 0.3, y: recY, w: SL.cw - 0.6, h: recH,
        fontSize: 14,
        bold: true,
        fontFace: font,
        color: 'FFFFFF',
        valign: 'middle',
      });
    }
  },
};
