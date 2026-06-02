---
id: CHORE-20260602-005
title: "public repo settings — GitHub 공개 저장소 설정 확인"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: CHORE
branch: feature/chore-20260602-002-public-transition
---

# CHORE-20260602-005 — public repo settings

## 목표

Public release 전에 GitHub repository 설정이 공개 저장소 운영에 맞게 정리되어 있는지 확인한다.

## 범위

- GitHub description, topics, About 설정 확인
- protect-main / protect-develop ruleset 확인
- secret scanning, push protection, vulnerability alerts 확인
- delete_branch_on_merge, allow_update_branch, discussions 확인
- owner/admin bypass 설정 확인

## 제외 범위

- 코드 또는 문서 기능 변경
- release tag 또는 GitHub Release 생성
- GitHub 설정을 임의로 변경
- showcase 재생성

## 완료 기준

- [x] GitHub description, topics, About 설정이 public 사용자에게 적절한지 확인한다.
- [x] protect-main / protect-develop ruleset이 확인된다.
- [x] secret scanning, push protection, vulnerability alerts가 확인된다.
- [x] delete_branch_on_merge, allow_update_branch, discussions 설정이 확인된다.
- [x] owner/admin bypass 설정이 확인된다.
- [x] 변경이 필요한 항목과 post-public maintenance 후보를 분리한다.

## 검증

```bash
gh repo view kyungseo/ai-deck-compiler --json nameWithOwner,description,repositoryTopics,visibility,isPrivate,deleteBranchOnMerge,hasDiscussionsEnabled
gh api repos/kyungseo/ai-deck-compiler
gh api repos/kyungseo/ai-deck-compiler/rulesets
git diff --check
```

## 리스크

| Risk | Mitigation |
| --- | --- |
| GitHub API가 권한 또는 public 전환 상태에 따라 일부 필드를 숨길 수 있음 | 확인 불가 항목은 명확히 표시하고 UI 확인 후보로 분리 |
| 설정 변경이 repo 운영에 즉시 영향을 줄 수 있음 | 이번 Work는 확인 중심으로 두고, 변경은 사용자 승인 후 별도 수행 |
| delete_branch_on_merge가 develop 삭제 사고와 충돌할 수 있음 | false 유지 여부를 명시적으로 확인 |

## 발견 기록

### 2026-06-02 — 시작

- `CHORE-20260602-004` archive 후 착수했다.
- 후보 출처: `docs/backlog/PHASE1.md` `[public-repo-settings]`.
- backlog에 기록된 참고 문서: source workflow repo `docs/decisions/DR-020-github-repo-settings.md`.

### 2026-06-02 — GitHub settings 확인

- Repository visibility와 About:
  - `visibility`: `PUBLIC`
  - `description`: `Generate polished, editable PPTX from AI-authored blueprints with a rules-based TypeScript renderer.`
  - topics: `ai`, `cli`, `deck-generation`, `developer-tools`, `powerpoint`, `pptx`, `pptxgenjs`, `presentation`, `presentation-automation`, `typescript`
  - homepage: empty
  - pinned repo: 사용자 profile의 pinned repository 목록에 `kyungseo/ai-deck-compiler`가 포함되어 있다.
- 일반 repository settings:
  - `deleteBranchOnMerge`: `false` — 이전 develop 삭제 사고 이후 안전한 설정을 유지한다.
  - `allow_update_branch`: `true`
  - `hasDiscussionsEnabled`: `false`
  - 허용 merge method: merge, squash, rebase
- Security:
  - secret scanning: enabled
  - secret scanning push protection: enabled
  - vulnerability alerts endpoint가 HTTP 204 No Content를 반환했다. enabled 상태로 해석한다.
  - Dependabot security updates: disabled.
- Branch rulesets:
  - `protect-develop`: `refs/heads/develop`에 active. deletion block, non-fast-forward block, pull request rule 포함.
  - `protect-main`: `refs/heads/main`에 active. deletion block, non-fast-forward block, pull request rule 포함.
  - 두 ruleset 모두 ruleset 수준에서 `merge`, `squash`, `rebase` merge method를 허용한다.
  - 두 ruleset 모두 `bypass_mode: always`인 RepositoryRole bypass actor를 포함하며, 현재 사용자는 bypass 가능하다.

### 2026-06-02 — 평가

- public release blocker는 발견되지 않았다.
- `deleteBranchOnMerge=false`를 유지한다.
- 선택적 post-public maintenance:
  - public Q&A가 필요할 때만 Discussions enable을 검토한다.
  - 자동 security PR을 원하면 Dependabot security updates enable을 검토한다. vulnerability alerts 자체는 이미 enabled다.
  - GitHub ruleset에서 regular merge를 강제하고 싶다면 허용 merge method를 나중에 더 좁힐 수 있다. 현재는 `docs/GIT-WORKFLOW.md` 정책으로 regular merge를 요구한다.

### 2026-06-02 — 검증

- `gh repo view kyungseo/ai-deck-compiler --json nameWithOwner,description,repositoryTopics,visibility,isPrivate,deleteBranchOnMerge,hasDiscussionsEnabled,viewerPermission,url`: 통과.
- `gh api repos/kyungseo/ai-deck-compiler`: 통과.
- `gh api repos/kyungseo/ai-deck-compiler/rulesets`: 통과.
- `gh api repos/kyungseo/ai-deck-compiler/rulesets/17151770`: 통과.
- `gh api repos/kyungseo/ai-deck-compiler/rulesets/17151771`: 통과.
- `gh api -i repos/kyungseo/ai-deck-compiler/vulnerability-alerts`: 통과, HTTP 204.
- `gh api graphql ... pinnedItems`: 통과, repo pinned 확인.

### 2026-06-02 — 아카이브

- Done Criteria를 모두 완료하고 검증했다.
- release finalization prep을 시작하기 전에 Public Clean Baseline Gate에 Active/Done-pending Work가 남지 않도록 즉시 archive했다.
