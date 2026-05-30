import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { BlueprintSchema } from '../schema/blueprint';

const args = process.argv.slice(2);
const flagIndex = args.indexOf('--blueprint');

if (flagIndex === -1 || !args[flagIndex + 1]) {
  console.error('Usage: npm run validate -- --blueprint <path>');
  process.exit(1);
}

const blueprintPath = resolve(args[flagIndex + 1] as string);

let raw: string;
try {
  raw = readFileSync(blueprintPath, 'utf-8');
} catch {
  console.error(`Error: cannot read file: ${blueprintPath}`);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = parse(raw);
} catch (err) {
  console.error(`Error: invalid YAML — ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

const result = BlueprintSchema.safeParse(parsed);

if (!result.success) {
  console.error('Blueprint validation failed:\n');
  for (const issue of result.error.issues) {
    const fieldPath = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    console.error(`  ${fieldPath}: ${issue.message}`);
  }
  process.exit(1);
}

const { deck, slides } = result.data;
console.log('Blueprint valid.');
console.log(`  title:   ${deck.title}`);
console.log(`  design:  ${deck.design}`);
console.log(`  theme:   ${deck.theme}`);
console.log(`  version: ${deck.version}`);
console.log(`  slides:  ${slides.length}`);
slides.forEach((s, i) => {
  console.log(`    ${String(i + 1).padStart(2, '0')}. [${s.type}] ${s.title}`);
});
