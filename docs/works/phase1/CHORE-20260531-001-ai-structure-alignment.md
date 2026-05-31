---
id: CHORE-20260531-001
title: "AI 구조 정렬 — 멀티툴 product skill 라우팅 완성"
status: Done
type: CHORE
created: 2026-05-31
actual_end: 2026-05-31
branch: feature/ai-structure-alignment
---

# CHORE-20260531-001 — AI 구조 정렬: 멀티툴 product skill 라우팅 완성

## Goal

create-deck / generate-blueprint / review-deck product skill 삼각형을
Claude Code, Codex CLI/App, Claude 채팅 각각에서 어떻게 진입하는지 명시하고,
도구별 진입 경로가 구조적으로 완결된 상태를 만든다.

Claude 채팅은 로컬 파일 실행·CLI 능력이 없으므로 "동일 실행"이 아니라
"skill 절차 참조/복사용 경로"로 정의한다.

Codex App에서의 `.agents/skills/{name}/SKILL.md` 노출은
AGENTS.md routing에 따른 **수동 로드** 기준이다.
앱 skill 목록 자동 노출은 별도 plugin/skill packaging 범위 밖이며 이 작업에서 다루지 않는다.

## 현재 갭 (Discovery)

| 갭 | 현재 | 목표 |
|---|---|---|
| `skills/README.md` | 중복 heading, review-deck *(예정)*, customize-preset 상태 불명확 | 완료 반영, core skill 삼각형 정리 ✅ (즉시 수정됨) |
| Codex product skill 라우팅 | `AGENTS.md` 미언급 | Product Skill Routing 섹션 추가 |
| Codex create-deck 진입점 | 없음 | `.agents/skills/create-deck/SKILL.md` |
| Codex review-deck 진입점 | 없음 | `.agents/skills/review-deck/SKILL.md` |
| Codex generate-blueprint 진입점 | 없음 | `.agents/skills/generate-blueprint/SKILL.md` |
| Claude Code review-deck wrapper | 없음 | `.claude/commands/review-deck.md` |
| Claude Code generate-blueprint wrapper | 없음 | `.claude/commands/generate-blueprint.md` |
| Codex session prompt product skill | 없음 | `prompts/codex-session-start.md` 추가 |
| create-deck → review-deck loop | 암묵적 | `skills/create-deck.md` Step 6에 명시 |
| FEAT-20260531-002 close | Active 상태로 남아 있음 | commit 전 STATUS Finalization 처리 필요 |

## generate-blueprint 결정 (확정)

**Option B 채택: Claude Code와 Codex 모두 단독 제공**

- `.claude/commands/generate-blueprint.md` — wrapper (필수)
- `.agents/skills/generate-blueprint/SKILL.md` — Codex 진입점 (필수)

`generate-blueprint`는 `create-deck` 내부 Step 3~4이자 독립 사용 가능 skill이므로
두 도구 모두에서 단독 진입 경로를 제공한다.

## 라우팅 목표 구조

```
Claude Code:
  /create-deck        → .claude/commands/create-deck.md        → skills/create-deck.md
  /review-deck        → .claude/commands/review-deck.md (신규) → skills/review-deck.md
  /generate-blueprint → .claude/commands/generate-blueprint.md (신규) → skills/generate-blueprint.md

Codex CLI/App (AGENTS.md routing 기준, 수동 로드):
  Workflow Skill → .agents/skills/workflow-{name}/SKILL.md  (기존 유지)
  Product Skill  → .agents/skills/create-deck/SKILL.md (신규)
               → .agents/skills/review-deck/SKILL.md (신규)
               → .agents/skills/generate-blueprint/SKILL.md (신규)
  + prompts/codex-session-start.md product skill 섹션

Claude 채팅 (참조/복사용, 실행 도구 아님):
  skills/README.md 또는 prompts/claude-session-start.md → skills/*.md 복사·참조
  대화 절차 수행만 가능. 파일 실행·CLI 없음.
```

## Scope

### 필수

| 파일 | 작업 |
|---|---|
| `AGENTS.md` | Product Skill Routing 섹션 추가 — Workflow Skill Routing과 별도 섹션. **English Only** |
| `.agents/skills/create-deck/SKILL.md` | Codex 진입점. `skills/create-deck.md` 로드 + Gate 1~4 유지 명시 |
| `.agents/skills/review-deck/SKILL.md` | Codex 진입점. `skills/review-deck.md` 로드 |
| `.agents/skills/generate-blueprint/SKILL.md` | Codex 진입점. `skills/generate-blueprint.md` 로드 |
| `.claude/commands/review-deck.md` | `create-deck.md` 패턴 준용 wrapper |
| `.claude/commands/generate-blueprint.md` | wrapper 추가 |
| `prompts/codex-session-start.md` | Product Deck Creation 섹션 추가 |
| `skills/create-deck.md` | Step 6 이후 review-deck으로 이어지는 선택 review loop 명시 |

