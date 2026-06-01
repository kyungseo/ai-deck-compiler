---
id: FEAT-20260601-004
title: "Card inner horizontal padding — 카드 내부 콘텐츠 좌우 여백 통일"
status: Archived
actual_end: 2026-06-01
type: FEAT
created: 2026-06-01
branch: feature/FEAT-20260601-003-showcase-deck-results
---

# FEAT-20260601-004 — Card inner horizontal padding

## Goal

모든 슬라이드에서 카드 내부 콘텐츠(박스, 테이블, KPI 패널 등)가
카드 좌우 경계에 여백 없이 붙어 보이는 문제를 해결한다.

현재 `renderCardBackground`는 `x: SL.cx, w: SL.cw`로 카드를 그리고,
내부 콘텐츠도 동일한 좌표에서 시작해 카드 내부 패딩이 없다.

**공통 규칙 도입:**
카드 내부 콘텐츠는 좌우 각 `CARD.px = 0.25"`의 inner padding을 갖는다.

---

## 요건 (사용자 직접 지적)

| 슬라이드 | 타입 | 현상 | 기대 |
|---|---|---|---|
| 7페이지 | `kpi` | 4개 KPI 박스가 카드 좌우에 여백 없이 붙음 | 카드 좌우 0.25" 여백 후 박스 배치, 박스 간격도 재조정 |
| 13페이지 | `table` | 테이블이 카드 좌우 경계까지 꽉 참 | 카드 내부 좌우 여백 적용 |
| 15페이지 | `decision` | Generic sample 박스가 카드 왼쪽에 붙음, Product showcase 박스가 카드 오른쪽에 붙음 | 양쪽 옵션 박스 모두 카드 내부 여백 적용 |

**일반화:** 위 세 케이스는 카드 내 콘텐츠 전체에 적용해야 할 공통 규칙의 사례다.

---

## Scope

### Layer 1 — layout.ts: CARD.px 상수 추가

```typescript
export const CARD = {
  y:  1.75,
  h:  5.1,
  iy: 2.05,
  ih: 4.65,
  px: 0.25,   // NEW: card inner horizontal padding
} as const;
```

렌더러에서 카드 내 콘텐츠 배치 시:
- left edge: `SL.cx + CARD.px` (= 0.92")
- width:     `SL.cw - CARD.px * 2` (= 11.50")

### Layer 2 — P0: 직접 지적된 3종

| 파일 | 변경 내용 |
|---|---|
| `kpi.ts` | KPI 박스 x 시작을 `SL.cx + CARD.px`로 이동, 총 폭 `SL.cw - CARD.px*2` 기준으로 4등분 |
| `table.ts` | `addTable` x/w를 inner 기준으로 이동 |
| `decision.ts` | 좌/우 option 박스 x/w를 inner 기준으로 이동 |

### Layer 3 — P1: 동일 패턴 나머지 렌더러

| 파일 | 적용 범위 |
|---|---|
| `comparison.ts` | 좌우 패널 박스 |
| `two-column.ts` | 좌우 컬럼 텍스트 |
| `content.ts` | body 텍스트 |
| `chart.ts` | addChart x/w |
| `agenda.ts` | 항목 텍스트 |
| `summary.ts` | body/takeaways 패널 |
| `flow.ts` | diagram 영역 (zoneCenter 기준 조정) |
| `architecture.ts` | diagram 영역 (zoneCenter 기준 조정) |

### Layer 4 — 제외/유지

| 파일 | 이유 |
|---|---|
| `timeline.ts` | padX=0.40" 이미 적용 (CARD.px보다 넓음 — 그대로 유지) |
| `appendix.ts` | BOX_X/BOX_W 이미 적용 (독립적 계산 유지) |
| `hero.ts`, `closing.ts`, `section-divider.ts` | 카드 배경 없는 full-bleed 레이아웃 — 해당 없음 |

### Layer 5 — 검증

- `npm run typecheck`
- `npm test -- -u` (snapshot 전체 업데이트 후 diff 리뷰)
- showcase preview: 슬라이드 7 / 13 / 15 시각 확인 (직접 지적 슬라이드)
- showcase preview: 전체 18장 추가 확인
- teal/vivid/modern 3종 회귀 없음

---

## Done Criteria

- [x] `layout.ts` — `CARD.px = 0.25` 추가
- [x] `kpi.ts` — inner padding 적용
- [x] `table.ts` — inner padding 적용
- [x] `decision.ts` — inner padding 적용
- [x] `comparison.ts` — inner padding 적용
- [x] `two-column.ts` — inner padding 적용
- [x] `content.ts` — inner padding 적용
- [x] `chart.ts` — inner padding 적용
- [x] `agenda.ts` — inner padding 적용
- [x] `summary.ts` — inner padding 적용
- [x] `flow.ts` / `architecture.ts` — inner zone 기준 조정
- [x] `npm run typecheck` 통과
- [x] `npm test -- -u` 통과 (snapshot diff 리뷰 포함)
- [x] showcase 슬라이드 7 / 13 / 15 preview 시각 확인

---

## Risks

| Risk | Mitigation |
|---|---|
| snapshot 테스트 전체 변경 | `-u` 업데이트 후 diff를 사용자와 리뷰 |
| architecture/flow zone 계산이 틀어짐 | 별도 preview 확인, 필요 시 zone 오프셋 재보정 |
| summary panelW 계산 기존 수정과 충돌 | 기존 right padding 처리와 중복 여부 확인 후 병합 |
| 텍스트 콘텐츠(content, agenda)는 시각 차이가 미미할 수 있음 | 적용 후 preview 확인. 과하면 텍스트 타입은 0.10"으로 축소 가능 |

---

## Reversal Cost

낮음. CARD.px 상수를 0으로 되돌리면 전부 원복.

## Discovery

*(착수 후 기록)*
