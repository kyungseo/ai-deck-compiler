---
id: CHORE-20260601-001
title: "Public release gate — 공개 전 최종 정리"
status: Done
created: 2026-06-01
actual_end: 2026-06-01
type: CHORE
branch: chore/CHORE-20260601-001-public-release-gate
---

# CHORE-20260601-001 — Public release gate

## Goal

`ai-deck-compiler`를 public GitHub repo로 전환하기 전, 외부 사용자가 README에서 시작해
AI-assisted deck 생성, examples 확인, 시스템 구조 이해, 기여 준비까지 자연스럽게 진행할 수 있도록
repo 표면을 정리한다.

이번 Work는 공개 전환의 umbrella gate다. 개별 개선을 무제한 수행하지 않고, 공개 전 필수 정리와
후속 유지보수 backlog 분리를 목표로 한다.

---

## Release Gate Pattern

공개 전환 또는 큰 릴리스 직전에는 아래 순서로 정리한다.

1. **State gate** — `STATUS`, backlog, Work index가 실제 상태와 일치하는지 확인한다.
2. **Public surface gate** — README, USER/SYSTEM manual, examples, package metadata를 외부 사용자 기준으로 확인한다.
3. **AI surface gate** — Claude/Codex/Cursor/Claude App routing과 prompt가 같은 canonical workflow를 가리키는지 확인한다.
4. **Artifact gate** — showcase blueprint/PPTX/PDF/gallery가 최신이고 품질 기준을 만족하는지 확인한다.
5. **Code gate** — `src/`, tests, CLI를 audit하고 public 전 low-risk 수정만 수행한다.
6. **Cleanup gate** — 내부 harness 부산물 중 public 가치가 낮은 파일을 삭제하거나 최소화한다.
7. **Repo settings gate** — GitHub ruleset, security, About/Topics, discussion 등 public repo 설정을 확인한다.
8. **Final validation gate** — typecheck/test/validate/diff/stale phrase/clean clone smoke를 수행한다.

---

## Scope

### 오늘 우선 정리 (2026-06-01)

1. Public release gate Work 생성 및 상태 연결
2. `docs/STATUS.md`, `docs/backlog/PHASE1.md`, `docs/PLAN.md`, `docs/PLAN-SUMMARY.md`를 공개 전환/유지보수 phase 관점으로 재정리
3. showcase, AI tool simulation, code quality audit, social post 준비를 후속 task로 등록
4. 불필요한 harness 표면 1차 삭제/최소화
   - `prompts/*session-start.md` 3종과 `prompts/README.md`만 유지하고 나머지 generic prompt 제거
   - `docs/WORKFLOW-MANUAL.md`는 원본 `ai-workflow-harness`를 직접 참조하도록 삭제
   - public repo 사용자가 읽을 필요가 낮은 harness 문서를 식별하고 삭제/유지/후속 검토로 분류

### 공개 전 완료해야 할 후속 gate

| Gate | 목적 | 처리 방식 |
| --- | --- | --- |
| Showcase final polish | repo 소개 PPTX 품질 최대화, examples/results 최신화 | 별도 Work 후보 |
| AI tool simulation | Claude/Codex/Cursor/Claude App 케이스별 흐름 검증 | 별도 Work 후보 |
| Code quality audit | `src/` 개선 포인트 audit, low-risk fix만 반영 | 별도 Work 후보 |
| Docs final review | README/USER/SYSTEM 최종 현행화 | 이 Work 또는 별도 Work |
| Public repo settings | DR-020 기준 GitHub 설정 확인 | release 직전 checklist |
| Social post prep | public 전환용 소셜 포스팅 초안 작성 | 별도 task 후보 |

---

## Non-goals

- renderer/layout 대규모 리팩토링
- 새 slide type 추가
- npm package 공개
- GitHub public 전환 버튼 실행
- 모든 harness 파일 일괄 제거
- 완료된 Work 이력 전체 삭제
- source workflow 원본(`ai-workflow-harness`) 문서를 이 repo 안에 중복 유지

---

## Decisions

### D1 — PLAN 정리 방향

공개 직전에는 `docs/PLAN.md`의 초기 구축 계획을 모두 클리어하고 archive 대상으로 전환한다.
public 이후에는 유지보수 phase 중심의 새 plan으로 재구성한다.

