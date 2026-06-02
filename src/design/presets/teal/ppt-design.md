# teal Design System

**방향:** charcoal-dark, teal-accent, bold-minimal, AI-native, premium-dark

**AI workflow recommended default.** 새 deck 작성 시 `design: teal`, `theme: dark`를 기본 추천값으로 사용한다.

**피해야 할 것:** light background 남용, gradient 남용, emoji 남용, stock image, non-editable decorative element

---

## Slide Canvas

| 항목 | 값 |
| --- | --- |
| Aspect ratio | 16:9 |
| Canvas size | 13.33" × 7.5" (LAYOUT_WIDE) |
| Safe margin | 0.67" (left/right) |
| Title Y (section_label 없음) | 0.35" |
| Title H | 0.82" |
| Title Y (section_label 있음) | 0.62" |
| Content Y (card inner) | 2.05" |
| Content W | 12.0" |
| Content H | 4.65" |

---

## Typography

| Role | Size | Weight | Usage |
| --- | --- | --- | --- |
| title | 40pt | Bold | Slide title |
| subtitle | 24pt | Regular | Hero subtitle |
| section-title | 32pt | Bold | Section divider headline |
| body | 16pt | Regular | Bullet list, paragraph text |
| caption | 14pt | Regular | Labels, footnotes, chart legend |
| label | 12pt | Regular | Chip text, small UI elements |
| kpi-value | 52pt | Bold | KPI main number |
| kpi-label | 13pt | Regular | KPI descriptor |
| node-label | 11pt | Regular | Architecture diagram node |
| table-header | 14pt | Bold | Table column header |
| table-cell | 13pt | Regular | Table body cell |

**Font family:** Pretendard (fallback: system sans-serif)

---

## Color — Dark Theme (recommended)

| Token | Hex | Usage |
| --- | --- | --- |
| background | `#1A1C1E` | Slide background (charcoal) |
| surface | `#1E2124` | Card, panel background |
| card-bg | `#242829` | Content card background |
| card-item-bg | `#2D3235` | Inner item background |
| divider-light | `#2A3030` | Subtle divider |
| border | `#3A4440` | Card outline, subtle border |
| text-primary | `#FFFFFF` | Title, heading |
| text-secondary | `#9BA0A6` | Body text |
| text-muted | `#8A9098` | Caption, placeholder |
| accent | `#2D6B5E` | Filled UI, chip, header bar (deep teal) |
| accent-text | `#4FAE9A` | Text highlight and KPI value |
| accent-alt | `#4FAE9A` | Secondary accent (brighter teal) |
| success | `#10B981` | Positive trend text |
| danger | `#F87171` | Negative trend text |
| chip-bg | `#2D6B5E` | Section label chip background |
| chip-text | `#FFFFFF` | Section label chip text |
| callout-bar | `#2D6B5E` | Bottom callout bar background (content/flow opt-in) |
| callout-bar-text | `#FFFFFF` | Bottom callout bar text |
| node-fill | `#2D3235` | Architecture node background |
| node-text | `#FFFFFF` | Architecture node label |
| node-border | `#2D6B5E` | Architecture node outline |
| group-fill | `#1E2124` | Diagram group background |
| group-border | `#3A4440` | Diagram group dashed border |
| edge | `#6B7280` | Diagram edge line |
| chart-0…5 | `#4FAE9A` `#2D6B5E` `#34D399` `#F87171` `#FBBF24` `#22D3EE` | Chart series colors |

---

## Color — Light Theme (dark fallback)

`teal` / `vivid`는 dark-first preset입니다. `theme: light`를 사용하면 dark 값과 동일하게 렌더링됩니다.
light 테마가 필요하면 `modern light`를 사용하세요.

---

## Section Label Chip

`section_label` 필드가 있는 슬라이드에 filled chip 배지를 렌더링합니다.

| 속성 | 값 |
| --- | --- |
| Shape | roundRect (rectRadius 0.04) |
| Fill | `chip-bg` (`#2D6B5E`) |
| Text color | `chip-text` (`#FFFFFF`) |
| Font | label (12pt, Bold, UPPERCASE) |
| x | 0.67" (margin) |
| y | 0.20" |
| h | 0.28" |
| w | 동적 (label 길이 기준, max 3.5") |

적용 슬라이드: `renderSectionHeader()`를 사용하는 모든 타입 (content, two-column, kpi, chart, table, timeline, flow, comparison, decision, agenda, summary, appendix, architecture)

미적용: hero, closing, section-divider (후속 Work P2)

---

## Callout Bar

`content` / `flow` 슬라이드에서 `callout` 필드가 있을 때 카드 내부 하단에 inset panel을 렌더링한다.
callout은 slide type이 아니라 optional emphasis field이며, 핵심 메시지·결론·주의 문장 1개만 강조할 때 사용한다.

| 속성 | 값 |
| --- | --- |
| Fill | `callout-bar` (`#2D6B5E`) |
| Text color | `callout-bar-text` (`#FFFFFF`) |
| 위치 | x=1.12", y=6.13", w=11.10", h=0.48" |
| Footer | brand footer 유지 |

---

## Spacing (inches)

| Token | Value | Usage |
| --- | --- | --- |
| xs | 0.05" | Tight gap |
| sm | 0.1" | Inner padding |
| md | 0.2" | Component gap |
| lg | 0.3" | Section gap |
| xl | 0.5" | Large gap |
| xxl | 0.8" | Major section break |

---

## Files in This Preset

| File | Purpose |
| --- | --- |
| `tokens.json` | Machine-readable design tokens |
| `ppt-design.md` | This file — design system overview |
| `ppt-components.md` | Component-level specifications |
| `ppt-layouts.md` | Per-slide layout specifications |
| `ppt-chart-rules.md` | Chart type and data format rules |
