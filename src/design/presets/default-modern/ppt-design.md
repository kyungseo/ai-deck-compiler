# default-modern Design System

**방향:** modern, minimal, technical, clean, premium, AI-native

**피해야 할 것:** generic corporate template, boring consulting deck, gradient 남용, emoji 남용, rounded card 남발, stock image, non-editable decorative element

---

## Slide Canvas

| 항목 | 값 |
| --- | --- |
| Aspect ratio | 16:9 |
| Canvas size | 13.33" × 7.5" (LAYOUT_WIDE) |
| Safe margin | 0.67" (left/right) |
| Title Y | 0.4" |
| Title H | 0.85" |
| Content Y | 1.35" (title bottom + 0.1") |
| Content W | 12.0" |
| Content H | 5.75" |

---

## Typography

| Role | Size | Weight | Usage |
| --- | --- | --- | --- |
| title | 40pt | Bold | Slide title |
| subtitle | 24pt | Regular | Hero subtitle |
| section-title | 32pt | Bold | Section divider headline |
| body | 18pt | Regular | Bullet list, paragraph text |
| caption | 14pt | Regular | Labels, footnotes, chart legend |
| label | 12pt | Regular | Badge text, small UI elements |
| kpi-value | 52pt | Bold | KPI main number |
| kpi-label | 13pt | Regular | KPI descriptor |
| node-label | 11pt | Regular | Architecture diagram node |
| table-header | 14pt | Bold | Table column header |
| table-cell | 13pt | Regular | Table body cell |

**Font family:** Pretendard (fallback: system sans-serif)

---

## Color — Light Theme

| Token | Hex | Usage |
| --- | --- | --- |
| background | `#FFFFFF` | Slide background |
| surface | `#F8F9FA` | Card, panel background |
| border | `#E5E7EB` | Divider, card outline |
| text-primary | `#111827` | Title, heading |
| text-secondary | `#374151` | Body text |
| text-muted | `#6B7280` | Caption, placeholder |
| accent | `#2563EB` | Primary CTA, highlight |
| accent-alt | `#7C3AED` | Secondary accent |
| node-fill | `#EFF6FF` | Architecture node background |
| node-text | `#1D4ED8` | Architecture node label |
| node-border | `#93C5FD` | Architecture node outline |
| group-fill | `#F9FAFB` | Diagram group background |
| group-border | `#D1D5DB` | Diagram group dashed border |
| edge | `#9CA3AF` | Diagram edge line |
| chart-0…5 | `#2563EB` `#7C3AED` `#059669` `#DC2626` `#D97706` `#0891B2` | Chart series colors |

---

## Color — Dark Theme

| Token | Hex | Usage |
| --- | --- | --- |
| background | `#0F172A` | Slide background |
| surface | `#1E293B` | Card, panel background |
| border | `#334155` | Divider, card outline |
| text-primary | `#F1F5F9` | Title, heading |
| text-secondary | `#CBD5E1` | Body text |
| text-muted | `#64748B` | Caption, placeholder |
| accent | `#60A5FA` | Primary CTA, highlight |
| accent-alt | `#A78BFA` | Secondary accent |
| node-fill | `#1E3A5F` | Architecture node background |
| node-text | `#93C5FD` | Architecture node label |
| node-border | `#3B82F6` | Architecture node outline |
| group-fill | `#1E293B` | Diagram group background |
| group-border | `#475569` | Diagram group dashed border |
| edge | `#64748B` | Diagram edge line |
| chart-0…5 | `#60A5FA` `#A78BFA` `#34D399` `#F87171` `#FBBF24` `#22D3EE` | Chart series colors |

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
