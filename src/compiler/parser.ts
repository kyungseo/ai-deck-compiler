import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { BlueprintSchema } from '../schema/blueprint.js';
import type { Blueprint } from '../schema/blueprint.js';

export function parseBlueprint(yamlPath: string): Blueprint {
  const raw = readFileSync(resolve(yamlPath), 'utf-8');
  const parsed = parse(raw) as unknown;
  return BlueprintSchema.parse(parsed);
}
