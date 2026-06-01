---
id: FEAT-20260601-001
title: "vivid preset 고도화 — callout bar + chart palette 심화"
status: Done
type: FEAT
created: 2026-06-01
branch: feature/FEAT-20260601-001-vivid-preset-enhancement
---

# FEAT-20260601-001 — vivid preset 고도화

## Goal

vivid preset을 skeleton 수준에서 A 시리즈 고유 경험으로 격상한다.

- **Bottom callout bar** — 슬라이드 하단 전체 너비 accent 패널. A 시리즈 01/04의 핵심 시각 요소.
- **Chart palette 심화** — chart-0~2를 A 시리즈 purple 계열로 정제.
- legend pill, light theme은 이번 범위 밖.

**"vivid only"의 의미:**
callout bar는 `callout-bar` 토큰을 통해 opt-in한다. teal/modern에 해당 토큰이 없으면 렌더링하지 않는다. 기존 deck은 영향 없음.

---

## 참고 이미지

```
A 시리즈:
temp/01.png  Content — bottom callout bar (full-width accent 패널, 텍스트 포함)
temp/04.png  Flow — bottom callout bar 동일 패턴
temp/02.png  Chart — purple 바 차트 계열
```

---

## Scope

### Layer 1 — vivid tokens.json

| 토큰 | 값 | 용도 |
|---|---|---|
| `callout-bar` | `#6957E8` | callout bar 배경 — 이 토큰 존재 여부로 렌더 opt-in |
| `callout-bar-text` | `#FFFFFF` | callout bar 텍스트 |
| chart-0 | `#7B6CF6` | 현행 유지 |
| chart-1 | `#5340CC` | 현행(`#A89BF8`) → deep purple로 조정 |
| chart-2 | `#A89BF8` | 현행(`#5340CC`) → light purple로 이동 |

chart-1/2 순서 조정: 시각적으로 main→dark→light 계열 순으로 배치.
vivid light는 dark mirror이므로 양쪽 동일 토큰 변경 허용 (light 수요 없음 — dark recommended).

### Layer 2 — Blueprint schema

`src/schema/blueprint.ts` — `ContentSlide`와 `FlowSlide`에만 `callout` 선택 필드 추가:

```typescript
// ContentSlide, FlowSlide 각각에 추가 (base 제외)
callout: z.string().optional(), // bottom callout bar 텍스트 (callout-bar 토큰 있는 preset만 렌더링)
```

base에 추가하지 않는 이유: hero/chart/table 등 적용 불가 슬라이드에서 schema는 통과하지만 렌더링은 안 되는 불일치 방지.

### Layer 3 — renderCalloutBar() (layout.ts)

위치:
- x=0, y=6.85, w=SL.w, h=0.34 — full width, CARD 바로 아래 (14pt bold Korean 기준 clipping 방지)
- `callout-bar` 토큰 없으면 즉시 return (teal/modern 영향 없음)
- 반환값은 layout helper 내부 유틸. footer 억제 신호는 compiler.ts에서 독립 판단.

```typescript
export function renderCalloutBar(
  s: PptxSlide,
  callout: string,
  tokens: ResolvedDesignTokens,
): void {
  const { colors: co, typography: ty } = tokens;
  if (!co['callout-bar']) return;
  const bg = hex(co['callout-bar']);
  const fg = hex(co['callout-bar-text'] ?? 'FFFFFF');
  s.addShape('rect', {
    x: 0, y: 6.85, w: SL.w, h: 0.34,
    fill: { color: bg }, line: { color: bg, width: 0 },
  });
  s.addText(callout, {
    x: SL.mx, y: 6.85, w: SL.cw, h: 0.34,
    fontSize: ty['caption']?.size ?? 14,
    bold: true,
    fontFace: ty['caption']?.font ?? 'Pretendard',
    color: fg,
    valign: 'middle',
    align: 'center',
  });
}
```

