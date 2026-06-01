/**
 * Preview CLI — converts a PPTX to per-slide PNG images.
 *
 * Requires two optional external tools:
 *   LibreOffice  (PPTX → PDF)
 *     macOS:   brew install --cask libreoffice
 *     Linux:   apt install libreoffice
 *     Windows: https://www.libreoffice.org/download/
 *
 *   poppler / pdftoppm  (PDF → PNG, one file per slide)
 *     macOS:   brew install poppler
 *     Linux:   apt install poppler-utils
 *     Windows: https://github.com/oschwartz10612/poppler-windows/releases
 *
 * Usage:
 *   npm run preview -- output/my-deck.pptx
 *   npm run preview -- output/my-deck.pptx --out output/preview/
 *   npm run preview -- output/my-deck.pptx --slides 1,3,5
 *   npm run preview -- output/my-deck.pptx --dpi 96
 */

import { existsSync, mkdirSync, readdirSync, unlinkSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, basename, join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { findSoffice, findPdftoppm, sofficeHint, pdftoppmHint } from './lib/tools.js';

// ── Conversion pipeline ──────────────────────────────────────────────────────

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function convert(opts: {
  soffice: string;
  pdftoppm: string;
  pptxPath: string;
  outDir: string;
  dpi: number;
}): string[] {
  const { soffice, pdftoppm, pptxPath, outDir, dpi } = opts;

  mkdirSync(outDir, { recursive: true });

  const tmp = join(tmpdir(), `pef-preview-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });

  try {
    // Step 1 — PPTX → PDF via LibreOffice Impress (headless)
    execFileSync(
      soffice,
      ['--headless', '--convert-to', 'pdf', '--outdir', tmp, pptxPath],
      { stdio: 'pipe' },
    );

    const stem    = basename(pptxPath, '.pptx');
    const pdfPath = join(tmp, `${stem}.pdf`);

    if (!existsSync(pdfPath)) {
      throw new Error(`LibreOffice이 PDF를 생성하지 못했습니다: ${pdfPath}`);
    }

    // Step 2 — PDF → PNG via pdftoppm (poppler): one PNG per page
    //   pdftoppm -png -r <dpi> input.pdf output-prefix
    //   → output-prefix-1.png, output-prefix-2.png, ...
    const prefix = join(tmp, 'slide');
    execFileSync(
      pdftoppm,
      ['-png', '-r', String(dpi), pdfPath, prefix],
      { stdio: 'pipe' },
    );

    // Collect and copy to outDir as slide-01.png, slide-02.png, ...
    const rawPngs = readdirSync(tmp)
      .filter(f => f.startsWith('slide') && f.endsWith('.png'))
      .sort(naturalSort);

    if (rawPngs.length === 0) {
      throw new Error('pdftoppm이 PNG 파일을 생성하지 못했습니다.');
    }

    const results: string[] = [];
    for (const [i, png] of rawPngs.entries()) {
      const padded = String(i + 1).padStart(2, '0');
      const dest   = join(outDir, `slide-${padded}.png`);
      copyFileSync(join(tmp, png), dest);
      results.push(dest);
    }

    return results;
  } finally {
    try {
      for (const f of readdirSync(tmp)) unlinkSync(join(tmp, f));
    } catch {}
  }
}

// ── Argument parsing ─────────────────────────────────────────────────────────

interface Args {
  pptxPath: string;
  outDir: string;
  slideFilter: Set<number> | null;
  dpi: number;
}

function parseArgs(argv: string[]): Args {
  const args = argv.slice(2);
  let pptxPath = '';
  let outDir   = '';
  let slideFilter: Set<number> | null = null;
  let dpi = 150;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] ?? '';
    if ((arg === '--out' || arg === '-o') && args[i + 1]) {
      outDir = args[++i] ?? '';
    } else if ((arg === '--slides' || arg === '-s') && args[i + 1]) {
      const raw = args[++i] ?? '';
      slideFilter = new Set(raw.split(',').map(n => parseInt(n.trim(), 10)));
    } else if (arg === '--dpi' && args[i + 1]) {
      dpi = parseInt(args[++i] ?? '150', 10);
    } else if (!arg.startsWith('-')) {
      pptxPath = arg;
    }
  }

  if (!pptxPath) {
    console.error(
      '사용법: npm run preview -- <file.pptx> [--out 디렉터리] [--slides 1,2,3] [--dpi 150]',
    );
    process.exit(1);
  }

  const resolved = resolve(pptxPath);
  if (!existsSync(resolved)) {
    console.error(`파일을 찾을 수 없습니다: ${resolved}`);
    process.exit(1);
  }

  if (!basename(resolved).toLowerCase().endsWith('.pptx')) {
    console.error(`[오류] .pptx 파일이 필요합니다: ${resolved}`);
    process.exit(1);
  }

  return {
    pptxPath: resolved,
    outDir:   outDir ? resolve(outDir) : join(dirname(resolved), 'preview'),
    slideFilter,
    dpi,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const { pptxPath, outDir, slideFilter, dpi } = parseArgs(process.argv);

  // Tool detection
  const soffice  = findSoffice();
  const pdftoppm = findPdftoppm();

  let hasError = false;

  if (!soffice) {
    console.error([
      '',
      '  [오류] LibreOffice를 찾을 수 없습니다.',
      '  설치 방법:',
      sofficeHint(),
      '',
    ].join('\n'));
    hasError = true;
  }

  if (!pdftoppm) {
    console.error([
      '',
      '  [오류] pdftoppm (poppler)를 찾을 수 없습니다.',
      '  설치 방법:',
      pdftoppmHint(),
      '',
    ].join('\n'));
    hasError = true;
  }

  if (hasError) process.exit(1);

  const pptxName = basename(pptxPath);
  const stem = pptxName.slice(0, pptxName.length - '.pptx'.length);
  console.log(`Preview: ${stem}`);
  console.log(`LibreOffice: ${soffice}`);
  console.log(`pdftoppm:    ${pdftoppm}`);
  console.log(`Output:      ${outDir}`);
  console.log(`DPI:         ${dpi}  (${Math.round(13.33 * dpi)}×${Math.round(7.5 * dpi)}px)`);

  if (slideFilter) {
    console.log(`슬라이드:    ${[...slideFilter].sort((a, b) => a - b).join(', ')}`);
  }

  console.log('\n변환 중...');

  let pngs: string[];
  try {
    pngs = convert({ soffice: soffice!, pdftoppm: pdftoppm!, pptxPath, outDir, dpi });
  } catch (err) {
    console.error(`\n변환 실패: ${(err as Error).message}`);
    process.exit(1);
  }

  const filtered = slideFilter
    ? pngs.filter((_, i) => slideFilter.has(i + 1))
    : pngs;

  console.log(`\n생성 완료 — ${filtered.length}장 (전체 ${pngs.length}장):\n`);
  for (const p of filtered) {
    console.log(`  ${p}`);
  }
  console.log('');
}

main();
