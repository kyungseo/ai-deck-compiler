import { describe, it, expect, vi } from 'vitest';
import type { PptxSlide } from '../src/templates/registry';
import { defaultRegistry } from '../src/templates/index';
import type { ResolvedDesignTokens } from '../src/compiler/types';

// ── Mock slide factory ────────────────────────────────────────────────────────

function makeMockSlide(): PptxSlide & {
  calls: Record<string, number>;
  addImageCalled: boolean;
} {
  const calls: Record<string, number> = {};
  const track = (method: string) => {
    calls[method] = (calls[method] ?? 0) + 1;
  };
  const slide = {
    background: {},
    calls,
    addImageCalled: false,
    addText: vi.fn((..._args: unknown[]) => { track('addText'); return slide; }),
    addShape: vi.fn((..._args: unknown[]) => { track('addShape'); return slide; }),
    addChart: vi.fn((..._args: unknown[]) => { track('addChart'); return slide; }),
    addTable: vi.fn((..._args: unknown[]) => { track('addTable'); return slide; }),
    addImage: vi.fn((..._args: unknown[]) => { track('addImage'); slide.addImageCalled = true; return slide; }),
    addNotes: vi.fn((..._args: unknown[]) => { track('addNotes'); return slide; }),
  } as unknown as PptxSlide & { calls: Record<string, number>; addImageCalled: boolean };
  return slide;
}

// ── Minimal tokens ────────────────────────────────────────────────────────────

const tokens: ResolvedDesignTokens = {
  colors: {
    background: '#FFFFFF', surface: '#F8F9FA', border: '#E5E7EB',
    'text-primary': '#111827', 'text-secondary': '#374151', 'text-muted': '#6B7280',
    accent: '#2563EB', 'accent-alt': '#7C3AED',
    'node-fill': '#EFF6FF', 'node-text': '#1D4ED8', 'node-border': '#93C5FD',
    'group-fill': '#F9FAFB', 'group-border': '#D1D5DB', edge: '#9CA3AF',
    'chart-0': '#2563EB', 'chart-1': '#7C3AED', 'chart-2': '#059669',
    'chart-3': '#DC2626', 'chart-4': '#D97706', 'chart-5': '#0891B2',
  },
  typography: {
    title: { size: 40, bold: true, font: 'Pretendard' },
    subtitle: { size: 24, bold: false, font: 'Pretendard' },
    body: { size: 18, bold: false, font: 'Pretendard' },
    caption: { size: 14, bold: false, font: 'Pretendard' },
    label: { size: 12, bold: false, font: 'Pretendard' },
    'kpi-value': { size: 52, bold: true, font: 'Pretendard' },
    'kpi-label': { size: 13, bold: false, font: 'Pretendard' },
    'node-label': { size: 11, bold: false, font: 'Pretendard' },
    'table-header': { size: 14, bold: true, font: 'Pretendard' },
    'table-cell': { size: 13, bold: false, font: 'Pretendard' },
  },
  spacing: { xs: 0.05, sm: 0.1, md: 0.2, lg: 0.3, xl: 0.5, xxl: 0.8 },
  slideSize: { width: 13.33, height: 7.5 },
  brand: { name: 'Test', show: false, showPageNumbers: false, fontSize: 10, author: '' },
  shapes: {
    service: 'roundRect', database: 'can', queue: 'rect', gateway: 'diamond',
    client: 'rect', cloud: 'cloud', container: 'rect', cache: 'hexagon',
    storage: 'can', external: 'rect',
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────

describe('defaultRegistry', () => {
  const P1_TYPES = ['hero', 'agenda', 'content', 'two-column', 'kpi', 'table', 'chart', 'architecture', 'summary'];
  const P2_TYPES = ['section-divider', 'comparison', 'timeline', 'flow', 'decision', 'appendix', 'closing'];

  it('has all 9 P1 slide types registered', () => {
    for (const type of P1_TYPES) {
      expect(defaultRegistry.has(type), `"${type}" should be registered`).toBe(true);
    }
  });

  it('has all 6 P2 slide types registered', () => {
    for (const type of P2_TYPES) {
      expect(defaultRegistry.has(type), `"${type}" should be registered`).toBe(true);
    }
  });

  it('throws on unknown slide type (no silent fallback)', () => {
    expect(() => defaultRegistry.resolve('unknown-slide-type')).toThrow();
  });
});

// ── Editable object invariant ─────────────────────────────────────────────────

describe('Editable object invariant', () => {
  it('hero: renders without addImage', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('hero');
    template.render({ id: 'h1', type: 'hero', title: 'Hello World', subtitle: 'Subtitle', cta: 'Get Started' }, tokens, slide);
    expect(slide.addImageCalled).toBe(false);
    expect((slide.calls['addText'] ?? 0)).toBeGreaterThan(0);
  });

  it('content: renders bullet list without addImage', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('content');
    template.render({ id: 'c1', type: 'content', title: 'Content', body: ['Item A', 'Item B'] }, tokens, slide);
    expect(slide.addImageCalled).toBe(false);
  });

  it('chart: renders native chart without addImage (inline data)', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('chart');
    template.render({
      id: 'ch1', type: 'chart', title: 'Revenue',
      chart: {
        type: 'bar',
        data: { source: 'inline', labels: ['Q1', 'Q2'], series: [{ name: 'Rev', values: [100, 200] }] },
      },
    }, tokens, slide);
    expect(slide.addImageCalled).toBe(false);
    expect((slide.calls['addChart'] ?? 0)).toBeGreaterThan(0);
  });

  it('table: renders native table without addImage', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('table');
    template.render({
      id: 't1', type: 'table', title: 'Data',
      headers: ['Col A', 'Col B'],
      rows: [['1', '2'], ['3', '4']],
    }, tokens, slide);
    expect(slide.addImageCalled).toBe(false);
    expect((slide.calls['addTable'] ?? 0)).toBeGreaterThan(0);
  });

  it('architecture: renders shapes without addImage (inline diagram)', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('architecture');
    template.render({
      id: 'a1', type: 'architecture', title: 'System',
      diagram: {
        source: 'inline',
        version: '1.0',
        nodes: [
          { id: 'api', kind: 'service', label: 'API', zone: 'center' },
          { id: 'db', kind: 'database', label: 'DB', zone: 'center-right' },
        ],
        edges: [{ from: 'api', to: 'db', kind: 'sync' }],
      },
    }, tokens, slide);
    expect(slide.addImageCalled).toBe(false);
    expect((slide.calls['addShape'] ?? 0)).toBeGreaterThan(0);
  });
});

