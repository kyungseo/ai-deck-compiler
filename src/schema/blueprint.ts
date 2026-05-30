import { z } from 'zod';

// ── Chart ─────────────────────────────────────────────────────────────────────

const ChartData = z.discriminatedUnion('source', [
  z.object({
    source: z.literal('inline'),
    labels: z.array(z.string()),
    series: z.array(z.object({
      name: z.string(),
      values: z.array(z.number()),
    })),
  }),
  z.object({
    source: z.literal('file'),
    path: z.string(),
  }),
]);

// ── Diagram Spec (inline) ─────────────────────────────────────────────────────

const DiagramSpec = z.discriminatedUnion('source', [
  z.object({
    source: z.literal('inline'),
    version: z.string().default('1.0'),
    nodes: z.array(z.object({
      id: z.string(),
      kind: z.enum(['service', 'database', 'queue', 'gateway', 'client', 'cloud', 'container', 'cache', 'storage', 'external']),
      label: z.string(),
      zone: z.enum(['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right', 'left', 'right']),
      description: z.string().optional(),
    })),
    edges: z.array(z.object({
      id: z.string().optional(),
      from: z.string(),
      to: z.string(),
      kind: z.enum(['sync', 'async', 'bidirectional', 'data-flow']).default('sync'),
      label: z.string().optional(),
    })),
    groups: z.array(z.object({
      id: z.string(),
      label: z.string(),
      nodes: z.array(z.string()),
    })).optional(),
  }),
  z.object({
    source: z.literal('file'),
    path: z.string(),
  }),
]);

// ── Slide Base ────────────────────────────────────────────────────────────────

const base = {
  id: z.string().min(1),
  title: z.string().min(1),
  notes: z.string().optional(),
  variant: z.string().optional(),
};

// ── Slide Types ───────────────────────────────────────────────────────────────

const HeroSlide = z.object({
  ...base,
  type: z.literal('hero'),
  subtitle: z.string().optional(),
  cta: z.string().optional(),
});

const AgendaSlide = z.object({
  ...base,
  type: z.literal('agenda'),
  items: z.array(z.string()).optional(),
});

const SectionDividerSlide = z.object({
  ...base,
  type: z.literal('section-divider'),
  section: z.string().optional(),
  number: z.string().optional(),
});

const ContentSlide = z.object({
  ...base,
  type: z.literal('content'),
  body: z.array(z.string()).optional(),
});

const TwoColumnSlide = z.object({
  ...base,
  type: z.literal('two-column'),
  left: z.object({ body: z.array(z.string()) }),
  right: z.object({ body: z.array(z.string()) }),
});

const ComparisonSlide = z.object({
  ...base,
  type: z.literal('comparison'),
  left: z.object({ label: z.string(), body: z.array(z.string()) }).optional(),
  right: z.object({ label: z.string(), body: z.array(z.string()) }).optional(),
});

const KpiSlide = z.object({
  ...base,
  type: z.literal('kpi'),
  kpis: z.array(z.object({
    label: z.string(),
    value: z.string(),
    delta: z.string().optional(),
    trend: z.enum(['up', 'down', 'neutral']).optional(),
  })).optional(),
});

const TimelineSlide = z.object({
  ...base,
  type: z.literal('timeline'),
  items: z.array(z.object({
    date: z.string(),
    label: z.string(),
    description: z.string().optional(),
  })).optional(),
});

const ArchitectureSlide = z.object({
  ...base,
  type: z.literal('architecture'),
  diagram: DiagramSpec,
});

const FlowSlide = z.object({
  ...base,
  type: z.literal('flow'),
  diagram: DiagramSpec.optional(),
});

const TableSlide = z.object({
  ...base,
  type: z.literal('table'),
  headers: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
});

const ChartSlide = z.object({
  ...base,
  type: z.literal('chart'),
  chart: z.object({
    type: z.enum(['bar', 'stacked-bar', 'line', 'area', 'pie', 'donut']),
    data: ChartData,
  }),
});

const DecisionSlide = z.object({
  ...base,
  type: z.literal('decision'),
  options: z.array(z.object({
    label: z.string(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
  })).optional(),
  recommendation: z.string().optional(),
});

const SummarySlide = z.object({
  ...base,
  type: z.literal('summary'),
  body: z.array(z.string()).optional(),
  takeaways: z.array(z.string()).optional(),
});

const AppendixSlide = z.object({
  ...base,
  type: z.literal('appendix'),
  body: z.array(z.string()).optional(),
});

// ── Discriminated Union ───────────────────────────────────────────────────────

export const SlideSchema = z.discriminatedUnion('type', [
  HeroSlide,
  AgendaSlide,
  SectionDividerSlide,
  ContentSlide,
  TwoColumnSlide,
  ComparisonSlide,
  KpiSlide,
  TimelineSlide,
  ArchitectureSlide,
  FlowSlide,
  TableSlide,
  ChartSlide,
  DecisionSlide,
  SummarySlide,
  AppendixSlide,
]);

// ── Deck ──────────────────────────────────────────────────────────────────────

export const DeckSchema = z.object({
  title: z.string().min(1),
  design: z.string().min(1),
  theme: z.enum(['light', 'dark']),
  version: z.string().default('1.0'),
  audience: z.string().optional(),
});

// ── Blueprint ─────────────────────────────────────────────────────────────────

export const BlueprintSchema = z.object({
  deck: DeckSchema,
  slides: z.array(SlideSchema).min(1),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;
export type Slide = z.infer<typeof SlideSchema>;
export type Deck = z.infer<typeof DeckSchema>;
