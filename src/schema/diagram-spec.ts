import { z } from 'zod';

// Standalone schema for diagram spec files referenced via `source: file`.
// Inline diagram specs embedded in blueprint.yaml use the same structure
// but are validated through BlueprintSchema.

export const NodeKind = z.enum([
  'service', 'database', 'queue', 'gateway', 'client',
  'cloud', 'container', 'cache', 'storage', 'external',
]);

export const Zone = z.enum([
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
  'left', 'right',
]);

export const EdgeKind = z.enum(['sync', 'async', 'bidirectional', 'data-flow']);

export const DiagramNode = z.object({
  id: z.string().min(1),
  kind: NodeKind,
  label: z.string().min(1),
  zone: Zone,
  description: z.string().optional(),
});

export const DiagramEdge = z.object({
  id: z.string().optional(),
  from: z.string().min(1),
  to: z.string().min(1),
  kind: EdgeKind.default('sync'),
  label: z.string().optional(),
});

export const DiagramGroup = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  nodes: z.array(z.string()).min(1),
});

export const SemanticDiagramSpec = z.object({
  version: z.string().default('1.0'),
  nodes: z.array(DiagramNode).min(1),
  edges: z.array(DiagramEdge),
  groups: z.array(DiagramGroup).optional(),
});

export type SemanticDiagramSpec = z.infer<typeof SemanticDiagramSpec>;
export type DiagramNode = z.infer<typeof DiagramNode>;
export type DiagramEdge = z.infer<typeof DiagramEdge>;
export type DiagramGroup = z.infer<typeof DiagramGroup>;
export type NodeKind = z.infer<typeof NodeKind>;
export type Zone = z.infer<typeof Zone>;
export type EdgeKind = z.infer<typeof EdgeKind>;
