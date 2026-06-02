# vivid Design System

**방향:** deep-navy, vivid-purple, bold-contrast, AI-native

**상태: secondary/experimental preset.** A 시리즈(01~05) 기반. callout bar + chart palette 심화 구현 완료. legend pill, light theme 고유 배색은 후속 Work 예정.

**dark-first preset.** `theme: dark` 권장. `theme: light` 사용 시 dark 값으로 렌더링된다.

---

## Slide Canvas

modern/teal과 동일한 LAYOUT_WIDE 기준을 사용한다.

| 항목 | 값 |
| --- | --- |
| Aspect ratio | 16:9 |
| Canvas size | 13.33" × 7.5" (LAYOUT_WIDE) |
| Safe margin | 0.67" (left/right) |

---

## Typography

teal과 동일한 Pretendard 기반 typography를 사용한다. (`ppt-design.md` 참조)

---

## Color — Dark Theme (recommended)

| Token | Hex | Usage |
| --- | --- | --- |
| background | `#0D0F1E` | Slide background (deep navy) |
| surface | `#131626` | Card, panel background |
| card-bg | `#161824` | Content card background |
| card-item-bg | `#1C1F35` | Inner item background |
| divider-light | `#2A2D4A` | Subtle divider |
| border | `#3A3D5C` | Card outline |
| text-primary | `#FFFFFF` | Title, heading |
| text-secondary | `#8B8FA8` | Body text |
| text-muted | `#7A809A` | Caption, placeholder |
| accent | `#6957E8` | Filled UI, chip, header bar (vivid purple) |
| accent-text | `#8B7BFF` | Text highlight and KPI value |
| accent-alt | `#A89BF8` | Secondary accent (lighter purple) |
| success | `#10B981` | Positive trend text |
| danger | `#F87171` | Negative trend text |
| chip-bg | `#6957E8` | Section label chip background |
| chip-text | `#FFFFFF` | Section label chip text |
| node-fill | `#1C1F35` | Architecture node background |
| node-text | `#FFFFFF` | Architecture node label |
| node-border | `#7B6CF6` | Architecture node outline |
| group-fill | `#131626` | Diagram group background |
| group-border | `#3A3D5C` | Diagram group dashed border |
| edge | `#5B5F78` | Diagram edge line |
| callout-bar | `#6957E8` | Inset card callout background (opt-in: renders only when this token + slide.callout exist) |
| callout-bar-text | `#FFFFFF` | Bottom callout bar text |
| chart-0…5 | `#7B6CF6` `#5340CC` `#A89BF8` `#F87171` `#FBBF24` `#22D3EE` | Chart series (main→dark→light purple, then accent colors) |

---

## Color — Light Theme (dark fallback)

`vivid`는 dark-first preset입니다. `theme: light` 사용 시 dark 값과 동일하게 렌더링됩니다.

---

## 후속 Work 예정 (미구현)

| 요소 | 설명 |
| --- | --- |
| Legend pill chip | 차트 범례 pill 형태 렌더링 |
| Light theme 고유 배색 | vivid 전용 light 배색 (현재는 dark mirror) |

---

## Files in This Preset

| File | Purpose |
| --- | --- |
| `tokens.json` | Machine-readable design tokens |
| `tokens.json` | Machine-readable design tokens |
| `ppt-design.md` | This file — design system overview |
| `ppt-components.md` | Component-level specifications |
| `ppt-layouts.md` | Per-slide layout specifications |
| `ppt-chart-rules.md` | Chart type and data format rules |
