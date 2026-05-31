# Data Report — 예제

분기 비즈니스 리뷰 형식의 예제 deck. 사업 이해관계자 대상 수치 기반 보고 시나리오를 기반으로 작성했다.

## 실행

```bash
npm run validate -- --blueprint examples/data-report/blueprint.yaml
npm run deck -- --blueprint examples/data-report/blueprint.yaml
```

## 슬라이드 구성

| # | type | 설명 |
|---|---|---|
| 1 | `kpi` | Q2 핵심 지표 — Revenue, 신규 고객, Churn, Gross Margin |
| 2 | `chart` (bar) | 최근 6분기 매출 추이 |
| 3 | `chart` (line) | 세그먼트별 매출 분해 — Enterprise vs. Self-serve |
| 4 | `table` | 코호트 리텐션 — M3 / M6 / M12 |
| 5 | `summary` | Q2 핵심 발견 + Q3 포커스 |

## 커스터마이징 포인트

- `deck.theme: dark` — 보고 자료에 어울리는 다크 테마 사용
- `slides[0].kpis` — 지표 라벨·값·트렌드 변경
- `slides[1].chart.data` / `slides[2].chart.data` — 실제 수치로 교체
- `slides[3].table.rows` — 코호트 데이터 교체
