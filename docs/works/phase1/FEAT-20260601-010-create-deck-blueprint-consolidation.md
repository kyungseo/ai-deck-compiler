---
id: FEAT-20260601-010
title: "create-deck blueprint 규칙 내재화 — generate-blueprint 통합"
status: Done
created: 2026-06-01
type: FEAT
branch: feature/FEAT-20260601-010-create-deck-blueprint-consolidation
---

# FEAT-20260601-010 — create-deck blueprint 규칙 내재화

## Goal

`skills/create-deck.md`가 Step 3에서 `skills/generate-blueprint.md`를 외부 참조하는
분산 구조를 해소한다. generate-blueprint의 핵심 blueprint 작성 규칙을 create-deck에
직접 흡수하여 단일 파일로 self-contained하게 만든다.

---

## Scope

### 흡수 대상 (generate-blueprint → create-deck)
1. Story Arc (기승전결) 표 + Narrative Spine 예시 → Step 2
2. Action Title ✗/✓ 예시 3쌍 → Step 3
3. callout 판단 예시 표 → Step 2
4. two-column / section-divider / comparison YAML 예시 → Step 3

### 참조 정리
- `skills/create-deck.md` Step 3: generate-blueprint 외부 참조 제거
- `.claude/commands/create-deck.md` Step 3: 동일
- `.claude/commands/generate-blueprint.md`: "내부 전용 — /create-deck 사용 권장" 리다이렉트
- `.agents/skills/generate-blueprint/SKILL.md`: 동일
- `AGENTS.md`: generate-blueprint 라우팅 행 제거
- `.cursor/rules/product-skills.mdc`: generate-blueprint 행 제거
- `docs/USER-MANUAL.md`: /generate-blueprint 행 제거

### 보존
- `skills/generate-blueprint.md`: 삭제하지 않음 (git 이력 보존, 내부 참조용)

### DR 기록
- DR-023: generate-blueprint → create-deck 통합 결정

---

## Non-goals
- `skills/generate-blueprint.md` 삭제
- `review-deck` 관련 변경
- blueprint 규칙 자체 내용 변경

---

## Done Criteria

- [x] `skills/create-deck.md` Step 2에 Story Arc 표 + callout 판단 예시 포함
- [x] `skills/create-deck.md` Step 3에 Action Title 예시 + 3종 YAML 예시 포함
- [x] `skills/create-deck.md`가 generate-blueprint를 외부 참조하지 않음
- [x] `.claude/commands/create-deck.md` generate-blueprint 참조 제거
- [x] `.claude/commands/generate-blueprint.md` 리다이렉트 처리
- [x] `AGENTS.md` / `.cursor/rules/` / `USER-MANUAL.md` 참조 정리
- [x] DR-023 기록

---

## Discovery

### 2026-06-01 — 구현 완료

- create-deck.md: 453줄 → 535줄 (+82줄). generate-blueprint 참조 0개.
- 흡수한 내용: Story Arc(기승전결) 표, Narrative Spine 예시, Action Title ✗/✓ 예시 3쌍, callout 판단 예시 표, two-column/section-divider/comparison YAML 예시.
- generate-blueprint 리다이렉트: .claude/commands, .agents/skills 양쪽 모두 create-deck으로 포워딩.
- user-facing 제거: USER-MANUAL 진입 표, AGENTS.md 라우팅, cursor rules에서 generate-blueprint 행 삭제.
- DR-023 기록 완료.
