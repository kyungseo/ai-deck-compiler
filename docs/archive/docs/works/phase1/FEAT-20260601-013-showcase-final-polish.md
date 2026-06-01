---
id: FEAT-20260601-013
title: "Showcase final polish — ai-deck-compiler 실전형 대표 deck"
status: Archived
created: 2026-06-01
actual_end: 2026-06-02
type: FEAT
branch: feature/feat-20260601-013-showcase-final-polish
---

# FEAT-20260601-013 — Showcase final polish

## Goal

`ai-deck-compiler` 자체를 주제로 한 대표 showcase deck을 실전형 산출물 수준으로 다듬는다.

이 showcase는 단순 기능 나열이나 slide type coverage 예제가 아니라, README 첫 화면에서 제품의 핵심 메시지,
AI-assisted deck workflow, editable PPTX 가치, preset 차이, 짧지만 집중적인 구현 이력을 한 번에 보여주는
public-facing proof artifact가 되어야 한다.

## Scope

- `examples/results/showcase-*.blueprint.yaml` content를 `ai-deck-compiler` 자체의 핵심 메시지 중심으로 재작성/보강.
- `teal + dark`, `vivid + dark`, `modern + light`가 같은 구조를 각기 다른 톤으로 보여주도록 유지.
- 가능한 많은 slide type을 포함하되, 전체 narrative 흐름 안에서 자연스럽게 배치.
- commit history, Work count, LOC, tests, slide type coverage 등 repo 기반 데이터를 chart/KPI/table에 사용.
- 최근 추가한 code block component를 showcase 안에서 자연스럽게 예시.
- PPTX/PDF/preview/gallery를 재생성하고 visual QA로 공란, 밀도, title overflow, chart 가독성, architecture/flow 가독성을 확인.

## Non-goals

- 새 slide type 추가
- renderer/layout 대규모 리팩토링
- 외부 시장 리서치 기반 주장 추가
- GitHub public 전환 설정 실행
- AI tool simulation 전체 수행

## Narrative Direction

1. **Problem:** AI가 PPT를 만들 수 있어도 결과물이 이미지·bullet·즉흥 layout으로 남으면 수정과 재사용이 어렵다.
2. **Thesis:** `ai-deck-compiler`는 AI 판단을 `blueprint.yaml`이라는 의미 구조로 고정하고, renderer가 editable PPTX로 안정적으로 출력한다.
3. **Proof:** 짧은 기간에 slide types, presets, skills, tests, examples, preview/export loop를 집중적으로 쌓았다.
4. **System:** create-deck → blueprint → compiler → preset tokens → PPTX/PDF/preview의 경계를 분리했다.
5. **Artifact:** 이 showcase 자체가 product proof다. 같은 blueprint를 세 preset으로 재생성해 결과 품질을 보여준다.

## Planned Slide Coverage

| Type | Showcase 역할 |
| --- | --- |
| `hero` | 제품명과 핵심 thesis |
| `agenda` | 실전 발표 흐름 |
| `section-divider` | Problem / System / Proof / Result 전환 |
| `content` | 핵심 주장과 callout |
| `two-column` | AI improvisation vs structured artifact |
| `comparison` | generic AI slide output vs blueprint-first workflow |
| `kpi` | tests, slide types, presets, result sets |
| `chart` | commit/work/LOC 기반 build intensity와 artifact coverage |
| `table` | preset/theme/result matrix |
| `architecture` | AI planning과 deterministic rendering 경계 |
| `flow` | create-deck + review/preview loop |
| `timeline` | May 30 → Jun 01 집중 구현 흐름 |
| `decision` | showcase를 product proof artifact로 두는 이유 |
| `summary` | public viewer가 기억해야 할 결론 |
| `appendix` | regeneration commands/code block component |
| `closing` | 최종 메시지 |

## Done Criteria

- [x] `examples/results/showcase-teal-dark.blueprint.yaml`이 실전형 product showcase narrative를 담음
- [x] `showcase-vivid-dark` / `showcase-modern-light`가 동일 content를 preset/theme 차이 중심으로 반영
- [x] chart/KPI/table 데이터가 repo 상태 또는 검증 가능한 local command 결과에 근거함
- [x] code block component가 appendix 또는 content slide에서 자연스럽게 예시됨
- [x] PPTX 3종, PDF 3종, preview 3종, README gallery가 재생성됨
- [x] visual QA에서 공란 과다, 제목 overflow, chart/architecture/flow 가독성 문제를 점검함
- [x] README / `examples/results/README.md`가 최신 artifact와 regeneration 흐름을 반영함
- [x] `npm run validate`, `npm run deck`, `npm run export-pdf`, `npm run preview`, `npm run typecheck`, `npm test`, `git diff --check` 통과

## Verification

```bash
npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml
npm run validate -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml
npm run validate -- --blueprint examples/results/showcase-modern-light.blueprint.yaml

npm run deck -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml --output examples/results/showcase-teal-dark.pptx
npm run deck -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml --output examples/results/showcase-vivid-dark.pptx
npm run deck -- --blueprint examples/results/showcase-modern-light.blueprint.yaml --output examples/results/showcase-modern-light.pptx

npm run export-pdf -- examples/results/showcase-teal-dark.pptx --out examples/results/showcase-teal-dark.pdf
npm run export-pdf -- examples/results/showcase-vivid-dark.pptx --out examples/results/showcase-vivid-dark.pdf
npm run export-pdf -- examples/results/showcase-modern-light.pptx --out examples/results/showcase-modern-light.pdf

npm run preview -- examples/results/showcase-teal-dark.pptx --out temp/showcase-teal-preview --dpi 120
npm run preview -- examples/results/showcase-vivid-dark.pptx --out temp/showcase-vivid-preview --dpi 120
npm run preview -- examples/results/showcase-modern-light.pptx --out temp/showcase-modern-preview --dpi 120

npm run typecheck
npm test
git diff --check
```

