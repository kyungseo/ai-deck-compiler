import { describe, it, expect } from 'vitest';
import { BlueprintSchema } from '../src/schema/blueprint';

const validDeck = {
  title: 'Test Deck',
  design: 'modern',
  theme: 'dark' as const,
  version: '1.0',
};

describe('BlueprintSchema', () => {
  describe('valid blueprints', () => {
    it('parses a minimal hero blueprint', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{ id: 'hero', type: 'hero', title: 'Hello World' }],
      });
      expect(result.success).toBe(true);
    });

    it('defaults version to 1.0 when omitted', () => {
      const result = BlueprintSchema.safeParse({
        deck: { title: 'T', design: 'd', theme: 'light' },
        slides: [{ id: 's1', type: 'hero', title: 'T' }],
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.deck.version).toBe('1.0');
    });

    it('parses chart slide with inline data', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'chart-1', type: 'chart', title: 'Revenue',
          chart: {
            type: 'line',
            data: { source: 'inline', labels: ['Q1', 'Q2'], series: [{ name: 'Rev', values: [100, 200] }] },
          },
        }],
      });
      expect(result.success).toBe(true);
    });

    it('parses chart slide with file data', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'chart-1', type: 'chart', title: 'Revenue',
          chart: { type: 'bar', data: { source: 'file', path: 'data/revenue.json' } },
        }],
      });
      expect(result.success).toBe(true);
    });

    it('parses architecture slide with inline diagram', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'arch', type: 'architecture', title: 'Architecture',
          diagram: {
            source: 'inline',
            nodes: [
              { id: 'api', kind: 'service', label: 'API', zone: 'center' },
              { id: 'db', kind: 'database', label: 'DB', zone: 'right' },
            ],
            edges: [{ from: 'api', to: 'db', kind: 'sync' }],
          },
        }],
      });
      expect(result.success).toBe(true);
    });

    it('parses architecture slide with file diagram', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'arch', type: 'architecture', title: 'Architecture',
          diagram: { source: 'file', path: 'diagrams/platform.json' },
        }],
      });
      expect(result.success).toBe(true);
    });

    it('parses all non-chart slide types without type-specific fields', () => {
      const simpleTypes = [
        'hero', 'agenda', 'section-divider', 'content',
        'kpi', 'timeline', 'flow', 'table',
        'decision', 'summary', 'appendix',
      ];
      for (const type of simpleTypes) {
        const result = BlueprintSchema.safeParse({
          deck: validDeck,
          slides: [{ id: `s-${type}`, type, title: `Slide ${type}` }],
        });
        expect(result.success, `${type} should be valid`).toBe(true);
      }
    });

    it('parses two-column slide', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 's1', type: 'two-column', title: 'Comparison',
          left: { body: ['Left item A', 'Left item B'] },
          right: { body: ['Right item A', 'Right item B'] },
        }],
      });
      expect(result.success).toBe(true);
    });

    it('parses slide with optional notes field', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{ id: 's1', type: 'hero', title: 'T', notes: 'Speaker notes here' }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid blueprints', () => {
    it('fails on missing deck.title', () => {
      const result = BlueprintSchema.safeParse({
        deck: { design: 'modern', theme: 'dark' },
        slides: [{ id: 's1', type: 'hero', title: 'T' }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on missing deck.design', () => {
      const result = BlueprintSchema.safeParse({
        deck: { title: 'T', theme: 'dark' },
        slides: [{ id: 's1', type: 'hero', title: 'T' }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on invalid theme value', () => {
      const result = BlueprintSchema.safeParse({
        deck: { title: 'T', design: 'd', theme: 'blue' },
        slides: [{ id: 's1', type: 'hero', title: 'T' }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on unknown slide type', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{ id: 's1', type: 'unknown-type', title: 'T' }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on empty slides array', () => {
      const result = BlueprintSchema.safeParse({ deck: validDeck, slides: [] });
      expect(result.success).toBe(false);
    });

    it('fails on missing slide id', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{ type: 'hero', title: 'T' }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on missing slide title', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{ id: 's1', type: 'hero' }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on invalid chart type', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'c1', type: 'chart', title: 'T',
          chart: { type: 'bubble', data: { source: 'inline', labels: [], series: [] } },
        }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on invalid diagram node kind', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'a1', type: 'architecture', title: 'T',
          diagram: {
            source: 'inline',
            nodes: [{ id: 'n1', kind: 'unknown-kind', label: 'L', zone: 'center' }],
            edges: [],
          },
        }],
      });
      expect(result.success).toBe(false);
    });

    it('fails on invalid diagram node zone', () => {
      const result = BlueprintSchema.safeParse({
        deck: validDeck,
        slides: [{
          id: 'a1', type: 'architecture', title: 'T',
          diagram: {
            source: 'inline',
            nodes: [{ id: 'n1', kind: 'service', label: 'L', zone: 'middle' }],
            edges: [],
          },
        }],
      });
      expect(result.success).toBe(false);
    });
  });
});
