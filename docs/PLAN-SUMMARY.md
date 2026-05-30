# PLAN-SUMMARY.md — Presentation Compiler

> 전체 근거와 상세 아키텍처: `docs/PLAN.md`

## Project Summary

| 항목 | 내용 |
| --- | --- |
| 프로젝트 목표 | blueprint.yaml + design preset → editable PPTX 일관 생성 |
| 주요 사용자 | AI-assisted presentation author (개인 / 팀 내부) |
| production 성격 | library / internal tool (public open-source) |
| 배포 또는 공개 방식 | public GitHub, npm package (Post-MVP) |
| 제품 핵심 workflow | blueprint.yaml → Schema Validation (Zod) → Compiler → TemplateRegistry → pptxgenjs → Editable PPTX → Validation Report |
| AI 작업 도구 | Claude Code / Codex / Cursor |
| 주요 제약 조건 | AI가 x/y 좌표를 결정하지 않음. 규칙 기반 렌더링만 허용 (같은 입력 = 같은 결과). pptxgenjs editable output 필수. |

## Implementation Baseline

코드 개발이 없는 프로젝트(content/research/no-code 운영 등)는 전체 표를 Not Applicable로 처리한다.
baseline이 비어 있으면 feature candidate은 Not Ready로 보고하고, 첫 후보로 Project Initialization을 제안한다.

| 항목 | 결정 내용 | Readiness |
| --- | --- | --- |
| Runtime / Language | Node.js 18+, TypeScript | Ready |
| Framework / Library | pptxgenjs ^3.12, zod ^3.23, yaml ^2.4 (eemeli), vitest ^1, tsx ^4 | Ready |
| Build tool | tsconfig.json (ES2022, strict, bundler resolution) | Ready |
| Base package / Module | src/ (schema/, compiler/, templates/, design/, cli/) | Ready |
| Module shape | CLI (`npm run validate`, `npm run deck`) + TypeScript library | Ready |
| Data storage | 없음 — file-based input/output (blueprint.yaml, tokens.json, output/*.pptx) | Not Applicable |
| Profiles / Environments | 없음 — CLI flags: `--blueprint`, `--design`, `--theme`, `--output` | Not Applicable |
| Verification defaults | `npm run typecheck`, `npm test` (vitest), `npm run validate -- --blueprint examples/sample/blueprint.yaml` | Ready |

*(Readiness: Not Started / Partial / Ready / Not Applicable)*

## Core Architecture

```text
User / AI
  ↓ (structured input: blueprint.yaml, design preset)
Schema Validation (Zod — src/schema/blueprint.ts)
  ↓
Deterministic Compiler (src/compiler/compiler.ts)
  ↓ (TemplateRegistry → layout engine → token resolution)
pptxgenjs
  ↓
Editable PPTX
  ↓
Validation Report → AI Review / Human Review
```

**핵심 원칙: AI writes intent. Code renders layout.**

- AI 역할: blueprint.yaml 생성·수정, slide narrative 개선, diagram semantic spec 생성
- 규칙 기반 엔진 역할: blueprint 파싱, design token 해석, template 선택, 좌표 계산, PPTX 생성
- AI 금지: 임의 x/y 좌표 결정, 미등록 layout 발명, design token 무시

## Verification Defaults

- TypeScript 변경: `npm run typecheck`
- 로직 변경: `npm test` (vitest, 19 tests)
- Blueprint schema 변경: `npm run validate -- --blueprint examples/sample/blueprint.yaml`
- 문서 전용 변경: `git diff --check`, stale phrase 점검
- Scaffold/script 없음 — Not Applicable

## Active References

- 프로젝트 정의 전체: `temp/work-plans/10-ai-native-pt-engineering-framework-3.md`
- Blueprint DSL: §9 Blueprint DSL Reference
- Slide type 목록 (15종): §5 Supported Slide Types
- Tech stack 선택 근거: §7 Tech Stack
- MVP scope: §12 (Work 1 완료, Work 2 다음)
