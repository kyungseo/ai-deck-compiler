---
id: FEAT-20260601-009
title: "Timeline circular variant — 타원 + 곡선 화살표 타임라인"
status: Done
created: 2026-06-01
actual_end: 2026-06-01
type: FEAT
branch: feature/FEAT-20260601-009-timeline-circular-variant
---

# FEAT-20260601-009 — Timeline circular variant

## Goal

`timeline` slide의 `variant: circular`를 구현한다.
기존 일자형(linear) 타임라인은 그대로 유지하고, blueprint에서 `variant: circular`로 선택 가능하게 한다.
각 아이템을 타원(ellipse)으로 표현하고 `curvedConnector3`로 연결한다.

---

## Scope

1. `src/templates/slides/timeline-circular.ts` — 신규 renderer
2. `src/templates/index.ts` — import + register
3. `tests/renderer.test.ts` — smoke test 추가
4. `temp/timeline-circular-sample.yaml` — QA blueprint
5. README, `docs/USER-MANUAL.md`, `docs/SYSTEM-MANUAL.md` — 지원 타입/variant 업데이트

---

## Non-goals

- 기존 `timeline`(linear) 변경
- schema 구조 변경

---

## Done Criteria

- [x] `timeline:circular` blueprint로 PPTX 생성 가능
- [x] 기존 `timeline`(linear) 회귀 없음
- [x] `npm run typecheck` 통과
- [x] `npm test` 통과
- [x] `temp/` blueprint PPTX 생성 + preview 시각 확인
- [x] README, USER-MANUAL, SYSTEM-MANUAL 업데이트

---

## Verification

```bash
npm run typecheck
npm test
npm run validate -- --blueprint temp/timeline-circular-sample.yaml
npm run deck -- --blueprint temp/timeline-circular-sample.yaml --output temp/timeline-circular-sample.pptx
npm run preview -- temp/timeline-circular-sample.pptx --out temp/timeline-circular-preview
```

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| curvedConnector3 아치 방향이 bounding box에 의존 | 중간 | bentConnector3/curvedConnector3 비교 테스트 |
| 아이템 수(2~6) 따른 레이아웃 비율 | 낮음 | n별 파라미터 조정 |

---

## Discovery

### 2026-06-01 — 구현 완료

- `timeline.items[].date`를 optional로 변경 — circular variant는 날짜가 없는 경우가 일반적. linear renderer도 guard 추가.
- `curvedConnector3` + `flipV: true`로 타원 간 S자 연결 화살표 구현. 4종 flip 조합 실험 후 확정.
- 타원 크기: `ovalW = min(2.6, slotW * 0.80)`, 비율 0.80으로 약간 정방형에 가깝게. 수직 위치는 카드 콘텐츠 상단에서 30% 오프셋.
- `date` 있는 경우 타원 위에 accent 색상으로 표시, 없는 경우 공간 절약.
- smoke test 3종 추가 (descriptions, dates, 5-items / 날짜 없음).
- teal:dark + modern:light 양 preset 시각 확인.
- `npm run typecheck` 통과, `npm test` 57/57 통과.
