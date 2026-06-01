---
id: FEAT-20260601-002
title: "Blueprint generation quality rules — semantic component selection + AI tool alignment"
status: Done
type: FEAT
created: 2026-06-01
branch: feature/FEAT-20260601-002-blueprint-generation-quality-rules
---

# FEAT-20260601-002 — Blueprint generation quality rules

## Goal

자연어 또는 source 문서에서 PPTX를 만들 때 AI가 단순히 bullet slide를 나열하지 않고,
내용의 의미에 맞는 slide type, component, emphasis를 선택하도록 생성 규칙을 강화한다.

이 Work의 핵심은 `callout` 자동 삽입 하나가 아니다.
아래 판단을 AI 생성 workflow의 기본 품질로 만든다.

- 수치/추세/비교는 chart, kpi, table로 승격한다.
- 시스템 구성/처리 흐름은 architecture, flow로 승격한다.
- 선택/승인/권고는 decision 또는 summary로 승격한다.
- 핵심 메시지/결론/주의 문장은 필요한 경우에만 callout으로 분리한다.
- title, subtitle, body, callout, recommendation, takeaways의 역할을 분리한다.
- AI 도구별 entrypoint와 skill/command 문서가 같은 생성 품질 규칙을 따르게 정렬한다.
- README와 사용자/시스템 매뉴얼에 이 기능을 ai-deck-compiler의 주요 특징으로 설명한다.

## Product Positioning

이 기능은 ai-deck-compiler의 주요 차별점으로 부각할 수 있다.

현재의 가치:

```text
blueprint.yaml + design preset -> editable PPTX
```

강화 후의 가치:

```text
natural language / source document
  -> semantic blueprint planning
  -> 적절한 slide type과 강조 구조 선택
  -> editable PPTX
```

사용자에게는 "AI가 내용을 읽고 슬라이드 표현 방식을 고른다"는 경험으로 보이게 한다.
내부적으로는 deterministic renderer를 유지하고, 생성 skill이 blueprint 품질을 책임진다.

## Scope

### Layer 1 — Semantic component selection rules

생성 skill에 아래 선택 기준을 명시한다.

| 입력 내용의 성격 | 기본 표현 | 비고 |
| --- | --- | --- |
| 핵심 숫자 3~4개 | `kpi` | 큰 숫자 중심, 설명 최소화 |
| 시간 추세 | `chart` line/area | labels와 values 길이 검증 |
| 항목 비교 | `chart` bar 또는 `table` | 수치면 chart, 다차원 비교면 table |
| 구성비 | `chart` pie/donut | 항목 수가 너무 많으면 table 권장 |
| 시스템 구성 | `architecture` | node/edge/zone으로 구조화 |
| 단계별 절차 | `flow` | 순서와 방향성이 핵심일 때 |
| 양자택일/승인 | `decision` | recommendation 사용 |
| 현재 vs 제안 | `comparison` 또는 `two-column` | 대비가 핵심일 때 |
| 핵심 요약/다음 행동 | `summary` | takeaways 사용 |
| 강조 문장 1개 | `content` 또는 `flow`의 `callout` field | callout은 slide type이 아니라 optional emphasis field. 남발 금지 |

### Layer 2 — Emphasis hierarchy

각 텍스트 필드의 역할을 분리한다.

| Field | 역할 |
| --- | --- |
| `title` | 슬라이드의 결론. Action Title 원칙 |
| `subtitle` | 제목 아래 맥락 보완 |
| `section_label` | 위치/섹션 탐색 보조 |
| `body` | 근거, 설명, bullet |
| `callout` | 해당 슬라이드에서 기억할 한 문장 |
| `recommendation` | decision slide의 권고/선택 |
| `takeaways` | deck 또는 섹션 전체 요약 |

규칙:

