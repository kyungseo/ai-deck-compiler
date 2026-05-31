import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type TableSlide = Extract<Slide, { type: 'table' }>;

export const tableTemplate: SlideTemplate<TableSlide> = {
  id: 'table',
  supportedType: 'table',
  variants: ['default'],
  render(slide: TableSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const headers = slide.headers ?? [];
    const rows = slide.rows ?? [];
    if (headers.length === 0 && rows.length === 0) return;

    const headerRow = headers.map(h => ({
      text: h,
      options: {
        fontSize: ty['table-header']?.size ?? 14,
        bold: true,
        fontFace: ty['table-header']?.font ?? 'Pretendard',
        color: 'FFFFFF',
        fill: { color: hex(co['accent'] ?? '2563EB') },
        align: 'center',
        valign: 'middle',
      },
    }));

    const dataRows = rows.map((row, ri) =>
      row.map(cell => ({
        text: cell,
        options: {
          fontSize: ty['table-cell']?.size ?? 13,
          fontFace: ty['table-cell']?.font ?? 'Pretendard',
          color: hex(co['text-secondary'] ?? '374151'),
          fill: { color: ri % 2 === 0 ? hex(co['card-item-bg'] ?? 'EEF4FE') : hex(co['card-bg'] ?? 'FFFFFF') },
          align: 'center',
          valign: 'middle',
        },
      }))
    );

    const tableRows = headers.length > 0 ? [headerRow, ...dataRows] : dataRows;

    pptxSlide.addTable(tableRows, {
      x: SL.cx, y: CARD.iy, w: SL.cw,
      rowH: 0.45,
      border: { pt: 0.5, color: hex(co['divider-light'] ?? 'E0E7FF') },
    });
  },
};
