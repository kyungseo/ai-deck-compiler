---
id: PATCH-20260602-002
title: "create-deck structure defaults — agenda/section/closing/section_label 기본화"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: PATCH
branch: feature/chore-20260602-002-public-transition
---

# PATCH-20260602-002 — create-deck structure defaults

## Goal

Claude Code `/create-deck`로 생성한 PPTX가 showcase deck과 달리 agenda, section-divider, closing,
section_label, 긴 headline 대응을 일관되게 포함하지 않는 문제를 줄인다.

## Scope

- `skills/create-deck.md`의 구조 제안과 blueprint 작성 규칙을 보강한다.
- `.claude/commands/create-deck.md`에서 Claude Code 실행 경로의 핵심 구조 기본값을 명시한다.
- `summary`는 발표 성격에 따라 AI가 판단하도록 두고, agenda / section-divider / closing은 사용자가 명시적으로 제외하지 않는 한 기본 포함한다.
- 일반 slide의 `section_label` chip과 long action title 대응을 기본 품질 규칙으로 명시한다.
- callout이 footer처럼 보이지 않도록 renderer 기본 위치를 카드 내부 inset 강조 패널로 정리한다.
- 표/KPI/body에 preview 변환에서 깨질 수 있는 footnote marker, unsupported Markdown citation, 이모지 잔여물이 생기지 않도록 생성 규칙을 보강한다.

## Non-goals

- showcase PPTX/PDF/gallery 재생성
- compiler가 임의로 slide를 삽입하는 자동 변환
- renderer typography system 전면 개편
- public repo settings 변경
- release tag 또는 GitHub Release 생성

## Done Criteria

- [x] Claude Code `/create-deck` 경로에서 agenda / section-divider / closing 기본 포함 규칙이 명시된다.
- [x] `skills/create-deck.md`의 권장 구성과 제안 형식이 section-divider / closing 기본 포함을 반영한다.
- [x] `section_label`을 일반 slide 기본 필드로 작성하도록 명시된다.
- [x] headline overflow는 renderer compact header를 활용하고, AI가 무리하게 headline을 약화하지 않도록 기준을 정리한다.
- [x] blueprint 작성 후 대기 메시지는 사용자가 다음 액션을 알 수 있게 PPTX 생성 승인 문구를 포함한다.
- [x] Claude command와 canonical skill 사이의 구조 기본값 drift를 확인한다.
- [x] callout이 footer 영역을 대체하지 않고 카드 내부 강조 패널로 렌더링된다.
- [x] table/KPI/body 생성 규칙에서 unsupported footnote/citation/emoji artifact를 방지한다.
- [x] 문서 변경 검증과 stale phrase search를 통과한다.

## Verification

```bash
rg -n "agenda|section-divider|closing|section_label|summary|overflow|Action Title" skills/create-deck.md .claude/commands/create-deck.md
npm run validate -- --blueprint examples/sample/blueprint.yaml
git diff --check
```

## Risks

| Risk | Mitigation |
| --- | --- |
| 짧은 deck에도 구조 slide가 과하게 늘어날 수 있음 | 사용자가 명시적으로 제외하면 생략 가능하다고 규칙화 |
| summary와 closing 역할이 중복될 수 있음 | summary는 AI 판단, closing은 마지막 메시지/Q&A로 역할 분리 |
| Claude Code command와 canonical skill이 다시 어긋날 수 있음 | command에는 핵심 MUST만 두고 상세는 canonical skill에 유지 |

## Discovery

### 2026-06-02 — Start

- User reproduced the issue through Claude Code `/create-deck`.
- `.claude/commands/create-deck.md` delegates detailed Step 2/3 behavior to `skills/create-deck.md`.
- Initial finding: canonical skill still says agenda is recommended when there are 4+ sections, and some purpose templates omit agenda, section-divider, or closing. This can lead Claude Code to generate decks that differ from the showcase structure.

### 2026-06-02 — Implementation

- Added a Claude Code-specific MUST in `.claude/commands/create-deck.md` so `/create-deck` keeps agenda, section-divider, and closing as default structure elements unless the user explicitly excludes them.
- Added `Baseline Deck Grammar` to `skills/create-deck.md`:
  - `hero → agenda → section-divider + section slides → optional summary → closing`
  - `summary` remains AI-judged rather than mandatory.
  - `section_label` is now a default field for normal slides.
- Updated purpose templates and example YAML so Claude has concrete examples that include agenda, section-divider, closing, and `section_label`.
- Recorded headline overflow guidance: keep meaningful Action Titles, rely on renderer compact header for normal slides, and move extra context to subtitle/body/callout.

### 2026-06-02 — Verification

- `rg -n "Baseline Deck Grammar|Claude Code MUST|agenda|section-divider|closing|section_label|summary|overflow|Action Title|compact header" skills/create-deck.md .claude/commands/create-deck.md`: pass, confirms both Claude Code command and canonical skill contain the intended guidance.
- `npm run validate -- --blueprint examples/sample/blueprint.yaml`: pass.
- `npm test`: pass, 3 files / 60 tests.
- `npm run typecheck`: pass.
- `git diff --check`: pass.

### 2026-06-02 — Claude Code generated deck preview follow-up

- Previewed `output/ai-coding-tools-trend-v1.0.pptx` with `npm run preview -- output/ai-coding-tools-trend-v1.0.pptx --out output/ai-coding-tools-trend-preview`.
- Findings:
  - agenda / section-divider / closing were present in the generated deck after the prompt update.
  - Step 3 waiting text was ambiguous because it did not tell the user that "PPTX 생성해줘" continues the workflow.
  - slide 05 showed long headline pressure: compact title sizing was applied, but the card top was still too close to a two-line title.
