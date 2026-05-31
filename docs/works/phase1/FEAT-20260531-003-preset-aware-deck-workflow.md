---
id: FEAT-20260531-003
title: "preset-aware deck creation + metadata/source input workflow"
status: Done
type: FEAT
created: 2026-05-31
actual_end: 2026-05-31
branch: feature/feat-20260531-003-preset-aware-deck-workflow
---

# FEAT-20260531-003 — preset-aware deck creation + metadata/source input workflow

## Goal

`create-deck` / `generate-blueprint` / `review-deck` workflow를 확장하여
사용자 입력 패턴, design preset 선택, 작성자·브랜드 정보, markdown source input,
문서 version, preview 기반 검토 loop를 하나의 자연스러운 deck creation 흐름으로 만든다.

이 Work는 Active implementation Work다.
실제 파일 변경 실행은 사용자 승인 후 시작한다.

## Problem

현재 product skill은 blueprint 작성과 PPTX 생성을 안내하지만,
사용자의 실제 입력 패턴과 deck 품질 보정 흐름을 충분히 모델링하지 않는다.

대표 사용자 패턴:

| Pattern | 설명 | 현재 한계 |
| --- | --- | --- |
| 간단한 brief | 사용자가 주제·목적만 간략히 답함 | 추가 질문과 content 보강 기준이 약함 |
| 준비된 source 제공 | 사용자가 markdown, 메모, 보고서 초안을 제공 | source-first 변환 절차가 명확하지 않음 |
| AI에게 전부 위임 | 사용자가 주제만 주고 내용 작성을 대부분 맡김 | research 범위, 출처, 근거 품질 기준이 없음 |

또한 이 repo의 차별점인 preset/custom branding과 생성 후 preview 검토 loop가
`create-deck` workflow에 아직 충분히 녹아 있지 않다.

## Design Direction

### 1. Input Mode

`create-deck`는 초기에 사용자 입력 수준을 판별한다.

| Mode | Trigger | Workflow |
| --- | --- | --- |
| Brief-first | 주제·목적만 제공 | 핵심 질문 최대 3개씩 수집 → structure proposal → blueprint |
| Source-first | markdown/file path/source text 제공 | source 요약 → narrative spine → slide plan → blueprint |
| AI-research-first | "알아서 작성", "자료 찾아서 작성" 등 | research 범위 확인 → 자료 조사/출처 정리 → content draft → blueprint |

`source-first`의 source 처리와 구조 결정은 `create-deck` 책임이다.
`generate-blueprint`는 구조가 정리된 뒤 blueprint 작성 단계만 위임받는다.

### 2. Preset And Branding

초기 질문 또는 structure proposal 전에 다음을 확인한다.

- design preset: 기본값 `default-modern`
- preset 특징: 추천 용도, layout traits, supported themes, brand slots
- author/team/company/brand footer
- custom preset이 필요한지 여부

초기 구현에서는 `default-modern` 설명을 skill 문서에 정적으로 넣는다.
후속 작업으로 preset catalog 또는 `list-designs` CLI와 연결한다.

### 3. Metadata And Version

Workflow 차원에서 먼저 수집한다.

- `deck.version`: blueprint와 PPTX 산출물 version source
- `deck.author`: 표지/metadata 작성자
- 향후 후보: `deck.company`, `deck.contact`, `deck.source`
- output filename 후보: `output/{slug}-v{version}.pptx`

PPTX document properties에는 최소 metadata를 이번 Work에서 반영한다.
현재 PowerPoint 속성 창에 `PptxGenJS Presentation` / `PptxGenJS` 기본값이 노출되는 상태는
brand-aware deck creation 품질 기준에 맞지 않는다.

이번 구현의 최소 목표:

- title: `deck.title`
- author/creator: `deck.author`
- subject 또는 description: `deck.audience`와 `deck.title`에서 유추하고, 적절한 값이 없으면 생략
- company: schema 확장 없이 수집 가능한 경우 우선 검토
- comments/keywords: source 또는 version 추적에 무리가 없을 때만 반영

`deck.contact`, `deck.source` 정식 schema화와 default output filename 자동 변경은 후속 검토로 둔다.

### 4. Markdown Source Input

사용자는 prompt에 markdown을 붙여넣거나 파일 경로를 제공할 수 있다.

AI 처리 원칙:

- source를 그대로 slide에 복제하지 않는다.
- 핵심 주장, 근거, 수치, audience-specific message를 추출한다.
- 부족한 부분은 질문 또는 research suggestion으로 보강한다.
- blueprint에는 필요한 경우 source reference만 남긴다.

### 5. Content Sufficiency And Research

content가 빈약하면 AI는 바로 PPTX를 만들지 않고 다음 중 하나를 제안한다.

- 추가 질문
- slide별 content 보강안
- source material 요청
- 외부 research 수행

AI-research-first mode에서는 research scope와 출처 기준을 확인한다.
외부 자료를 사용하는 경우 출처와 AI 추론을 구분한다.

### 6. Preview-based Review Loop

