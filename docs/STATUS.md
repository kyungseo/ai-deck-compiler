# STATUS.md — ai-deck-compiler

## Current State

| Field | Value |
| --- | --- |
| Phase | Phase 1 — Blueprint → Editable PPTX 일관 출력 엔진 구축 |
| Active plan | — |
| Bootstrap checklist | `docs/BOOTSTRAP.md` |
| Project backlog | `docs/backlog/PHASE1.md` |
| Harness backlog | `docs/backlog/HARNESS.md` |
| Last updated | 2026-06-01 (FEAT-20260601-011 Done) |

## Work Context Rule

이 파일은 현재 작업 상태의 dashboard다.
세션 시작 시에는 `Current State`, `Active Work`, `Blockers And Open Questions`, `Next Actions`만 확인한다.
상세 실행 흐름은 `docs/AGENT-WORKFLOW.md`를 따른다.

## Active Work

| ID | Title | Work 파일 |
| --- | --- | --- |
| FEAT-20260601-010 | create-deck blueprint 규칙 내재화 | docs/works/phase1/FEAT-20260601-010-create-deck-blueprint-consolidation.md |

## Blockers And Open Questions

| ID | Status | Question | Decision Needed |
| --- | --- | --- | --- |

## Recent Decisions

| Date | DR | Summary |
| --- | --- | --- |
| 2026-06-01 | DR-021 | `teal + dark` = AI workflow 기본 추천 preset. `default-modern` → `modern` rename, alias 호환 유지. |
| 2026-06-01 | DR-022 | `examples/results/*.pptx` git 추적. 재생성 명령 README 문서화로 staleness 관리. |
| 2026-06-01 | DR-023 | `generate-blueprint` → `create-deck` 통합. Narrative Spine/Story Arc/Action Title/3종 YAML을 create-deck Step 2~3에 흡수. generate-blueprint를 user-facing 진입점에서 제거. |

## Next Actions

1. Public 전환 시: GitHub repo ruleset 적용 — `protect-main`(deletion, non_fast_forward, pull_request, required_status_checks: validate), `protect-develop`(deletion, non_fast_forward, pull_request), bypass: RepositoryRole Admin. Secret scanning + push protection 활성화. `has_discussions: true`. 참조: DR-020
