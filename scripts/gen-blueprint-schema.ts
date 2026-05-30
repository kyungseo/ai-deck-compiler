import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { BlueprintSchema } from '../src/schema/blueprint.js';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '../schemas');
mkdirSync(outDir, { recursive: true });

const jsonSchema = zodToJsonSchema(BlueprintSchema, {
  name: 'Blueprint',
  $refStrategy: 'none',
});

const outPath = join(outDir, 'blueprint.schema.json');
writeFileSync(outPath, JSON.stringify(jsonSchema, null, 2) + '\n');
console.log(`Generated: ${outPath}`);
