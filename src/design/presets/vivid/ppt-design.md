# vivid Design System

**방향:** deep-navy, vivid-purple, bold-contrast, AI-native

**상태: secondary/experimental preset.** A 시리즈(01~05) 기반 skeleton. 고유 요소(callout bar, legend pill, chart palette 심화)는 후속 Work에서 구현한다.

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
| chart-0…5 | `#7B6CF6` `#A89BF8` `#5340CC` `#F87171` `#FBBF24` `#22D3EE` | Chart series colors |

---

## Color — Light Theme (dark fallback)

`vivid`는 dark-first preset입니다. `theme: light` 사용 시 dark 값과 동일하게 렌더링됩니다.

---

## 후속 Work 예정 (미구현)

| 요소 | 설명 |
| --- | --- |
| Bottom callout bar | 슬라이드 하단 전체 너비 accent 패널 |
| Legend pill chip | 차트 범례 pill 형태 렌더링 |
| Chart palette 심화 | A 시리즈 purple 단계 계열 배색 적용 |
| Light theme 디자인 | vivid 고유 light 배색 |

---

## Files in This Preset

| File | Purpose |
| --- | --- |
| `tokens.json` | Machine-readable design tokens |
| `ppt-design.md` | This file — design system overview (skeleton) |
| `ppt-components.md` | Component-level specifications (skeleton) |
| `ppt-layouts.md` | Per-slide layout specifications (skeleton) |
| `ppt-chart-rules.md` | Chart type and data format rules (skeleton) |
