# AGENTS.md

Codex entry point for this repository.
Keep this file thin. Global behavior principles live in `docs/BEHAVIOR-PRINCIPLES.md`. Shared operating rules live in `docs/AGENT-WORKFLOW.md`.

## Non-Negotiable Preflight

Before planning, editing, committing, opening a PR, or merging:

1. Check the current branch.
2. Read `docs/STATUS.md` Current State, Active Work, Blockers And Open Questions, and Next Actions.
3. If Active Work exists, load that Work file before proposing a different task.
4. If `docs/GIT-WORKFLOW.md` exists, follow its branch, PR base, merge, and commit rules.
5. If the task changes workflow, command, rule, prompt, status, backlog, or Work files, treat it as L2 unless the active Work says otherwise.
6. Do not change state files, commit, create PRs, or merge without passing the Approval Matrix gate.

## Entry Contract

MUST:

- Treat this file and `CLAUDE.md` as equal tool-specific entry points. Supported tools are Claude Code / Codex / Antigravity (Gemini-based) / Cursor.
- Read and follow `docs/BEHAVIOR-PRINCIPLES.md` at session start for global behavioral principles that apply to all tasks.
- Read and follow `docs/AGENT-WORKFLOW.md` at session start for common workflow, context routing, status rules, and validation defaults.
- Read `docs/STATUS.md` current sections before choosing or continuing work.
- Bootstrap/onboarding is complete for this repo; if scaffold adoption guidance is needed, refer to the source workflow repo instead of local bootstrap files.
- Treat `.claude/commands/*.md` as Claude Code command definitions, not as executable Codex commands. Do not read them at session start or follow them directly; run workflows through the Codex skill adapters per Codex Skill Routing below.
- Treat `.claude/rules/*.md` as project-local rule references. Do not load them at session start; when editing files whose paths match a rule's `paths` frontmatter, read only the matching rule files and apply their guidance manually.
- Follow `docs/AGENT-WORKFLOW.md` Approval Matrix before execution, scope expansion, state changes, and every commit.
- On failure: follow `docs/HARNESS-PROTOCOL.md` Failure And Recovery.

NEVER:

- Duplicate shared rules here.
- Bypass `docs/STATUS.md` or the Approval Matrix.

## Workflow Skill Routing

When a workflow command is invoked or its intent is matched,
load `.agents/skills/workflow-{name}/SKILL.md` and follow the procedure.
Skill name maps directly to command name (e.g., `/session-start` → `workflow-session-start`).
Each skill adapter must load the matching canonical procedure in `skills/workflow/{name}.md` as Step 0.

Available workflow skills: directories named `workflow-*` under `.agents/skills/`.

## Product Skill Routing

When the user requests a product skill (create-deck, review-deck, export-pdf, generate-architecture-slide),
load `.agents/skills/{name}/SKILL.md` and follow the procedure.

Note: `.agents/skills/{name}/SKILL.md` is loaded manually based on intent matching.
App-level automatic skill discovery is outside the scope of this routing.

| Intent | Skill file |
| --- | --- |
| Request to create a presentation or write a blueprint, `/create-deck` | `.agents/skills/create-deck/SKILL.md` |
| Request to review a deck or blueprint, `/review-deck` | `.agents/skills/review-deck/SKILL.md` |
| Request to export a PPTX to PDF, `/export-pdf` | `.agents/skills/export-pdf/SKILL.md` |
| Request to generate an architecture slide diagram, `/generate-architecture-slide` | `.agents/skills/generate-architecture-slide/SKILL.md` |

Each product skill file loads the canonical procedure from `skills/{name}.md`.

Antigravity (Gemini-based) consumes this same `.agents/` surface: it auto-loads root `AGENTS.md` and discovers `.agents/skills/workflow-{name}/SKILL.md`, following the identical Step 0 → canonical procedure. No Antigravity-specific adapter exists; the `Antigravity` row in each canonical adapter table reuses the Codex adapter.

If the matched skill intent is uncertain or multiple skills are equally plausible, confirm the interpreted intent in one line before loading a skill. Do not silently pick one and execute.

## Language Policy

`docs/decisions/DR-007-language-policy.md` is the single SSoT for language. When creating or editing any document, prompt, command, rule, hook message, **commit message, or PR body** — confirm DR-007 applies.

- **English Only:** `AGENTS.md`, `CLAUDE.md`, `.claude/rules/*.md`, `.cursor/rules/*.mdc`
- **Korean primary + Bilingual Rules:** `docs/*.md`, `prompts/*.md`, `skills/workflow/*.md`, `.claude/commands/*.md`, `.agents/skills/*/SKILL.md`
- **Commit message:** English type prefix; Korean-primary subject/body (Bilingual Rules); English co-author trailer.
- **PR body:** Korean-primary + Bilingual Rules.
- **Agent user-facing output** (progress narration, tool descriptions, echo labels): follow the conversation language (default Korean). Default conversational convention, not a hard gate.

Full policy: `docs/decisions/DR-007-language-policy.md`

## Branch Flow

When the user expresses branch merge intent (e.g., asking to merge, open a PR, or merge into develop),
If this repository has `docs/GIT-WORKFLOW.md`, load it and follow §2 (Feature Development Cycle) and §3 (Release Cycle). Otherwise, check the project-specific branch/release policy first.
If this repository has `docs/GIT-WORKFLOW.md`, follow §5 for commit format.

NEVER open a PR from a feature branch without `--base develop`. Default GitHub base (main) is wrong for this repo.

Before opening a feature PR, sync the latest `develop` into the feature branch (`git fetch origin && git merge origin/develop`) per `docs/GIT-WORKFLOW.md` §2-3, resolving conflicts locally. Default to `merge` (squash policy makes rebase's linear history moot); `--force-with-lease` only on your own feature branch, never on `develop`/`main`.

After `gh pr merge` completes, follow the merge type:
- feature→develop: use `--squash` (default per harness merge policy); use `--merge` only when commit-level history must be preserved. Then execute §2-5 (sync develop, delete local feature branch, suggest next feature branch).
- develop→main: use `--merge` (regular merge is the default per harness merge policy). Then execute §3-4 (Post-Merge Develop Sync: sync main, merge origin/main into develop, push develop).
