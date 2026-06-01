---
id: FEAT-20260602-001
title: "Headline wrap polish — action-title 가독성 보정"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: FEAT
branch: feature/feat-20260602-001-headline-wrap-polish
---

# FEAT-20260602-001 — Headline wrap polish

## Goal

문장형 action title이 생성 PPTX에서 과도하게 두 줄로 떨어지는 문제를 줄이고,
public-facing showcase deck의 headline 가독성을 개선한다.

## Scope

- showcase preview에서 headline wrapping이 과도한 slide를 식별한다.
- renderer/design token/layout/content 중 최소 변경으로 title 가독성을 보정한다.
- `examples/results/showcase-*` PPTX/PDF/preview/gallery를 재생성한다.
- 필요한 경우 README 또는 `examples/results/README.md`의 gallery 설명을 최신 상태로 유지한다.

## Non-goals

- 새 slide type 추가
- typography system 전면 개편
- 전체 preset visual redesign
- create-deck workflow 추가 개편
- public repo settings 실행

## Done Criteria

- [x] headline wrapping 문제가 있는 showcase slide를 preview 기준으로 확인한다.
- [x] 최소 변경 지점과 선택 이유를 Discovery에 기록한다.
- [x] teal/dark, vivid/dark, modern/light showcase PPTX/PDF가 재생성된다.
- [x] preview 3종과 `examples/results/showcase-gallery.png`가 재생성된다.
- [x] representative visual QA에서 headline 가독성, title/body overlap, gallery 품질을 확인한다.
- [x] `npm run validate`, `npm run typecheck`, `npm test`, `git diff --check` 통과.

## Verification

```bash
npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml
npm run validate -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml
npm run validate -- --blueprint examples/results/showcase-modern-light.blueprint.yaml
npm run typecheck
npm test
git diff --check
```

## Risks

| Risk | Mitigation |
| --- | --- |
| title font를 낮추면 visual hierarchy가 약해짐 | 필요한 범위에서만 공통 title size/height를 조정하고 preview로 확인 |
| content copy만 줄이면 create-deck action-title 원칙이 약해짐 | renderer/layout 보정을 우선 검토하고, copy 수정은 과도한 slide에만 제한 |
| binary artifact diff가 커짐 | regeneration command와 visual QA 결과를 Discovery에 기록 |

## Discovery

### 2026-06-02 — Start

- Current branch: `feature/feat-20260602-001-headline-wrap-polish`.
- Trigger: final showcase preview에서 action-title headline이 길지 않아도 두 줄로 떨어지는 slide가 여럿 관찰됨.
- Initial code finding: normal slide titles use shared `renderHeader()` with 40pt typography and a 0.60~0.82 inch title box. This is tight for Korean/English mixed sentence-style action titles.

### 2026-06-02 — Implementation

- Chosen change: keep preset `title` tokens and hero/closing/section-divider typography intact, but add compact sizing inside shared `renderSectionHeader()` for long sentence-style action titles.
- Rationale: this fixes normal slide headers without weakening hero or closing slide hierarchy.
- Added a renderer regression test that verifies a long action title uses compact header typography and a taller title box.
- Updated current test count from 58 to 59 in README, SYSTEM-MANUAL, and showcase KPI data.

### 2026-06-02 — Visual QA

- Before: modern slide 08 wrapped as two lines with the final word isolated; modern slide 11 also split the architecture action title.
- After: modern slide 08 and slide 11 render headline titles on one line with better spacing above the content card.
- Checked teal slide 08 and modern slide 04 to confirm hierarchy remains strong and content/card overlap does not occur.
- Regenerated `examples/results/showcase-gallery.png` from updated preview slides.

### 2026-06-02 — Final verification

- `npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml`: pass.
- `npm run validate -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml`: pass.
- `npm run validate -- --blueprint examples/results/showcase-modern-light.blueprint.yaml`: pass.
- `npm run deck` for teal/vivid/modern showcase outputs: pass.
- `npm run export-pdf` for teal/vivid/modern showcase outputs: pass.
- `npm run preview` for teal/vivid/modern showcase outputs: pass, 18 slides each.
- `npm run typecheck`: pass.
- `npm test`: pass, 3 files / 59 tests.
- `git diff --check`: pass.
