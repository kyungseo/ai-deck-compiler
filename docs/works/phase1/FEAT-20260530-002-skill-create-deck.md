---
id: FEAT-20260530-002
title: "skill-create-deck + skill-generate-blueprint"
status: Active
type: FEAT
created: 2026-05-30
branch: feature/skill-create-deck
---

# FEAT-20260530-002 — skill-create-deck + skill-generate-blueprint

## Goal

사용자가 `/create-deck`을 입력하면 Claude Code가 목적·청중·구조를 파악하고
blueprint.yaml 초안을 작성하여 PPTX 생성까지 안내하는 end-to-end 인터랙티브 워크플로우를 구현한다.

## Plan

### 생성 파일
- `skills/README.md` — skills 디렉토리 인덱스
- `skills/create-deck.md` — 6단계 end-to-end 워크플로우 (AI agent용)
- `skills/generate-blueprint.md` — blueprint.yaml 초안 생성 절차
- `.claude/commands/create-deck.md` — `/create-deck` Claude Code 커맨드

### 업데이트 파일
- `docs/USER-MANUAL.md` — `/create-deck` 워크플로우 섹션 보완

## Done Criteria

- [x] `skills/create-deck.md` — 6단계 절차, 슬라이드 타입 선택 가이드, blueprint 작성 규칙, 예제 세션 포함
- [x] `skills/generate-blueprint.md` — 목적 파악 질의, 타입별 케이스, 검토 루프 절차 포함
- [x] `.claude/commands/create-deck.md` — `/create-deck` 입력 시 Claude Code가 따르는 절차 포함
- [x] `docs/USER-MANUAL.md` `/create-deck` 섹션 보완
- [ ] `/create-deck` 실행 시 Step 1 질의가 시작되는지 확인 — 실제 세션에서 검증 필요

## Discovery

- P1 compiler, P1 slide 9종, design preset, CLI 모두 완료 상태
- skills/ 디렉토리 미존재 → 생성 필요
- .claude/commands/ 에 기존 커맨드 파일들 존재 → 형식 참고

## Checkpoints

- [ ] skills/ 디렉토리 및 README.md 생성
- [ ] create-deck.md 워크플로우 완성
- [ ] generate-blueprint.md 완성
- [ ] .claude/commands/create-deck.md 완성
- [ ] USER-MANUAL.md 보완
