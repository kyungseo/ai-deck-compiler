---
id: CHORE-20260602-003
title: "AI tool simulation — create-deck routing and blueprint draft dry-run"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: CHORE
branch: feature/chore-20260602-002-public-transition
---

# CHORE-20260602-003 — AI tool simulation

## Goal

public release 전에 Claude Code, Codex, Cursor, Claude App 진입점이
canonical product skill 흐름과 맞는지 확인하고,
`create-deck` 절차가 실제 사용자 입력 3종에서 자연스럽게 slide plan 또는 blueprint draft까지 진행되는지 dry-run한다.

## Scope

- AI 도구별 product skill routing을 문서 기준으로 점검한다.
- `create-deck`의 brief-first, source-first, AI-draft/research-first 흐름을 샘플 입력으로 dry-run한다.
- blueprint-only 요청이 deprecated `generate-blueprint`가 아니라 `create-deck`으로 연결되는지 확인한다.
- `review-deck`, `generate-architecture-slide`, `export-pdf` 진입점과 문서 prompt 예시 정합성을 확인한다.
- simulation 결과의 blocker와 follow-up을 분리한다.

## Non-goals

- showcase PPTX/PDF/gallery 재생성
- 실제 소셜 포스트 작성
- v1.0.0 tag/release 생성
- 모든 AI 도구에서 실제 외부 앱 세션을 끝까지 실행
- 새 slide type 또는 renderer 구현

## Done Criteria

- [x] Claude Code, Codex, Cursor, Claude App 진입점과 README/USER-MANUAL prompt 예시가 정합한지 기록된다.
- [x] 3개 샘플 입력이 `create-deck` Step 0~3 기준으로 dry-run된다.
- [x] 각 샘플에서 초기 질문, assumptions, GATE, slide plan, notes/preset/author 기본값이 평가된다.
- [x] blueprint-only, review-deck, generate-architecture-slide, export-pdf routing이 확인된다.
- [x] public release 전 blocker와 post-public follow-up이 분리된다.
- [x] 필요한 문서/skill 보정이 있으면 최소 범위로 반영된다.

## Verification

```bash
git diff --check
rg -n "generate-blueprint|default-modern|Kyungseo\\.Park@gmail|presentation-compiler" README.md docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md skills .agents .claude .cursor
npm run typecheck
npm test
npm run validate -- --blueprint examples/sample/blueprint.yaml
```

## Risks

| Risk | Mitigation |
| --- | --- |
| 실제 도구별 UI 실행 없이 문서 dry-run에 그침 | 실제 실행이 필요한 항목과 문서/절차 정합성 항목을 분리해 기록 |
| dry-run 중 create-deck 절차 보정이 커짐 | release 전 blocker만 반영하고 개선성 항목은 follow-up으로 분리 |
| simulation 산출물이 임시 artifact로 쌓임 | 기본은 Work Discovery 기록으로 처리하고 PPTX 생성은 하지 않음 |

## Discovery

### 2026-06-02 — Start

- Current branch: `feature/chore-20260602-002-public-transition`.
- Checkpoint commit before this Work: `c625fc7 chore: public 전환 체크포인트 정리`.
- Handoff note: `temp/public-transition-handoff.md` (gitignored).
- Default scope: dry-run to slide plan or blueprint draft, not PPTX generation.

### 2026-06-02 — Tool routing check

| Surface | Result | Notes |
| --- | --- | --- |
| Claude Code `/create-deck` | OK | `.claude/commands/create-deck.md` loads `skills/create-deck.md`, enforces Step gates, writes `notes`, and asks before preview generation. |
| Codex CLI/App `create-deck` | OK | `.agents/skills/create-deck/SKILL.md` is a thin wrapper and routes to the canonical skill. |
| Cursor product skill rule | OK | `.cursor/rules/product-skills.mdc` maps "create presentation / write blueprint" to `skills/create-deck.md` and preserves gates. |
| Claude App/manual entry | OK | README/USER-MANUAL instruct the user to provide `skills/create-deck.md` or ask the agent to follow Product Skill Routing. |
| Deprecated blueprint route | OK | `.claude/commands/generate-blueprint.md` and `.agents/skills/generate-blueprint/SKILL.md` explicitly route to `create-deck` from Step 0. |
| Review/export/architecture routes | OK | `/review-deck`, `/export-pdf`, and `/generate-architecture-slide` wrappers load their canonical `skills/*.md` files and preserve input/path gates. |
| Stale public wording | OK | No `Kyungseo.Park@gmail`, `presentation-compiler`, or `default-modern` found in README/USER-MANUAL/skills/tool-wrapper public surfaces. |

