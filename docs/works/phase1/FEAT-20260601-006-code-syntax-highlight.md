---
id: FEAT-20260601-006
title: "Code syntax highlighting — code block token color support"
status: Done
actual_end: 2026-06-01
type: FEAT
created: 2026-06-01
branch: feature/feat-20260601-006-code-syntax-highlight
---

# FEAT-20260601-006 — Code syntax highlighting

## Goal

`content`, `two-column`, `appendix`의 boxed monospace code block에
간단한 syntax highlighting을 적용한다.

1차 목표는 code editor 수준의 완전한 파서가 아니라,
발표 자료에서 코드의 구조를 빠르게 스캔할 수 있게 하는 보수적인 token coloring이다.

---

## Scope

### Layer 1 — AS-IS audit

- `renderBodyWithCodeBlocks()`의 code block 렌더링 경로와 `pptxgenjs` rich text run 제약을 확인한다.
- fenced code의 language hint(`bash`, `ts`, `js`, `java` 등)를 어떻게 전달할지 확인한다.

### Layer 2 — Token design

- `teal`, `vivid`, `modern` preset에 syntax color token을 추가한다.
- 최소 token:
  - `code-keyword`
  - `code-string`
  - `code-comment`
  - `code-number`
- 기본 code text는 기존 `accent-text` / `accent` fallback을 유지한다.

### Layer 3 — Lightweight tokenizer

- schema 변경 없이 fenced code의 language hint를 활용한다.
- 지원 대상:
  - `bash` / `sh`
  - `js` / `ts` / `javascript` / `typescript`
  - `java`
- 일반 text fallback은 기존 monospace 단색 렌더링을 유지한다.

### Layer 4 — Renderer integration

- line break와 indentation을 보존한다.
- line 안에서 keyword/string/comment/number에 다른 색상을 적용한다.
- pptxgenjs rich text run이 line break를 안정적으로 표현하지 못하면, Work Discovery에 한계를 기록하고 보수적인 fallback을 둔다.

### Layer 5 — Docs / Tests / Preview

- README, USER-MANUAL, SYSTEM-MANUAL의 "후속 backlog" 표현을 실제 지원 범위로 업데이트한다.
- renderer unit test로 fence marker 제거와 syntax run 생성을 검증한다.
- temp sample preview로 content/two-column/appendix 중 최소 1개 이상 시각 확인한다.

---

## Non-goals

- AST 기반 full parser 구현.
- 모든 언어 지원.
- 줄 번호, diff highlight, copy button, folding.
- code block schema 확장.

---

## Done Criteria

- [x] syntax highlighting 표현 방식과 fallback이 Work Discovery에 기록된다.
- [x] `teal`, `vivid`, `modern` preset에 code syntax color token이 추가된다.
- [x] fenced code block에서 지원 언어의 keyword/string/comment/number가 색상 분리된다.
- [x] unsupported language 또는 inline code block은 기존 단색 monospace rendering으로 회귀 없이 표시된다.
- [x] README / USER-MANUAL / SYSTEM-MANUAL이 실제 지원 범위와 일치한다.
- [x] `npm run typecheck` 통과.
- [x] `npm test` 통과.
- [x] 관련 sample preview로 visual QA가 수행된다.

---

## Verification

```bash
npm run typecheck
npm test
npm run validate -- --blueprint temp/general-code-block-sample.yaml
npm run deck -- --blueprint temp/general-code-block-sample.yaml --output temp/general-code-block-syntax-sample.pptx
npm run preview -- temp/general-code-block-syntax-sample.pptx --out temp/general-code-block-syntax-preview
```

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| rich text run line break 제약 | 줄바꿈/들여쓰기 손상 | line 단위 run 생성 후 preview 확인, 실패 시 단색 fallback |
| tokenizer 오탐 | 코드가 산만해짐 | 키워드/문자열/주석/숫자만 보수적으로 처리 |
| preset 색상 과다 | 디자인 일관성 저하 | token은 semantic color만 추가하고 renderer 기본값 유지 |

---

## Discovery

### 2026-06-01 — Initial plan

- FEAT-005의 `renderBodyWithCodeBlocks()`를 기반으로 확장한다.
- schema는 변경하지 않는다. fenced code의 optional language label을 tokenizer hint로 사용한다.
- 1차 구현은 lightweight highlighting이며, 실패 시 단색 boxed monospace fallback을 유지한다.

### 2026-06-01 — Implementation decision

- `pptxgenjs` rich text run의 `breakLine` 옵션을 사용해 line break를 유지한다.
- 지원 언어는 `bash`/`sh`, `js`/`ts`, `java`로 제한한다.
- tokenizer는 AST parser가 아니라 line scanner다. keyword, quoted string, line comment, number만 색상 분리한다.
- unsupported language와 inline code block은 기존 단색 monospace rendering을 유지한다.
- syntax color는 preset token(`code-keyword`, `code-string`, `code-comment`, `code-number`)을 우선 사용한다.

### 2026-06-01 — Validation

- `npm run typecheck` 통과.
- `npm test` 통과 — 54/54.
- `npm run validate -- --blueprint temp/general-code-block-sample.yaml` 통과.
- `npm run deck -- --blueprint temp/general-code-block-sample.yaml --output temp/general-code-block-syntax-sample.pptx` 통과.
- `npm run preview -- temp/general-code-block-syntax-sample.pptx --out temp/general-code-block-syntax-preview` 통과.
- Visual QA: preview에서 Java fenced code의 keyword/string 색상 분리를 확인했다.
- XML 확인: generated PPTX slide XML에 `code-keyword`(`A7F3D0`)와 `code-string`(`34D399`) 색상 run이 포함됨을 확인했다.
