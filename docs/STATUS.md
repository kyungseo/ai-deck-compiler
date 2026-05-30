# STATUS.md — Presentation Compiler

## Current State

| Field | Value |
| --- | --- |
| Phase | Phase 1 — Blueprint → Editable PPTX 결정론적 컴파일 엔진 구축 |
| Active plan | — |
| Bootstrap checklist | `docs/BOOTSTRAP.md` |
| Project backlog | `docs/backlog/PHASE1.md` |
| Harness backlog | `docs/backlog/HARNESS.md` |
| Last updated | 2026-05-30 |

## Work Context Rule

이 파일은 현재 작업 상태의 dashboard다.
세션 시작 시에는 `Current State`, `Active Work`, `Blockers And Open Questions`, `Next Actions`만 확인한다.
상세 실행 흐름은 `docs/AGENT-WORKFLOW.md`를 따른다.

## Active Work

| ID | Title | Work File |
| --- | --- | --- |
| W2 (slug: work2-default-modern-renderer) | default-modern preset + P1 slide render + PPTX CLI | `/work work2-default-modern-renderer` 착수 시 생성 |

## Blockers And Open Questions

| ID | Status | Question | Decision Needed |
| --- | --- | --- | --- |

## Recent Decisions

*(없음)*

## Next Actions

1. Work 2 착수: `/work work2-default-modern-renderer` — default-modern preset, P1 slide render 9종, zone-based layout engine, PPTX CLI, snapshot/determinism 테스트
2. `docs/backlog/PHASE1.md`에 Work 2 및 Post-MVP 후보 등록 (Work ID는 /work 착수 시 확정)
3. `docs/PLAN.md` Project Initialization Plan에 stack 선택 근거 이전 (`temp/work-plans/10-ai-native-pt-engineering-framework-3.md` §7 기반)
