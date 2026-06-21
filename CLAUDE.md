# CLAUDE.md

Claude Code entry point for this repository.
Keep this file thin. Global behavior principles live in `docs/BEHAVIOR-PRINCIPLES.md`. Shared operating rules live in `docs/AGENT-WORKFLOW.md`.

@docs/BEHAVIOR-PRINCIPLES.md
@docs/AGENT-WORKFLOW.md

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

- Treat this file and `AGENTS.md` as equal tool-specific entry points. Supported tools are Claude Code / Codex / Antigravity (Gemini-based) / Cursor. Antigravity has no dedicated entry file: it auto-loads root `AGENTS.md` and consumes `.agents/skills/` (the Codex surface).
- Follow `docs/BEHAVIOR-PRINCIPLES.md` for global behavioral principles that apply to all tasks.
- Follow `docs/AGENT-WORKFLOW.md` for common workflow, context routing, status rules, and validation defaults.
- Read `docs/STATUS.md` current sections before choosing or continuing work.
- Bootstrap/onboarding is complete for this repo; if scaffold adoption guidance is needed, refer to the source workflow repo instead of local bootstrap files.
- Use `.claude/commands/` for repeated Claude Code workflows when available.
- Do not read `.claude/commands/*.md` at session start; load a command file only when that workflow is explicitly invoked or clearly relevant.
- Follow `docs/AGENT-WORKFLOW.md` Approval Matrix before execution, scope expansion, state changes, and every commit.

NEVER:

- Duplicate shared rules here.
- Bypass `docs/STATUS.md` or the Approval Matrix.
