# vivid Layouts

**skeleton** — teal과 동일한 레이아웃 구조를 사용한다. 색상 토큰만 vivid 계열로 다르다.

A 시리즈 고유 요소 중 callout bar는 구현 완료. chart legend pill은 후속 Work 예정.

## Callout Bar 레이아웃

content / flow 슬라이드에서 `callout` 필드가 있을 때 카드 하단에 full-width bar 렌더링.

| 항목 | 값 |
| --- | --- |
| x | 0 |
| y | 6.85" |
| w | 13.33" (full-width) |
| h | 0.34" |
| Fill | `callout-bar` token (`#6957E8`) |
| Footer | callout bar 렌더 시 brand footer 억제

---

teal preset의 `ppt-layouts.md`를 레이아웃 기준으로 참조하되, 색상 토큰은 vivid `tokens.json`을 따른다.

- chip-bg: `#6957E8` (vivid purple)
- accent: `#6957E8`
- accent-text: `#8B7BFF`
- card-bg: `#161824`
- background: `#0D0F1E`

모든 슬라이드 타입(hero, agenda, content, two-column, kpi, chart, table, architecture, summary, etc.)의 좌표와 구조는 teal과 동일하다.
