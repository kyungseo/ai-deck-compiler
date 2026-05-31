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

async function getPptxFileXml(
  blueprintPath: string,
  design: string,
  theme: 'light' | 'dark',
  path: string,
): Promise<string> {
  const blueprint = parseBlueprint(blueprintPath);
  const tokens = resolveDesignTokens(design, theme);
  const pptx = await compile({ blueprint, tokens });
  const buffer = await (pptx as any).write({ outputType: 'nodebuffer' }) as Buffer;
  const zip = await JSZip.loadAsync(buffer);
  const file = zip.file(path);

  if (!file) {
    throw new Error(`Missing PPTX file: ${path}`);
  }

  return file.async('string');
}

describe('Renderer structure snapshot', () => {
  it('basic blueprint produces stable slide XML structure', async () => {
    const slides = await getPptxSlideXmls(
      'examples/basic/blueprint.yaml',
      'modern',
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
      'modern',
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
    const run1 = await getPptxSlideXmls('examples/basic/blueprint.yaml', 'modern', 'light');
    const run2 = await getPptxSlideXmls('examples/basic/blueprint.yaml', 'modern', 'light');
    expect(run1).toEqual(run2);
  });
});

describe('Design preset alias compatibility', () => {
  it('keeps default-modern as an alias for modern', () => {
    expect(resolveDesignTokens('default-modern', 'light').colors)
      .toEqual(resolveDesignTokens('modern', 'light').colors);
  });
});

describe('PPTX document metadata', () => {
  it('writes deck metadata into core document properties', async () => {
    const coreXml = await getPptxFileXml(
      'examples/basic/blueprint.yaml',
      'modern',
      'light',
      'docProps/core.xml',
    );

    expect(coreXml).toContain('<dc:title>Product Overview</dc:title>');
    expect(coreXml).toContain('<dc:creator>ai-deck-compiler (Kyungseo.Park@gmail.com)</dc:creator>');
    expect(coreXml).toContain('<dc:subject>Product Overview — Internal team</dc:subject>');
    expect(coreXml).toContain('<cp:revision>1</cp:revision>');
  });

  it('writes brand metadata into app document properties', async () => {
    const appXml = await getPptxFileXml(
      'examples/basic/blueprint.yaml',
      'modern',
      'light',
      'docProps/app.xml',
    );

    expect(appXml).toContain('<Company>ai-deck-compiler</Company>');
  });
});