### 2026-06-02 — create-deck dry-run samples

#### Sample 1: brief-first executive engineering review

Input:

> Q2 엔지니어링 성과 리뷰 deck을 만들고 싶어. 청중은 임원진이고, 발표 시간은 15분. 핵심 메시지는 플랫폼 안정성이 개선됐고 다음 분기에는 배포 자동화 투자가 필요하다. dark theme, executive briefing tone.

Expected Step 0:

- Mode: `brief-first`.
- Already known: purpose, audience, time, core message, theme, tone.
- Do not ask purpose/audience/time/core message again.

Expected Step 1:

- Ask only missing high-impact items, max 3:
  1. 사용 가능한 KPI/차트 데이터가 있는가? 예: incident count, MTTR, deployment frequency, change failure rate.
  2. Q3 배포 자동화 투자 요청의 decision target은 예산, 인력, 일정 중 무엇인가?
  3. author/team명은 기본값 `AI Deck Compiler`로 둘지, Engineering/Platform Team으로 둘지.
- If the user wants to proceed without data, present assumptions and ask for approval before Step 2.
- Defaults: `design: teal`, `theme: dark`, `author: AI Deck Compiler`, `version: "1.0"`, notes enabled.

Expected Step 2 slide plan:

1. `[hero]` Q2 Engineering Performance Review
2. `[agenda]` 안정성 성과 / 운영 지표 / 투자 필요성 / Q3 결정
3. `[kpi]` 안정성 핵심 지표는 Q2에 개선 방향으로 전환
4. `[chart]` 장애 대응 시간과 배포 빈도는 자동화 투자 필요성을 함께 보여준다
5. `[comparison]` 수동 릴리즈 운영은 개선 성과를 Q3 scale-out에서 제한한다
6. `[decision]` Q3 배포 자동화 투자를 승인하면 안정성 개선을 반복 가능한 운영 체계로 전환한다
7. `[timeline]` 3단계 rollout으로 자동화 도입 risk를 낮춘다
8. `[summary]` Summary

Assessment:

- The current skill supports this without over-questioning because Adaptive Interaction Rules say known fields must be skipped.
- Speaker notes guidance is sufficient: decision and chart slides have expected-question/trade-off prompts.
- Headline guidance is sufficient: long action titles should be shortened and context moved to subtitle/body/callout.

#### Sample 2: source-first customer proposal

Input shape:

> 고객 제안용 markdown 초안을 줄게. 이걸 20분 제안 deck으로 바꿔줘. 청중은 고객 CTO와 플랫폼 리드야.

Source excerpt used for dry-run:

```md
# Platform Delivery Modernization Proposal

The customer currently ships major backend changes every 3-4 weeks.
Release confidence is low because deployment checks are manual and rollback steps vary by team.
The proposal is to introduce a blueprint-driven release review, CI validation gate, and editable executive reporting deck.
Expected outcome: weekly releases within one quarter, visible release risk, and reusable decision artifacts.
```

Expected Step 0:

- Mode: `source-first`.
- First action is source summary, not immediate slide generation.

Expected Step 1:

- Summarize source into claim/evidence/audience-specific message.
- Ask only missing items:
  1. 고객명 또는 anonymous 처리 여부.
  2. 제안의 target action: pilot 승인, budget 승인, or discovery workshop 승인.
  3. 수치의 근거 수준: 내부 측정, 추정, or 제안 가정.

Expected Step 2:

