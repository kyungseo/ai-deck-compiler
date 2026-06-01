import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type AppendixSlide = Extract<Slide, { type: 'appendix' }>;

export const appendixTemplate: SlideTemplate<AppendixSlide> = {
  id: 'appendix',
  supportedType: 'appendix',
  variants: ['default'],
  render(slide: AppendixSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, { ...slide, section_label: slide.section_label ?? 'APPENDIX' }, tokens);
    renderCardBackground(pptxSlide, tokens);

    const items = slide.body ?? [];
    if (items.length === 0) return;

    const isCodeItem = (t: string) => t.startsWith('`') && t.endsWith('`') && t.length > 2;

    // Split: leading contiguous code block + remaining body items.
    const firstNonCode = items.findIndex(t => !isCodeItem(t));
    const codeItems = firstNonCode === -1 ? items : items.slice(0, firstNonCode);
    const bodyItems = firstNonCode === -1 ? []    : items.slice(firstNonCode);

    // No code items — render body normally.
    if (codeItems.length === 0) {
      pptxSlide.addText(bodyItems.map(text => ({
        text,
        options: {
          fontSize: ty['body']?.size ?? 14,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: hex(co['text-muted'] ?? '6B7280'),
          bullet: { code: '2022', indent: 15 },
          paraSpaceAfter: 8,
        },
      })), { x: SL.cx, y: CARD.iy, w: SL.cw, h: CARD.ih, valign: 'top' });
      return;
    }

    // Estimate code block height for box drawing.
    // 12pt Courier New with bullet indent: ~95 chars/line.
    // 0.32" per line accounts for PowerPoint's larger line spacing vs LibreOffice.
    const CHARS_PER_LINE = 95;
    const CODE_LINE_H   = 0.20;
    const CODE_PARA_H   = 0.10;
    const BOX_PAD       = 0.15;
    const BOX_GAP       = 0.22;
    const BOX_X = SL.cx + 0.15;
    const BOX_W = SL.cw - 0.30;

    const codeBlockH = codeItems.reduce((sum, t) => {
      const lines = Math.max(1, Math.ceil(t.slice(1, -1).length / CHARS_PER_LINE));
      return sum + lines * CODE_LINE_H + CODE_PARA_H;
    }, 0);
    const boxH = codeBlockH + BOX_PAD * 2;

    // 1. Code block background box.
    pptxSlide.addShape('roundRect', {
      x: BOX_X, y: CARD.iy - BOX_PAD, w: BOX_W, h: boxH,
      fill: { color: hex(co['card-item-bg'] ?? '1E2124') },
      line: { color: hex(co['border'] ?? '3A3F44'), width: 0.75 },
      rectRadius: 0.06,
    });

    // 2. Code items in their own text box — x/w match the box boundary.
    pptxSlide.addText(codeItems.map(text => ({
      text: text.slice(1, -1),
      options: {
        fontSize: 12,
        fontFace: 'Courier New',
        color: hex(co['accent-text'] ?? co['accent'] ?? '2563EB'),
        bullet: { code: '276F', indent: 15 },
        paraSpaceAfter: 6,
        paraSpaceBefore: 2,
      },
    })), { x: BOX_X, y: CARD.iy, w: BOX_W, h: codeBlockH + BOX_PAD, valign: 'top' });

    // 3. Body items anchored below box — position is independent of code rendering height.
    if (bodyItems.length > 0) {
      const bodyY = CARD.iy + boxH + BOX_GAP;
      pptxSlide.addText(bodyItems.map(text => ({
        text,
        options: {
          fontSize: ty['body']?.size ?? 14,
          fontFace: ty['body']?.font ?? 'Pretendard',
          color: hex(co['text-muted'] ?? '6B7280'),
          bullet: { code: '2022', indent: 15 },
          paraSpaceAfter: 8,
        },
      })), { x: SL.cx, y: bodyY, w: SL.cw, h: CARD.ih - (bodyY - CARD.iy), valign: 'top' });
    }
  },
};
