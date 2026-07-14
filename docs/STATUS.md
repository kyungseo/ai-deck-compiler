# STATUS.md — ai-deck-compiler

## Current State

| Field | Value |
| --- | --- |
| Phase | Phase 1 — Blueprint → Editable PPTX 일관 출력 엔진 구축 |
| Workflow profile | Scaffold-adoption product repo; generator script not included |
| Active plan | None |
| Bootstrap checklist | Complete / inactive; local bootstrap document removed |
| Project backlog | `docs/backlog/PHASE1.md` |
| Harness backlog | `docs/backlog/HARNESS.md` |
| Local repo map | `~/dev-home/vibe/ai-workflow-harness/docs/maintainer/REPO-MAP.md` (machine-local — cross-repo 작업 시 로드) |
| Last updated | 2026-07-14 (Local repo map row 추가; clean idle 유지) |

## Work Context Rule

이 파일은 현재 작업 상태의 dashboard다.
세션 시작 시에는 `Current State`, `Active Work`, `Blockers And Open Questions`, `Next Actions`만 확인한다.
상세 실행 흐름은 `docs/AGENT-WORKFLOW.md`를 따른다.

## Active Work

—

## Blockers And Open Questions

| ID | Status | Question | Decision Needed |
| --- | --- | --- | --- |

## Recent Decisions

| Date | DR | Summary |
| --- | --- | --- |
| 2026-06-01 | DR-802 | `teal + dark` = AI workflow 기본 추천 preset. `default-modern` → `modern` rename, alias 호환 유지. |
| 2026-06-01 | DR-803 | `examples/results/*.pptx` git 추적. 재생성 명령 README 문서화로 staleness 관리. |
| 2026-06-01 | DR-804 | `generate-blueprint` → `create-deck` 통합. Narrative Spine/Story Arc/Action Title/3종 YAML을 create-deck Step 2~3에 흡수. generate-blueprint를 user-facing 진입점에서 제거. |

## Next Actions

—