- 중요한 문장을 무조건 callout으로 만들지 않는다.
- 선택/승인/권고 문장은 callout보다 `decision.recommendation`을 우선 검토한다.
- deck 전체 결론은 개별 slide callout보다 `summary.takeaways`를 우선 검토한다.
- callout은 권장 밀도 기준으로 deck 전체의 20~40% 슬라이드에만 사용한다.
  - 예: 6장 deck 기준 1~2장.
  - 이 수치는 hard validation rule이 아니라 생성 품질 가이드다.
- body bullet과 callout 문장을 그대로 중복하지 않는다.

### Layer 3 — Preset callout support (conditional scope)

`vivid`에서 구현된 callout 경험을 `teal`과 `modern`에 확장할지 결정하고 적용한다.

이 Layer는 Step 1 직후 Decision Gate 결과에 따라 포함 범위를 확정한다.

- OQ-1 결론이 `teal only`이면 본 Work 안에서 처리 가능.
- OQ-1 결론이 `modern 포함`이면 modern light visual QA를 blocker로 두고 진행 여부를 재확인한다.
- OQ-1 결론이 `callout-style 토큰 필요`이면 별도 Work로 분리한다.
- OQ-1 결론이 `preset 확장 제외`이면 본 Work는 generation rules와 documentation positioning에 집중하고 제외 사유를 Discovery에 기록한다.

검토 기준:

- `teal + dark`: full-width callout bar가 기본 tone과 잘 맞는지 확인.
- `modern + light`: full-width bar가 과하면 subtle style 또는 후속 Work로 분리.
- renderer를 단순 유지할지, `callout-style` 토큰을 추가할지 판단.

초기 방향:

```text
teal: callout-bar token 추가 가능성이 높음
modern: visual QA 후 full-width bar 또는 subtle treatment 결정
```

### Layer 4 — Icon policy

사용자가 "타이틀에 어울리는 아이콘"을 기대할 수 있으므로,
과하지 않은 icon 정책을 먼저 설계한다.

초기 원칙:

- arbitrary emoji 자동 삽입 금지.
- 제한된 semantic icon set만 허용.
- title 문자열 자체에 emoji를 섞기보다 `section_label` chip 또는 title-leading icon을 우선 검토.
- icon renderer 구현은 이번 Work에 포함할지, 별도 Work로 분리할지 결정한다.

후보 semantic icon:

| Meaning | Icon concept |
| --- | --- |
| Problem/Risk | warning/alert |
| Growth | trend-up |
| Decision | check/route |
| Architecture | network/nodes |
| Security | shield |
| Data | chart |
| Timeline | clock |
| Action | arrow-right |

### Layer 5 — AI tool alignment

동일한 생성 품질 규칙이 AI 도구별 entrypoint에서 drift 없이 적용되도록 정렬한다.

대상:

- `skills/create-deck.md`
- `skills/generate-blueprint.md`
- `.agents/skills/create-deck/SKILL.md`
- `.agents/skills/generate-blueprint/SKILL.md`
- `.claude/commands/create-deck.md`
- `.claude/commands/generate-blueprint.md`
- 관련 rule 또는 prompt가 있으면 해당 파일

정렬 원칙:

- wrapper 문서는 thin routing을 유지한다.
- 실제 생성 품질 규칙은 canonical skill 문서에 둔다.
- Claude/Codex/Cursor가 서로 다른 판단 기준을 갖지 않도록 cross-reference를 맞춘다.
- `.claude/commands/*.md`는 Claude Code용 command 정의로 취급하고, Codex 실행 규칙과 혼동하지 않는다.

### Layer 6 — README and manuals

이 기능을 사용자-facing 문서에서 주요 특징으로 설명한다.

대상:

- `README.md`
- `docs/USER-MANUAL.md`
- `docs/SYSTEM-MANUAL.md`
- 필요 시 `docs/PLAN-SUMMARY.md` 또는 architecture overview 문서

반영 내용:

- "AI-guided semantic blueprint planning"을 핵심 기능으로 소개.
- 자연어/문서 입력에서 slide type과 component를 선택하는 방식 설명.
- callout, chart, kpi, architecture, decision이 언제 생성되는지 예시 제공.
- deterministic renderer와 AI planning layer의 역할 분리 설명.
- 사용자에게 "원하면 blueprint를 직접 수정할 수 있고 PPTX는 editable"하다는 점을 강조.

