import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { parseBlueprint } from '../src/compiler/parser';
import { resolveDesignTokens } from '../src/design/resolver';
import { compile } from '../src/compiler/compiler';

// Normalize timestamps and generated IDs so snapshots are stable
function normalizeXml(xml: string): string {
  return xml
    .replace(/modified="[^"]*"/g, 'modified="TIMESTAMP"')
    .replace(/created="[^"]*"/g, 'created="TIMESTAMP"')
    .replace(/lastModifiedBy="[^"]*"/g, 'lastModifiedBy="AUTHOR"')
    .replace(/id="\d+"/g, 'id="ID"');
}

async function getPptxSlideXmls(blueprintPath: string, design: string, theme: 'light' | 'dark') {
  const blueprint = parseBlueprint(blueprintPath);
  const tokens = resolveDesignTokens(design, theme);
  const pptx = await compile({ blueprint, tokens });
  const buffer = await (pptx as any).write({ outputType: 'nodebuffer' }) as Buffer;
  const zip = await JSZip.loadAsync(buffer);

  const slides: Record<string, string> = {};
  for (const [path, file] of Object.entries(zip.files)) {
    if (path.match(/ppt\/slides\/slide\d+\.xml/)) {
      const xml = await file.async('string');
      slides[path] = normalizeXml(xml);
    }
  }
  return slides;
}

describe('Renderer structure snapshot', () => {
  it('basic blueprint produces stable slide XML structure', async () => {
    const slides = await getPptxSlideXmls(
      'examples/basic/blueprint.yaml',
      'default-modern',
      'light',
    );
    expect(Object.keys(slides).length).toBe(6);
    for (const [path, xml] of Object.entries(slides)) {
      expect(xml, path).toMatchSnapshot();
    }
  });

  it('architecture blueprint produces stable slide XML structure', async () => {
    const slides = await getPptxSlideXmls(
      'examples/architecture/blueprint.yaml',
      'default-modern',
      'dark',
    );
    expect(Object.keys(slides).length).toBe(5);
    for (const [path, xml] of Object.entries(slides)) {
      expect(xml, path).toMatchSnapshot();
    }
  });
});

describe('Renderer determinism — identical PPTX structure on repeated compile', () => {
  it('same blueprint produces identical slide XMLs on two consecutive compiles', async () => {
    const run1 = await getPptxSlideXmls('examples/basic/blueprint.yaml', 'default-modern', 'light');
    const run2 = await getPptxSlideXmls('examples/basic/blueprint.yaml', 'default-modern', 'light');
    expect(run1).toEqual(run2);
  });
});
