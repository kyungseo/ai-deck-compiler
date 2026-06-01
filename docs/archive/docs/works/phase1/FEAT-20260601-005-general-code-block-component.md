---
id: FEAT-20260601-005
title: "General code block component — 본문 코드 블럭 표현 공통화"
status: Archived
actual_end: 2026-06-01
type: FEAT
created: 2026-06-01
branch: feature/readme-semantic-code-block-docs
---

# FEAT-20260601-005 — General code block component

## Goal

슬라이드 본문에 등장하는 명령어, 코드 조각, 재생성 절차를
일반 bullet 텍스트가 아니라 boxed monospace code block으로 표현할 수 있게 한다.

현재 구현은 `appendix` slide의 선행 `body` 항목이 백틱으로 감싸진 경우에만
code block처럼 렌더링한다. 사용자가 기대하는 경험은 `appendix`에 한정되지 않고,
`content`, `two-column`, 필요 시 `summary` 등 본문형 슬라이드에서도 코드가 별도 블럭으로 보이는 것이다.

1차 목표는 **general code block component**다.
syntax highlighting은 구현 난도와 PPTX text run 제약을 확인한 뒤 별도 단계로 판단한다.

---

## Scope

### Layer 1 — AS-IS audit

- 현재 `appendix.ts`의 code block 인식/렌더링 방식을 확인한다.
- `content`, `two-column`, `summary`, `appendix`의 body data shape와 renderer 차이를 정리한다.
- schema를 확장해야 하는지, 기존 string convention으로 충분한지 판단한다.

### Layer 2 — Blueprint 표현 방식 결정

아래 중 하나를 선택한다.

| Option | 설명 | 장점 | 단점 |
| --- | --- | --- | --- |
| A. string convention | 현재처럼 `` `...` `` 또는 fenced-code-like string을 해석 | schema 변경 작음 | multi-line/lang 표현이 약함 |
| B. structured body item | `{ kind: "code", lang, text }` 같은 body item 추가 | 명확하고 확장 가능 | schema/render 영향 큼 |
| C. slide-level code field | `code_blocks` 또는 `code` field 추가 | 렌더러 단순 | slide type별 배치 유연성 낮음 |

Decision Gate:
- 1차 구현은 schema 안정성과 작성 편의성을 함께 고려한다.
- syntax highlighting을 바로 넣을지 여부는 이 단계에서 다시 판단한다.

### Layer 3 — Common renderer helper

- 공통 helper를 `src/templates/layout.ts` 또는 별도 helper 파일에 둔다.
- boxed background, border, monospace font, padding, line wrapping, height estimate를 공통화한다.
- code block이 overflow되면 잘리거나 겹치지 않도록 안전한 높이 계산 또는 fallback을 둔다.

### Layer 4 — Slide renderer 적용

우선순위:

| Priority | Slide type | 이유 |
| --- | --- | --- |
| P0 | `content` | 일반 본문 코드 설명의 대표 경로 |
| P0 | `two-column` | 설명 + 코드 예시 패턴에 가장 적합 |
| P0 | `appendix` | 기존 구현을 공통 helper로 이전 |
| P1 | `summary` | 결론/실행 명령이 있을 수 있으나 빈도 낮음 |

### Layer 5 — Docs / Examples

- README, USER-MANUAL, SYSTEM-MANUAL에서 현재 지원 범위를 정확히 설명한다.
- semantic planning 규칙에 "코드/명령어는 code block component" 기준을 추가한다.
- showcase 또는 별도 sample에 최소 1개 code block 예시를 포함할지 판단한다.

---

## Non-goals

- 완전한 syntax highlighting 엔진 구현.
- Mermaid, PlantUML 등 diagram-as-code 렌더링.
- code editor 수준의 줄 번호, folding, diff highlight.
- 모든 slide type에 code block을 강제로 추가.

---

## Done Criteria

- [x] 본문형 slide에서 code block 표현 방식이 결정되어 Work Discovery에 기록된다.
- [x] `content`, `two-column`, `appendix` 중 합의된 1차 대상에 boxed monospace code block이 적용된다.
- [x] 기존 `appendix` code block 동작이 회귀하지 않는다.
- [x] README / USER-MANUAL / SYSTEM-MANUAL이 실제 지원 범위와 일치한다.
- [x] syntax highlighting을 이번 Work에 포함할지, 후속으로 둘지 결정이 기록된다.
- [x] `npm run typecheck` 통과.
- [x] `npm test` 통과.
- [x] 관련 sample 또는 showcase preview로 visual QA가 수행된다.

---

## Verification

```bash
npm run typecheck
npm test
npm run validate -- --blueprint <sample-or-showcase-blueprint>
npm run deck -- --blueprint <sample-or-showcase-blueprint> --output <output.pptx>
npm run preview -- <output.pptx> --out <preview-dir>
```

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| string convention이 불명확함 | AI가 일반 문장과 code를 혼동 | structured body item option을 함께 검토 |
| PPTX text run 제약 | syntax highlighting 구현 복잡 | 1차는 box/monospace로 제한 |
| code block 높이 계산 실패 | 본문 겹침/잘림 | height estimate + preview QA |
| schema 변경 범위 확장 | 기존 examples/tests 영향 | schema 확장은 Decision Gate 이후 수행 |

---

## Discovery

### 2026-06-01 — Initial decision

- 현재 구현은 `appendix` slide의 선행 백틱 `body` 항목에 한정된다.
- 사용자가 원하는 방향은 특정 appendix가 아니라 본문형 슬라이드 전반에서 사용할 수 있는 code block component다.
- syntax highlighting은 desirable이지만 필수는 아니다. 먼저 boxed monospace block을 안정화한다.

### 2026-06-01 — Implementation decision

- Blueprint 표현은 Option A(string convention)로 결정했다. schema 변경 없이 기존 `body: string[]` 안에서 inline backtick 항목과 fenced code string을 code block으로 인식한다.
- 1차 적용 범위는 `content`, `two-column`, `appendix`다. `summary`는 현재 결론 bullet 중심 성격이 강해 후속 필요 시 확장한다.
- 기존 `appendix` 전용 구현은 `renderBodyWithCodeBlocks()` 공통 helper로 이전한다. 이로써 code block은 body 앞에만 놓일 필요 없이 일반 bullet 사이에도 배치할 수 있다.
- syntax highlighting은 이번 Work 범위에서 제외한다. 현재는 boxed background, border, monospace font, optional language label까지 지원하고, token-level coloring은 `code-syntax-highlight` 후보로 유지한다.

### 2026-06-01 — Validation

- `npm run typecheck` 통과.
- `npm test` 통과 — 53/53.
- `npm run validate -- --blueprint temp/general-code-block-sample.yaml` 통과.
- `npm run deck -- --blueprint temp/general-code-block-sample.yaml --output temp/general-code-block-sample.pptx` 통과.
- `npm run preview -- temp/general-code-block-sample.pptx --out temp/general-code-block-preview` 통과.
- Visual QA: `content`, `two-column`, `appendix` preview에서 boxed monospace code block 위치와 일반 bullet 혼용을 확인했다.
