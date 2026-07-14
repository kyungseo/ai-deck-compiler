# PLAN-SUMMARY.md — ai-deck-compiler

> 상세 설계 기록: `docs/PLAN.md`

## Project Summary

| 항목 | 내용 |
| --- | --- |
| 프로젝트 목표 | AI와 대화해 `blueprint.yaml`을 작성하고 editable PPTX/PDF를 생성 |
| 주요 사용자 | AI-assisted presentation author, repo maintainer, contributor |
| 공개 방식 | public GitHub repo, npm package는 post-MVP |
| 핵심 workflow | create-deck → blueprint.yaml → Schema Validation → Compiler → TemplateRegistry → pptxgenjs → Editable PPTX → optional preview/PDF |
| AI 작업 도구 | Claude Code, Codex CLI/App, Cursor, Claude App |
| 핵심 제약 | AI는 intent/content를 작성하고, code는 layout을 deterministic하게 렌더링한다. AI가 x/y 좌표를 결정하지 않는다. |

## Current Product Baseline

| 영역 | 상태 |
| --- | --- |
| Runtime / Language | Node.js 20+, TypeScript |
| Rendering | pptxgenjs editable PPTX |
| Schema | Zod discriminated union + generated JSON Schema |
| CLI | `validate`, `deck`, `preview`, `export-pdf`, `schema` |
| Slide types | 16종: hero, agenda, section-divider, content, two-column, comparison, kpi, timeline, architecture, flow, table, chart, decision, summary, appendix, closing |
| Design presets | `teal`, `vivid`, `modern` |
| AI workflow | `create-deck` canonical. `review-deck`, `export-pdf`, `generate-architecture-slide` 보조 skill |
| Examples | `examples/results`에 showcase blueprint/PPTX/PDF/gallery 추적 |

## Public Release Gate

Public 전환 전에는 새 기능 추가보다 아래 gate를 우선한다.

1. Showcase 품질 최종화
2. README / USER-MANUAL / SYSTEM-MANUAL 현행화
3. Claude/Codex/Cursor/Claude App 작업 케이스별 시뮬레이션
4. `src/` code quality audit 및 low-risk fix만 반영
5. backlog/status/plan 정리 및 유지보수 phase 전환
6. 불필요한 harness prompt/manual 표면 최소화
7. GitHub repo settings 확인
8. final validation 및 clean clone smoke

## Maintenance Phase Direction

Public 이후 plan은 기능 구축 목록보다 유지보수와 품질 개선 중심으로 운영한다.

| Track | 예시 |
| --- | --- |
| Showcase / docs | showcase refresh, docs polish, social post, examples curation |
| Quality | layout fine tuning, code quality audit, validation skill |
| Preset | custom preset support, enterprise-clean preset |
| CLI | list-designs, convert-design, npm package/global CLI |
| Export / preview | PDF export hardening, preview reliability |

## Verification Defaults

- TypeScript 변경: `npm run typecheck`
- 로직 변경: `npm test`
- Blueprint/schema 변경: `npm run validate -- --blueprint examples/sample/blueprint.yaml`
- Showcase 변경: validate + deck + export-pdf + preview + visual review
- 문서 전용 변경: `git diff --check`, stale phrase search

## Active References

- Public release gate: `docs/works/phase1/CHORE-20260601-001-public-release-gate.md`
- Backlog: `docs/backlog/PHASE1.md`
- User guide: `docs/USER-MANUAL.md`
- Maintainer guide: `docs/SYSTEM-MANUAL.md`
