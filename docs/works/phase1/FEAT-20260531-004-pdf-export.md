---
id: FEAT-20260531-004
title: "PDF 내보내기 — export-pdf CLI + 멀티툴 AI skill"
status: Active
type: FEAT
created: 2026-05-31
branch: feature/FEAT-20260531-004-pdf-export
---

# FEAT-20260531-004 — PDF 내보내기: export-pdf CLI + 멀티툴 AI skill

## Goal

PPTX → PDF 변환을 `npm run export-pdf` CLI와 `/export-pdf` AI skill로 지원한다.
환경 체크(LibreOffice 탐색) → 없으면 OS별 설치 안내 → 있으면 변환 실행의 흐름을 제공한다.
export-pdf가 Claude Code / Codex CLI/App / Claude 채팅 모두에서 동일하게 진입 가능하도록 AI tool 정렬을 완성한다.

## Discovery

- `preview.ts`에 `findSoffice`, `sofficeHint`, `findPdftoppm`, `pdftoppmHint`, PPTX→PDF 변환 로직이 이미 구현되어 있음.
- export-pdf는 LibreOffice만 필요하고 poppler는 불필요 (PDF 단계에서 멈춤).
- 공유 tool utility를 `src/cli/lib/tools.ts`로 추출하고 preview.ts와 export-pdf.ts 양쪽에서 import하는 방식이 적절함.

## Scope

### 필수

| 파일 | 작업 |
|---|---|
| `src/cli/lib/tools.ts` | 신규 — `findSoffice`, `sofficeHint`, `findPdftoppm`, `pdftoppmHint` 추출 |
| `src/cli/preview.ts` | import 경로를 `./lib/tools.js`로 변경 |
| `src/cli/export-pdf.ts` | 신규 — LibreOffice 체크 + PPTX→PDF 변환 CLI |
| `package.json` | `"export-pdf": "tsx src/cli/export-pdf.ts"` 추가 |
| `skills/export-pdf.md` | 신규 canonical skill |
| `.claude/commands/export-pdf.md` | 신규 Claude Code wrapper |
| `.agents/skills/export-pdf/SKILL.md` | 신규 Codex wrapper |
| `AGENTS.md` | Product Skill Routing 표에 행 추가 (English Only) |
| `skills/README.md` | Skill 목록 업데이트 |
| `prompts/codex-session-start.md` | Section 0 fallback에 export-pdf 케이스 추가 |

### 문서 소급 반영

| 파일 | 작업 |
|---|---|
| `README.md` | `## 한계와 제약`에서 "PDF 내보내기 없음" 항목 삭제 + `## 주요 기능` 표에 PDF 내보내기 행 추가 |
| `docs/USER-MANUAL.md` | §11에 PDF 내보내기 절차 추가, §13 문제 해결 보강 |
| `docs/SYSTEM-MANUAL.md` | §6 CLI 참조에 `npm run export-pdf` 추가 |

## CLI 사용법

```bash
npm run export-pdf -- output/deck.pptx
npm run export-pdf -- output/deck.pptx --out output/deck.pdf
```

## AI Tool 정렬 (완성 목표)

| 도구 | 진입 경로 |
|---|---|
| Claude Code | `/export-pdf` → `.claude/commands/export-pdf.md` → `skills/export-pdf.md` |
| Codex CLI/App | `AGENTS.md` Product Skill Routing → `.agents/skills/export-pdf/SKILL.md` → `skills/export-pdf.md` |
| Claude 채팅 | `skills/export-pdf.md` 직접 참조/복사 |

## Done Criteria

- [ ] `npm run export-pdf -- output/sample-v1.0.pptx` — PDF 생성 확인
- [ ] LibreOffice 없을 때 OS별 설치 안내 출력 후 exit 1
- [ ] `skills/export-pdf.md` — 환경 체크 + 변환 + 오류 안내 포함, 3도구 진입 경로 명시
- [ ] `.claude/commands/export-pdf.md` wrapper 추가
- [ ] `.agents/skills/export-pdf/SKILL.md` wrapper 추가
- [ ] `AGENTS.md` Product Skill Routing 표 업데이트 (English Only)
- [ ] `skills/README.md` 업데이트
- [ ] `prompts/codex-session-start.md` Section 0 export-pdf 케이스 추가
- [ ] README `## 주요 기능`에 PDF 내보내기 추가, 한계 항목 삭제
- [ ] USER-MANUAL, SYSTEM-MANUAL 소급 반영
- [ ] `npm run typecheck` 통과
- [ ] `npm test` 통과

## Verification

```bash
npm run typecheck
npm test
npm run export-pdf -- output/sample-v1.0.pptx   # 실제 변환 확인
unzip -l output/sample-v1.0.pdf 2>/dev/null || file output/sample-v1.0.pdf
```

## Risks

| Risk | Mitigation |
|---|---|
| preview.ts import 변경 시 기존 동작 깨짐 | typecheck + test로 즉시 검출 가능 |
| LibreOffice PDF 출력 파일명 예측 | soffice는 `{stem}.pdf`로 생성 — 명시적 rename 로직 추가 |
