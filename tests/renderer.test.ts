import { describe, it, expect, vi } from 'vitest';
import type { PptxSlide } from '../src/templates/registry';
import { defaultRegistry } from '../src/templates/index';
import { renderCalloutBar } from '../src/templates/layout';
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

// ── Callout bar ───────────────────────────────────────────────────────────────

describe('renderCalloutBar', () => {
  it('no-op when callout-bar token is absent', () => {
    const slide = makeMockSlide();
    renderCalloutBar(slide, 'Hello', tokens);
    expect(slide.calls['addShape'] ?? 0).toBe(0);
    expect(slide.calls['addText'] ?? 0).toBe(0);
  });

  it('renders shape + text when callout-bar token is present', () => {
    const slide = makeMockSlide();
    const tokensWithCallout: ResolvedDesignTokens = {
      ...tokens,
      colors: { ...tokens.colors, 'callout-bar': '#6957E8', 'callout-bar-text': '#FFFFFF' },
    };
    renderCalloutBar(slide, '2026년은 파트너십으로 진입', tokensWithCallout);
    expect(slide.calls['addShape']).toBe(1);
    expect(slide.calls['addText']).toBe(1);
  });

  it('content slide: callout field renders callout bar at y=6.85 (even with empty body)', () => {
    const slide = makeMockSlide();
    const tokensWithCallout: ResolvedDesignTokens = {
      ...tokens,
      colors: { ...tokens.colors, 'callout-bar': '#6957E8' },
    };
    const template = defaultRegistry.resolve('content');
    template.render(
      { id: 'c1', type: 'content', title: 'Market Context', callout: 'Key Takeaway' },
      tokensWithCallout, slide,
    );
    const calloutShapes = (slide.addShape as ReturnType<typeof vi.fn>).mock.calls.filter(
      (args: unknown[]) => typeof args[1] === 'object' && args[1] !== null && (args[1] as { y?: number }).y === 6.85,
    );
    expect(calloutShapes).toHaveLength(1);
  });

  it('flow slide: callout renders at y=6.85 even when diagram is absent (early return path)', () => {
    const slide = makeMockSlide();
    const tokensWithCallout: ResolvedDesignTokens = {
      ...tokens,
      colors: { ...tokens.colors, 'callout-bar': '#6957E8' },
    };
    const template = defaultRegistry.resolve('flow');
    template.render(
      { id: 'f1', type: 'flow', title: 'Deployment Flow', callout: 'Phase 1 Goal' },
      tokensWithCallout, slide,
    );
    const calloutShapes = (slide.addShape as ReturnType<typeof vi.fn>).mock.calls.filter(
      (args: unknown[]) => typeof args[1] === 'object' && args[1] !== null && (args[1] as { y?: number }).y === 6.85,
    );
    expect(calloutShapes).toHaveLength(1);
  });

  it('content slide: no callout field — callout bar not rendered', () => {
    const slide = makeMockSlide();
    const tokensWithCallout: ResolvedDesignTokens = {
      ...tokens,
      colors: { ...tokens.colors, 'callout-bar': '#6957E8' },
    };
    const template = defaultRegistry.resolve('content');
    template.render(
      { id: 'c2', type: 'content', title: 'Normal Slide', body: ['Item A'] },
      tokensWithCallout, slide,
    );
    const addShapeArgs = (slide.addShape as ReturnType<typeof vi.fn>).mock.calls;
    const calloutBarCalls = addShapeArgs.filter(
      (args: unknown[]) => typeof args[1] === 'object' && args[1] !== null && (args[1] as { y?: number }).y === 6.85,
    );
    expect(calloutBarCalls).toHaveLength(0);
  });
});

// ── Body code blocks ─────────────────────────────────────────────────────────

