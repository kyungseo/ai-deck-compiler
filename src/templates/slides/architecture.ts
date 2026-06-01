import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, zoneCenter, renderSectionHeader, renderCardBackground } from '../layout.js';

type ArchitectureSlide = Extract<Slide, { type: 'architecture' }>;

const NODE_W = 1.8;
const NODE_H = 0.65;

export const architectureTemplate: SlideTemplate<ArchitectureSlide> = {
  id: 'architecture',
  supportedType: 'architecture',
  variants: ['default'],
  render(slide: ArchitectureSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    if (slide.diagram.source === 'file') {
      pptxSlide.addText('[Diagram from file — inline source required for rendering]', {
        x: SL.cx + CARD.px, y: CARD.iy, w: SL.cw - CARD.px * 2, h: CARD.ih,
        fontSize: ty['caption']?.size ?? 14,
        color: hex(co['text-muted'] ?? '6B7280'),
        align: 'center', valign: 'middle',
      });
      return;
    }

    const { nodes, edges, groups } = slide.diagram;

    // Compute node center positions (zone system uses SL.cy/SL.ch — zones land inside card)
    const nodePos = new Map<string, { cx: number; cy: number }>();
    for (const node of nodes) {
      nodePos.set(node.id, zoneCenter(node.zone));
    }

    // Groups (draw first so nodes appear on top)
    if (groups) {
      for (const group of groups) {
        const memberPositions = group.nodes
          .map(id => nodePos.get(id))
          .filter((p): p is { cx: number; cy: number } => p != null);
        if (memberPositions.length === 0) continue;

        const xs = memberPositions.map(p => p.cx);
        const ys = memberPositions.map(p => p.cy);
        const pad = 0.35;
        const gx = Math.min(...xs) - NODE_W / 2 - pad;
        const gy = Math.min(...ys) - NODE_H / 2 - pad;
        const gw = Math.max(...xs) - Math.min(...xs) + NODE_W + pad * 2;
        const gh = Math.max(...ys) - Math.min(...ys) + NODE_H + pad * 2;

        pptxSlide.addShape('roundRect', {
          x: gx, y: gy, w: gw, h: gh,
          fill: { color: hex(co['group-fill'] ?? 'F9FAFB'), transparency: 20 },
          line: { color: hex(co['group-border'] ?? 'D1D5DB'), width: 1, dashType: 'dash' },
          rectRadius: 0.12,
        });
        pptxSlide.addText(group.label, {
          x: gx, y: gy, w: gw, h: 0.3,
          fontSize: ty['caption']?.size ?? 14,
          fontFace: ty['caption']?.font ?? 'Pretendard',
          color: hex(co['text-muted'] ?? '6B7280'),
          align: 'left', valign: 'top',
        });
      }
    }

    // Edges
    for (const edge of edges) {
      const from = nodePos.get(edge.from);
      const to = nodePos.get(edge.to);
      if (!from || !to) continue;

      const dx = to.cx - from.cx;
      const dy = to.cy - from.cy;
      // OOXML requires non-negative cx/cy — normalize bounding box and use flip flags
      pptxSlide.addShape('line', {
        x: Math.min(from.cx, to.cx),
        y: Math.min(from.cy, to.cy),
        w: Math.abs(dx) || 0.01,
        h: Math.abs(dy) || 0.01,
        flipH: dx < 0 ? true : undefined,
        flipV: dy < 0 ? true : undefined,
        line: { color: hex(co['edge'] ?? '9CA3AF'), width: 1.5, endArrowType: 'arrow' },
      });

      if (edge.label) {
        const mx = (from.cx + to.cx) / 2;
        const my = (from.cy + to.cy) / 2;
        pptxSlide.addText(edge.label, {
          x: mx - 0.6, y: my - 0.2, w: 1.2, h: 0.3,
          fontSize: (ty['node-label']?.size ?? 11) - 1,
          fontFace: ty['node-label']?.font ?? 'Pretendard',
          color: hex(co['text-muted'] ?? '6B7280'),
          align: 'center',
        });
      }
    }

    // Nodes
    for (const node of nodes) {
      const pos = nodePos.get(node.id);
      if (!pos) continue;
      const shapeName = tokens.shapes[node.kind] ?? 'rect';
      const nx = pos.cx - NODE_W / 2;
      const ny = pos.cy - NODE_H / 2;

      pptxSlide.addShape(shapeName, {
        x: nx, y: ny, w: NODE_W, h: NODE_H,
        fill: { color: hex(co['node-fill'] ?? 'EFF6FF') },
        line: { color: hex(co['node-border'] ?? '93C5FD'), width: 1.5 },
      });
      pptxSlide.addText(node.label, {
        x: nx, y: ny, w: NODE_W, h: NODE_H,
        fontSize: ty['node-label']?.size ?? 11,
        fontFace: ty['node-label']?.font ?? 'Pretendard',
        color: hex(co['node-text'] ?? '1D4ED8'),
        align: 'center', valign: 'middle',
        bold: true,
      });
    }
  },
};
