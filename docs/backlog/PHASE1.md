# Product Backlog — Public Release / Maintenance

## 상태 요약

| 항목 | 내용 |
| --- | --- |
| Phase | Public release gate → Maintenance |
| 제품 목표 | AI와 대화해 `blueprint.yaml`을 만들고 editable PPTX/PDF를 안정적으로 생성 |
| 주요 사용자 | AI-assisted presentation author, repo maintainer, contributor |
| 현재 상태 | Public 전환 준비 |

## 현재 제품 흐름

```text
사용자 의도 표현
  → create-deck이 brief-first / source-first / AI-draft-first 입력 모드 판별
  → 슬라이드 구조 제안 및 승인
  → blueprint.yaml 초안 생성 및 검토 반복
  → npm run deck 실행 → editable PPTX 생성
  → 사용자 승인 시 preview / review-deck 검토
  → 필요 시 blueprint 수정 및 재생성
  → 선택적으로 export-pdf로 PDF 반출
```

Phase 1의 핵심 엔진, 16종 slide type, design preset, product skill routing, showcase examples는 구현 완료 상태다.
public 전환 전에는 새 기능 추가보다 release gate 정리와 검증을 우선한다.

---

## Active Candidates

### P0 — Public Release Gate

**[public-release-gate]** | Priority: P0 | Scope: public 전환 전 repo 표면, 문서, 예제, 설정, 잔여 작업 정리

- Work: `CHORE-20260601-001`
- Done Criteria:
  - `STATUS`, backlog, plan, Work index가 실제 상태와 일치
  - README / USER-MANUAL / SYSTEM-MANUAL 현행화
  - 불필요한 harness prompt/manual 표면 최소화
  - showcase, AI tool simulation, code audit, repo settings, social post task가 후속 실행 가능 상태로 등록
  - final validation checklist 정의
- Verification: `git diff --check`, stale phrase search, release gate checklist review

---

**[showcase-final-polish]** | Priority: P0 | Scope: ai-deck-compiler 소개 showcase deck 품질 최대화

- Goal:
  - repo 소개를 위한 `examples/results/showcase-*` blueprint/PPTX/PDF/gallery를 최종 품질로 정리
  - create-deck self-dogfood 결과가 기존 showcase보다 좋으면 교체
- Done Criteria:
  - teal/dark, vivid/dark, modern/light showcase blueprint 최신화
  - PPTX, PDF, preview/gallery 재생성
  - chart, architecture, decision, callout, code block 등 핵심 기능이 자연스럽게 드러남
  - README gallery가 최신 산출물을 반영
- Verification:
  - `npm run validate -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml`
  - `npm run deck`, `npm run export-pdf`, `npm run preview`
  - visual review

---

**[ai-tool-simulation]** | Priority: P0 | Scope: Claude Code, Codex, Cursor, Claude App 작업 케이스별 routing 검증

- Cases:
  - brief-first deck 생성
  - source-first markdown 기반 deck 생성
  - blueprint-only 요청이 create-deck으로 연결되는지
  - review-deck
  - generate-architecture-slide
  - export-pdf
  - preview는 사용자 승인 후 진행되는지
- Done Criteria:
  - 도구별 진입점과 prompt 예시가 문서와 일치
  - 실패/애매한 케이스는 public 전 수정 또는 maintenance backlog로 분류
- Verification: simulation log 또는 Work Discovery 기록

---

**[docs-final-review]** | Priority: P0 | Scope: README, USER-MANUAL, SYSTEM-MANUAL, examples 문서 최종 현행화

- Done Criteria:
  - public 사용자가 README만 보고 설치/예제 확인/create-deck 시작 가능
  - USER-MANUAL은 사용자 흐름 중심, SYSTEM-MANUAL은 유지보수자 구조 중심으로 역할 분리
  - examples/results의 `blueprint.yaml`, `.pptx`, `.pdf`, gallery 구조 설명 명확
  - 오래된 `generate-blueprint` 독립 진입점, `default-modern` 기본값, stale command 설명 제거
- Verification: 문서 리뷰 + stale phrase search

---

**[public-repo-settings]** | Priority: P0 | Scope: GitHub public 전환 전 repo settings 확인

- Reference: `/Users/kyungseo/dev-home/vibe/ai-workflow-harness/docs/decisions/DR-020-github-repo-settings.md`
- Done Criteria:
  - protect-main / protect-develop ruleset 확인
  - secret scanning + push protection 확인
  - vulnerability alerts 확인
  - delete_branch_on_merge, allow_update_branch, discussions 확인
  - About, topics, description 확인