### D2 — prompts 최소화

`prompts/`는 session-start prompt 3종(`claude-session-start.md`, `codex-session-start.md`,
`cursor-session-start.md`)과 `README.md`만 유지한다. 나머지 generic harness prompt는 원본
`ai-workflow-harness`의 책임으로 보고 삭제한다.

### D3 — workflow manual 중복 제거

`docs/WORKFLOW-MANUAL.md`는 이 repo 안에서 직접 유지하지 않는다. 필요 시 원본
`ai-workflow-harness` 문서를 참조한다.

### D4 — social post를 release task로 관리

public 전환용 소셜 포스팅 준비는 문서 작업의 부수물이 아니라 별도 release communication task로 관리한다.

### D5 — scaffold generator는 scaffold target에 포함하지 않음

`scripts/create-harness.sh`는 source workflow repo(`ai-workflow-harness`)의 scaffold generator다.
scaffold 대상 repo는 workflow 운용에 필요한 entrypoint, rules, skills, status/backlog/work 구조를 받으면 충분하다.
대상 repo 자체가 다시 하위 프로젝트를 scaffold하는 product가 아니라면 generator script와 template source를 포함하지 않는다.
따라서 이 repo에서 `scripts/create-harness.sh` 검증은 “script가 존재할 때만” 적용되는 조건부 규칙이어야 한다.

### D6 — 이 repo는 canonical scaffold 산출물이 아니라 adoption 결과로 본다

`ai-deck-compiler`는 정식 `scripts/create-harness.sh` 실행 결과가 아니라, AI에게 scaffold 형태로 구성하도록 요청해
시작된 repo다. 따라서 source harness 표면과 scaffold target 표면이 일부 섞여 있을 수 있다. 공개 전 정리는
canonical scaffold와의 일치 여부보다, product repo가 유지보수 가능한 workflow를 갖고 있는지와 source-only
generator/maintainer 문서가 과하게 남아 있지 않은지를 기준으로 판단한다.

---

## Open Questions

| ID | Question | Current Lean |
| --- | --- | --- |
| OQ-1 | `docs/works/`, `docs/backlog/`, `docs/STATUS.md`를 public repo에 그대로 둘 것인가? | 이번 공개 전에는 유지하되 stale 내용만 정리. 공개 후 별도 cleanup 가능 |
| OQ-2 | harness 상세 문서 중 어떤 파일을 유지할 것인가? | `AGENT-WORKFLOW`, `BEHAVIOR-PRINCIPLES`, `GIT-WORKFLOW`는 당분간 유지. 상세 protocol류는 삭제/후속 검토 후보 |
| OQ-3 | showcase deck을 create-deck self-dogfood 결과로 교체할 것인가? | 사용자가 실제 실행한 결과가 더 좋으면 교체 |
| OQ-4 | default author/email 노출을 공개용으로 유지할 것인가? | 별도 확인 필요 |
| OQ-5 | LICENSE를 Apache License 2.0으로 유지할 것인가? | 유지. 기존 공개 repo와 일관성을 맞추고 명시적 patent grant를 선호 |

---

## Plan

1. **Work/Status 연결**
   - `docs/STATUS.md` Active Work에 이 Work를 연결한다.
   - `docs/works/phase1/README.md` Active에 이 Work를 추가한다.

2. **State 문서 정리**
   - `docs/backlog/PHASE1.md`의 오래된 generate-blueprint 중심 설명을 create-deck 중심으로 수정한다.
   - 완료된 구축 계획과 공개 전 남은 gate를 분리한다.
   - `docs/PLAN.md`, `docs/PLAN-SUMMARY.md`를 public 이후 유지보수 phase 관점으로 정리할 계획을 반영한다.

3. **후속 task 등록**
   - showcase final polish
   - AI tool simulation
   - code quality audit
   - docs final review
   - public repo settings
   - social post prep

4. **Harness surface 최소화**
   - `prompts/`에서 session-start 3종과 README를 제외한 generic prompt 삭제
   - `docs/WORKFLOW-MANUAL.md` 삭제
   - 기타 harness 문서 삭제 후보를 Discovery에 기록하고, 즉시 삭제 여부를 구분한다.

