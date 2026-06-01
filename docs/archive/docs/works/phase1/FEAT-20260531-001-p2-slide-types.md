---
id: FEAT-20260531-001
title: "P2 slide type 4종 구현 — timeline, flow, decision, appendix"
status: Archived
type: FEAT
created: 2026-05-31
actual_end: 2026-05-31
branch: feature/template-design-and-language-policy
---

# FEAT-20260531-001 — P2 slide type 4종 구현

## Goal

schema에 정의된 P2 slide type 중 미구현 4종(timeline, flow, decision, appendix)을 구현한다.
section-divider, comparison은 이미 완료. 이 Work로 15종 slide type 체계가 완결된다.

## Scope

| Type | Schema 필드 | 레이아웃 방향 |
| --- | --- | --- |
| `timeline` | `items[]{date, label, description}` | 수평 타임라인 — 중앙 선 + 원형 마커 + 날짜/라벨/설명 |
| `flow` | `diagram?: DiagramSpec` | diagram 있으면 architecture와 동일 zone-based 렌더링. 없으면 title + placeholder |
| `decision` | `options[]{label, pros[], cons[]}`, `recommendation?` | 2~3 option 카드 병렬 + 하단 recommendation 배너 |
| `appendix` | `body[]` | content와 유사하나 APPENDIX 라벨, 본문 색상 muted |

## Plan

### Step 1 — timeline renderer

레이아웃:
- `renderSectionHeader` + `renderCardBackground`
- 카드 수직 중앙(y ≈ CARD.iy + CARD.ih * 0.45)에 수평 accent line
- items 수에 따라 균등 x 배치 (최대 5개 권장)
- 마커(accent 원), 위: date(small) + label(bold), 아래: description(muted)

### Step 2 — flow renderer

- diagram 있으면 architecture renderer 로직 재활용 (zoneCenter, shape/edge rendering)
- diagram 없으면 section header + card + "Flow diagram을 diagram 필드로 추가하세요" 안내 텍스트

### Step 3 — decision renderer

레이아웃:
- `renderSectionHeader` + `renderCardBackground`
- options 2~3개: 균등 폭 카드 병렬 배치
  - 카드 상단: option label (bold, accent)
  - 중단: ✓ pros (accent색), ✗ cons (muted)
- recommendation 있으면 카드 하단 accent 배너

### Step 4 — appendix renderer

레이아웃:
- section header (APPENDIX label)
- card background
- body bullets (content와 동일 구조, 색상만 text-secondary muted)

### Step 5 — Registry 등록 + 테스트

- `src/templates/index.ts`에 4종 등록
- `tests/renderer.test.ts`에 smoke test 추가
- `npm test` 통과 확인
- `npm run deck -- --blueprint examples/sample/blueprint.yaml` 정상 렌더링 확인

## Done Criteria

- [x] `src/templates/slides/timeline.ts` 구현 및 registry 등록
- [x] `src/templates/slides/flow.ts` 구현 및 registry 등록
- [x] `src/templates/slides/decision.ts` 구현 및 registry 등록
- [x] `src/templates/slides/appendix.ts` 구현 및 registry 등록
- [x] `src/templates/slides/closing.ts` 구현 및 registry 등록 (closing/Q&A 슬라이드 추가)
- [x] `src/compiler/compiler.ts` closing 슬라이드 footer 제외 처리
- [x] `tests/renderer.test.ts` 5종 smoke test 추가, `npm test` 통과 (41 tests)
- [x] `npm run deck -- --blueprint examples/sample/blueprint.yaml` 전체 슬라이드 정상 렌더링
- [x] preview로 각 슬라이드 시각 확인 완료

## Verification

```bash
npm run typecheck
npm test
npm run deck -- --blueprint examples/sample/blueprint.yaml --output output/sample.pptx
npm run preview -- --input output/sample.pptx --out output/sample-preview
```

## Discovery

- section-divider, comparison은 이전 Work에서 구현 완료
- flow는 architecture와 DiagramSpec 구조 동일 → 렌더러 코드 재활용 가능
- appendix는 content와 구조 동일 → 단순 변형
- decision, timeline은 신규 레이아웃 설계 필요
