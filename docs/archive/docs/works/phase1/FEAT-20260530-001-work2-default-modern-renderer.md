---
id: FEAT-20260530-001
title: "Work 2 — default-modern preset + P1 slide render + PPTX CLI"
status: Archived
type: FEAT
created: 2026-05-30
actual_end: 2026-05-30
branch: feature/work2-default-modern-renderer
---

# FEAT-20260530-001 — Work 2: default-modern preset + P1 slide render + PPTX CLI

## Goal

blueprint.yaml + default-modern design preset → editable PPTX 일관 생성.
P1 slide type 9종, zone-based layout engine, PPTX CLI 구현.

## Plan

### Phase A — Design Preset + Token Resolver
- `src/design/presets/default-modern/tokens.json` — typography, color(light/dark), layout, shapes token
- `src/design/resolver.ts` — preset 로딩 및 `ResolvedDesignTokens` 반환

### Phase B — Parser + Compiler Core
- `src/compiler/parser.ts` — YAML → Blueprint (BlueprintSchema.parse 래핑)
- `src/templates/layout.ts` — 공유 레이아웃 helpers (SL constants, hex, zoneCenter)
- `src/compiler/compiler.ts` — Blueprint + tokens → pptxgenjs → PPTX

### Phase C — P1 Slide Templates (9종)
- `src/templates/slides/`: hero, agenda, content, two-column, kpi, table, chart, architecture, summary
- `src/templates/index.ts` — defaultRegistry에 9종 등록

### Phase D — CLI + Tests + Examples
- `src/cli/deck.ts` — `npm run deck` CLI
- `package.json` — deck script 추가
- `tests/renderer.test.ts` — 컴파일 성공, editable object, 구조적 determinism 테스트
- `examples/basic/blueprint.yaml`, `examples/architecture/blueprint.yaml`

## Done Criteria

- [x] `npm run deck -- --blueprint examples/sample/blueprint.yaml --design default-modern --theme light --output output/sample.pptx` → PPTX 생성 성공
- [x] P1 slide 9종 모두 텍스트·차트·표가 native XML (addImage 미사용)으로 렌더링
- [x] 동일 input → 동일 슬라이드 구조 (determinism 테스트 통과)
- [x] `npm test` — 34 tests 통과 (parser 19 + renderer 12 + snapshot 3)
- [x] `npm run typecheck` — 에러 없음

## Discovery

Work 1 확인 결과:
- `src/schema/blueprint.ts`: 15 slide types Zod schema 완료
- `src/templates/registry.ts`: TemplateRegistry 클래스 완료
- `src/compiler/types.ts`: NormalizedSlide, ResolvedDesignTokens 타입 완료
- `src/cli/validate.ts`: blueprint validation CLI 완료
- `tests/blueprint.test.ts`: 19 parser 테스트 완료
- `src/compiler/parser.ts`, `src/compiler/compiler.ts`: 미구현 (Work 2 대상)

## Checkpoints

- [x] Phase A 완료: resolver.ts에서 tokens.json 로딩, `npm run typecheck` 통과
- [x] Phase B 완료: compiler.ts에서 빈 PPTX 생성 확인
- [x] Phase C 완료: 9종 template 등록, `npm run typecheck` 통과
- [x] Phase D 완료: 전체 Done Criteria 달성

## Close Notes

- 추가 구현 (잔여 항목): schemas/blueprint.schema.json, design docs 4종, snapshot 테스트 3개
- 버그 수정: architecture 역방향 엣지 음수 cx/cy (OOXML 위반) → flipH/flipV로 정규화
- 트러블슈팅: `docs/troubleshooting/pptx-negative-cx-powerpoint-repair.md` 기록