5. **검증**
   - `git diff --check`
   - stale phrase search: `generate-blueprint`, `default-modern`, old prompt references, `WORKFLOW-MANUAL`
   - 삭제 후 남은 링크/참조 확인

---

## Done Criteria

- [x] Public release gate Work가 생성되고 `STATUS`/Work index에 연결됨
- [x] `docs/backlog/PHASE1.md`가 create-deck 중심 현행 상태와 public gate 후보를 반영함
- [x] `docs/PLAN.md` / `docs/PLAN-SUMMARY.md`가 공개 직전 archive 목표와 유지보수 phase 재구성 방향을 반영함
- [x] showcase / AI tool simulation / code quality audit / docs final review / repo settings / social post task가 backlog 또는 Work 계획에 등록됨
- [x] `prompts/`는 session-start 3종 + README만 남음
- [x] `docs/WORKFLOW-MANUAL.md` 삭제 또는 원본 harness 참조 방식으로 정리됨
- [x] 삭제하지 않은 harness 문서의 유지 사유 또는 후속 검토 필요성이 기록됨
- [x] `git diff --check` 통과

---

## Discovery

### 2026-06-01 — Initial audit

- 현재 branch: `chore/CHORE-20260601-001-public-release-gate`
- `develop`에서 분기. 분기 시점 worktree clean.
- `docs/STATUS.md`는 Active Work 없음, FEAT-012 Done 상태.
- `docs/backlog/PHASE1.md`는 아직 `generate-blueprint` 중심의 오래된 핵심 흐름을 포함한다.
- `docs/PLAN-SUMMARY.md`는 slide type 수와 workflow 설명이 최신 상태와 다르다.
- `prompts/`에는 session-start 3종 외 generic harness prompt 다수가 남아 있다.
- `docs/WORKFLOW-MANUAL.md`는 source harness 원본과 중복되는 공개 가치 낮은 문서로 분류했다.

### 2026-06-01 — 오늘 범위 반영

- `docs/STATUS.md` Active Work에 CHORE-20260601-001 pointer 추가.
- `docs/works/phase1/README.md` Active에 CHORE-20260601-001 추가.
- `docs/backlog/PHASE1.md`를 public release / maintenance backlog로 재작성.
  - `generate-blueprint` 중심의 오래된 Phase 1 설명 제거.
  - showcase final polish, AI tool simulation, docs final review, public repo settings, social post prep, code quality audit 후보 등록.
- `docs/PLAN-SUMMARY.md`를 public release gate + maintenance phase 기준으로 재작성.
- `docs/PLAN.md` 상단에 Phase 1 구축 계획 archive 및 maintenance phase 전환 안내 추가.
- `prompts/`에서 session-start 3종과 README 외 generic prompt 삭제.
- `docs/WORKFLOW-MANUAL.md` 삭제. `docs/AGENT-WORKFLOW.md`는 원본 `ai-workflow-harness` manual 참조 방식으로 보정.
- `.cursor/rules/execution.mdc`의 기본 검증 명령을 source harness scaffold 검증에서 이 repo의 TypeScript/deck 검증으로 보정.
- `scripts/create-harness.sh`는 scaffold 대상 repo의 기본 포함물이 아니라 source harness repo의 generator로 분류.
- `docs/STATUS.md` Current State에 workflow profile과 bootstrap inactive 상태를 명시.
- `CLAUDE.md`/`AGENTS.md`에 Non-Negotiable Preflight 추가.
- `/work`, `/close` 및 대응 `.agents/skills/workflow-*` mirror에 Step 0 Mandatory Gate 추가.

### Harness document classification

