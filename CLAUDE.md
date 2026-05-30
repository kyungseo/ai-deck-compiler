# CLAUDE.md

AI-Native Presentation Engineering Framework — Presentation Compiler

## Project

Blueprint + Design System → Presentation Compiler → Editable PPTX

**Core principle:** AI writes intent. Code renders layout.

- Blueprint format: `blueprint.yaml` (pure YAML, Zod validated)
- Design system: `design-system/presets/{name}/`
- Compiler: deterministic TypeScript engine (pptxgenjs)
- Diagrams: zone-based layout, template-first, no flat image output

## Key Commands

```bash
npm run validate -- --blueprint examples/sample/blueprint.yaml
npm run typecheck
npm test
```

## Workflow

Git workflow rules: `.claude/rules/git-workflow.md` (auto-loaded)

Branch flow: `feature/*` → `develop` → `main`
Hooks: `sh tools/git-hooks/install.sh` to install

## Project Plan

Full project spec: `temp/work-plans/10-ai-native-pt-engineering-framework-3.md` (in harness repo)
or carry the plan doc into this repo as `docs/PROJECT-SPEC.md` when starting Work 2.
