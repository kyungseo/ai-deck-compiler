---
id: FEAT-20260531-007
title: "Design Preset 고도화 — teal (신규 권장 default) + vivid skeleton 추가"
status: Archived
type: FEAT
created: 2026-05-31
actual_end: 2026-05-31
branch: feature/FEAT-20260531-007-preset-design-overhaul
---

# FEAT-20260531-007 — Design Preset 고도화

## Goal

b01~b08 캡처본(teal-dark)을 ai-deck-compiler의 기본 경험으로 만든다.

- `teal` preset 신규 추가 — b01~b08 기반, **AI workflow/recommended default**로 지정
- `section_label` chip 렌더링(P0) 구현 — `renderSectionHeader()`를 사용하는 공통 슬라이드에 teal filled chip 적용
- README / USER-MANUAL / SYSTEM-MANUAL / skills 문서에서 기본 추천 preset을 `teal + dark`로 업데이트
- 대표 example 최소 1개 `design: teal`, `theme: dark`로 전환
- `vivid` preset skeleton 추가 (A 시리즈 기반, 후속 Work로 심화)
- `modern` canonical preset으로 정리 — 기존 `default-modern`은 alias로 호환성 유지

**"default 변경"의 의미:**
기존 `default-modern` 이름을 사용자-facing 기본값으로 유지하지 않는다.
AI와 문서가 새 deck 작성 시 기본 추천값으로 `design: teal`, `theme: dark`를 제안하도록 만드는 것이 목표다.
기존 blueprint에서 `design: default-modern`을 명시한 경우 resolver alias를 통해 계속 동작한다.

---

## 참고 이미지

### B 시리즈 — teal preset 메인 레퍼런스 (b01~b08)

```
temp/b01.png  Hero — charcoal 배경, 추상 teal 텍스처, bold white 제목, teal chip subtitle
temp/b02.png  Content — "SESSION GUIDE" chip, Our Goal 카드 (teal left border), 2×2 그리드 카드 (teal border)
temp/b03.png  Two-column — "HIGHLIGHTS" chip, 2×2 섹션 (teal 수평선 구분), 우측 대각선 데코 이미지
temp/b04.png  Two-column (이미지 좌) — "AREAS FOR IMPROVEMENT" chip, 강조 카드 + 리스트 박스
temp/b05.png  3-column cards — "IDEAS" chip, 아이콘 위 배치, teal border 카드
temp/b06.png  2×2 card grid — "CELEBRATION" chip, 아이콘 + 제목 + 본문, teal border
temp/b07.png  Timeline/Flow — "ACTION PLAN" chip, 원형 노드 + teal 테두리 + 아이콘, 하단 4-col 카드
temp/b08.png  Closing — "WRAP-UP" chip, 01/02/03/04 teal 번호, 좌측 데코 이미지
```

### A 시리즈 — vivid preset 보조 레퍼런스 (01~05)

```
temp/01.png   Content — deep navy 배경, vivid purple 제목, 3-col 카드, bottom callout bar
temp/02.png   Chart — 풀 dark, purple 바 차트, legend pill 칩, 하단 요약 텍스트
temp/03.png   Two-column — section chip (purple), 좌측 accordion 카드, 우측 라인 차트
temp/04.png   Flow — 원형 노드 연결, 하단 3 purple 카드, bottom callout bar
temp/05.png   Two-column (code) — 좌 텍스트, 우 코드 블록 카드 (dark tinted bg)
```

---

## Discovery

### B 시리즈 색상 추출 (teal preset tokens)

| 토큰 | 값 | 용도 |
|---|---|---|
| bg | `#1A1C1E` | 슬라이드 배경 (차콜, 중립적 dark) |
| card-bg | `#242829` | 카드/박스 배경 |
| accent | `#2D6B5E` | chip, 보더, 아이콘, 숫자 강조 (deep teal) |
| text-primary | `#FFFFFF` | 제목 |
| text-secondary | `#9BA0A6` | 본문 |
| chip-bg | `#2D6B5E` | section_label chip 배경 |
| chip-text | `#FFFFFF` | section_label chip 텍스트 |
| border | `#2D6B5E` | 카드 테두리 (후속) |
| line | `#2D6B5E` | 섹션 구분선 (후속) |

**B 시리즈 디자인 신호 (강도순):**
1. **section_label chip** — filled teal 직사각형 배지. 전 슬라이드 반복. → P0 구현 대상
2. 카드 teal 1px border → P1 후속
3. flow 원형 노드 + teal 테두리 → P1 후속
4. closing 01/02 teal 번호 → P2 후속
5. hero subtitle chip 스타일 → P2 후속

### A 시리즈 색상 추출 (vivid preset skeleton tokens)

| 토큰 | 값 | 용도 |
|---|---|---|
| bg | `#0D0F1E` | deep navy 배경 |
| card-bg | `#161824` | 카드 배경 |
| accent | `#7B6CF6` | vivid purple |
| text-primary | `#FFFFFF` | 제목 |
| text-secondary | `#8B8FA8` | 본문 |
| chart-colors | `#7B6CF6`, `#A89BF8`, `#5340CC` | purple 단계 |

