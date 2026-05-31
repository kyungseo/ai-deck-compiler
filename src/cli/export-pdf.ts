/**
 * export-pdf CLI — converts a PPTX to a single PDF file.
 *
 * Requires:
 *   LibreOffice  (PPTX → PDF)
 *     macOS:   brew install --cask libreoffice
 *     Linux:   apt install libreoffice
 *     Windows: https://www.libreoffice.org/download/
 *
 * Usage:
 *   npm run export-pdf -- output/my-deck.pptx
 *   npm run export-pdf -- output/my-deck.pptx --out output/my-deck.pdf
 */

import { existsSync, mkdirSync, readdirSync, unlinkSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, basename, join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { findSoffice, sofficeHint } from './lib/tools.js';

function convertToPdf(soffice: string, pptxPath: string, outPath: string): void {
  const stem = basename(pptxPath, '.pptx');
  const tmp  = join(tmpdir(), `pef-export-pdf-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });

  try {
    execFileSync(
      soffice,
      ['--headless', '--convert-to', 'pdf', '--outdir', tmp, pptxPath],
      { stdio: 'pipe' },
    );

    const generated = join(tmp, `${stem}.pdf`);
    if (!existsSync(generated)) {
      throw new Error(`LibreOffice이 PDF를 생성하지 못했습니다: ${generated}`);
    }

    mkdirSync(dirname(outPath), { recursive: true });
    copyFileSync(generated, outPath);
  } finally {
    try {
      for (const f of readdirSync(tmp)) unlinkSync(join(tmp, f));
    } catch {}
  }
}

interface Args {
  pptxPath: string;
  outPath: string;
}

function parseArgs(argv: string[]): Args {
  const args = argv.slice(2);
  let pptxPath = '';
  let outPath  = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] ?? '';
    if ((arg === '--out' || arg === '-o') && args[i + 1]) {
      outPath = args[++i] ?? '';
    } else if (!arg.startsWith('-')) {
      pptxPath = arg;
    }
  }

  if (!pptxPath) {
    console.error('사용법: npm run export-pdf -- <file.pptx> [--out output.pdf]');
    process.exit(1);
  }

  const resolved = resolve(pptxPath);
  if (!existsSync(resolved)) {
    console.error(`파일을 찾을 수 없습니다: ${resolved}`);
    process.exit(1);
  }

  const stem       = basename(resolved, '.pptx');
  const defaultOut = join(dirname(resolved), `${stem}.pdf`);

  return {
    pptxPath: resolved,
    outPath:  outPath ? resolve(outPath) : defaultOut,
  };
}

function main() {
  const { pptxPath, outPath } = parseArgs(process.argv);

  const soffice = findSoffice();

  if (!soffice) {
    console.error([
      '',
      '  [오류] LibreOffice를 찾을 수 없습니다.',
      '  설치 방법:',
      sofficeHint(),
      '',
    ].join('\n'));
    process.exit(1);
  }

  const stem = basename(pptxPath, '.pptx');
  console.log(`Export PDF: ${stem}`);
  console.log(`LibreOffice: ${soffice}`);
  console.log(`출력:        ${outPath}`);
  console.log('\n변환 중...');

  try {
    convertToPdf(soffice, pptxPath, outPath);
  } catch (err) {
    console.error(`\n변환 실패: ${(err as Error).message}`);
    process.exit(1);
  }

  console.log(`\n생성 완료: ${outPath}\n`);
}

main();
