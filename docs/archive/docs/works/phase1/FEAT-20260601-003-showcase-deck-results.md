---
id: FEAT-20260601-003
title: "Showcase deck results — ai-deck-compiler 소개 PPTX + preset gallery 교체"
status: Archived
type: FEAT
created: 2026-06-01
actual_end: 2026-06-01
branch: feature/FEAT-20260601-003-showcase-deck-results
---

# FEAT-20260601-003 — Showcase deck results

## Goal

`ai-deck-compiler` 자체를 소개하는 발표용 showcase deck을 만들고,
품질이 충분하면 `examples/results`의 기존 strategy 예제를 이 showcase 결과물로 교체한다.

이 Work는 단순 sample 추가가 아니라 README 첫 화면에서 제품 품질을 보여주는 대표 산출물을 만드는 작업이다.

## Scope

- `ai-deck-compiler` / `create-deck` workflow를 소개하는 하나의 canonical showcase blueprint 작성.
- 가능한 많은 slide type을 자연스럽게 포함한다.
- `teal + dark`, `vivid + dark`, `modern + light` preset/theme별 PPTX 결과물을 생성한다.
- 필요하면 현재 repo의 commit/work history를 데이터화해 chart/table/timeline에 사용한다.
- `examples/results/README.md`와 README 첫 화면의 gallery 이미지를 showcase 기준으로 갱신한다.
- 기존 `strategy-*` result 파일은 품질 검토 후 showcase naming으로 대체한다.

## Non-goals

- Renderer layout 자체를 대규모 수정하지 않는다.
- 새 slide type을 추가하지 않는다.
- 외부 조사 기반 시장 데이터는 만들지 않는다. 필요한 데이터는 repo history와 현재 기능 목록을 사용한다.
- README를 전면 재작성하지 않는다. 첫 화면 visual과 examples/results 설명 중심으로 갱신한다.

## Planned Slide Coverage

현재 지원 slide type은 16개다.

| Type | Showcase 사용 방향 |
| --- | --- |
| `hero` | 제품명, 한 줄 가치, 발표 맥락 |
| `agenda` | 발표 흐름 |
| `section-divider` | 큰 섹션 전환 |
| `content` | 핵심 메시지와 callout |
| `two-column` | AI 작성 경험 vs 일반 PPT 제작 흐름 |
| `comparison` | 기존 bullet deck vs semantic blueprint planning |
| `kpi` | 지원 범위, 테스트 수, preset 수, slide type 수 |
| `timeline` | 2026-05-30 ~ 2026-06-01 개발 progression |
| `architecture` | Natural language -> blueprint.yaml -> renderer -> PPTX 구조 |
| `flow` | create-deck/review-deck loop |
| `table` | AI tool entrypoint 또는 preset matrix |
| `chart` | commit/work history 기반 구현 추이 |
| `decision` | 대표 산출물이 제품 가치를 직접 보여줘야 한다는 기준 |
| `summary` | 사용자 가치 요약 |
| `appendix` | 재생성 명령과 파일 목록 |
| `closing` | 다음 행동 |

## Plan

1. **AS-IS audit**
   - 현재 `examples/results` 파일, README gallery 참조, slide type/schema, preview command를 확인한다.
2. **Content model**
   - commit history와 Work history에서 showcase용 데이터셋을 추출한다.
   - 제품 메시지, audience, narrative spine을 확정한다.
3. **Canonical blueprint 작성**
   - `examples/results/showcase-teal-dark.blueprint.yaml`를 먼저 작성한다.
   - 모든 slide type이 억지로 들어가지 않고 실제 제품 소개 흐름 안에 놓이는지 검토한다.
4. **Preset variants 생성**
   - canonical content를 기준으로 `showcase-vivid-dark`, `showcase-modern-light` blueprint/PPTX를 생성한다.
   - preset/theme 외 내용 drift는 최소화한다.
5. **Preview and visual QA**
   - 각 preset preview를 생성하고 title overflow, chart visibility, architecture/flow readability, callout density를 확인한다.
   - 필요하면 blueprint 문구와 slide count를 조정한다.
6. **README gallery 갱신**
   - 대표 slide를 2x3 gallery 이미지로 만든다.
   - README와 `examples/results/README.md`를 showcase 기준으로 갱신한다.
7. **Validation**
   - blueprint validation, PPTX generation, preview generation, typecheck/test, diff hygiene를 실행한다.

## Done Criteria

- [x] `examples/results`에 showcase blueprint 3개와 PPTX 3개가 존재한다.
- [x] 기존 strategy result 파일은 showcase 결과물로 대체되거나 제거 사유가 Discovery에 기록된다.
- [x] Showcase deck이 지원 slide type 16개를 모두 포함하거나, 제외한 type과 이유가 Discovery에 기록된다.
- [x] `README.md` 첫 화면 gallery가 showcase 결과물로 갱신된다.
- [x] `examples/results/README.md`가 showcase 파일명과 재생성 명령을 설명한다.
- [x] 각 preset/theme PPTX가 생성되고 preview visual QA가 수행된다.
- [x] `npm run validate`, `npm run deck`, `npm run preview`가 showcase 대상에서 통과한다.
- [x] `npm run typecheck`, `npm test`, `git diff --check`가 통과한다.

## Verification