---

## 확정된 결정사항

### 결정 1 — 명칭: `teal` / `vivid`

- `teal`: b01~b08 기반 신규 권장/default preset
- `vivid`: A 시리즈 기반 secondary/experimental preset
- "default"는 AI workflow/recommended default 변경이지 디렉터리 rename이 아님을 문서화

### 결정 2 — 렌더러 범위: P0(section_label chip)만 1차 구현

- b01~b08에서 반복되는 가장 강한 디자인 신호
- **적용 대상: `renderSectionHeader()`를 사용하는 슬라이드 타입** (content, two-column, kpi, chart, table, timeline, flow, comparison, decision, agenda, summary, appendix 등 공통 흐름)
- **적용 제외 (후속 P2):** hero, closing, section-divider — 별도 렌더링 흐름이므로 이번 Work에서 억지로 건드리지 않음
- chip 색상: `chip-bg` → `accent` fallback, chip text: `chip-text` → white fallback
- overflow 대비: 긴 section_label 테스트 필요
- section_label 없는 슬라이드의 title 위치 기존과 동일 유지
- 카드 border / flow circle / closing number / hero chip / chart legend → 후속 P1/P2

### 결정 3 — vivid 우선순위: teal 완료 후, 이번 Work는 skeleton까지

- vivid 디렉터리 + tokens.json + 문서 4종 skeleton 작성
- 예제 전환·visual QA 주 대상은 teal으로 제한
- vivid는 "secondary preset"으로 문서화, A 시리즈 고유 요소(callout bar, legend pill)는 후속 Work

### 결정 4 — Light 테마: dark only, light는 최소 fallback

- b01~b08 / A 시리즈 모두 dark 기반 → light 디자인 근거 없음
- tokens.json에 `light` 섹션 필수 포함 (resolver가 없으면 오류) — dark 값과 유사하게 구성
- USER-MANUAL에 `teal`, `vivid`는 dark 우선 preset임을 명시
- light 수요는 `modern light`로 대응 (`default-modern`은 alias)

---

## Scope

### 1차 구현 범위 (이번 Work)

#### Layer 1 — teal preset

| 파일 | 작업 |
|---|---|
| `src/design/presets/teal/tokens.json` | 신규 — B 시리즈 색상/타이포 토큰 (dark + light fallback) |
| `src/design/presets/teal/ppt-design.md` | 신규 — AI용 design system 문서 |
| `src/design/presets/teal/ppt-layouts.md` | 신규 — 레이아웃 가이드 |
| `src/design/presets/teal/ppt-components.md` | 신규 — 컴포넌트 가이드 |
| `src/design/presets/teal/ppt-chart-rules.md` | 신규 — 차트 규칙 |

#### Layer 2 — vivid preset skeleton

| 파일 | 작업 |
|---|---|
| `src/design/presets/vivid/tokens.json` | 신규 skeleton — A 시리즈 색상 토큰 |
| `src/design/presets/vivid/ppt-design.md` | 신규 skeleton |
| `src/design/presets/vivid/ppt-layouts.md` | 신규 skeleton |
| `src/design/presets/vivid/ppt-components.md` | 신규 skeleton |
| `src/design/presets/vivid/ppt-chart-rules.md` | 신규 skeleton |

#### Layer 3 — section_label chip 렌더러 (P0)

| 대상 | 작업 |
|---|---|
| `src/templates/layout.ts` 또는 공통 렌더러 | `section_label` 있을 때 filled rect chip으로 렌더링 |
| `renderSectionHeader()` 사용 슬라이드 타입 | chip 적용 후 title y 위치 조정 — section_label 없으면 기존 동일 |
| hero / closing / section-divider | **이번 Work에서 변경 없음** — 별도 렌더링 흐름, 후속 P2로 분리 |
| `tests/__snapshots__/` | `-u`로 snapshot 업데이트, diff 리뷰 |

#### Layer 4 — AI/문서 default 안내 변경

| 파일 | 작업 |
|---|---|
| `skills/create-deck.md` | 기본값 질문에서 `design: teal`, `theme: dark` 우선 제안으로 수정. light 원하면 `modern light` 안내 |
| `skills/generate-blueprint.md` | blueprint 예시 `design` 값 → `teal`, 기본 preset 안내 `teal + dark`로 업데이트 |
| `README.md` | Design Preset 섹션 → `teal` 중심 설명, `modern`은 light/legacy preset으로 표기. 예제 실행 안내 teal output 기준 정리 |
| `docs/USER-MANUAL.md` | preset 목록에 `teal`(권장 dark), `vivid`(보조 dark), `modern`(legacy/light 수요) 역할 분리. `teal`/`vivid`는 dark recommended 명시 |
| `docs/SYSTEM-MANUAL.md` | preset 디렉터리 구조 반영, AI workflow/recommended default 정책 명시, `default-modern` alias 호환성 추가, section_label chip 렌더링 적용 범위 요약 |

#### Layer 5 — examples 전환 및 대표 example 확장

