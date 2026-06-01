---
id: FEAT-20260601-007
title: "Code block polish — 타입 모호성 제거, magic number 주석, YAML 작성 예시 보강"
status: Archived
actual_end: 2026-06-01
type: FEAT
created: 2026-06-01
branch: feature/FEAT-20260601-007-code-block-polish
---

# FEAT-20260601-007 — Code block polish

## Goal

FEAT-005/006 리뷰에서 도출된 4가지 보완 항목을 처리한다.
버그 수정이 아닌 코드 명확성 개선 + 문서 누락 보완이다.

---

## Scope

### 1. `layout.ts` — `addText` 타입 모호성 제거

`renderCodeGroup` 내부의 `s.addText(textRuns ?? lines.join('\n'), ...)` 호출을
명시적 분기로 분리한다. `textRuns`가 `TextProps[] | undefined`, fallback이 `string`으로
union 타입 ambiguity가 있으며, 런타임은 안전하지만 타입 의도가 불명확하다.

### 2. `layout.ts` — magic number 주석

`estimateWrappedLines`의 `charsPerInch = 11`과
`estimateBulletHeight`의 `width * 7.8`에 각 수치의 의미 주석을 추가한다.
읽는 사람이 배경 없이도 수치 의도를 파악할 수 있게 한다.

### 3. `layout.ts` — `normalizeCodeLang` 언어 확장 안내 주석

언어 추가 시 함께 수정해야 할 세 곳(union type, `KEYWORDS` record, `tokenizeCodeLine` comment check)을
주석으로 명시한다.

### 4. `skills/generate-blueprint.md` + `docs/USER-MANUAL.md` — YAML `|` 작성 예시

fenced code block을 `body[]` 단일 항목으로 작성하려면 YAML literal block scalar(`|`)가 필요하다.
현재 문서는 개념 설명만 있고 YAML 예시가 없어 AI가 잘못된 형식으로 blueprint를 생성할 수 있다.
두 문서 모두에 `|` 문법을 보여주는 최소 예시를 추가한다.

---

## Non-goals

- schema 변경
- 언어 추가 (bash/js/ts/java 이외)
- pptxgenjs type definition 수정

---

## Done Criteria

- [x] `addText` 호출이 명시적 분기로 분리된다.
- [x] `estimateWrappedLines` / `estimateBulletHeight` magic number에 주석이 있다.
- [x] `normalizeCodeLang` 위에 확장 포인트 주석이 있다.
- [x] `skills/generate-blueprint.md`에 fenced code YAML `|` 예시가 추가된다.
- [x] `docs/USER-MANUAL.md`에 동일 예시가 추가된다.
- [x] `npm run typecheck` 통과.
- [x] `npm test` 통과.
- [x] `temp/general-code-block-sample.yaml` PPTX 생성 및 preview QA.

---

## Verification

```bash
npm run typecheck
npm test
npm run validate -- --blueprint temp/general-code-block-sample.yaml
npm run deck -- --blueprint temp/general-code-block-sample.yaml --output temp/general-code-block-polish-sample.pptx
npm run preview -- temp/general-code-block-polish-sample.pptx --out temp/general-code-block-polish-preview
```

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `addText` 분기 변경이 렌더 결과에 영향 | 낮음 — 로직 동일, 타입 분기만 | typecheck + test + preview QA |
| 주석 추가가 코드 스타일 위반 | 낮음 | 최소 1줄, WHY 중심 |

---

## Discovery

### 2026-06-01 — Validation

- FEAT-005/006 리뷰 4개 항목 전체 구현 완료.
- `addText` 명시적 분기: `textRuns` 유/무 분기로 타입 의도 명확화. 렌더 결과 동일.
- magic number 주석: `estimateWrappedLines(charsPerInch=11)` = Courier New 11pt 기준, `estimateBulletHeight(7.8)` = Pretendard ~16pt 기준 주석 추가.
- `normalizeCodeLang` 확장 포인트 주석 추가.
- `skills/generate-blueprint.md` + `docs/USER-MANUAL.md`에 YAML `|` 문법 예시 추가.
- `npm run typecheck` 통과.
- `npm test` 통과 — 54/54.
- `temp/general-code-block-polish-sample.pptx` 생성 및 preview 3종 확인:
  - content: bullet + BASH block (syntax color) + bullet 혼용 정상
  - two-column: JAVA block keyword/string 색상 분리 정상
  - appendix: inline code boxes + BASH fenced block + bullet 혼용 정상
