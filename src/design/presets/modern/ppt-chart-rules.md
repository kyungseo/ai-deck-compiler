# modern Chart Rules

`chart` 슬라이드 타입의 차트 렌더링 규칙.

---

## 지원 Chart Type

| Blueprint type | pptxgenjs type | 비고 |
| --- | --- | --- |
| `bar` | `bar` | barDir: col (세로 막대) |
| `stacked-bar` | `bar` | barGrouping: stacked |
| `line` | `line` | |
| `area` | `area` | |
| `pie` | `pie` | showValue: true |
| `donut` | `doughnut` | showValue: true |

---

## Data Source

| source | 처리 방법 |
| --- | --- |
| `inline` | blueprint.yaml 내 labels + series 직접 사용 |
| `file` | MVP에서 미지원 — placeholder 텍스트 표시 |

### inline → pptxgenjs 변환

```yaml
# blueprint.yaml
data:
  source: inline
  labels: [Q1, Q2, Q3]
  series:
    - name: Revenue
      values: [100, 200, 300]
```

```typescript
// pptxgenjs chartData
[{ name: 'Revenue', labels: ['Q1', 'Q2', 'Q3'], values: [100, 200, 300] }]
```

---

## 스타일 규칙

| 항목 | 값 |
| --- | --- |
| 위치/크기 | x=0.67, y=1.35, w=12.0, h=5.75 (content 전체) |
| Series 색상 | `chart-0` ~ `chart-5` (tokens.json) |
| 범례 위치 | 하단 (`legendPos: 'b'`) |
| 범례 폰트 | caption (14pt) |
| 데이터 레이블 폰트 | caption (14pt) |
| 데이터 레이블 표시 | pie/donut만 showValue: true |

---

## AI Agent 작성 가이드

blueprint.yaml에 chart 슬라이드를 작성할 때:

1. `type`은 위 지원 목록 중 하나를 선택한다.
2. `data.source: inline` 과 `labels` + `series` 배열을 제공한다.
3. `series` 각 항목의 `values` 길이는 `labels` 길이와 같아야 한다.
4. stacked-bar는 여러 series를 사용할 때 의미 있다.
5. pie/donut은 series 1개, values 합계가 100%를 나타내도록 작성한다.