- Changes:
  - Updated Step 3 completion text in both Claude command and canonical skill to explicitly invite "진행해" / "PPTX 생성해줘".
  - Tightened renderer compact header thresholds so very long normal slide titles drop to 28pt with a taller title box.
  - Added a renderer regression test for a very long Korean action title.
- Rebuilt the PPTX from `blueprints/ai-coding-tools-trend.yaml` and regenerated preview. Slide 05 no longer collides with the content card.

### 2026-06-02 — Closing slide preview follow-up

- User asked whether slides 11 and 12 were inspected. They were not inspected in the initial pass.
- Slide 11 timeline looked structurally acceptable.
- Slide 12 had a clear closing renderer bug: the long closing title wrapped, and the divider line crossed through the title.
- Updated the closing template with compact title sizing for long titles and dynamic divider placement below the title box.
- Added a regression test for long closing titles.

### 2026-06-02 — review-deck precision follow-up

- User shared a Claude Code `/review-deck` transcript.
- Findings:
  - The review said "preview 12장 확인 완료" even though a review agent may not have opened every preview image.
  - The review reported "section-divider 6장 포함" when the generated deck actually had 3 `section-divider` slides and 6 structural slides if hero/agenda/closing are included.
  - Preview issues and renderer follow-ups were mixed into the same report language as blueprint-fixable issues.
- Changes:
  - Updated `skills/review-deck.md` and `.claude/commands/review-deck.md` to require explicit preview inspection scope.
  - Added exact slide type count terminology: `section-divider`, `structural slide`, and `content slide`.
  - Required preview issues to be classified as blueprint-fixable, renderer follow-up, or content density issue before suggesting changes.

### 2026-06-02 — Claude Code plan-mode follow-up

- User reported that Claude Code `/create-deck` turned the request into a "Ready to code?" plan instead of the expected Narrative Spine and slide structure proposal.
- Assessment:
  - This is not the intended `/create-deck` scenario.
  - Likely cause is Claude Code combining general file-edit planning rules with the fact that Step 3 writes a `blueprints/*.yaml` file.
  - Harness influence is partial: general workflow rules say to plan before file edits, but product skill routing should keep `/create-deck` inside its own gated deck workflow.
- Changes:
  - Added explicit guidance to `.claude/commands/create-deck.md` and `skills/create-deck.md`: do not enter Claude Code `/plan` or "Ready to code?" mode.
  - Clarified that Step 2 slide structure proposal is the approval plan for this workflow.
  - Clarified that Step 2 must not write files and should avoid broad schema/existing blueprint exploration unless necessary.
  - Added handling for existing same-slug blueprints: ask overwrite / new filename / edit existing instead of deciding silently.

### 2026-06-02 — Latest verification

- `rg -n "확인 완료|확인 범위|section-divider|structural slide|content slide|Renderer Follow-up|blueprint 수정 가능|renderer follow-up|content density" skills/review-deck.md .claude/commands/review-deck.md`: pass.
- `npm run validate -- --blueprint blueprints/ai-coding-tools-trend.yaml`: pass.
- `npm test`: pass, 3 files / 61 tests.
- `npm run typecheck`: pass.
- `git diff --check`: pass.

### 2026-06-02 — Pilot decision deck preview follow-up

- User created `output/ai-coding-tools-pilot-decision-v1.0.pptx` through Claude Code and asked to account for the actual result.
- Regenerated preview with `npm run preview -- output/ai-coding-tools-pilot-decision-v1.0.pptx --out output/ai-coding-tools-pilot-decision-preview` and inspected all 16 slides.
- Findings:
  - slide 04/10/11 callouts read like footer bars because `renderCalloutBar()` used a full-width slide-bottom shape and compiler suppressed the brand footer on callout slides.
  - slide 07 showed a preview artifact from a warning emoji in a table cell.
  - slide 16 closing title/divider was correct after the earlier closing renderer fix.
- Changes:
  - Moved callout rendering from a full-width bottom bar to an inset card panel at x=1.12", y=6.13", w=11.10", h=0.48".
  - Removed callout-based footer suppression so page number and brand footer remain visible.
  - Updated renderer/snapshot tests and preset docs to match the new callout contract.
  - Added create-deck guidance to avoid footnote markers, unsupported Markdown citations, and emoji artifacts in rendered fields.
  - Updated the ignored sample blueprint `blueprints/ai-coding-tools-pilot-decision.yaml` to replace the warning emoji with text and regenerated `output/ai-coding-tools-pilot-decision-v1.0.pptx`.
- Verification:
  - `npm run validate -- --blueprint blueprints/ai-coding-tools-pilot-decision.yaml`: pass.
  - `npm run deck -- --blueprint blueprints/ai-coding-tools-pilot-decision.yaml --output output/ai-coding-tools-pilot-decision-v1.0.pptx`: pass.
  - `npm run preview -- output/ai-coding-tools-pilot-decision-v1.0.pptx --out output/ai-coding-tools-pilot-decision-preview`: pass, 16 preview images generated.
  - Manual preview check: slides 04, 07, 10, 11, and 16 inspected after regeneration.
  - `npm test`: pass, 3 files / 61 tests.
  - `npm run typecheck`: pass.
  - `git diff --check`: pass.

### 2026-06-02 — Archive

- Done Criteria completed and verified.
- Archived immediately to keep Public Clean Baseline Gate free of Active/Done-pending Work leakage.
