---
id: FEAT-20260601-012
title: "generate-blueprint canonical 파일 폐기 및 참조 정리"
status: Done
created: 2026-06-01
type: FEAT
branch: feature/FEAT-20260601-012-generate-blueprint-deprecation
---

# FEAT-20260601-012 — generate-blueprint canonical 파일 폐기 및 참조 정리

## Goal

`skills/generate-blueprint.md` canonical 파일을 폐기하고,
`create-deck`을 단일 blueprint 생성 canonical workflow로 정리한다.
active/user-facing/system-facing 문서에서 generate-blueprint를 독립 진입점으로 노출하는
stale reference를 모두 제거한다.

---

## Motivation

- FEAT-20260601-010(DR-023): `create-deck`을 단일 canonical skill로 강화하고, generate-blueprint를 user-facing 진입점에서 제거했다. 당시 `skills/generate-blueprint.md`는 "내부 참조용으로 보존" 결정.
- FEAT-20260601-011: `create-deck`의 콘텐츠 품질 강화. generate-blueprint에서 흡수하지 못한 내용은 없음을 확인.
- 현 시점 `skills/generate-blueprint.md`를 남기면 drift source가 된다. 보존의 이점보다 유지 비용이 크다.
- 따라서 canonical file을 폐기하고 redirect wrapper만 남기는 방향으로 결정(FEAT-012).

---

## Scope

### 삭제

| 파일 | 조치 |
| --- | --- |
| `skills/generate-blueprint.md` | `git rm` — canonical file 폐기 |

### 수정 — active/system-facing 문서

라인 번호는 Audit 시점 참고값이다. 구현 시 섹션/문구 기준으로 변경한다.

| 파일 | surface | 변경 내용 |
| --- | --- | --- |
| `docs/SYSTEM-MANUAL.md` | system doc | "Product Skills 표"에서 generate-blueprint 행 제거, "AI 진입점 표"에서 Blueprint 전용 행 제거, canonical skills 목록 수정, generate-architecture-slide 설명에서 generate-blueprint 참조 제거 |
| `skills/README.md` | skill doc | Core Skill 다이어그램 `create-deck → generate-blueprint` 관계 제거, generate-blueprint routing 행 제거, generate-architecture-slide 설명 업데이트 |
| `skills/generate-architecture-slide.md` | skill doc | 헤더 진입점 설명에서 generate-blueprint 제거, 진입 조건 표 업데이트, 관련 파일 항목 업데이트 |
| `.claude/commands/generate-architecture-slide.md` | command | generate-blueprint 참조를 create-deck으로 교체 |
| `.agents/skills/generate-architecture-slide/SKILL.md` | agent skill | 동일 |
| `skills/review-deck.md` | skill doc | 관련 파일 항목에서 `skills/generate-blueprint.md` 제거 |
| `prompts/codex-session-start.md` | session prompt | AGENTS.md 있음 블록의 skill 목록에서 generate-blueprint 제거, "blueprint 생성 / generate-blueprint" fallback 블록 제거 (blueprint 작성 요청은 create-deck으로 안내) |
| `docs/decisions/DR-023` | decision record | 기존 결정 본문은 유지하고 하단에 Addendum 추가: "FEAT-012에서 drift 비용 > 보존 이점 판단, canonical file 폐기" |

### 유지 — backward compatibility wrapper (변경 없음)

| 파일 | 이유 |
| --- | --- |
| `.claude/commands/generate-blueprint.md` | `/generate-blueprint` 호출 시 create-deck으로 안내하는 redirect wrapper |
| `.agents/skills/generate-blueprint/SKILL.md` | 동일 |

### 유지 — 역사 기록 (변경 없음)

| 파일 | 이유 |
| --- | --- |
| `docs/decisions/DR-014`, `DR-021` | 과거 의사결정 기록에서 generate-blueprint 언급 — 역사 기록 보존 |
| `docs/works/phase1/*.md` (Done 파일들) | 완료된 Work 기록 — 수정하지 않음 |
| `docs/backlog/PHASE1.md` L243 (Done 행) | 완료 백로그 — 수정하지 않음 |
| `docs/PLAN.md` | 과거 계획 문서 — 수정하지 않음 |

### 분류 — product surface 아님 (미수정)

| 파일 | 판단 |
| --- | --- |
| `.claude/settings.local.json` | local tool permission 기록(allow rule). product skill routing이나 user-facing SSoT가 아니므로 FEAT-012 수정 범위 밖. 최종 보고에서 "참조는 있으나 product surface 아님, 미수정" 기록. |

---

## Non-goals

