---
id: CHORE-20260602-002
title: "Public transition — visibility 전환 및 post-public settings 검증"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: CHORE
branch: feature/chore-20260602-002-public-transition
---

# CHORE-20260602-002 — Public transition

## Goal

`kyungseo/ai-deck-compiler`를 private에서 public으로 전환하고,
개인 public release playbook 기준으로 민감정보, GitHub settings, post-public verification을 확인한다.

## Scope

- 개인 playbook `public-release-playbook`의 public release checklist를 적용한다.
- 민감정보 검색과 public surface 점검을 수행한다.
- repository description/topics/About/settings를 public 전환에 맞게 확인하거나 보정한다.
- visibility를 public으로 전환한다.
- public 전환 직후 ruleset, security settings, Dependabot alerts, fresh clone 검증을 수행한다.
- social release note는 초안 준비 상태만 확인하고, 실제 문구 작성은 사용자와 별도 논의한다.

## Non-goals

- product code 변경
- showcase 산출물 추가 변경
- social post 최종 문구 작성/게시
- 별도 release note 작성
- history rewrite

## Done Criteria

- [x] pre-public clean baseline이 재확인된다.
- [x] sensitive information sweep 결과가 기록된다.
- [x] repo description/topics/public positioning이 확인 또는 보정된다.
- [x] visibility가 public으로 전환된다.
- [x] post-public GitHub settings가 확인 또는 가능한 범위에서 보정된다.
- [x] public clone/install/test/validate가 통과한다.
- [x] Work 결과가 archived 상태로 남고 `docs/STATUS.md`는 clean baseline을 유지한다.

## Verification

```bash
git status --short --branch
rg -n "^status: Done" docs/works
rg -n "^status: Active" docs/works
gh repo view kyungseo/ai-deck-compiler --json defaultBranchRef,deleteBranchOnMerge,hasDiscussionsEnabled,visibility
gh api repos/kyungseo/ai-deck-compiler/dependabot/alerts
npm run typecheck
npm test
npm run validate -- --blueprint examples/sample/blueprint.yaml
git diff --check
```

## Risks

| Risk | Mitigation |
| --- | --- |
| 민감정보가 public 전환 후 발견됨 | 전환 전 tracked/history/artifact sweep을 수행하고, 발견 시 visibility 전환을 보류 |
| GitHub setting 일부가 plan/visibility에 따라 달라짐 | 전환 전후 API 응답을 Work Discovery에 기록 |
| `develop` 장기 브랜치 삭제 | `delete_branch_on_merge=false` 유지, ruleset deletion protection 확인 |
| public fresh clone 실패 | post-public verification에서 즉시 확인 |

## Discovery

### 2026-06-02 — Start

- Current branch: `feature/chore-20260602-002-public-transition`.
- Target repo: `kyungseo/ai-deck-compiler`.
- Release baseline: `main` and `develop` are synced at `8883b4b`; `docs/STATUS.md` has no Active Work, Blockers/OQ, or Next Actions on baseline.
- External playbook: private personal `public-release-playbook` repo.

### 2026-06-02 — Pre-public baseline and sensitive sweep

