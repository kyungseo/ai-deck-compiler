import { TemplateRegistry } from './registry.js';
import { heroTemplate } from './slides/hero.js';
import { agendaTemplate } from './slides/agenda.js';
import { sectionDividerTemplate } from './slides/section-divider.js';
import { contentTemplate } from './slides/content.js';
import { twoColumnTemplate } from './slides/two-column.js';
import { comparisonTemplate } from './slides/comparison.js';
import { kpiTemplate } from './slides/kpi.js';
import { tableTemplate } from './slides/table.js';
import { chartTemplate } from './slides/chart.js';
import { architectureTemplate } from './slides/architecture.js';
import { summaryTemplate } from './slides/summary.js';

export const defaultRegistry = new TemplateRegistry();

defaultRegistry.register(heroTemplate);
defaultRegistry.register(agendaTemplate);
defaultRegistry.register(sectionDividerTemplate);
defaultRegistry.register(contentTemplate);
defaultRegistry.register(twoColumnTemplate);
defaultRegistry.register(comparisonTemplate);
defaultRegistry.register(kpiTemplate);
defaultRegistry.register(tableTemplate);
defaultRegistry.register(chartTemplate);
defaultRegistry.register(architectureTemplate);
defaultRegistry.register(summaryTemplate);