## Non-goals

- LLM을 코드에 내장하여 자동 분류기를 구현하지 않는다.
- 모든 slide type renderer를 새로 설계하지 않는다.
- icon 렌더러 구현을 무조건 포함하지 않는다. 정책과 필요성 판단 후 포함/분리한다.
- callout을 모든 slide type에 확대하지 않는다. 필요 시 별도 schema/render Work로 분리한다.
- design preset 전체 리브랜딩을 하지 않는다.

## Plan

### Step 1 — AS-IS audit

- `create-deck` / `generate-blueprint`의 현재 생성 규칙 확인.
- README/USER-MANUAL/SYSTEM-MANUAL에서 현재 제품 설명 확인.
- Claude command, agent skill, canonical skill 간 drift 확인.

Exit Criteria:

- Discovery에 `Missing selection rules` 목록을 기록한다.
  - 예: chart 승격 기준 없음, decision vs callout 경계 없음.
- Discovery에 `Surface drift` 목록을 기록한다.
  - 예: `.claude/commands/create-deck.md`가 canonical skill의 component selection rule을 참조하지 않음.
- Discovery에 `Target files` 목록을 기록한다.
  - 수정할 파일과 읽기만 할 파일을 구분한다.
- 위 세 목록 없이 Step 2로 진행하지 않는다.

### Step 2 — Decision Gate: OQ-1/OQ-2/OQ-3

Step 1 audit 직후, semantic selection rule 작성 전에 scope를 확정한다.

필수 결정:

- OQ-1: `teal` / `modern` callout token 확장 범위
  - `teal only`, `teal + modern`, `defer`, `callout-style 별도 Work` 중 하나로 결정한다.
  - 결정에 따라 token/visual QA/test 범위를 확정한다.
- OQ-2: icon 처리 범위
  - `policy only`, `schema only`, `renderer included`, `separate Work` 중 하나로 결정한다.
  - `schema only` 또는 `renderer included`이면 blueprint field와 값 형식을 함께 결정한다.
  - 결정에 따라 Done Criteria와 Verification을 조정한다.
- OQ-3: sample 선택
  - `existing strategy deck 확장`, `별도 semantic-planning sample 생성`, `sample 제외` 중 하나로 결정한다.
  - 결정에 따라 Step 7 문서 예시와 Step 8 검증 산출물 범위를 맞춘다.

검증:

- 결정 결과와 이유를 Discovery에 기록한다.
- Layer 3/4 실행 범위와 검증 범위가 결정 결과와 일치해야 한다.

### Step 3 — Semantic selection rubric 작성

- chart/kpi/table 승격 기준 작성.
- architecture/flow 승격 기준 작성.
- decision/comparison/summary 선택 기준 작성.
- callout 사용 조건과 남발 방지 규칙 작성.

검증:

- 같은 입력 문장에 대해 callout/decision/summary 중 무엇을 선택할지 판단 예시를 Discovery에 1개 이상 기록한다.

### Step 4 — Canonical skill 문서 업데이트

- `skills/create-deck.md` Step 2/3에 component selection rule 추가.
- `skills/generate-blueprint.md` Blueprint 작성 절차에 quality rules 추가.
- source-first 처리에서 claim/data/decision/risk/action 추출 기준 추가.

검증:

- skill 문서만 읽고도 AI가 같은 slide type 선택을 할 수 있어야 한다.

### Step 5 — Preset callout 확장 판단 및 적용

- `teal`/`modern` tokens에 callout token 추가 여부 결정.
- 적용 시 문서와 preview로 visual QA.
- modern light에서 과하면 후속 Work로 분리.

검증:

- vivid/teal/modern sample 중 최소 1개씩 callout rendering 확인하거나, 미적용 사유 기록.
- token 적용 결과를 Step 6의 canonical skill 문서와 Step 7의 README/manual 설명에 반영한다.

