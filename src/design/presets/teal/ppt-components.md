# teal Components

컴파일러가 렌더링하는 재사용 UI 컴포넌트 명세.
모든 좌표는 inches 단위.

---

## Section Label Chip

`section_label` 필드가 있는 슬라이드 상단에 filled chip을 렌더링한다.
적용 대상: `renderSectionHeader()`를 사용하는 슬라이드 타입 (content, two-column, kpi, chart, table, timeline, flow, comparison, decision, agenda, summary, appendix, architecture)
미적용 (후속 P2): hero, closing, section-divider

| 속성 | 값 |
| --- | --- |
| Shape | roundRect, rectRadius 0.04 |
| x | 0.67" (margin) |
| y | 0.20" |
| h | 0.28" |
| w | `min(max(1.0, label.length × 0.10 + 0.40), 4.0)` |
| Fill | `chip-bg` → `accent` fallback |
| Border | none (width 0) |
| Text color | `chip-text` → `#FFFFFF` fallback |
| Text font | label (11pt, Bold, UPPERCASE, wrap: false) |
| Text padding | left 0.14", right 0.14" |

section_label 없는 슬라이드: chip 미렌더링, title Y = 0.35" (SL.ty 기본값 유지)

---

## Title Bar

모든 슬라이드 상단에 공통으로 적용.

| 속성 | 값 |
| --- | --- |
| x | 0.67" (margin) |
| y | 0.35" (section_label 없음) / 0.62" (section_label 있음) |
| w | 12.0" |
| h | 0.82" |
| font | title (40pt, Bold) |
| color | `text-primary` (`#FFFFFF`) |
| valign | middle |

---

## Content Card

슬라이드 배경 위에 올라오는 카드 영역.

| 속성 | 값 |
| --- | --- |
| x | 0.67" |
| y | 1.75" |
| w | 12.0" |
| h | 5.1" |
| Fill | `card-bg` (`#242829`) |
| Border | none |

---

## Bullet List

`content`, `two-column`, `summary` 슬라이드의 body 영역에 사용.

- Bullet character: `•` (U+2022)
- Left margin: 190500 EMU (≈ 0.21" = 15pt hanging indent)
- Paragraph spacing after: 8pt
- Font: body (14pt, Regular)
- Color: `text-secondary` (`#9BA0A6`)

---

## KPI Card

`kpi` 슬라이드에 최대 4개까지 수평 배치.

| 속성 | 값 |
| --- | --- |
| Shape | roundRect |
| Fill | `card-bg` (`#242829`) |
| Border | `border` (`#3A4440`), 1pt |
| Corner radius | 0.1 (rectRadius) |
| Value font | kpi-value (52pt, Bold), `accent-text` (`#4FAE9A`) |
| Delta font | caption (14pt) |
| Delta color | `#34D399` (up) / `#F87171` (down) / `text-muted` (neutral) |
| Label font | kpi-label (13pt, Regular), `text-muted` |

---

## Agenda Item

`agenda` 슬라이드에서 번호 뱃지 + 텍스트 형식으로 세로 나열.

| 속성 | 값 |
| --- | --- |
| Badge shape | ellipse, 0.55" × 0.55" |
| Badge fill | `accent` (`#2D6B5E`) |
| Badge font | label (12pt, Bold), white |
| Item font | body (14pt, Regular), `text-primary` |
| Row height | 0.65" |
| Row gap | 0.15" |

---

## Architecture Node

`architecture` 슬라이드의 다이어그램 노드.

| 속성 | 값 |
| --- | --- |
| Size | 1.8" × 0.65" |
| Fill | `node-fill` (`#2D3235`) |
| Border | `node-border` (`#2D6B5E`), 1.5pt |
| Font | node-label (11pt, Bold), `node-text` (`#FFFFFF`) |
| Shape | tokens.json `shapes` 맵에서 node kind로 결정 |

---

## Architecture Edge

| 속성 | 값 |
| --- | --- |
| Shape | line |
| Color | `edge` (`#6B7280`), 1.5pt |
| Arrow | tailEnd: arrow |

---

## Diagram Group

| 속성 | 값 |
| --- | --- |
| Shape | roundRect, dashed border |
| Fill | `group-fill` (`#1E2124`), transparency 20% |
| Border | `group-border` (`#3A4440`), 1pt, dash |
| Label font | caption (14pt), `text-muted` |
| Padding | 0.35" around member nodes |

---

## Table

`table` 슬라이드 전용.

| 속성 | 값 |
| --- | --- |
| Header fill | `accent` (`#2D6B5E`), white text, 14pt Bold |
| Even row fill | `card-item-bg` (`#2D3235`) |
| Odd row fill | `card-bg` (`#242829`) |
| Border | `border` (`#3A4440`), 1pt |
| Row height | 0.45" |
| Cell padding | marL/R: 0.1", marT/B: 0.05" |

---

## Takeaways Panel

`summary` 슬라이드 우측 패널.

| 속성 | 값 |
| --- | --- |
| Width | content_w × 0.45 |
| Shape | roundRect |
| Fill | `card-item-bg` (`#2D3235`) |
| Border | `border` (`#3A4440`), 1pt |
| Header | "Key Takeaways", label (12pt, Bold), `accent` |
| Item font | body (14pt), `text-secondary` |

---

## Brand Footer

모든 슬라이드 하단에 자동 추가.

| 속성 | 값 |
| --- | --- |
| 위치 (브랜드명) | footer 우측, x=10.83", y=7.15", w=2.5", h=0.3" |
| 위치 (페이지번호) | footer 좌측, x=0.67", y=7.15", w=1.0", h=0.3" |
| 폰트 | caption (10pt), `text-muted` |
