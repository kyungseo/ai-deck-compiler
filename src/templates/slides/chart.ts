import type { SlideTemplate, PptxSlide } from '../registry.js';
import type { ResolvedDesignTokens } from '../../compiler/types.js';
import type { Slide } from '../../schema/blueprint.js';
import { SL, CARD, hex, renderSectionHeader, renderCardBackground } from '../layout.js';

type ChartSlide = Extract<Slide, { type: 'chart' }>;

const PPTX_CHART_TYPE: Record<string, string> = {
  'bar': 'bar',
  'stacked-bar': 'bar',
  'line': 'line',
  'area': 'area',
  'pie': 'pie',
  'donut': 'doughnut',
};

export const chartTemplate: SlideTemplate<ChartSlide> = {
  id: 'chart',
  supportedType: 'chart',
  variants: ['default'],
  render(slide: ChartSlide, tokens: ResolvedDesignTokens, pptxSlide: PptxSlide) {
    const ty = tokens.typography;
    const co = tokens.colors;

    renderSectionHeader(pptxSlide, slide, tokens);
    renderCardBackground(pptxSlide, tokens);

    const { chart } = slide;
    if (chart.data.source === 'file') {
      pptxSlide.addText('[Chart data from file — inline source required for rendering]', {
        x: SL.cx, y: CARD.iy, w: SL.cw, h: CARD.ih,
        fontSize: ty['caption']?.size ?? 14,
        color: hex(co['text-muted'] ?? '6B7280'),
        align: 'center', valign: 'middle',
      });
      return;
    }

    const chartData = chart.data.series.map(s => ({
      name: s.name,
      labels: chart.data.source === 'inline' ? chart.data.labels : [],
      values: s.values,
    }));

    const chartColors = [0, 1, 2, 3, 4, 5].map(i => hex(co[`chart-${i}`] ?? '2563EB'));
    const pptxType = PPTX_CHART_TYPE[chart.type] ?? 'bar';
    const isStacked = chart.type === 'stacked-bar';
    const isPie = chart.type === 'pie' || chart.type === 'donut';

    const textColor = hex(co['text-secondary'] ?? '6B7280');
    const axisColor = hex(co['text-muted'] ?? '9CA3AF');

    const chartOpts: Record<string, unknown> = {
      x: SL.cx, y: CARD.iy, w: SL.cw, h: CARD.ih,
      chartColors,
      showLegend: true,
      legendPos: 'b',
      legendFontSize: ty['caption']?.size ?? 14,
      legendFontColor: textColor,
      dataLabelFontSize: ty['caption']?.size ?? 14,
      dataLabelColor: textColor,
      catAxisLabelColor: axisColor,
      catAxisLabelFontSize: ty['caption']?.size ?? 14,
      valAxisLabelColor: axisColor,
      valAxisLabelFontSize: ty['caption']?.size ?? 14,
      showValue: isPie,
    };

    if (isStacked) chartOpts['barGrouping'] = 'stacked';

    pptxSlide.addChart(pptxType, chartData, chartOpts);
  },
};
