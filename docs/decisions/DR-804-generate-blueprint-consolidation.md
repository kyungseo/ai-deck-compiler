---
id: DR-804
title: "generate-blueprint → create-deck 통합"
date: 2026-06-01
status: Accepted
---

# DR-804 — generate-blueprint → create-deck 통합

## 결정

`skills/generate-blueprint.md`의 핵심 blueprint 작성 규칙(Narrative Spine/Story Arc, Action Title 예시, callout 판단 예시, 누락 YAML 3종)을 `skills/create-deck.md` Step 2~3에 흡수했다. `generate-blueprint`를 user-facing 진입점에서 제거하고 `create-deck`을 단일 canonical skill로 강화했다.

## 배경

`create-deck.md`의 Step 3이 `skills/generate-blueprint.md`를 외부 참조하는 분산 구조였다. 두 파일이 병렬 커맨드로 사용자에게 노출되었으나, `generate-blueprint`의 사용 시점이 불명확해 사용자(및 내부)가 혼란을 겪었다.

분석 결과 `generate-blueprint.md`에만 있던 중요 내용:
- Story Arc (기승전결) 표와 Narrative Spine 작성 절차
- Action Title 원칙 ✗/✓ 예시
- callout 판단 예시 표
- two-column / section-divider / comparison YAML 예시 (create-deck에 누락)

## 변경 범위

| 파일 | 조치 |
| --- | --- |
| `skills/create-deck.md` | Story Arc, Action Title 예시, callout 판단 예시, 3종 YAML 흡수. generate-blueprint 외부 참조 제거 |
| `.claude/commands/create-deck.md` | Step 3 참조 대상을 create-deck 자체로 교체 |
| `.claude/commands/generate-blueprint.md` | create-deck으로 리다이렉트 |
| `.agents/skills/generate-blueprint/SKILL.md` | 동일 |
| `AGENTS.md` | generate-blueprint 라우팅 행 제거 |
| `.cursor/rules/product-skills.mdc` | generate-blueprint 행 제거 |
| `docs/USER-MANUAL.md` | `/generate-blueprint` 진입 표 행 제거 |
| `skills/generate-blueprint.md` | 삭제하지 않음 — 내부 참조용으로 보존 |

## 트레이드오프

- **장점:** create-deck이 self-contained. Step 3에서 외부 파일 없이 완전한 blueprint 작성 가능. 사용자 진입점 단순화.
- **단점:** create-deck.md 파일 크기 증가 (+107줄, 453→560줄). skills/generate-blueprint.md는 내용이 중복되어 관리 대상으로 남음.
- **되돌리기 비용:** Medium — git revert로 복구 가능하나 content migration 재작업 필요.

## Addendum — 2026-06-01 (FEAT-20260601-012)

FEAT-010 결정 당시 `skills/generate-blueprint.md`는 "내부 참조용 보존"으로 유지했다.
FEAT-011(create-deck 콘텐츠 정비) 완료 후 재검토 결과, 보존 이점보다 drift 비용이 크다고 판단하여
FEAT-012에서 canonical file을 폐기하고 redirect wrapper(`.claude/commands/generate-blueprint.md`, `.agents/skills/generate-blueprint/SKILL.md`)만 호환성 목적으로 유지했다.