- Verification: `gh repo view`, `gh api repos/{owner}/{repo}`, `gh api repos/{owner}/{repo}/rulesets`

---

**[social-post-prep]** | Priority: P1 | Scope: public 전환용 소셜 포스팅 초안 준비

- Done Criteria:
  - 한국어 짧은 소개글
  - 영어 짧은 소개글
  - 핵심 메시지 3개
  - showcase/gallery 링크 또는 이미지 첨부 후보
  - 과장 없는 limitations/roadmap 문구
- Verification: 사용자 리뷰

---

### P1 — Code Quality / Maintenance

**[code-quality-audit]** | Priority: P1 | Scope: public 전 `src/`, tests, CLI 개선 포인트 audit

- Done Criteria:
  - `src/schema`, `src/compiler`, `src/templates/slides`, `src/design`, `src/cli`, `tests` 점검
  - low-risk fix와 post-public refactor 후보 분리
  - 즉시 수정하지 않을 항목은 maintenance backlog로 등록
- Verification: `npm run typecheck`, `npm test`, `npm run validate -- --blueprint examples/sample/blueprint.yaml`

---

**[contributing-license]** | Priority: P1 | Scope: public contributor 기본 문서 보강

- Done Criteria:
  - `LICENSE` Apache License 2.0 유지 확인
  - `CONTRIBUTING.md` 필요 여부 재검토
  - package metadata 확인
- Verification: 파일 존재 및 내용 리뷰

---

### P2 — Post-public Maintenance Candidates

**[layout-fine-tuning]** | Priority: P2 | Scope: 슬라이드 타입별 여백, 텍스트 크기, 카드 비율 미세 조정

**[cli-list-designs]** | Priority: P2 | Scope: `npm run list-designs`로 사용 가능한 design preset 목록 출력

**[preset-enterprise-clean]** | Priority: P3 | Scope: enterprise-clean design preset 추가

**[custom-preset-support]** | Priority: P3 | Scope: `--design custom/my-company` 형식 custom preset 디렉터리 지원

**[skill-validate-deck]** | Priority: P3 | Scope: layout, overlap, typography, editability 검증 skill

**[cli-convert-design]** | Priority: P3 | Scope: `npm run convert-design` — design.md → ppt-design.md CLI

**[mermaid-fallback]** | Priority: P3 | Scope: draft/appendix용 Mermaid 렌더링 fallback

**[npm-package-global-cli]** | Priority: P3 | Scope: npm package 공개 및 전역 CLI 제공

**[export-pdf-hardening]** | Priority: P3 | Scope: export-pdf edge case 강화

---

## Done

| ID | Title | actual_end |
| --- | --- | --- |
| FEAT-20260530-001 | default-modern preset + P1 slide render + PPTX CLI | 2026-05-30 |
| FEAT-20260530-002 | create-deck + initial generate-blueprint skill | 2026-05-31 |
| FEAT-20260531-001 | P2 slide type 구현 | 2026-05-31 |
| FEAT-20260531-002 | review-deck skill | 2026-05-31 |
| FEAT-20260531-003 | preset-aware deck creation + metadata/source input workflow | 2026-05-31 |
| FEAT-20260531-004 | export-pdf CLI + AI skill | 2026-05-31 |
| FEAT-20260531-005 | examples/strategy + examples/data-report | 2026-05-31 |
| FEAT-20260531-006 | generate-architecture-slide skill | 2026-05-31 |
| FEAT-20260531-007 | teal/vivid preset 고도화 | 2026-06-01 |
| FEAT-20260601-001 | vivid preset 고도화 | 2026-06-01 |
| FEAT-20260601-002 | Blueprint generation quality rules | 2026-06-01 |
| FEAT-20260601-003 | Showcase deck results | 2026-06-01 |
| FEAT-20260601-004 | Card inner horizontal padding | 2026-06-01 |
| FEAT-20260601-005 | General code block component | 2026-06-01 |
| FEAT-20260601-006 | Code syntax highlighting | 2026-06-01 |
| FEAT-20260601-007 | Code block polish | 2026-06-01 |
| FEAT-20260601-008 | Cross-platform first-run setup | 2026-06-01 |
| FEAT-20260601-009 | Timeline circular variant | 2026-06-01 |
| FEAT-20260601-010 | create-deck blueprint 규칙 내재화 | 2026-06-01 |
| FEAT-20260601-011 | create-deck skill 콘텐츠 정비 | 2026-06-01 |
| FEAT-20260601-012 | generate-blueprint canonical 파일 폐기 | 2026-06-01 |
