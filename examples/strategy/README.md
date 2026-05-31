# Strategy — 예제

전략 보고 형식의 예제 deck. 경영진 대상 제품 전략 발표 시나리오를 기반으로 작성했다.

## 실행

```bash
npm run validate -- --blueprint examples/strategy/blueprint.yaml
npm run deck -- --blueprint examples/strategy/blueprint.yaml
```

대표 preset별 blueprint와 PPTX 결과물은 `examples/results/`에 있습니다.

```bash
npm run deck -- --blueprint examples/results/strategy-teal-dark.blueprint.yaml --output examples/results/strategy-teal-dark.pptx
npm run deck -- --blueprint examples/results/strategy-vivid-dark.blueprint.yaml --output examples/results/strategy-vivid-dark.pptx
npm run deck -- --blueprint examples/results/strategy-modern-light.blueprint.yaml --output examples/results/strategy-modern-light.pptx
```

## 슬라이드 구성

| # | type | 설명 |
|---|---|---|
| 1 | `hero` | 발표 제목 + 부제 + 발표 부서 |
| 2 | `agenda` | 5개 섹션 목차 |
| 3 | `content` | 시장 맥락 — 텍스트 블릿 4개 |
| 4 | `kpi` | 현재 포지션 — MAU, 엔터프라이즈, 전환율, NRR |
| 5 | `decision` | Build vs. Partner 의사결정 — pros/cons + recommendation |
| 6 | `summary` | 전략 우선순위 3가지 |

## 커스터마이징 포인트

- `deck.title` / `slides[0].title` — 발표 제목
- `deck.audience` — 대상 청중 (문서 속성에 반영)
- `slides[3].kpis` — KPI 라벨·값·트렌드
- `slides[4].options` — 의사결정 옵션 및 pros/cons