// ── Structural determinism ────────────────────────────────────────────────────

describe('Structural determinism', () => {
  it('same input produces same call sequence on hero slide', () => {
    const slideA = makeMockSlide();
    const slideB = makeMockSlide();
    const template = defaultRegistry.resolve('hero');
    const slideData = { id: 'h1', type: 'hero' as const, title: 'Hello', subtitle: 'Sub', cta: 'Go' };

    template.render(slideData, tokens, slideA);
    template.render(slideData, tokens, slideB);

    expect(slideA.calls).toEqual(slideB.calls);
  });

  it('same input produces same call sequence on kpi slide', () => {
    const slideA = makeMockSlide();
    const slideB = makeMockSlide();
    const template = defaultRegistry.resolve('kpi');
    const slideData = {
      id: 'k1', type: 'kpi' as const, title: 'KPIs',
      kpis: [
        { label: 'Revenue', value: '$1M', delta: '+12%', trend: 'up' as const },
        { label: 'Users', value: '10K', delta: '-3%', trend: 'down' as const },
      ],
    };

    template.render(slideData, tokens, slideA);
    template.render(slideData, tokens, slideB);

    expect(slideA.calls).toEqual(slideB.calls);
  });
});

// ── All P1 types compile without error ────────────────────────────────────────

describe('All P1 types compile without error', () => {
  it('agenda', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('agenda');
    expect(() => template.render({ id: 'a', type: 'agenda', title: 'Agenda', items: ['Topic A', 'Topic B'] }, tokens, slide)).not.toThrow();
  });

  it('two-column', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('two-column');
    expect(() => template.render({ id: 'tc', type: 'two-column', title: 'Compare', left: { body: ['L1'] }, right: { body: ['R1'] } }, tokens, slide)).not.toThrow();
  });

  it('summary', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('summary');
    expect(() => template.render({ id: 's', type: 'summary', title: 'Summary', body: ['Point A'], takeaways: ['Key 1', 'Key 2'] }, tokens, slide)).not.toThrow();
  });
});

// ── All P2 types compile without error ────────────────────────────────────────

describe('All P2 types compile without error', () => {
  it('timeline', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('timeline');
    expect(() => template.render({
      id: 'tl', type: 'timeline', title: 'Roadmap',
      items: [
        { date: 'Q1', label: 'Phase 1', description: 'Foundation' },
        { date: 'Q2', label: 'Phase 2', description: 'Build' },
        { date: 'Q3', label: 'Phase 3', description: 'Launch' },
      ],
    }, tokens, slide)).not.toThrow();
  });

  it('flow: no diagram (placeholder)', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('flow');
    expect(() => template.render({ id: 'fl', type: 'flow', title: 'Process Flow' }, tokens, slide)).not.toThrow();
  });

  it('flow: with inline diagram', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('flow');
    expect(() => template.render({
      id: 'fl2', type: 'flow', title: 'Flow',
      diagram: {
        source: 'inline', version: '1.0',
        nodes: [
          { id: 'a', kind: 'service', label: 'Start', zone: 'center-left' },
          { id: 'b', kind: 'service', label: 'End', zone: 'center-right' },
        ],
        edges: [{ from: 'a', to: 'b', kind: 'sync' }],
      },
    }, tokens, slide)).not.toThrow();
  });

  it('decision', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('decision');
    expect(() => template.render({
      id: 'dc', type: 'decision', title: 'Build vs Buy',
      options: [
        { label: 'Build', pros: ['Full control'], cons: ['High cost'] },
        { label: 'Buy', pros: ['Fast'], cons: ['Vendor lock-in'] },
      ],
      recommendation: 'Buy — faster time to market given current runway',
    }, tokens, slide)).not.toThrow();
  });

  it('appendix', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('appendix');
    expect(() => template.render({
      id: 'ap', type: 'appendix', title: 'Appendix',
      body: ['See supporting data at data/charts/', 'Architecture decisions at docs/decisions/'],
    }, tokens, slide)).not.toThrow();
  });

  it('closing', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('closing');
    expect(() => template.render({
      id: 'cl', type: 'closing', title: 'Q&A',
      subtitle: 'kyungseo.park@gmail.com',
      message: '발표를 들어주셔서 감사합니다',
    }, tokens, slide)).not.toThrow();
  });
});
