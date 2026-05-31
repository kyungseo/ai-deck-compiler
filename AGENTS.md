# AGENTS.md

Codex entry point for this repository.
Keep this file thin. Global behavior principles live in `docs/BEHAVIOR-PRINCIPLES.md`. Shared operating rules live in `docs/AGENT-WORKFLOW.md`.

## Entry Contract

MUST:

- Treat this file and `CLAUDE.md` as equal tool-specific entry points.
- Read and follow `docs/BEHAVIOR-PRINCIPLES.md` at session start for global behavioral principles that apply to all tasks.
- Read and follow `docs/AGENT-WORKFLOW.md` at session start for common workflow, context routing, status rules, and validation defaults.
- Read `docs/STATUS.md` current sections before choosing or continuing work.
- Do not check `docs/BOOTSTRAP.md` just because it exists; use it only when `docs/STATUS.md` Next Actions explicitly points to scaffold bootstrap/onboarding work.
- Treat `.claude/commands/*.md` as Claude Code command definitions, not as executable Codex commands.
- Do not read `.claude/commands/*.md` at session start; load a command file only when that workflow is explicitly invoked or clearly relevant.
- When a Claude command is relevant, follow the same procedure manually.
- Treat `.claude/rules/*.md` as project-local rule references. Do not load them at session start; when editing files whose paths match a rule's `paths` frontmatter, read only the matching rule files and apply their guidance manually.
- Follow `docs/AGENT-WORKFLOW.md` Approval Matrix before execution, scope expansion, state changes, and every commit.
- On failure: follow `docs/HARNESS-PROTOCOL.md` Failure And Recovery.

NEVER:

- Duplicate shared rules here.
- Bypass `docs/STATUS.md` or the Approval Matrix.

## Workflow Skill Routing

When a workflow command is invoked or its intent is matched,
load `.agents/skills/workflow-{name}/SKILL.md` and follow the procedure.
Skill name maps directly to command name (e.g., `/start` → `workflow-start`).

Available workflow skills: directories named `workflow-*` under `.agents/skills/`.

## Product Skill Routing

When the user requests a product skill (create-deck, review-deck, generate-blueprint),
load `.agents/skills/{name}/SKILL.md` and follow the procedure.

Note: `.agents/skills/{name}/SKILL.md` is loaded manually based on intent matching.
App-level automatic skill discovery is outside the scope of this routing.

| Intent | Skill file |
| --- | --- |
| PPT 생성 요청, `/create-deck` | `.agents/skills/create-deck/SKILL.md` |
| deck 검토 요청, `/review-deck` | `.agents/skills/review-deck/SKILL.md` |
| blueprint 작성 요청, `/generate-blueprint` | `.agents/skills/generate-blueprint/SKILL.md` |

Each product skill file loads the canonical procedure from `skills/{name}.md`.

## Document Language Policy

When creating or editing any document, prompt, command, rule, or hook message — confirm DR-007 applies.

- **English Only:** `AGENTS.md`, `CLAUDE.md`, `.claude/rules/*.md`, `.cursor/rules/*.mdc`
- **Korean primary + Bilingual Rules:** `docs/*.md`, `prompts/*.md`, `.claude/commands/*.md`

Full policy: `docs/decisions/DR-007-language-policy.md`

## Branch Flow

When the user expresses branch merge intent (e.g., asking to merge, open a PR, or merge into develop),
If this repository has `docs/GIT-WORKFLOW.md`, load it and follow §2 (Feature Development Cycle) and §3 (Release Cycle). Otherwise, check the project-specific branch/release policy first.
If this repository has `docs/GIT-WORKFLOW.md`, follow §5 for commit format.

NEVER open a PR from a feature branch without `--base develop`. Default GitHub base (main) is wrong for this repo.

After `gh pr merge` completes, follow the merge type:
- feature→develop: execute §2-4 (sync develop, delete local feature branch, suggest next feature branch).
- develop→main: execute §3-4 (Post-Merge Develop Sync: sync main, merge origin/main into develop, push develop).