- Present Narrative Spine before slide list.
- Recommended plan:
  1. `[hero]` Platform Delivery Modernization Proposal
  2. `[agenda]` 현재 병목 / 제안 방식 / 기대 효과 / 승인 요청
  3. `[content]` 수동 릴리즈 검증은 배포 신뢰도를 낮춘다
  4. `[comparison]` 표준화된 gate는 팀별 변동성을 줄인다
  5. `[flow]` Brief에서 validation과 reporting까지 하나의 review loop로 연결한다
  6. `[chart]` 주간 릴리즈 목표는 한 분기 안에 운영 리듬을 바꾼다
  7. `[decision]` Pilot 승인으로 리스크를 제한한 채 전환 효과를 검증한다
  8. `[summary]` Summary

Assessment:

- Current source-first rule is adequate: it explicitly forbids copying source into slides and requires source summary plus Narrative Spine.
- No release blocker found.

#### Sample 3: AI-research-first / AI-draft-first

Input:

> AI-native presentation workflow 소개 deck을 만들어줘. 대상은 스타트업 CTO이고, 기술적이지만 너무 깊지 않게. 필요하면 자료 조사 범위와 출처 기준 먼저 물어봐.

Expected Step 0:

- Mode: `AI-research-first`.
- Since external search may be unavailable, separate "source-based facts" from "AI assumptions".

Expected Step 1:

- Ask research/source questions before drafting:
  1. 범위: AI presentation workflow 일반론인지, 이 repo(`ai-deck-compiler`) 중심인지.
  2. 출처 기준: 공식 문서/프로젝트 README/코드 지표/외부 article 중 무엇을 허용할지.
  3. 원하는 output: overview deck, product showcase, or adoption proposal.
- If browsing is not used, proceed only with stated assumptions and local repo sources.

Expected Step 2:

1. `[hero]` AI-native presentation workflow
2. `[agenda]` 문제 / workflow / architecture / proof / next step
3. `[content]` 발표 산출물의 병목은 작성보다 반복 검토에 있다
4. `[flow]` Brief에서 editable PPTX까지 gate를 통과하며 품질을 고정한다
5. `[architecture]` Blueprint DSL이 AI 작성과 PPTX 렌더링을 분리한다
6. `[kpi]` 재현 가능한 산출물은 파일, 검증, metadata로 확인된다
7. `[comparison]` ad-hoc slide writing보다 blueprint-first workflow가 반복 수정에 강하다
8. `[appendix]` 재생성 명령과 validation command를 code block으로 남긴다
9. `[summary]` Summary
10. `[closing]` From prompt to editable proof artifact

Assessment:

- Current skill is appropriate: it requires research scope/source standards and states fallback behavior when search is unavailable.
- Code block support can be demonstrated through an appendix body item.

### 2026-06-02 — Route-specific dry-run

- Blueprint-only request: "blueprint.yaml 초안만 만들어줘" routes to `create-deck`; GATE 1/2/3 still apply, but Step 5 PPTX generation is not required unless the user later asks.
- `/generate-blueprint`: preserved only as compatibility wrapper and points to `create-deck`. This is acceptable for existing users without reintroducing a competing workflow.
- `/review-deck`: asks for blueprint path and optional review focus; it does not apply changes until the user approves specific suggestions.
- `/generate-architecture-slide`: standalone path returns an architecture slide snippet only, while `create-deck` can use it internally for architecture slides.
- `/export-pdf`: requires a PPTX path and delegates environment handling to `npm run export-pdf`.

## Result

### Public release blockers

- None found in this simulation pass.

### Post-public follow-up candidates

- 실제 Claude App/Cursor UI에서 동일한 3개 sample을 수동 실행해 응답 품질을 비교하는 cross-tool UX 점검.
- `customize-preset`은 routing에는 노출되어 있으나 end-to-end 검증 미완 상태이므로, 별도 Work에서 custom preset task로 다루는 편이 좋다.
- v1.0.0 GitHub Release title/body와 social note 초안은 public release finalization Work에서 별도 작성한다.