- `main` and `develop` remote refs both point to `8883b4b`.
- Live Work directory has no `status: Done`; only this branch-local transition Work is `status: Active`.
- Archive Work entries are `status: Archived`.
- Broad secret search produced false positives for design/token terminology and safety-rule text; no tracked secret value was found.
- Focused credential history grep across all commits returned no matches for `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `AWS_`, `DATABASE_URL`, private key headers, `PASSWORD`, or `SECRET`.
- Local path search only found ignored `.claude/settings.local.json` plus two public-facing cleanup items; public-facing local path references were removed from backlog/current Work.
- `.claude/settings.local.json` is ignored and untracked.
- PPTX metadata for tracked showcase decks uses `ai-deck-compiler` author/company and no local path.
- PDF metadata for tracked showcase PDFs uses `ai-deck-compiler` author/title, LibreOffice producer, no custom metadata, no JavaScript, and no encryption.

### 2026-06-02 — Public positioning and metadata cleanup

- Repository description changed to: "Generate polished, editable PPTX from AI-authored blueprints with a rules-based TypeScript renderer."
- Topics changed to: `ai`, `typescript`, `cli`, `developer-tools`, `presentation`, `presentation-automation`, `deck-generation`, `powerpoint`, `pptx`, `pptxgenjs`.
- About URL intentionally left blank.
- `package.json` / `package-lock.json` package name changed from `presentation-compiler` to `ai-deck-compiler`.
- Historical `presentation-compiler` references in `docs/PLAN.md` were updated to `ai-deck-compiler`.

### 2026-06-02 — Pre-public validation

- `npm run typecheck`: pass.
- `npm test`: pass, Vitest 4.1.0, 3 files / 59 tests.
- `npm audit --audit-level=critical`: pass, `found 0 vulnerabilities`.
- `npm run validate -- --blueprint examples/sample/blueprint.yaml`: pass.
- GitHub Dependabot open alerts: none.

### 2026-06-02 — Visibility and post-public settings

- Repository visibility changed from private to public.
- Post-public repository state:
  - `visibility=PUBLIC`, `private=false`, default branch `main`.
  - `delete_branch_on_merge=false` retained to avoid accidental long-lived `develop` deletion.
  - Issues and Discussions are enabled; Wiki is disabled; Projects remains enabled.
  - Secret scanning and secret scanning push protection are enabled.
  - Dependabot automated security updates remain disabled; open Dependabot alerts: none.
- Branch rulesets were created after public visibility made rulesets available:
  - `protect-main`: active branch ruleset for `refs/heads/main`.
  - `protect-develop`: active branch ruleset for `refs/heads/develop`.
  - Both rulesets include `deletion`, `non_fast_forward`, and `pull_request` rules.
  - Both rulesets include `RepositoryRole` Admin bypass (`actor_id=5`, `bypass_mode=always`), and current user can bypass.
- Required status checks were intentionally not added yet because no repository CI check is currently reporting a stable check name.
- GitHub currently reports `licenseInfo=Other` for public `main`; this branch normalizes public license metadata by adding `license: Apache-2.0` to `package.json` / `package-lock.json` and restoring the standard Apache 2.0 `APPENDIX` section in `LICENSE`.
- Follow-up check found the existing `LICENSE` body had multiple wording differences from GitHub's canonical Apache-2.0 license text, so this branch replaces it with the canonical `licenses/apache-2.0` body while keeping `Copyright 2026 Kyungseo Park`.

### 2026-06-02 — Public clone verification

- Fresh public clone path: `/private/tmp/ai-deck-public-clone-20260602-1356`.
- `npm install`: pass, 72 packages installed.
- `npm run typecheck`: pass.
- `npm test`: pass, Vitest 4.1.0, 3 files / 59 tests.
- `npm run validate -- --blueprint examples/sample/blueprint.yaml`: pass.
- Public `main` still showed npm script banners as `presentation-compiler@0.1.0`; this branch already updates the package name to `ai-deck-compiler`.

### 2026-06-02 — Final public surface consistency check

- `CLAUDE.md` and `AGENTS.md` remain thin AI entrypoints for a normal public clone; bootstrap/onboarding is explicitly inactive, and scaffold adoption points to the source workflow repo.
- `AGENTS.md` Document Language Policy now includes `.agents/skills/*/SKILL.md` in the Korean-primary + Bilingual Rules group, matching DR-007.
- `skills/*.md` and `skills/README.md` were checked for current product skill routing and example paths. `examples/basic/blueprint.yaml` exists for `customize-preset` validation.
- Default author fallback changed from the personal email-bearing value to `AI Deck Compiler`; per-deck author can still override this with `deck.author`.
- README and USER-MANUAL no longer expose `default-modern`; the alias remains documented only in SYSTEM-MANUAL and covered by resolver tests for backward compatibility.
- README feature list now includes brand/custom preset customization.
- DR-014 now points to `create-deck` as the canonical blueprint-writing skill and notes deprecated `generate-blueprint` routing.
- DR-022 title and decision wording now explicitly frame `examples/results/*.pptx` as showcase artifacts.

### 2026-06-02 — Archive

- Done Criteria completed and Work archived.
- `docs/STATUS.md` Active Work pointer removed for clean public baseline.