PPTX 생성 후 AI가 preview 생성 가능 여부를 판단하고,
사용자에게 preview PNG 생성과 visual review 진행 여부를 확인한다.
사용자가 승인하면 preview를 생성한다.

```bash
npm run preview -- output/{slug}.pptx --out output/{slug}-preview
```

AI는 preview PNG와 blueprint를 함께 보며 다음을 점검한다.

- 시각적 밀도와 빈 공간
- 제목/본문 overflow
- chart/table 가독성
- theme/preset 일관성
- slide 흐름과 메시지 강도

preview 도구가 없으면 PowerPoint/Keynote 수동 확인 경로로 fallback한다.

## Scope

### 필수

| 파일 | 작업 |
| --- | --- |
| `skills/create-deck.md` | input mode, preset/brand/version 질문, source input, content sufficiency, preview review loop 반영 |
| `skills/generate-blueprint.md` | source-first 및 AI-research-first blueprint 작성 절차 반영 |
| `skills/review-deck.md` | preview 기반 visual review와 기존 구조·메시지 검토의 관계 명시 |
| `.claude/commands/create-deck.md` | canonical skill 변경을 반영한 wrapper 업데이트 |
| `.agents/skills/create-deck/SKILL.md` | thin wrapper 유지, mode 판별은 canonical skill에서 처리 |
| `src/compiler/compiler.ts` | pptxgenjs document properties(`title`, `author`, `subject` 등) 최소 반영 |
| `docs/USER-MANUAL.md` | preset 선택, branding, source input, preview loop 사용자 흐름 반영 |
| `docs/SYSTEM-MANUAL.md` | architecture/workflow 관점 반영 |

### Architecture Plan Sync

`docs/PLAN.md`는 L3 architecture plan 문서이므로 implementation scope와 별도로 관리한다.
이번 planning branch에서 AI guided authoring, preset-aware workflow, metadata/source/preview loop는
이미 소급 반영했다.

구현 중 PLAN 추가 변경이 필요하면 Approval Matrix의 L3 gate를 다시 확인한다.
구현 전 [docs/PLAN.md](../../PLAN.md)의 AI guided authoring, metadata/version, skill architecture 관련 섹션을 확인한다.

### 검토 후 결정

| 항목 | 판단 |
| --- | --- |
| `deck.company`, `deck.contact`, `deck.source` schema 확장 | 이번 구현 포함 여부 결정 |
| version-aware default output filename | CLI behavior 변경이므로 risk 검토 후 결정 |
| preset metadata catalog | 정적 skill 설명으로 시작할지, catalog 파일/CLI까지 포함할지 결정 |

### Non-Scope

- 새로운 design preset 구현
- custom preset end-to-end 생성 자동화
- browser 기반 research 자동화 구현
- preview rendering engine 교체
- PowerPoint binary visual diff 자동화

## Done Criteria

- [x] `create-deck`가 brief-first / source-first / AI-research-first mode를 구분한다.
- [x] `create-deck`가 preset, theme, author/brand, version을 초기 흐름에서 확인한다.
- [x] preset 특징을 사용자에게 설명하고 기본값 `default-modern`을 제안한다.
- [x] markdown paste 또는 file path source input을 받을 수 있는 절차가 명시된다.
- [x] content가 빈약할 때 보강 질문, source 요청, research 제안 중 하나로 분기한다.
- [x] AI-research-first mode에서 research scope와 출처 기준 확인 절차가 있다.
- [x] AI-research-first mode에서 실제 외부 검색은 tool 환경에 따라 제한될 수 있음을 명시한다.
- [x] PPTX 생성 후 preview 기반 review loop가 workflow에 포함된다.
- [x] preview 도구가 없을 때 fallback 안내가 있다.
- [x] `review-deck`와 preview visual review의 관계가 명확하다.
- [x] PPTX document properties에 최소 metadata가 반영되어 PowerPoint 속성 창에 PptxGenJS 기본값이 남지 않는다.
- [x] metadata/version mapping의 이번 구현 범위와 후속 범위가 명확하다.
- [x] `docs/USER-MANUAL.md`, `docs/SYSTEM-MANUAL.md`가 workflow 목표와 일치한다.
- [x] `docs/PLAN.md`는 이번 branch의 Architecture Plan Sync 상태와 충돌하지 않는다.

## Verification

문서·skill coverage:

```bash
rg -n "preset|brand|version|source|markdown|preview|research|brief-first|source-first|AI-research-first" \
  skills/ docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md docs/PLAN.md \
  .claude/commands/ .agents/skills/
```

기본 검증:

```bash
git diff --check
npm run typecheck
npm test
npm run validate -- --blueprint examples/sample/blueprint.yaml
```

PPTX metadata 검증:

```bash
npm run deck -- --blueprint examples/sample/blueprint.yaml --output output/sample-v1.0.pptx
unzip -p output/sample-v1.0.pptx docProps/core.xml | rg "dc:title|dc:creator|cp:subject|cp:keywords|dc:description"
```

schema를 변경할 경우:

```bash
npm run schema
```

preview loop를 실제 검증할 경우:

```bash
npm run preview -- output/sample-v1.0.pptx --out output/sample-preview
```

`preview`는 LibreOffice + pdftoppm 설치 상태와 사용자 승인 여부에 따라 skipped 가능하다.

### Verification Results

2026-05-31 실행:

- `git diff --check` ✅
- `npm run typecheck` ✅
- `npm test` ✅ — 43 tests passed
- `npm run validate -- --blueprint examples/sample/blueprint.yaml` ✅
- `npm run deck -- --blueprint examples/sample/blueprint.yaml --output output/sample-v1.0.pptx` ✅
- `unzip -p output/sample-v1.0.pptx docProps/core.xml | rg "dc:title|dc:creator|dc:subject|cp:revision"` ✅
- `unzip -p output/sample-v1.0.pptx docProps/app.xml | rg "Company|Application"` ✅
- `npm run preview -- output/sample-v1.0.pptx --out output/sample-preview` ✅ — 8 PNG files generated

`tsx` 기반 CLI 명령은 sandbox IPC 제한(`listen EPERM`) 때문에 sandbox 밖에서 재실행했다.
후속 조정으로 기본 author를 `ai-deck-compiler (Kyungseo.Park@gmail.com)`로 변경했고,
preview 실행은 사용자 확인 gate를 거치도록 정리했다.

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Step 1 질문이 과도하게 길어짐 | 사용자가 이탈 | 최대 3개 질문 원칙 유지, 기본값 제공 |
| AI research 품질·출처 불명확 | 부정확한 deck 생성 | research scope 확인, 출처와 추론 구분 |
| AI research tool availability 차이 | Codex/Claude/채팅 환경별 검색 가능성이 다름 | 외부 검색은 tool 환경에 따라 제한될 수 있음을 skill에 명시 |
| metadata schema 과확장 | blueprint 복잡도 증가 | 기존 `deck.title`, `deck.author`, `deck.version` 우선 활용 |
| pptx metadata 추가로 snapshot diff 발생 | `npm test` 실패 | `npm test -- --update-snapshots` 실행 후 diff 검토 |
| preview optional dependency | 환경별 실패 | fallback 안내, skipped 가능성 명시 |
| preset catalog 조기 설계 | 과잉 설계 | 초기에는 static preset 설명으로 시작 |

## Reversal Cost

Medium.
이번 Work는 compiler 변경(pptx document properties 설정)을 포함한다.
revert 시 skill/doc 변경과 함께 properties 설정 코드를 제거하고 snapshot을 재검토해야 한다.
schema 확장이나 default output filename 변경까지 포함하면 blueprint 호환성과 CLI behavior 영향이 커지므로 follow-up으로 분리한다.

## Open Questions

| ID | Question | Default |
| --- | --- | --- |
| OQ-FEAT-20260531-003-001 | `deck.company`, `deck.contact`, `deck.source`를 이번 작업에서 schema에 추가할까? | 보류, 최소 metadata는 기존 field 우선 |
| OQ-FEAT-20260531-003-002 | PPTX document properties 반영을 이번 작업에 포함할까? | 포함, 최소 metadata 반영 |
| OQ-FEAT-20260531-003-003 | default output filename을 version-aware로 바꿀까? | 보류, 명시적 `--output` 유지 |
| OQ-FEAT-20260531-003-004 | preset metadata catalog를 구현할까? | 보류, static preset 설명 우선 |

## Implementation Plan (승인 후)

1. Skill workflow 업데이트
   - `skills/create-deck.md`, `skills/generate-blueprint.md`, `skills/review-deck.md`
   - Claude/Codex wrapper는 thin routing 유지, mode 판별은 canonical skill에서 처리
2. User/System manual 업데이트
   - preset, branding, source input, preview loop 사용자 흐름 반영
3. PPTX metadata 최소 반영
   - `src/compiler/compiler.ts` 수정 지점을 확인하고 `deck.title`, `deck.author`, `deck.version` 중심으로 document properties 반영
   - schema 확장과 filename 기본값 변경은 Open Questions 답변에 따라 follow-up 분리
4. Verification 실행
   - Verification 섹션의 coverage, 기본 검증, PPTX metadata 검증을 실행

## Discovery

- `default-modern`이 현재 유일한 preset이며, light/dark theme와 brand footer token을 가진다.
- `npm run preview`는 이미 존재하지만 optional external tools(LibreOffice + pdftoppm)가 필요하다.
- `deck.version`, `deck.author`는 schema에 존재하므로 초기 workflow 반영은 schema 변경 없이 가능하다.
- PPTX metadata 반영의 1차 수정 후보는 `src/compiler/compiler.ts`이며, 실제 적용 전 현재 pptxgenjs 생성 위치를 확인한다.
- 구현 전 `docs/PLAN.md`의 AI guided authoring, metadata/version, skill architecture 관련 섹션과 Work 방향이 일치하는지 확인한다.
- PPTX document properties 최소 반영은 이번 Work 범위로 격상한다.
- version-aware filename은 기존 backlog `[pptx-document-metadata]` 또는 후속 Work와 연결된다.