### Layer 4 — 슬라이드 렌더러 적용

적용 대상: content.ts, flow.ts
- `slide.callout` 있으면 `renderCalloutBar()` 호출 (RenderFn 시그니처 불변 — void 유지)

compiler.ts footer 억제 — renderer 반환값 대신 compiler에서 직접 판단:
```typescript
// 현재: const skipFooter = slide.type === 'closing';
const CALLOUT_TYPES = new Set(['content', 'flow']);
type SlideWithCallout = { callout?: string };
const hasCallout = CALLOUT_TYPES.has(slide.type) &&
  !!(slide as SlideWithCallout).callout &&
  !!tokens.colors['callout-bar'];
const skipFooter = slide.type === 'closing' || hasCallout;
```

이유: `RenderFn`은 void 반환. 반환 타입 변경 시 registry 전체 타입 영향. compiler에서 독립 판단이 더 작고 안전.

### Layer 5 — vivid 문서 현행화

- `vivid/ppt-design.md` — "후속 Work 예정" 항목에서 callout bar/chart palette 제거, 스펙 추가
- `vivid/ppt-components.md` — Callout Bar 컴포넌트 스펙 추가

### Layer 6 — examples/results 재생성

- `strategy-vivid-dark.blueprint.yaml` — content/flow 슬라이드 중 1개에 `callout` 필드 추가
- `strategy-vivid-dark.pptx` — 재생성 (teal/modern은 변경 없음)

---

## Done Criteria

**Schema / 토큰:**
- [x] `src/schema/blueprint.ts` — `callout` optional 필드 추가
- [x] `vivid/tokens.json` — `callout-bar`, `callout-bar-text` 추가, chart-1/2 순서 조정

**렌더러:**
- [x] `src/templates/layout.ts` — `renderCalloutBar()` 구현, `callout-bar` 토큰 없으면 no-op
- [x] `content.ts`, `flow.ts` — callout 있을 때 `renderCalloutBar()` 호출 (early return 앞에 배치)
- [x] callout 있는 슬라이드에서 footer 억제 확인

**vivid 문서:**
- [x] `vivid/ppt-design.md` — 스펙 현행화
- [x] `vivid/ppt-components.md` — Callout Bar 스펙 추가

**예제 / 검증:**
- [x] `strategy-vivid-dark.blueprint.yaml` — `callout` 필드 사용 슬라이드 포함
- [x] `strategy-vivid-dark.pptx` — 재생성
- [x] `npm run typecheck` 통과
- [x] `npm test` 통과 (단위 테스트 포함)
  - content/flow: `callout` 있는 blueprint parse 성공
  - `callout-bar` 토큰 없을 때 `renderCalloutBar` no-op (shape 미추가)
  - `callout-bar` 토큰 있을 때 shape + text 2개 추가
  - callout slide에서 footer가 추가되지 않음 확인
  - callout 없는 teal/modern deck은 footer 유지 확인
- [x] `npm run validate -- --blueprint examples/results/strategy-vivid-dark.blueprint.yaml` 통과
- [x] teal/modern blueprint 회귀 없음 확인
- [x] preview 시각 QA: Korean text clipping 없음, callout bar와 card 경계 명확, footer 미노출

---

## Risks

| Risk | Mitigation |
|---|---|
| callout bar가 footer 텍스트와 겹침 | callout 있으면 footer 억제. compiler.ts에서 처리. |
| callout 없는 슬라이드에서 레이아웃 변화 없어야 함 | `callout-bar` 토큰 + `slide.callout` 둘 다 있을 때만 렌더. |
| chart-1/2 순서 변경으로 기존 snapshot 바뀜 | vivid는 snapshot 테스트 없음(아직). 기존 basic/architecture(modern 기반)는 영향 없음. |
| schema 추가 필드가 기존 blueprint 파싱 오류 | optional 필드이므로 기존 blueprint 영향 없음. |

---

## Discovery

*(착수 후 기록)*
