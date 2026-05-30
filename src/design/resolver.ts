import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ResolvedDesignTokens, TypographyToken } from '../compiler/types.js';

const PRESETS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'presets');

interface RawTokens {
  colors: Record<string, Record<string, string>>;
  typography: Record<string, TypographyToken>;
  spacing: Record<string, number>;
  shapes: Record<string, string>;
}

export function resolveDesignTokens(
  presetName: string,
  theme: 'light' | 'dark',
): ResolvedDesignTokens {
  const tokensPath = join(PRESETS_DIR, presetName, 'tokens.json');
  let raw: RawTokens;
  try {
    raw = JSON.parse(readFileSync(tokensPath, 'utf-8')) as RawTokens;
  } catch {
    throw new Error(`Design preset not found: "${presetName}" (looked in ${PRESETS_DIR})`);
  }

  const themeColors = raw.colors[theme];
  if (!themeColors) {
    throw new Error(`Theme "${theme}" not found in preset "${presetName}"`);
  }

  return {
    colors: themeColors,
    typography: raw.typography,
    spacing: raw.spacing,
    slideSize: { width: 13.33, height: 7.5 }, // LAYOUT_WIDE
    shapes: raw.shapes,
  };
}