```bash
npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml
npm run deck -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml --output examples/results/showcase-teal-dark.pptx
npm run preview -- examples/results/showcase-teal-dark.pptx --out temp/showcase-teal-preview

npm run validate -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml
npm run deck -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml --output examples/results/showcase-vivid-dark.pptx
npm run preview -- examples/results/showcase-vivid-dark.pptx --out temp/showcase-vivid-preview

npm run validate -- --blueprint examples/results/showcase-modern-light.blueprint.yaml
npm run deck -- --blueprint examples/results/showcase-modern-light.blueprint.yaml --output examples/results/showcase-modern-light.pptx
npm run preview -- examples/results/showcase-modern-light.pptx --out temp/showcase-modern-preview

npm run typecheck
npm test
git diff --check
```

## Risks

| Risk | Mitigation |
| --- | --- |
| 모든 slide type을 넣으려다 소개 deck이 산만해짐 | 부록/섹션 전환까지 포함해 자연스러운 흐름으로 배치하고, 억지 사용은 Discovery에 제외 사유 기록 |
| README gallery가 너무 복잡해짐 | 첫 화면은 2x3 구성으로 여러 slide type을 보여주되 제목이 짧은 장표를 우선 선택 |
| PPTX binary diff가 커짐 | 재생성 명령을 README에 명확히 유지하고, tracked result 정책(DR-022)을 따른다 |
| develop/main sync 상태가 꼬임 | 시작 시 develop을 main과 동기화한 뒤 feature branch를 맞췄다 |

## Discovery

### 2026-06-01 — Start

- Current branch: `feature/FEAT-20260601-003-showcase-deck-results`.
- Work started after `develop` was synced with `origin/main` because FEAT-20260601-002 was present on `main` but local `develop` had not yet incorporated it.
- Existing result set:
  - `strategy-teal-dark.blueprint.yaml` / `.pptx`
  - `strategy-vivid-dark.blueprint.yaml` / `.pptx`
  - `strategy-modern-light.blueprint.yaml` / `.pptx`
  - `preset-gallery.png`
- Current product surface supports 16 slide types: `hero`, `agenda`, `section-divider`, `content`, `two-column`, `comparison`, `kpi`, `timeline`, `architecture`, `flow`, `table`, `chart`, `decision`, `summary`, `appendix`, `closing`.

### 2026-06-01 — Implementation

- Created showcase blueprints:
  - `examples/results/showcase-teal-dark.blueprint.yaml`
  - `examples/results/showcase-vivid-dark.blueprint.yaml`
  - `examples/results/showcase-modern-light.blueprint.yaml`
- Generated matching PPTX files for all three preset/theme combinations.
- Replaced prior strategy result set with showcase result naming.
- Created `examples/results/showcase-gallery.png` as a 2x3 README gallery.
- Updated `README.md` and `examples/results/README.md` to use the showcase result set.
- Updated `tests/snapshot.test.ts` callout footer suppression fixture from removed strategy result to showcase-vivid result.
- Updated `docs/decisions/DR-022-results-pptx-git-tracking.md` result inventory wording from `preset-gallery.png` to showcase gallery image.

Slide type coverage:

| Type | Slide |
| --- | --- |
| `hero` | 1 |
| `agenda` | 2 |
| `section-divider` | 3, 10 |
| `content` | 4 |
| `two-column` | 5 |
| `comparison` | 6 |
| `kpi` | 7 |
| `chart` | 8, 9 |
| `architecture` | 11 |
| `flow` | 12 |
| `table` | 13 |
| `timeline` | 14 |
| `decision` | 15 |
| `summary` | 16 |
| `appendix` | 17 |
| `closing` | 18 |

Visual QA notes:

- Teal/vivid callout bars render on content/flow slides and suppress footer as expected.
- Modern light does not render callout bars because modern has no `callout-bar` token; content remains readable and footer remains visible.
- Initial dark chart preview showed low-contrast legend text. Adjusted showcase charts to single-series bar/line charts and changed chart renderer to hide legends for single-series charts.
- Follow-up gallery QA shortened long slide titles, added a second chart slide, changed the gallery from 2x2 to 2x3, and matched the closing divider line width to the hero underline formula.
- Review follow-up adjusted panel/subheader hierarchy so `two-column` and `comparison` panel labels render larger than body text without increasing body density.
- Review follow-up changed the gallery mix to 2 teal / 2 vivid / 2 modern slides.
- Review follow-up changed the showcase decision slide and agenda wording so the deck describes the product value rather than exposing internal example-replacement workflow.
- Appendix now includes deck regeneration commands plus a note that vivid/modern preview commands follow the same file/path pattern as teal.
- Teal, vivid, and modern preview generation completed for all 18 slides.

Validation:

```bash
npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml
npm run validate -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml
npm run validate -- --blueprint examples/results/showcase-modern-light.blueprint.yaml
npm run deck -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml --output examples/results/showcase-teal-dark.pptx
npm run deck -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml --output examples/results/showcase-vivid-dark.pptx
npm run deck -- --blueprint examples/results/showcase-modern-light.blueprint.yaml --output examples/results/showcase-modern-light.pptx
npm run preview -- examples/results/showcase-teal-dark.pptx --out temp/showcase-teal-preview --dpi 120
npm run preview -- examples/results/showcase-vivid-dark.pptx --out temp/showcase-vivid-preview --dpi 120
npm run preview -- examples/results/showcase-modern-light.pptx --out temp/showcase-modern-preview --dpi 120
npm run typecheck
npm test
git diff --check
```

All commands passed.