describe('Body code blocks', () => {
  const textFromArg = (arg: unknown): string => {
    if (typeof arg === 'string') return arg;
    if (Array.isArray(arg)) {
      return arg.map(run => typeof run === 'object' && run !== null && 'text' in run ? String((run as { text?: string }).text ?? '') : '').join('');
    }
    return '';
  };

  it('content slide renders fenced code as boxed monospace text without fence markers', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('content');
    template.render({
      id: 'code',
      type: 'content',
      title: 'Commands',
      body: [
        'Run the validation command.',
        '```bash\nnpm run validate\nnpm run deck\n```',
        'Then review the preview.',
      ],
    }, tokens, slide);

    const codeShape = (slide.addShape as ReturnType<typeof vi.fn>).mock.calls.find(
      (args: unknown[]) => typeof args[1] === 'object' && args[1] !== null && (args[1] as { rectRadius?: number }).rectRadius === 0.06,
    );
    const codeText = (slide.addText as ReturnType<typeof vi.fn>).mock.calls
      .map(args => textFromArg(args[0]))
      .find(text => text.includes('npm run validate'));

    expect(codeShape).toBeTruthy();
    expect(codeText).not.toContain('```');
  });

  it('content slide applies syntax colors to supported fenced code', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('content');
    template.render({
      id: 'code-color',
      type: 'content',
      title: 'Code',
      body: ['```ts\nconst value = \"ready\" // comment\n```'],
    }, {
      ...tokens,
      colors: {
        ...tokens.colors,
        'code-keyword': '#AA0000',
        'code-string': '#00AA00',
        'code-comment': '#777777',
      },
    }, slide);

    const richTextCall = (slide.addText as ReturnType<typeof vi.fn>).mock.calls.find(
      (args: unknown[]) => Array.isArray(args[0]) && textFromArg(args[0]).includes('const value'),
    );
    const runs = richTextCall?.[0] as Array<{ text?: string; options?: { color?: string } }>;

    expect(runs.some(run => run.text === 'const' && run.options?.color === 'AA0000')).toBe(true);
    expect(runs.some(run => run.text === '"ready"' && run.options?.color === '00AA00')).toBe(true);
    expect(runs.some(run => run.text === '// comment' && run.options?.color === '777777')).toBe(true);
  });

  it('appendix slide keeps inline code and fenced code as separate blocks', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('appendix');
    template.render({
      id: 'appendix-code',
      type: 'appendix',
      title: 'Appendix',
      body: [
        'Supporting note.',
        '`npm run typecheck`',
        '`npm test`',
        '```bash\nnpm run preview -- output/sample.pptx --out output/preview\n```',
      ],
    }, tokens, slide);

    const codeTexts = (slide.addText as ReturnType<typeof vi.fn>).mock.calls
      .map(args => textFromArg(args[0]));

    expect(codeTexts.some(text => text.includes('npm run typecheck') && text.includes('npm test'))).toBe(true);
    expect(codeTexts.some(text => text.includes('npm run preview') && !text.includes('```'))).toBe(true);
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

  it('timeline:circular — with descriptions', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('timeline', 'circular');
    expect(() => template.render({
      id: 'tlc', type: 'timeline', title: 'Roadmap', variant: 'circular',
      items: [
        { label: '기획', description: '요구사항 정의' },
        { label: '개발', description: '기능 구현' },
        { label: '배포', description: '운영 릴리스' },
      ],
    }, tokens, slide)).not.toThrow();
  });

  it('timeline:circular — with dates', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('timeline', 'circular');
    expect(() => template.render({
      id: 'tlcd', type: 'timeline', title: 'Milestones', variant: 'circular',
      items: [
        { label: 'Alpha', date: '2026 Q1', description: '내부 테스트' },
        { label: 'Beta',  date: '2026 Q2', description: '외부 파일럿' },
        { label: 'GA',    date: '2026 Q3', description: '일반 출시' },
      ],
    }, tokens, slide)).not.toThrow();
  });

  it('timeline:circular — 5 items, no description', () => {
    const slide = makeMockSlide();
    const template = defaultRegistry.resolve('timeline', 'circular');
    expect(() => template.render({
      id: 'tlc5', type: 'timeline', title: 'Process', variant: 'circular',
      items: [
        { label: 'A' }, { label: 'B' }, { label: 'C' }, { label: 'D' }, { label: 'E' },
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
