---
id: CHORE-20260531-004
title: "문서 정보구조 정비 — README, USER-MANUAL, SYSTEM-MANUAL 재구성"
status: Archived
type: CHORE
created: 2026-05-31
actual_end: 2026-05-31
branch: feature/chore-20260531-004-docs-information-architecture
---

# CHORE-20260531-004 — 문서 정보구조 정비: README, USER-MANUAL, SYSTEM-MANUAL 재구성

## Goal

README, USER-MANUAL, SYSTEM-MANUAL을 독자와 목적에 맞게 재구성한다.
최근 완료된 preset-aware creation, metadata/version, source input, preview review loop,
multi-tool AI workflow를 소급 반영하여 public-facing 문서의 첫인상과 실행 가능성을 높인다.

## Scope

| File | Work |
| --- | --- |
| `README.md` | 관례적 README 구조로 재작성, quick setup, feature overview, ai-workflow-harness 유입 문구 추가 |
| `docs/USER-MANUAL.md` | 초보 사용자 대상 개념·절차·AI 요청법·customization prompt 중심으로 재구성 |
| `docs/SYSTEM-MANUAL.md` | 초보 개발자 대상 architecture, 구성 요소, 유지보수 절차, 검증 기준 중심으로 재구성 |
| `docs/STATUS.md` | Active Work pointer 갱신 |
| `docs/works/phase1/README.md` | Phase 1 Work index 갱신 |

## Non-Scope

- `docs/PLAN.md` 구조 변경
- compiler/schema/CLI 동작 변경
- 새 design preset 구현
- ai-workflow-harness 자체 문서 수정

## Required Content

- README는 impact-first introduction, quick start, AI 환경별 빠른 셋업, 핵심 특징, 상세 문서 링크를 포함한다.
- README 하단에 ai-workflow-harness 링크와 유입 문구를 추가한다.
- USER-MANUAL은 초보자를 대상으로 기본 개념, 설치, 첫 PPT 생성, AI 요청 방식, preview/review loop를 안내한다.
- USER-MANUAL은 개인/회사 브랜딩, custom preset, layout customization 절차와 AI 요청 prompt 예시를 포함한다.
- SYSTEM-MANUAL은 초보 개발자를 대상으로 시스템 오버뷰, architecture, 주요 디렉터리, 기술 요소, 유지보수 절차를 포함한다.
- 세 문서는 공통으로 clone 후 blueprint 작성, PPTX 생성, preview review, 수정 loop를 Mermaid로 표현한다.
- multi-tool 지원 표기는 실제 구조에 맞게 구분한다:
  - Claude Code: `.claude/commands/*.md`
  - Codex CLI/App: `.agents/skills/*/SKILL.md`
  - Claude App: `skills/*.md` 참조/복사용 수동 절차
  - Codex App: repo-local skill 수동 로드 기준

## Done Criteria

- [x] README가 stale 정보 없이 현재 기능을 관례적 구조로 소개한다.
- [x] README에 AI 환경별 quick setup과 ai-workflow-harness 유입 링크가 있다.
- [x] USER-MANUAL이 초보 사용자 기준으로 설치부터 preview review loop까지 안내한다.
- [x] USER-MANUAL에 customization 절차와 prompt 예시가 있다.
- [x] SYSTEM-MANUAL이 초보 개발자 기준으로 architecture와 유지보수 절차를 안내한다.
- [x] README, USER-MANUAL, SYSTEM-MANUAL에 Mermaid workflow가 있다.
- [x] multi-tool 지원 표현이 실제 command/skill 구조와 일치한다.
- [x] `docs/PLAN.md`는 이번 작업에서 구조 변경하지 않는다.

## Verification

문서 품질:

```bash
git diff --check
rg -n "34 tests|15 slide|P2 .*예정|P2 — 구현 예정|Claude Code에서만|PptxGenJS Presentation" README.md docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md
rg -n "Claude Code|Codex CLI|Codex App|Claude App|ai-workflow-harness|Mermaid|```mermaid" README.md docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md
```

제품 sanity:

```bash
npm run typecheck
npm test
npm run validate -- --blueprint examples/sample/blueprint.yaml
```

### Verification Results

2026-05-31 실행:

- `git diff --check` ✅
- stale phrase grep ✅
- multi-tool / Mermaid / customization / harness coverage grep ✅
- `npm run typecheck` ✅
- `npm test` ✅ — 43 tests passed
- `npm run validate -- --blueprint examples/sample/blueprint.yaml` ✅

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| README/User/System Manual 중복 | 유지보수 부담 | 독자별 목적을 먼저 나누고 필요한 중복만 허용 |
| multi-tool 지원 과장 | 사용자가 잘못된 기대를 가짐 | 자동 실행과 수동 참조 경로를 명확히 구분 |
| 문서 리팩토링 중 stale fact 유지 | public-facing 혼선 | stale phrase grep과 현재 테스트/slide 수 확인 |
| PLAN scope 확장 | L3 gate 증가 | 이번 Work에서는 PLAN 구조 변경 제외 |

## Reversal Cost

Medium.
문서 중심 변경이라 revert는 쉽지만, README와 manual의 정보구조를 크게 바꾸므로 부분 rollback보다 파일 단위 diff 검토가 필요하다.

## Implementation Plan

1. README 재작성
   - 가치 제안, quick start, AI 환경별 셋업, feature 목록, harness link
2. USER-MANUAL 재작성
   - 초보자 흐름, Mermaid 워크플로우, AI 요청 예시, customization 절차
3. SYSTEM-MANUAL 재작성
   - 개발자 오버뷰, architecture Mermaid, 유지보수·검증 절차
4. Verification 실행
   - stale phrase grep, 링크·경로 점검, typecheck/test/validate

## Discovery

- 현재 README에는 34 tests, P2 예정, 15 slide type 등 stale 정보가 남아 있다.
- 최근 구현 기준은 16 slide types, 43 tests, PPTX metadata 반영, preview review loop 지원이다.
- ai-workflow-harness remote: `https://github.com/kyungseo/ai-workflow-harness.git`