- `.claude/commands/generate-blueprint.md` 삭제 없음
- `.agents/skills/generate-blueprint/SKILL.md` 삭제 없음
- `docs/backlog/PHASE1.md` 역사 행 수정 없음
- `docs/decisions/*.md` 기존 기록 수정 없음 (DR-023 Discovery 추가는 허용)
- blueprint 스키마, 렌더러, create-deck 내용 변경 없음

---

## Done Criteria

- [x] `skills/generate-blueprint.md` 삭제됨 (`git rm`)
- [x] `docs/SYSTEM-MANUAL.md` generate-blueprint 독립 진입점 참조 모두 제거 (Product Skills 표, AI 진입점 표, canonical skills 목록)
- [x] `skills/README.md` Core Skill 구조와 routing 표가 create-deck 중심으로 재작성됨
- [x] `skills/generate-architecture-slide.md` 헤더와 관련 파일이 create-deck 기준으로 업데이트됨
- [x] `.claude/commands/generate-architecture-slide.md` generate-blueprint 참조 제거
- [x] `.agents/skills/generate-architecture-slide/SKILL.md` 동일
- [x] `skills/review-deck.md` 관련 파일에서 generate-blueprint 제거
- [x] `prompts/codex-session-start.md` generate-blueprint skill 목록 + fallback 블록 제거. blueprint-only 요청도 create-deck으로 처리한다는 안내 추가
- [x] `DR-023` 하단에 Addendum 추가 (기존 결정 본문 유지)
- [x] scoped validation 통과: active/user-facing/system-facing surfaces에서 `skills/generate-blueprint.md` canonical path 참조 없음
  - 검증 결과: 0건 (허용 예외 redirect wrapper 및 local settings만 잔존)
  - 허용 예외: `.claude/commands/generate-blueprint.md`, `.agents/skills/generate-blueprint/SKILL.md`, `.claude/settings.local.json`, `docs/works/**`, `docs/decisions/**`, `docs/backlog/**`, `docs/PLAN.md`
- [x] redirect wrapper 정상 동작 확인: `.claude/commands/generate-blueprint.md`와 `.agents/skills/generate-blueprint/SKILL.md` 모두 `skills/create-deck.md` Step 0으로 안내
- [x] `.claude/settings.local.json` — local tool permission 기록, product surface 아님, 미수정. 최종 보고에 기록

---

## Discovery

### 2026-06-01 — Audit 완료, Work 파일 생성

**generate-blueprint 참조 파일 전체 목록 (grep 결과):**

```
.agents/skills/generate-architecture-slide/SKILL.md   — 진입점 설명
.agents/skills/generate-blueprint/SKILL.md             — redirect wrapper (유지)
.claude/commands/generate-architecture-slide.md        — 진입점 설명
.claude/settings.local.json                            — local tool permission 기록, product surface 아님, 미수정
docs/backlog/PHASE1.md                                 — Done 행 포함, 역사 기록 유지
docs/decisions/DR-014, DR-021                          — 과거 의사결정, 유지
docs/decisions/DR-023                                  — Addendum 추가 대상
docs/PLAN.md                                           — 과거 계획, 유지
docs/SYSTEM-MANUAL.md                                  — 수정 대상 (L256, L265, L268, L289, L306, L411)
docs/works/phase1/*.md (Done 파일들)                   — 역사 기록, 유지
prompts/codex-session-start.md                         — 수정 대상 (L40, L64-66)
skills/generate-architecture-slide.md                  — 수정 대상 (L5, L39, L424)
skills/generate-blueprint.md                           — 삭제 대상
skills/README.md                                       — 수정 대상 (L23, L35, L38)
skills/review-deck.md                                  — 수정 대상 (L333)
```

FEAT-010(DR-023)에서는 canonical file을 "내부 참조용 보존"으로 결정했으나,
FEAT-012에서 drift 비용 > 보존 이점 판단하에 canonical file 폐기로 결정.

### 2026-06-01 — 구현 완료

- `skills/generate-blueprint.md` 삭제 완료.
- active/system-facing 문서 8곳 정리 완료.
- scoped validation: `grep -rn "skills/generate-blueprint" README.md docs/SYSTEM-MANUAL.md skills .agents .claude/commands .cursor prompts AGENTS.md CLAUDE.md` → 0건.
- 허용 예외 잔존: `.claude/commands/generate-blueprint.md`(redirect wrapper), `.agents/skills/generate-blueprint/SKILL.md`(redirect wrapper), `.claude/settings.local.json`(local permission, product surface 아님).
- redirect wrappers 확인: 두 파일 모두 `skills/create-deck.md` Step 0으로 안내 중.
- FEAT-010 Work 파일도 이 커밋에서 Done 처리(PR #36/37로 main 반영 완료).
