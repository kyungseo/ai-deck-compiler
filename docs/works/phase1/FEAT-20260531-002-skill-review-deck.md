---
id: FEAT-20260531-002
title: "skill-review-deck"
status: Done
type: FEAT
created: 2026-05-31
actual_end: 2026-05-31
branch: feature/skill-review-deck
---

# FEAT-20260531-002 — skill-review-deck

## Goal

생성된 deck(blueprint.yaml)의 구조·메시지·디자인 일관성을 AI가 검토하고
blueprint 수정 제안을 actionable 형식으로 출력하는 skill 문서를 작성한다.

## Scope

| 파일 | 작업 |
| --- | --- |
| `skills/review-deck.md` | 신규 작성 |

## Done Criteria

- [x] `skills/review-deck.md` 작성 완료
- [x] 검토 항목 5종 모두 포함 (슬라이드 흐름, 메시지 일관성, 텍스트 분량, 차트/표 데이터 명확성, 청중 적합성)
- [x] 검토 결과를 blueprint 수정 제안 형식으로 출력하는 절차 포함

## Verification

`examples/sample/blueprint.yaml` 기반으로 skill 절차를 따라 검토 실행 →
actionable 수정 제안 생성 가능 여부 확인

## Discovery

착수 시 확인:
- 기존 `skills/create-deck.md` 패턴 확인 — GATE 기반 절차, 관련 파일 링크 구조 참조
- backlog 명세: 검토 항목 5종, blueprint 수정 제안 출력 형식 명시