## Risks

| Risk | Mitigation |
| --- | --- |
| 모든 slide type을 넣다가 deck이 기능 카탈로그처럼 보임 | story arc 안에서 각 type의 역할을 먼저 정하고, 억지 slide는 제외 |
| 데이터가 자화자찬처럼 보임 | commit/LOC/test/result 등 local evidence 중심으로 표현 |
| PPTX/PDF/gallery binary diff가 큼 | regeneration commands와 preview evidence를 Discovery에 기록 |
| renderer issue가 발견되어 scope가 커짐 | low-risk content 조정 우선, renderer fix는 별도 보고 후 진행 |

## Discovery

### 2026-06-01 — Start

- Current branch: `feature/feat-20260601-013-showcase-final-polish`.
- Started as a stacked branch on top of `CHORE-20260601-001` close commits.
- User direction: showcase topic must be `ai-deck-compiler` itself; content should carry the core product message, show current themes/presets, include as many slide cases as naturally possible, use repo evidence such as commit history/LOC where meaningful, and demonstrate the recent code box feature without leaving sparse slides.

### 2026-06-01 — Content model and evidence

- Reframed showcase v1.1 around `ai-deck-compiler` itself:
  - problem: AI-generated decks without structure become manual cleanup work;
  - thesis: AI planning should be preserved as `blueprint.yaml`, then rendered deterministically as editable PPTX;
  - proof: repo evidence, slide type coverage, preset variants, preview/export artifacts.
- Local evidence used in charts/KPI:
  - non-merge commits since 2026-05-30: May 30 = 1, May 31 = 24, Jun 01 = 23;
  - `src` LOC = 4,725; `skills` LOC = 1,695; example YAML/README LOC = 1,675; `tests` LOC = 901;
  - tests = 58, slide types = 16, presets = 3, tracked result files = 10.
- Slide coverage remains 18 slides and includes all supported slide types. `chart` appears twice to show build intensity and codebase shape.
- Appendix now demonstrates the fenced code box / syntax highlighting component using concise regeneration commands.

### 2026-06-01 — Visual QA notes

- Generated PPTX/PDF/preview for teal, vivid, and modern variants after the content rewrite.
- Initial QA findings:
  - modern table slide had title/section chip overlap due to a long title;
  - appendix command lines wrapped too aggressively;
  - flow diagram crossing labels were noisy;
  - problem slide felt sparse in modern/light.
- Follow-up fixes:
  - shortened preset table title to `같은 content, 세 가지 presentation tone`;
  - changed appendix commands to use `BP`, `OUT`, `PDF` variables;
  - removed two crossing flow edge labels;
  - added one evidence bullet to the problem slide.
- Confirmed after preview:
  - modern table title no longer overlaps;
  - code block is readable in modern/light and vivid/dark;
  - flow diagram is less cluttered;
  - problem slide density is improved while still leaving readable whitespace.
- Regenerated `examples/results/showcase-gallery.png` from six preview slides: teal hero, vivid semantic comparison, modern preset table, teal architecture, vivid code block, modern summary.

### 2026-06-01 — Final verification

- Regenerated all three PPTX artifacts, all three PDFs, all three preview folders, and `examples/results/showcase-gallery.png`.
- `npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml`: pass, 18 slides.
- `npm run validate -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml`: pass, 18 slides.
- `npm run validate -- --blueprint examples/results/showcase-modern-light.blueprint.yaml`: pass, 18 slides.
- `npm run typecheck`: pass.
- `npm test`: pass, 3 files / 58 tests.
- `git diff --check`: pass.
- Updated README and SYSTEM-MANUAL test count from 57 to 58 after adding a fixture-based footer suppression regression test.

### 2026-06-02 — create-deck readiness pass

- Reviewed `skills/create-deck.md` before closing showcase work because this showcase should also serve as a practical target for future create-deck sessions.
- Finding: canonical skill had strong Narrative Spine / Action Title guidance, but did not fully cover all currently supported slide types in Step 3 examples.
- Finding: `.claude/commands/create-deck.md` said "maximum 3 questions" while showing a 9-question prompt block, which worked against flexible interaction.
- Finding: `slide.notes` is supported by schema/compiler and documented in USER-MANUAL, but create-deck did not instruct agents to write speaker notes by default.
- Follow-up correction:
  - added Adaptive Interaction Rules to keep questions brief, skip known context, use explicit assumptions, and preserve GATE approvals;
  - expanded type guidance and YAML examples for `table`, `timeline`, `flow`, `decision`, `appendix`, and `closing`;
  - added Speaker Notes guidance so create-deck writes `notes` for every slide by default unless the user opts out;
  - aligned the Claude command wrapper with the 3-question startup flow and corrected the GATE 3 pointer to Step 4.

### 2026-06-02 — create-deck scenario dry-run

- `brief-first` dry-run: topic-only request should ask at most three startup questions, then propose a Narrative Spine and slide plan before blueprint creation.
- `source-first` dry-run: markdown/file input should skip repeated context questions, extract claims/data/audience message, present source summary + Narrative Spine, then wait at GATE 2.
- `AI-draft-first` dry-run: "알아서 초안부터" request should ask research scope/source standard, mark assumptions when external search is unavailable, and avoid generating a weak PPTX directly.
- All three dry-runs now require per-slide `notes` in the blueprint draft, with notes carrying key message, talk track, expected question, and transition.