### 권장

| 파일 | 작업 |
|---|---|
| `docs/USER-MANUAL.md` 또는 `docs/SYSTEM-MANUAL.md` | "구현 예정" 등 stale phrase 보정 (live surface 한정) |

## Language Policy 제약 (실행 시 준수)

| 표면 | 언어 규칙 |
|---|---|
| `AGENTS.md` | **English Only** |
| `.agents/skills/*/SKILL.md` | Korean primary + Bilingual Rules |
| `.claude/commands/*.md` | Korean primary + Bilingual Rules |
| `prompts/*.md` | Korean primary + Bilingual Rules |
| `skills/*.md` | Korean primary + Bilingual Rules |

## Done Criteria

- [x] `AGENTS.md` — Product Skill Routing 섹션 추가 (Workflow Skill Routing 섹션과 별도, English Only)
- [x] `.agents/skills/create-deck/SKILL.md` — `skills/create-deck.md` 로드, Gate 1~4 유지
- [x] `.agents/skills/review-deck/SKILL.md` — `skills/review-deck.md` 로드
- [x] `.agents/skills/generate-blueprint/SKILL.md` — `skills/generate-blueprint.md` 로드
- [x] `.claude/commands/review-deck.md` — wrapper 추가
- [x] `.claude/commands/generate-blueprint.md` — wrapper 추가
- [x] `prompts/codex-session-start.md` — product skill 진입 섹션 추가
- [x] `skills/create-deck.md` — Step 6 이후 review-deck 선택 review loop 명시
- [x] 각 `.agents/skills/{name}/SKILL.md`는 절차 원문 중복 없이 canonical `skills/*.md`를 로드/참조
- [x] `skills/create-deck.md` 또는 wrapper에서 PPTX 생성 후 review-deck으로 이어지는 선택 review loop가 명시됨
- [x] generate-blueprint 단독 제공이 Claude Code·Codex 양쪽에 모두 반영됨
- [x] Claude 채팅은 참조/복사용 경로로 설명됨 (실행 도구 아님)
- [x] FEAT-20260531-002 STATUS Finalization 처리 (commit 전 확인)

## Verification

```bash
# 핵심 키워드 coverage 확인 (live surface만)
rg -n "create-deck|review-deck|generate-blueprint|Product Skill Routing" \
  AGENTS.md prompts/ skills/ .agents/ .claude/commands/

# stale phrase — live user-facing surface만 (backlog/works/archive 제외)
rg -n "구현 예정|Claude Code에서만|Claude Code 진입|예정" \
  skills/README.md skills/*.md AGENTS.md prompts/ \
  .agents/skills/ .claude/commands/ \
  docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md

# whitespace/formatting
git diff --check
```

**의미상 동등성 확인 (문서 trace):**
- `.claude/commands/create-deck.md` ↔ `.agents/skills/create-deck/SKILL.md` — Gate 1~4 동일 흐름 유지
- `.claude/commands/review-deck.md` ↔ `.agents/skills/review-deck/SKILL.md` — 동일 검토 항목 5종 유지
- `.claude/commands/generate-blueprint.md` ↔ `.agents/skills/generate-blueprint/SKILL.md` — 동일 생성 절차 유지

**Codex App 검증 범위 명시:**
- Codex App에서는 AGENTS.md routing에 따라 intent match 시 `.agents/skills/{name}/SKILL.md`를 수동 로드하는 것으로 정의한다.
- 앱 skill 목록 자동 노출은 별도 plugin/skill packaging 범위 밖 — 이 검증에서 다루지 않는다.

**코드 변경 없음:** `npm run typecheck`, `npm test`는 선택. commit 전 `npm run validate -- --blueprint examples/sample/blueprint.yaml` 실행 여부 판단.

## 리스크

| 리스크 | 완화 방법 |
|---|---|
| Product Skill / Workflow Skill 네이밍 혼동 | AGENTS.md 두 섹션을 명확한 제목으로 분리 |
| `.agents/skills/` 파일 증가로 관리 부담 | 각 SKILL.md는 canonical `skills/*.md` 로드 wrapper만 — 절차 중복 없음 |
| stale phrase 잔존 | Verification grep 필수 (live surface 한정) |
| AGENTS.md 언어 혼용 | 작성 후 English Only 검토 |
| FEAT-20260531-002 Active 상태 drift | commit 전 STATUS Finalization에서 반드시 처리 |

**되돌리기 비용:** Low — `git revert` 한 번. 코드 변경 없음.

## Discovery

- `skills/README.md` 중복 heading 제거, customize-preset `📄 문서 완료` 표기 수정 완료 (이 Work 착수 직전 즉시 수정)
- customize-preset: 절차서 파일 존재, end-to-end 검증 이력 없음 → `📄 문서 완료`로 표기
