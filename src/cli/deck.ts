import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parseBlueprint } from '../compiler/parser.js';
import { resolveDesignTokens } from '../design/resolver.js';
import { compile } from '../compiler/compiler.js';

const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
}

const blueprintArg = flag('--blueprint');
const designArg = flag('--design');
const themeArg = flag('--theme') as 'light' | 'dark' | undefined;
const outputArg = flag('--output');

if (!blueprintArg) {
  console.error('Usage: npm run deck -- --blueprint <path> [--design <name>] [--theme light|dark] [--output <path>]');
  process.exit(1);
}

const blueprintPath = resolve(blueprintArg);

let blueprint;
try {
  blueprint = parseBlueprint(blueprintPath);
} catch (err) {
  console.error(`Error parsing blueprint: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

const designName = designArg ?? blueprint.deck.design;
const theme = themeArg ?? blueprint.deck.theme;
const outputPath = resolve(outputArg ?? `output/${blueprint.deck.title.toLowerCase().replace(/\s+/g, '-')}.pptx`);

let tokens;
try {
  tokens = resolveDesignTokens(designName, theme);
} catch (err) {
  console.error(`Error loading design preset: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

console.log(`Compiling: ${blueprint.deck.title}`);
console.log(`  design: ${designName} / theme: ${theme}`);
console.log(`  slides: ${blueprint.slides.length}`);

const pptx = await compile({ blueprint, tokens });
mkdirSync(dirname(outputPath), { recursive: true });
await pptx.writeFile({ fileName: outputPath });
console.log(`Output: ${outputPath}`);