| 파일 | 이번 Work 판단 |
| --- | --- |
| `docs/BEHAVIOR-PRINCIPLES.md` | 유지. public 이후 AI 협업 원칙으로 여전히 유효 |
| `docs/AGENT-WORKFLOW.md` | 유지. `AGENTS.md`/`CLAUDE.md` entry contract가 참조 |
| `docs/GIT-WORKFLOW.md` | 유지. public PR/branch flow 기준 |
| `docs/HARNESS-PROTOCOL.md` | 후속 검토. 현재 workflow skills가 참조하므로 즉시 삭제하지 않음 |
| `docs/HARNESS-QUICK-REFERENCE.md` | 후속 검토. workflow skill 운영 시 빠른 참조로 유효 |
| `docs/HARNESS-RECOVERY-VALIDATION.md` | 후속 검토. validation/recovery 상세 기준 |
| `docs/HARNESS-NAMING-RULES.md` | 후속 검토. Work/DR naming 기준 |
| `docs/HARNESS-ARCHITECTURE.md` | 삭제. source harness 원본과 중복 가능성이 크고 public product repo 노출 가치 낮음 |
| `docs/HARNESS-MAINTAINER-GUIDE.md` | 삭제. source harness maintainer 관점 문서로 product repo에는 과함 |
| `docs/HARNESS-PARALLEL-WORK-CONTROLS.md` | 후속 cleanup 후보. public contributor 경로에서 낮은 우선순위 |
| `docs/BOOTSTRAP.md` | 삭제. scaffold bootstrap 완료 후 public product repo에는 낮은 가치 |

### 2026-06-01 — Scaffold adoption drift audit

- 이 repo는 정식 `scripts/create-harness.sh` 실행 산출물이 아니라 AI가 scaffold 형태로 구성한 adoption repo로 확인했다.
- Core workflow는 유지된다: `AGENTS.md`/`CLAUDE.md`, `docs/STATUS.md`, `docs/AGENT-WORKFLOW.md`, workflow skills, Claude commands, Cursor rules.
- Source-only generator는 없음: `scripts/create-harness.sh`, `scripts/templates/**`는 존재하지 않고, `scripts/`에는 product script인 `gen-blueprint-schema.ts`만 존재.
- Drift 후보:
  - `docs/STATUS.md` Current State의 bootstrap 포인터는 `Complete / inactive`로 보정했다.
  - `docs/BOOTSTRAP.md`는 scaffold 직후 onboarding 문서라 삭제했다.
  - `docs/HARNESS-ARCHITECTURE.md`, `docs/HARNESS-MAINTAINER-GUIDE.md`는 source harness generator/maintainer 관점 설명이 많아 삭제했다.
  - `docs/GIT-WORKFLOW.md`는 `policy_type: source-gitflow` marker가 있으나, 이 repo가 실제 `feature -> develop -> main` 운영을 채택했으므로 현재는 유지한다.

### 2026-06-01 — Validation

- `find prompts -maxdepth 1 -type f | sort`: session-start 3종과 `prompts/README.md`만 남은 것 확인.
- Old generic prompt filename search: 삭제한 prompt 파일명 참조 0건 확인.
- Stale phrase search:
  - `generate-blueprint`: `STATUS`의 DR 기록, backlog Done 기록, redirect wrapper만 남음.
  - `default-modern`: legacy alias 설명과 과거 완료 기록만 남음.
  - `WORKFLOW-MANUAL`: naming snapshot 예시와 이 Work의 삭제 기록 외 active routing 참조 제거.
- `create-harness.sh` 검증 참조: health command/skill에는 “source scaffold가 있을 때만” 조건부 참조로 남고, Cursor 기본 검증에서는 제거됨.
- Claude/Codex command mirror check: `/work`와 `/close` 양쪽에 Step 0 Mandatory Gate가 반영됨.
- 삭제 문서 stale reference check:
  - `docs/BOOTSTRAP.md`, `HARNESS-ARCHITECTURE`, `HARNESS-MAINTAINER-GUIDE`, `SCAFFOLD-BOOTSTRAP`, `SCAFFOLD-ONBOARDING-GUIDE`는 active entry/command/rule/manual 표면에서 참조 0건.
  - 해당 이름은 이 Work의 cleanup 기록에만 남김.
- README / USER-MANUAL / SYSTEM-MANUAL quick stale check: 삭제 문서와 generic prompt 참조 없음.
- `git diff --check`: 통과.

### 2026-06-01 — Pre-close public text cleanup

- README의 `CONTRIBUTING.md` 준비 중 문구는 삭제했다. 아직 협업 운영 계획이 구체화되지 않았으므로 issue 기반 피드백 안내만 유지한다.
- License는 Apache License 2.0을 유지하기로 했다. 기존 공개 repo와의 일관성, compiler/tool 성격, 명시적 patent grant를 MIT 전환보다 우선했다.
- README / SYSTEM-MANUAL의 테스트 수를 현재 검증 결과인 57 tests로 보정했다.
