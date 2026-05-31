---
id: FEAT-20260531-005
title: "예제 확장 — examples/strategy + examples/data-report"
status: Done
actual_end: 2026-05-31
type: FEAT
created: 2026-05-31
branch: feature/FEAT-20260531-005-examples-expanded
---

# FEAT-20260531-005 — 예제 확장: strategy + data-report

## Goal

신규 사용자가 repo를 clone한 뒤 "이 도구로 뭘 만들 수 있나"를 바로 체감할 수 있도록
실용적인 예제 2종을 추가한다.

- `examples/strategy/` — 전략 보고 형식 (hero, agenda, content, kpi, decision, summary)
- `examples/data-report/` — 데이터 리포트 형식 (kpi, chart × 2, table, summary)
- 각 예제 디렉토리에 README.md 포함

## Done Criteria

- [ ] `examples/strategy/blueprint.yaml` 작성 — 6종 슬라이드 (hero, agenda, content, kpi, decision, summary)
- [ ] `examples/strategy/README.md` 작성 — 사용법 + 슬라이드 구성 설명
- [ ] `examples/data-report/blueprint.yaml` 작성 — 5종 슬라이드 (kpi, chart × 2, table, summary)
- [ ] `examples/data-report/README.md` 작성 — 사용법 + 슬라이드 구성 설명
- [ ] `npm run deck -- --blueprint examples/strategy/blueprint.yaml` 정상 실행
- [ ] `npm run deck -- --blueprint examples/data-report/blueprint.yaml` 정상 실행
- [ ] `npm run validate -- examples/strategy/blueprint.yaml` 통과
- [ ] `npm run validate -- examples/data-report/blueprint.yaml` 통과

## Implementation Plan

1. `examples/strategy/blueprint.yaml` 작성
2. `examples/data-report/blueprint.yaml` 작성
3. 각 예제 README.md 작성
4. `npm run validate` + `npm run deck` 검증
5. backlog Done 처리 + Work 파일 close
