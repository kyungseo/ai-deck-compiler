import pptxgen from 'pptxgenjs';
import type { Blueprint } from '../schema/blueprint.js';
import type { ResolvedDesignTokens } from './types.js';
import type { PptxSlide } from '../templates/registry.js';
import { defaultRegistry } from '../templates/index.js';
import type { TemplateRegistry } from '../templates/registry.js';
import { hex } from '../templates/layout.js';

export interface CompilerOptions {
  blueprint: Blueprint;
  tokens: ResolvedDesignTokens;
  registry?: TemplateRegistry;
}

export async function compile(opts: CompilerOptions): Promise<pptxgen> {
  const { blueprint, tokens, registry = defaultRegistry } = opts;

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  for (const slide of blueprint.slides) {
    const pptxSlide = pptx.addSlide();
    pptxSlide.background = { fill: hex(tokens.colors['background'] ?? 'FFFFFF') };

    const s = pptxSlide as unknown as PptxSlide;

    if (slide.notes) s.addNotes(slide.notes);

    if (!registry.has(slide.type, slide.variant)) {
      // P2 or unregistered type — render title-only placeholder
      s.addText(slide.title, {
        x: 0.67, y: 0.4, w: 12.0, h: 0.85,
        fontSize: tokens.typography['title']?.size ?? 40,
        bold: true,
        fontFace: tokens.typography['title']?.font ?? 'Pretendard',
        color: hex(tokens.colors['text-primary'] ?? '111827'),
        valign: 'middle',
      });
      s.addText(`[${slide.type}] — not yet implemented (Post-MVP)`, {
        x: 0.67, y: 1.35, w: 12.0, h: 0.6,
        fontSize: tokens.typography['caption']?.size ?? 14,
        fontFace: tokens.typography['caption']?.font ?? 'Pretendard',
        color: hex(tokens.colors['text-muted'] ?? '6B7280'),
        valign: 'middle',
      });
      continue;
    }

    const template = registry.resolve(slide.type, slide.variant);
    template.render(slide, tokens, s);

    renderFooter(s, tokens, blueprint.slides.indexOf(slide), blueprint.slides.length);
  }

  return pptx;
}

function renderFooter(
  s: PptxSlide,
  tokens: ResolvedDesignTokens,
  index: number,
  total: number,
): void {
  const { brand } = tokens;
  if (!brand.show) return;

  const footerY = 7.15;
  const footerH = 0.3;
  const muted = hex(tokens.colors['text-muted'] ?? '6B7280');
  const font = tokens.typography['caption']?.font ?? 'Pretendard';
  const isHero = index === 0;

  // Brand name — footer right
  s.addText(brand.name, {
    x: 10.83, y: footerY, w: 2.5, h: footerH,
    fontSize: brand.fontSize,
    fontFace: font,
    color: muted,
    align: 'right',
    valign: 'middle',
  });

  // Page number — footer left (skip hero/cover slide)
  if (brand.showPageNumbers && !isHero) {
    s.addText(`${index + 1} / ${total}`, {
      x: 0.67, y: footerY, w: 1.0, h: footerH,
      fontSize: brand.fontSize,
      fontFace: font,
      color: muted,
      align: 'left',
      valign: 'middle',
    });
  }
}