### Step 6 — AI tool surface 정렬

- `.agents/skills/*/SKILL.md` wrapper가 canonical skill을 정확히 가리키는지 확인.
- `.claude/commands/*.md`가 같은 절차를 따르는지 확인.
- 필요 시 Cursor rule 또는 prompt surface를 확인한다.

검증:

- Step 1 `Surface drift` 목록의 각 항목이 해소되었는지 확인한다.
- Claude/Codex/Cursor 진입 경로가 같은 canonical 규칙을 참조한다.

### Step 7 — Documentation positioning

- README의 feature section에 semantic blueprint planning 추가.
- USER-MANUAL에 "AI가 어떤 내용을 어떤 slide type으로 바꾸는지" 설명 추가.
- SYSTEM-MANUAL에 planning layer와 compiler layer의 역할 분리 추가.

검증:

- 신규 사용자가 이 repo의 차별점을 README에서 바로 이해할 수 있어야 한다.
- 사용자 매뉴얼에서 "callout/architecture/chart는 언제 생기는가"에 답할 수 있어야 한다.

### Step 8 — Sample and validation

- sample blueprint를 하나 선택해 semantic quality rules를 적용한다.
- 필요 시 output sample PPTX와 preview를 생성한다.
- `validate`, `deck`, `preview`, `test/typecheck` 필요 여부를 변경 범위에 맞춰 실행한다.

검증:

- sample이 schema validation을 통과한다.
- preview에서 callout/icon/chart/component 선택이 과하지 않은지 확인한다.

## Done Criteria

- [x] Step 1 Discovery — `Missing selection rules`, `Surface drift`, `Target files` 목록 기록
- [x] Step 2 Discovery — OQ-1/OQ-2/OQ-3 결정 결과와 이유 기록
- [x] Step 3 Discovery — callout/decision/summary 판단 예시 1개 이상 기록
- [x] `skills/create-deck.md` — Step 2/3에 semantic component selection rule 추가
- [x] `skills/generate-blueprint.md` — Blueprint 작성 절차에 quality rule 추가
- [x] AI tool surfaces — Step 1 `Surface drift` 목록의 각 파일이 canonical skill을 참조하거나 동일 규칙으로 정렬됨
- [x] callout 사용 기준 — `skills/generate-blueprint.md`와 `skills/create-deck.md`에 callout vs decision vs summary 경계 명시
- [x] chart/kpi/table 승격 기준 — `skills/generate-blueprint.md`와 `skills/create-deck.md`에 명시
- [x] architecture/flow 승격 기준 — `skills/generate-blueprint.md`와 `skills/create-deck.md`에 명시
- [x] icon policy — Work Discovery와 적용 대상 문서에 허용/금지/후속 구현 범위 기록
- [x] `teal` / `modern` callout token 적용 여부 — OQ-1 결정에 따라 token 반영 또는 제외 사유를 Work Discovery에 기록
- [x] README — semantic blueprint planning을 주요 특징으로 반영
- [x] `docs/USER-MANUAL.md` — 사용자가 이해할 수 있는 생성 판단 기준 추가
- [x] `docs/SYSTEM-MANUAL.md` — planning layer와 renderer/compiler 역할 분리 설명 추가
- [x] sample blueprint/PPTX/preview 또는 적용 제외 사유를 Work Discovery에 기록
- [x] 변경 범위에 맞는 validation 실행

## Verification

문서/skill 중심 변경만 있을 경우:

```bash
git diff --check
```

blueprint/sample 변경 시:

```bash
npm run validate -- --blueprint <sample-blueprint.yaml>
npm run deck -- --blueprint <sample-blueprint.yaml> --output <sample.pptx>
npm run preview -- <sample.pptx> --out <sample-preview>
```

schema/render/token 변경 시:

```bash
npm run typecheck
npm test
```

visual QA:

- callout이 남발되지 않는가
- decision/recommendation이 callout으로 잘못 축소되지 않았는가
- chart/kpi/table로 표현할 수 있는 데이터가 bullet에 묻히지 않았는가
- architecture/flow가 필요한 구조 설명이 content slide로만 남지 않았는가
- icon이 과하지 않고 preset tone과 맞는가
- README/USER-MANUAL의 설명과 실제 sample이 일치하는가

## Risks

| Risk | Mitigation |
| --- | --- |
| 생성 규칙이 너무 장황해져 skill 실행이 무거워짐 | canonical 문서에 핵심 rubric을 표로 정리하고 wrapper는 thin 유지 |
| callout/icon 자동화가 과해져 PPT가 산만해짐 | density budget과 남발 방지 규칙 명시 |
| modern light에 full-width callout이 어울리지 않음 | visual QA 후 token 미적용 또는 후속 callout-style Work로 분리 |
| AI 도구별 문서가 다시 drift됨 | canonical skill 중심, wrapper는 routing만 유지 |
| README가 과장된 마케팅 문구가 됨 | 실제 가능한 workflow와 sample 중심으로 설명 |

## Reversal Cost

낮음~중간.

- skill/README/manual 문서 규칙만 되돌리면 낮음.
- token/schema/renderer 변경이 포함되면 중간.
- icon renderer를 포함하면 테스트와 visual QA 범위가 커지므로 별도 Work 분리 가능성을 우선 검토한다.

## Open Questions

| ID | Status | Decision |
| --- | --- | --- |
| OQ-1 | Resolved | `teal only`. `modern` callout treatment는 subtle style 또는 `callout-style` token 후속 Work로 분리한다. |
| OQ-2 | Resolved | Icon은 이번 Work에서 policy only로 제한하고 renderer/schema 구현은 후속 Work로 분리한다. |
| OQ-3 | Resolved | 기존 sample을 왜곡하지 않고 별도 `examples/semantic-planning/blueprint.yaml` sample을 생성한다. |
| OQ-4 | Resolved | README/Manual에서는 `Semantic Blueprint Planning`으로 포지셔닝한다. |

## Discovery

### 2026-06-01 — Step 1 AS-IS audit

Missing selection rules:

- `skills/create-deck.md`의 slide type 선택 가이드는 존재하지만, data → chart/kpi/table 승격 기준이 낮은 해상도다.
- `skills/create-deck.md`와 `skills/generate-blueprint.md` 모두 callout 사용 기준이 없다.
- callout vs `decision.recommendation` vs `summary.takeaways` 경계가 없다.
- source-first 처리에서 claim/data/decision/risk/action 추출 기준이 부족하다.
- `architecture`와 `flow`의 선택 경계가 충분히 명시되지 않았다.
- title/subtitle/body/callout/recommendation/takeaways의 emphasis hierarchy가 canonical skill에 없다.
- icon은 현재 schema/render 정책이 없고, arbitrary emoji 삽입을 막는 규칙도 없다.

Surface drift:

- `.agents/skills/create-deck/SKILL.md`, `.agents/skills/generate-blueprint/SKILL.md`는 thin wrapper로 유지되어 drift 없음.
- `.claude/commands/create-deck.md`는 `default-modern`을 기본 preset으로 안내하고 `src/design/presets/default-modern/ppt-layouts.md`를 참조한다. 현재 canonical 정책(`teal + dark`, `modern` alias)과 drift.
- `.claude/commands/generate-blueprint.md`도 `default-modern` 기본값과 stale layout reference를 가진다.
- `README.md` 한계 섹션은 `vivid` callout bar를 후속 Work로 설명한다. FEAT-20260601-001 이후 stale.
- README/USER-MANUAL/SYSTEM-MANUAL은 "semantic blueprint planning"을 주요 특징으로 설명하지 않는다.
- USER-MANUAL은 callout, chart, kpi, architecture, decision이 언제 생성되는지 사용자 관점 설명이 부족하다.
- SYSTEM-MANUAL은 AI planning layer와 deterministic compiler/renderer layer의 역할 분리가 개요에는 있으나 semantic planning 책임까지는 설명하지 않는다.

