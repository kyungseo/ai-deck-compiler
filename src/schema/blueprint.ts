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

// zone은 슬라이드 카드 영역의 3×3 고정 그리드 셀 중심을 가리킵니다.
//
// 그리드 구조:
//   top-left    | top-center    | top-right
//   center-left | center        | center-right
//   bottom-left | bottom-center | bottom-right
//
// AI가 blueprint를 생성할 때 지켜야 할 규칙:
//   1. 각 노드에 고유한 zone을 할당하세요. 같은 zone에 두 노드를 넣으면 겹칩니다.
//   2. 최대 9개 노드(3×3). 10개 이상은 반드시 겹침이 발생합니다.
//   3. left = center-left, right = center-right 별칭이므로 혼용하지 마세요.
//   4. 흐름 방향에 따른 권장 배치:
//      - 좌→우 흐름 (client → gateway → service): left/center-left → center → right/center-right
//      - 상→하 계층 (user → api → db): top-center → center → bottom-center
//      - 복합 구조: 외부 시스템을 가장자리에, 핵심 서비스를 center 부근에 배치

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
  section_label: z.string().optional(), // e.g. "01. OVERVIEW" — renders above title
  subtitle: z.string().optional(),       // one-line context below title
};

// ── Slide Types ───────────────────────────────────────────────────────────────

const HeroSlide = z.object({
  ...base,
  type: z.literal('hero'),
  subtitle: z.string().optional(),
  cta: z.string().optional(),
  author: z.string().optional(),      // overrides brand.author when set
  doc_version: z.string().optional(), // injected from deck.version by compiler
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
  left: z.object({ label: z.string().optional(), body: z.array(z.string()) }),
  right: z.object({ label: z.string().optional(), body: z.array(z.string()) }),
});

const ComparisonSlide = z.object({
  ...base,
  type: z.literal('comparison'),
  left: z.object({ label: z.string().optional(), body: z.array(z.string()) }).optional(),
  right: z.object({ label: z.string().optional(), body: z.array(z.string()) }).optional(),
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

const ClosingSlide = z.object({
  ...base,
  type: z.literal('closing'),
  message: z.string().optional(),  // small label above title (e.g., "발표를 들어주셔서 감사합니다")
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
  ClosingSlide,
]);

// ── Deck ──────────────────────────────────────────────────────────────────────

export const DeckSchema = z.object({
  title: z.string().min(1),
  design: z.string().min(1),
  theme: z.enum(['light', 'dark']),
  version: z.string().default('1.0'),
  author: z.string().optional(),  // overrides brand.author for this deck
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
