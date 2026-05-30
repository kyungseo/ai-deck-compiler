# STATUS.md — Presentation Compiler

## Current State

| Field | Value |
| --- | --- |
| Phase | Phase 1 — [프로젝트 목표 한 줄] |
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

## Blockers And Open Questions

| ID | Status | Question | Decision Needed |
| --- | --- | --- | --- |

## Recent Decisions

*(없음)*

## Next Actions

1. Scaffold bootstrap onboarding: `docs/BOOTSTRAP.md`를 §0부터 순서대로 채운다
2. §1 Project Identity, §2 Product Definition 완료 후 `docs/PLAN-SUMMARY.md` Project Summary 업데이트
3. §3 Project Initialization: `docs/PLAN-SUMMARY.md` Implementation Baseline 채우기 (코드 개발 프로젝트만)
4. Implementation Baseline 완료 후 `docs/backlog/PHASE1.md`에 초기 작업 후보 등록 (Work ID는 /work 착수 시 확정)
5. `docs/AGENT-WORKFLOW.md` Project Constants와 Verification Defaults 채우기
6. AI workflow 개선 항목은 `docs/backlog/HARNESS.md`로 분리
7. Claude Code: `/start`로 첫 세션 시작 | Codex: `AGENTS.md` 확인 후 `/start` intent 실행 | Cursor: `prompts/cursor-session-start.md` 사용