| 파일 | 작업 |
|---|---|
| `examples/strategy/blueprint.yaml` | `design: teal`, `theme: dark`로 전환 |
| `examples/data-report/blueprint.yaml` | `design: teal`, `theme: dark`로 전환 |
| `examples/sample/blueprint.yaml` | `design: teal` 또는 `vivid` 활용 검토 |
| 대표 example 1개 확장 | b01~b08 패턴을 반영한 example 추가 또는 기존 확장 — hero / content(section_label 포함) / two-column / kpi / timeline 또는 flow / closing-summary 포함. chip 렌더링 확인 가능 슬라이드 필수 |

### 후속 Work로 분리 (이번 범위 밖)

| 항목 | 우선순위 |
|---|---|
| 카드 teal 1px border (content/two-column) | P1 |
| flow 원형 노드 + teal 테두리 | P1 |
| hero subtitle chip 스타일 | P2 |
| closing / section-divider 렌더러 chip 적용 | P2 |
| closing 번호 01/02 teal 색 | P2 |
| chart legend pill 칩 | P2 |
| vivid 고유 요소 (callout bar, legend, chart palette 심화) | 후속 Work |
| teal/vivid light 테마 제대로 디자인 | 후속 Work |

---

## Done Criteria

**Preset 추가:**
- [x] `src/design/presets/teal/` — tokens.json + 문서 4종 (dark + light fallback 포함)
- [x] `src/design/presets/vivid/` — tokens.json + 문서 4종 skeleton

**렌더러 (P0):**
- [x] `section_label` chip 렌더러 구현 — filled roundRect, chip-bg/accent 색상, white 텍스트
- [x] 적용 대상: `renderSectionHeader()` 사용 슬라이드 타입만 (hero/closing/section-divider 제외)
- [x] section_label 없는 슬라이드 title 위치 기존 동일 유지 확인
- [x] 긴 section_label overflow 테스트 — `wrap: false` + 동적 너비(0.10×chars+0.40, max 4.0")

**AI/문서 현행화:**
- [x] `skills/create-deck.md` — 기본 추천 `teal + dark`로 수정, light 대안 안내 포함
- [x] `skills/generate-blueprint.md` — blueprint 예시 + preset 기본값 `teal + dark`로 수정
- [x] `README.md` — Design Preset 섹션 teal 중심 업데이트, 예제 실행 teal 기준 정리
- [x] `docs/USER-MANUAL.md` — preset 목록 역할 분리, dark recommended 명시
- [x] `docs/SYSTEM-MANUAL.md` — preset 구조 + default policy + chip 적용 범위 요약

**Examples:**
- [x] `examples/strategy/blueprint.yaml` — `design: teal`, `theme: dark` 전환
- [x] `examples/data-report/blueprint.yaml` — `design: teal`, `theme: dark` 전환
- [x] teal 권장 preset을 보여주는 대표 example 1개 이상 확장 (section_label chip 확인 가능 슬라이드 포함)
- [x] 확장 example PPTX 생성 확인

**검증:**
- [x] `npm run typecheck` 통과
- [x] `npm test` 통과 (snapshot 2개 업데이트, summary panelW 여백 조정 반영)
- [x] `npm run validate -- --blueprint examples/strategy/blueprint.yaml` 통과
- [x] `npm run deck -- --blueprint examples/strategy/blueprint.yaml --output output/strategy-teal.pptx` 생성 확인
- [x] 기존 `default-modern` alias validate/deck 회귀 없음 확인
- [ ] (권장) PowerPoint 또는 preview 수동 확인 — b01~b08 기본 인상과 유사한지

---

## 1차 Scope 요약

1. `teal` preset tokens + 문서 4종 추가
2. `renderSectionHeader()` 기반 section_label chip P0 구현 (hero/closing/section-divider 제외)
3. `create-deck` / `generate-blueprint` 기본 추천 preset → `teal + dark`
4. README / USER-MANUAL / SYSTEM-MANUAL preset 안내 현행화
5. 대표 example 최소 1개 teal + dark 기준 확장 (chip 확인 가능 슬라이드 포함)
6. `modern` canonical + 기존 `default-modern` alias 회귀 확인
7. vivid는 skeleton만, 심화는 후속 Work

---

## Risks

| Risk | Mitigation |
|---|---|
| "default"가 preset 이름 교체로 오해될 수 있음 | docs에 "AI workflow/recommended default"로 명시, 디렉터리 유지·호환 정책 설명 추가 |
| `teal`/`vivid` dark-only인데 `theme: light` 사용 시 기대와 다른 결과 | tokens.json에 light 섹션 포함(dark fallback) + docs에 dark recommended 명시 |
| section_label chip으로 title layout 밀림 또는 긴 label overflow | 긴 label 테스트 + snapshot diff 확인 |
| hero/closing/section-divider에 chip 억지 적용 시 scope 확대 | Layer 3 적용 대상 명시(renderSectionHeader 사용 타입만), 별도 타입은 후속 Work |
| vivid 동시 심화 시 teal visual QA 흐려짐 | vivid는 skeleton/secondary로 제한, QA 주 대상은 teal |
| teal 색상 값이 pptxgenjs에서 실제와 다르게 렌더링 | PPTX 생성 후 PowerPoint/preview 수동 확인 |
