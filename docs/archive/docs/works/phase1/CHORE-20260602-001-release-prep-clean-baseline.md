---
id: CHORE-20260602-001
title: "Release prep clean baseline — public main PR gate 정리"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: CHORE
branch: feature/release-prep-20260602
---

# CHORE-20260602-001 — Release prep clean baseline

## Goal

`develop → main` public release PR 전 Public Clean Baseline Gate를 통과할 수 있도록
Work archive 상태, STATUS dashboard, GitHub repo settings checklist를 정리한다.

## Scope

- `docs/works/phase1`의 Done archive pending Work를 archive로 이동한다.
- archive된 Work frontmatter를 `status: Archived`로 정리한다.
- `docs/works/phase1/README.md` 인덱스를 Done pending 없음 / Archived 목록으로 맞춘다.
- DR-020 기준 GitHub repo settings를 확인하고 필요한 보정을 수행한다.
- `docs/STATUS.md` Active Work, Blockers/OQ, Next Actions가 public baseline에 맞는지 정리한다.
- Public Clean Baseline Gate 결과를 Discovery에 기록한다.

## Non-goals

- product feature 추가
- dependency 추가 변경
- showcase 산출물 변경
- release notes/social post 작성

## Done Criteria

- [x] `docs/works/**` 아래 `status: Done` 항목이 없다.
- [x] `docs/works/**` 아래 `status: Active` 항목이 없다.
- [x] `docs/archive/docs/works/**` 아래 archive된 Work가 `status: Archived`다.
- [x] `docs/STATUS.md` Active Work, Blockers/OQ, Next Actions가 public baseline에 맞다.
- [x] GitHub repo settings checklist가 DR-020 기준으로 확인되거나 필요한 보정이 수행된다.
- [x] `git diff --check` 및 release gate inspection commands가 통과한다.

## Verification

```bash
git status --short --branch
rg -n "^status: Done" docs/works
rg -n "^status: Active" docs/works
rg -n "^status:" docs/archive/docs/works
git diff --check
gh repo view kyungseo/ai-deck-compiler --json defaultBranchRef,deleteBranchOnMerge,hasDiscussions,visibility
gh api repos/kyungseo/ai-deck-compiler/rulesets
```

## Risks

| Risk | Mitigation |
| --- | --- |
| 대량 Work 이동으로 인덱스 drift 발생 | `rg`와 Work index를 함께 확인한다 |
| repo settings API 권한 부족 | 실패 시 Discovery에 기록하고 main PR gate에서 block 처리 |
| archive 중 현재 release-prep Work가 Done pending으로 남음 | release-prep Work 자체도 마지막에 Archived로 이동한다 |

## Discovery

### 2026-06-02 — Start

- Current branch: `feature/release-prep-20260602`.
- Trigger: `develop → main` PR 전 Public Clean Baseline Gate에서 Done archive pending Work가 다수 확인됨.
- Strategy: archive all Done Work, verify GitHub settings, then archive this release-prep Work as the final lifecycle cleanup.

### 2026-06-02 — Work archive

- Moved Phase 1 Done archive pending Work files from `docs/works/phase1/` to `docs/archive/docs/works/phase1/`.
- Updated archived Work frontmatter from `status: Done` to `status: Archived`.
- Regenerated `docs/works/phase1/README.md` with an empty Done pending table and archive paths.
- Archived this release-prep Work as the final lifecycle cleanup to avoid leaving a new Done pending Work before `develop → main`.

### 2026-06-02 — GitHub repo settings check

- `delete_branch_on_merge`: changed from `false` to `true`.
- `has_discussions`: changed from `false` to `true`.
- `allow_update_branch`: confirmed `true`.
- `vulnerability alerts`: confirmed enabled via `gh api repos/kyungseo/ai-deck-compiler/vulnerability-alerts -i` returning HTTP 204.
- Dependabot open critical alerts still appear on default branch `main` because the Vitest fix is currently on `develop`; expected to close after `develop → main` release merge.
- Rulesets API returned HTTP 403 while repo visibility is private: "Upgrade to GitHub Pro or make this repository public to enable this feature."
- Secret scanning enable attempt returned HTTP 422 while repo visibility is private: "Secret scanning is not available for this repository."
- Release gate interpretation: code/docs baseline is clean for `develop → main`; rulesets and secret scanning require post-visibility public settings verification.

### 2026-06-02 — Gate inspection

- `rg -n "^status: Done" docs/works`: no matches.
- `rg -n "^status: Active" docs/works`: no matches after this Work archive.
- `rg -n "^status:" docs/archive/docs/works`: archived Work entries use `status: Archived`.
- `docs/STATUS.md`: Active Work empty, Blockers/OQ empty, Next Actions empty.
