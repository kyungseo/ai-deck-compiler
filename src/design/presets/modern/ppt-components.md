# modern Components

컴파일러가 렌더링하는 재사용 UI 컴포넌트 명세.
모든 좌표는 inches 단위.

---

## Title Bar

모든 슬라이드 상단에 공통으로 적용.

| 속성 | 값 |
| --- | --- |
| x | 0.67" (margin) |
| y | 0.4" |
| w | 12.0" |
| h | 0.85" |
| font | title (40pt, Bold) |
| color | `text-primary` |
| valign | middle |

---

## Bullet List

`content`, `two-column`, `summary` 슬라이드의 body 영역에 사용.

- Bullet character: `•` (U+2022)
- Left margin: 190500 EMU (≈ 0.21" = 15pt hanging indent)
- Paragraph spacing after: 6pt
- Font: body (18pt, Regular)
- Color: `text-secondary`

---

## KPI Card

`kpi` 슬라이드에 최대 4개까지 수평 배치.

| 속성 | 값 |
| --- | --- |
| Shape | roundRect |
| Fill | `surface` |
| Border | `border`, 1pt |
| Corner radius | 0.1 (rectRadius) |
| Value font | kpi-value (52pt, Bold), `accent` |
| Delta font | caption (14pt) |
| Delta color | `#059669` (up) / `#DC2626` (down) / `text-muted` (neutral) |
| Label font | kpi-label (13pt, Regular), `text-muted` |

---

## Agenda Item

`agenda` 슬라이드에서 번호 뱃지 + 텍스트 형식으로 세로 나열.

| 속성 | 값 |
| --- | --- |
| Badge shape | ellipse, 0.55" × 0.55" |
| Badge fill | `accent` |
| Badge font | label (12pt, Bold), white |
| Item font | body (18pt, Regular), `text-primary` |
| Row height | 0.65" |
| Row gap | 0.15" |

---

## Architecture Node

`architecture` 슬라이드의 다이어그램 노드.

| 속성 | 값 |
| --- | --- |
| Size | 1.8" × 0.65" |
| Fill | `node-fill` |
| Border | `node-border`, 1.5pt |
| Font | node-label (11pt, Bold), `node-text` |
| Shape | tokens.json `shapes` 맵에서 node kind로 결정 |

### Node Kind → Shape

| Kind | Shape |
| --- | --- |
| service | roundRect |
| database | can (cylinder) |
| queue | rect |
| gateway | diamond |
| client | rect |
| cloud | cloud |
| container | rect |
| cache | hexagon |
| storage | can (cylinder) |
| external | rect |

---

## Architecture Edge

| 속성 | 값 |
| --- | --- |
| Shape | line |
| Color | `edge`, 1.5pt |
| Arrow | tailEnd: arrow |
| Direction | flipH/flipV로 역방향 지원 (음수 cx/cy 금지) |

---

## Diagram Group

| 속성 | 값 |
| --- | --- |
| Shape | roundRect, dashed border |
| Fill | `group-fill`, transparency 20% |
| Border | `group-border`, 1pt, dash |
| Label font | caption (14pt), `text-muted` |
| Padding | 0.35" around member nodes |

---

## Table

`table` 슬라이드 전용.

| 속성 | 값 |
| --- | --- |
| Header fill | `accent`, white text, 14pt Bold |
| Even row fill | `surface` |
| Odd row fill | white |
| Border | `border`, 1pt |
| Row height | 0.45" |
| Cell padding | marL/R: 0.1", marT/B: 0.05" |

---

## Takeaways Panel

`summary` 슬라이드 우측 패널. body 콘텐츠가 있을 때만 표시.

| 속성 | 값 |
| --- | --- |
| Width | content_w × 0.45 |
| Shape | roundRect |
| Fill | `surface` |
| Border | `border`, 1pt |
| Header | "Key Takeaways", label (12pt, Bold), `accent` |
| Item font | body (18pt), `text-secondary` |

---

## Brand Footer

모든 슬라이드 하단에 자동 추가 (컴파일러가 처리, 템플릿 불필요).

| 속성 | 값 |
| --- | --- |
| 위치 (브랜드명) | footer 우측, x=10.83", y=7.15", w=2.5", h=0.3" |
| 위치 (페이지번호) | footer 좌측, x=0.67", y=7.15", w=1.0", h=0.3" |
| 폰트 | caption (10pt), `text-muted` |
| 표지(hero) 제외 | 페이지 번호 미표시 옵션 |

---

## Visual Density 규칙

**슬라이드 Content Area 하단 30%를 비워두지 않는다.**

콘텐츠가 적어 하단이 비어 보이면, blueprint 작성 시 다음 중 하나를 추가한다:

1. **Key Takeaway 강조** — `notes` 필드에 핵심 메시지 → 추후 시각적 강조 박스로 렌더링 예정
2. **데이터 수치 추가** — 슬라이드 내용을 뒷받침하는 구체적 수치를 body에 포함
3. **Takeaways 추가** — `summary` 슬라이드에서 `takeaways` 배열 활용
4. **KPI 병행** — 텍스트 슬라이드에 관련 수치를 kpi 형태로 별도 슬라이드 추가

AI가 blueprint를 작성할 때 이 규칙을 따른다. 컴파일러 자동 강제는 미구현.
