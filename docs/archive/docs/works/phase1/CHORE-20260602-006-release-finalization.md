---
id: CHORE-20260602-006
title: "release finalization — v1.0.0 tag/release 준비"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: CHORE
branch: feature/chore-20260602-002-public-transition
---

# CHORE-20260602-006 — release finalization

## 목표

Public release 전 최종 정비 이후 `v1.0.0` tag와 GitHub Release를 만들 수 있도록 release title/body
초안과 final gate checklist를 준비한다.

## 범위

- `v1.0.0` GitHub Release title/body 초안 작성
- develop → main release PR 전 Public Clean Baseline Gate 확인 항목 정리
- 외부 `public-release-playbook`에 release title/body 준비 항목 추가
- 남은 release 전 후보와 post-public 후보 분리

## 제외 범위

- 실제 tag 생성
- 실제 GitHub Release 생성
- develop → main PR 생성 또는 merge
- showcase 재생성
- GitHub repo settings 변경

## 완료 기준

- [x] `v1.0.0` release title/body 초안이 준비된다.
- [x] Public Clean Baseline Gate 기준으로 release 전 확인 항목이 정리된다.
- [x] `public-release-playbook` checklist에 release title/body 준비 항목이 추가된다.
- [x] 실제 tag/release/PR/merge는 사용자 최종 승인 전 수행하지 않는다.
- [x] 남은 후보가 release 전 필수와 post-public maintenance로 분리된다.

## 검증

```bash
git diff --check
rg -n "release title|release body|GitHub Release|v1.0.0|Public Clean Baseline Gate" docs README.md
```

## 리스크

| Risk | Mitigation |
| --- | --- |
| 실제 release 작업과 준비 작업이 섞일 수 있음 | tag/release/PR/merge는 non-goal로 고정 |
| release notes가 과장될 수 있음 | public-facing 문구는 실제 기능/제한 기준으로 작성 |
| 외부 playbook repo 변경이 현재 repo 변경과 섞일 수 있음 | 별도 repo 변경으로 기록하고 commit/push 여부를 분리 |

## 발견 기록

### 2026-06-02 — 시작

- `CHORE-20260602-005` archive 후 착수했다.
- 사용자가 앞서 release finalization 후보로 요청한 항목:
  - `v1.0.0` tag와 GitHub Release 전 final cleanup
  - release title/body 초안
  - 외부 `public-release-playbook`에 release title/body 준비 항목 추가

### 2026-06-02 — Release 초안

현재 branch 참고:

- `git log --oneline main..develop`가 비어 있으므로, 현재 develop과 main 사이 release delta는 없다.
- 현재 feature branch에는 release-prep commit과 working-tree 변경이 있으며, develop → main release PR 전에 반드시 feature → develop 경로를 거쳐야 한다.
- 이 Work에서는 tag, release, PR, merge를 생성하지 않는다.

제안 GitHub Release title:

```text
v1.0.0 — 첫 public release
```

제안 GitHub Release body:

```markdown
`ai-deck-compiler`는 AI가 작성한 deck blueprint를 편집 가능한 PowerPoint 파일로 변환하는 TypeScript 기반 presentation compiler입니다.

## 주요 내용

- 자연어 발표 brief에서 구조 제안, blueprint 검토, editable PPTX 생성까지 이어지는 end-to-end `create-deck` workflow를 제공합니다.
- `blueprint.yaml` Deck Specification DSL과 schema validation을 제공합니다.
- agenda, section divider, KPI, chart, table, architecture, timeline, decision, summary, appendix, closing 등 16종 slide type을 지원합니다.
- 신규 deck 기본 추천값으로 `teal + dark` design preset을 제공하고, `vivid`, `modern` preset도 함께 지원합니다.
- slide를 이미지로 굳히지 않고 text, chart, table, shape 중심의 native editable PowerPoint 객체로 생성합니다.
- PNG preview 기반 review loop와 optional PDF export를 지원합니다.
- Claude Code, Codex, Cursor, 일반 AI tool 사용 흐름에서 활용할 수 있는 `create-deck`, `review-deck`, `export-pdf`, `generate-architecture-slide` product skill을 제공합니다.
- showcase blueprint, PPTX, PDF, gallery artifact를 repository에 함께 포함했습니다.

## 빠른 시작

설치와 첫 실행 방법은 README를 확인하세요.

https://github.com/kyungseo/ai-deck-compiler#빠른-시작

Claude Code에서는 다음 command로 시작할 수 있습니다.

```text
/create-deck
```

## 알려진 한계

- Preview PNG 생성에는 LibreOffice와 poppler가 필요합니다.
- PDF export에는 LibreOffice가 필요합니다.
- AI-research-first 품질은 사용하는 AI tool 환경과 browsing/research 가능 여부에 영향을 받습니다.
- `teal`과 `vivid`는 dark-first preset입니다. light/business 문서가 필요하면 `modern + light`를 사용하세요.
- custom preset 제작 workflow는 문서화되어 있지만, package-style custom preset loading은 아직 post-public maintenance 후보입니다.

## 참고

첫 public release입니다. 이번 release는 AI-assisted deck creation loop, editable PPTX output, 대표 examples, public-facing documentation을 공개 가능한 기준으로 정리하는 데 초점을 둡니다.
```

