# vivid Components

teal과 동일한 컴포넌트 구조를 기반으로 색상 토큰만 vivid 계열을 사용한다.
A 시리즈 고유 컴포넌트 중 Callout Bar는 이번 Work에서 구현되었다. Legend pill은 후속 Work 예정.

---

## Section Label Chip

teal과 동일한 chip 렌더링. 색상만 다르다.

| 속성 | 값 |
| --- | --- |
| Fill | `chip-bg` (`#6957E8`, vivid purple) |
| Text color | `chip-text` (`#FFFFFF`) |
| 나머지 | teal `ppt-components.md` Section Label Chip과 동일 |

---

## Callout Bar

슬라이드 하단 전체 너비 accent 패널. content / flow 슬라이드에서 `callout` 필드가 있을 때 opt-in 렌더링.

| 속성 | 값 |
| --- | --- |
| 위치 | x=0, y=6.85, w=13.33" (full-width), h=0.34" |
| Fill | `callout-bar` (`#6957E8`) |
| Text color | `callout-bar-text` (`#FFFFFF`) |
| Font | 14pt bold Pretendard, center align, valign middle |
| Footer 억제 | callout bar 렌더 시 brand footer 미표시 |
| 적용 조건 | `callout-bar` 토큰 존재 + blueprint `callout` 필드 존재 |

blueprint 예시:
```yaml
- id: market-context
  type: content
  title: Market Context
  callout: "2026년은 파트너십으로 진입하고 2027년 내재화를 재검토"
  body:
    - "..."
```

---

## 기타 컴포넌트

Title Bar, Content Card, Bullet List, KPI Card, Agenda Item, Architecture Node/Edge, Diagram Group, Table, Takeaways Panel, Brand Footer는 teal과 동일한 규격을 따르되 색상 토큰만 vivid를 사용한다.

자세한 스펙은 `src/design/presets/teal/ppt-components.md`를 참조하고, 색상 참조만 vivid `tokens.json`으로 대체한다.