Target files:

- Modify:
  - `skills/create-deck.md`
  - `skills/generate-blueprint.md`
  - `.claude/commands/create-deck.md`
  - `.claude/commands/generate-blueprint.md`
  - `README.md`
  - `docs/USER-MANUAL.md`
  - `docs/SYSTEM-MANUAL.md`
  - `src/design/presets/teal/tokens.json`
  - `src/design/presets/teal/ppt-components.md`
  - `src/design/presets/teal/ppt-design.md`
  - sample blueprint/PPTX/preview files selected by OQ-3
- Read-only / reference:
  - `.agents/skills/create-deck/SKILL.md`
  - `.agents/skills/generate-blueprint/SKILL.md`
  - `src/design/presets/vivid/*`
  - `src/design/presets/modern/*`
  - `schemas/blueprint.schema.json`
  - `tests/*`

### 2026-06-01 — Step 2 Decision Gate

OQ-1 decision: `teal only`.

- Reason: `teal + dark` is the AI workflow default, and its accent/color model matches the existing full-width callout bar. This keeps the Work focused while making natural-language callout planning useful in the default preset.
- `modern` decision: defer. Modern light needs a subtler treatment than full-width bar or a future `callout-style` token. Include as follow-up, not blocker.
- Verification impact: token change requires `npm run typecheck`, `npm test`, and preview QA for a teal sample with callout.

OQ-2 decision: `policy only`.

- Reason: icon intent is valid, but schema/renderer work would expand scope into a new visual component. This Work will document semantic icon policy and arbitrary emoji limits only.
- Blueprint field/value format: not introduced in this Work. Future Work must decide between a slide-level field such as `icon: "chart"` and a richer object before schema/render changes.

OQ-3 decision: `별도 semantic-planning sample 생성`.

- Reason: existing strategy deck is useful but does not cover chart/kpi/table/architecture/decision/callout selection in one intentional example. A dedicated sample can demonstrate semantic component selection without distorting existing examples.
- Verification impact: add one sample blueprint, generate PPTX/preview if scope remains manageable, and reference it from README/manual.

### 2026-06-01 — Step 3 Semantic rubric example

Judgment example:

| Input sentence | Context | Blueprint choice |
| --- | --- | --- |
| "2026년은 파트너십으로 진입하고 2027년 내재화를 재검토한다." | 선택/승인 요청 | `decision.recommendation` |
| same sentence | 배경 설명 중 기억할 한 문장 | `content.callout` |
| same sentence | deck 전체 결론 | `summary.takeaways` |

Conclusion: callout is an emphasis field, not the default destination for every important sentence.

### 2026-06-01 — Step 8 Sample and validation

Sample:

- Added `examples/semantic-planning/blueprint.yaml`.
- Generated local PPTX for verification: `temp/semantic-planning-sample.pptx`.
- Generated local preview for visual QA: `temp/semantic-planning-preview/slide-02.png` through `slide-07.png`.

Visual QA:

- `slide-02`: teal callout renders and footer is suppressed.
- `slide-03`: KPI slide demonstrates numeric signal selection.
- `slide-04`: chart slide demonstrates trend/comparison selection.
- `slide-05`: architecture slide demonstrates planning/compiler boundary.
- `slide-06`: decision slide demonstrates icon policy decision boundary.
- `slide-07`: summary slide demonstrates deck-level takeaways.
- Long title density on slides 5/6 was reduced after preview inspection.

Validation:

```bash
npm run validate -- --blueprint examples/semantic-planning/blueprint.yaml
npm run deck -- --blueprint examples/semantic-planning/blueprint.yaml --output temp/semantic-planning-sample.pptx
npm run preview -- temp/semantic-planning-sample.pptx --out temp/semantic-planning-preview --slides 2,3,4,5,6,7 --dpi 120
npm run typecheck
npm test
git diff --check
```