### 2026-06-02 — 최종 gate checklist

실제 `v1.0.0` tag / GitHub Release 전 확인:

- feature branch 변경이 feature → develop PR을 통해 `develop`에 merge되어 있어야 한다.
- develop → main release PR은 Public Clean Baseline Gate 통과 후에만 만든다.
- `docs/STATUS.md` Active Work가 비어 있어야 한다.
- `docs/works/**`에 `status: Done` archive-pending Work가 없어야 한다.
- intentional pre-merge feature state를 제외하고 `status: Active` Work leakage가 없어야 한다.
- README / USER-MANUAL / SYSTEM-MANUAL이 최신이어야 한다.
- commit/PR 전 `git diff --check`, `npm run typecheck`, `npm test`, 대표 `npm run validate`를 완료해야 한다.
- publish 전 release title/body를 사용자가 최종 검토해야 한다.

### 2026-06-02 — 남은 작업 분리

Public release 전 후보:

- final validation과 commit approval 후 현재 release-prep 변경을 commit한다.
- base `develop`으로 feature → develop PR을 연다.
- develop merge 후 develop → main release PR 전에 Public Clean Baseline Gate를 실행한다.
- `v1.0.0` tag와 GitHub Release는 main release merge 완료 후, 사용자 승인 뒤에만 생성한다.

Post-public / optional 후보:

- `social-post-prep`: 사용자 초안/톤을 받거나 release notes를 source로 삼아 진행한다.
- `code-quality-audit`: 사용자가 public 전 추가 pass를 원하지 않으면 low-risk `src/tests/cli` audit은 post-public에 진행해도 된다.
- Discussions enablement: optional, 현재 disabled.
- Dependabot security updates: optional, 현재 disabled. vulnerability alerts는 enabled.
- Ruleset merge method tightening: optional. 문서는 regular merge를 요구하지만 GitHub rulesets는 현재 merge/squash/rebase를 허용한다.

### 2026-06-02 — 외부 playbook 업데이트

- `/Users/kyungseo/dev-home/vibe/public-release-playbook/github-public-release-checklist.md`에는 이미 §10 "Release 준비 — 타이틀과 노트"가 있고 release title/notes guidance가 포함되어 있다.
- 외부 playbook `README.md`에서 `github-public-release-checklist.md`가 GitHub Release title/notes 준비 기준을 포함한다는 점이 보이도록 수정했다.
- 외부 playbook 운영 원칙에 GitHub Release publish 전 release title/notes를 먼저 준비하라는 항목을 추가했다.

### 2026-06-02 — 검증

- `git log --oneline main..develop`: 통과, 현재 develop→main delta 없음.
- `git log --oneline develop..HEAD`: 통과, feature branch에 release-prep commit이 있음을 확인.
- `git diff --check`: 통과.
- 외부 `public-release-playbook` `git diff --check`: 통과.

### 2026-06-02 — 아카이브

- Done Criteria를 모두 완료하고 검증했다.
- Public Clean Baseline Gate에 Active/Done-pending Work가 남지 않도록 즉시 archive했다.
