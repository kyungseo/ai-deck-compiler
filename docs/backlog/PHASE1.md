# Product Backlog — Phase 1

## 상태 요약

| 항목 | 내용 |
| --- | --- |
| Phase | Phase 1 |
| 제품 목표 | blueprint.yaml + design preset → editable PPTX 일관 생성 |
| 주요 사용자 | AI-assisted presentation author |
| Phase 1 범위 | 엔진(compiler) + AI guided workflow(skills) + P2 slide types |
| 상태 | In Progress |

## Phase 1 목표

사용자가 repo를 clone한 뒤, AI와 대화하여 blueprint를 작성하고 editable PPTX를 생성하는 전체 워크플로우를 완성한다.

**핵심 흐름:**
```
사용자 의도 표현
  → AI가 목적·대상·구조 질의 (skill: generate-blueprint)
  → 슬라이드 구조 제안 및 승인
  → blueprint.yaml 초안 생성 및 검토 반복
  → npm run deck 실행 → PPTX 생성
  → AI 리뷰 및 재수정 반복 (skill: review-deck)
```

엔진(compiler, P1 slide 9종)은 완료. 남은 작업은 workflow layer와 P2 확장.

---

## Active Candidates

### P0 — 핵심 워크플로우 (엔진 가치를 실현하는 드라이버)

---

**[skill-create-deck]** | Priority: P0 | Scope: 사용자와 대화하며 blueprint 작성 후 PPTX 생성까지 안내하는 end-to-end interactive workflow

이 skill이 없으면 사용자는 blueprint.yaml을 직접 작성해야 한다. 이것이 Phase 1의 핵심 UX 목표다.

- Done Criteria:
  - `skills/create-deck.md` 작성 — Claude Code가 순서대로 실행할 수 있는 단계별 절차 포함
  - `.claude/commands/create-deck.md` 커맨드 파일 작성 — `/create-deck` 으로 진입 가능
  - 절차: ① 목적·청중·분량 파악 → ② 슬라이드 구조 제안 및 승인 → ③ blueprint.yaml 초안 작성 → ④ 사용자 검토·보완 반복 → ⑤ `npm run deck` 실행 → ⑥ 결과 확인 및 재수정
  - 각 단계에서 사용자 확인을 받고 다음 단계로 진행하는 구조
  - 예제 세션 로그 1개 포함 (예: Q2 엔지니어링 리뷰 PPT)
- Verification: Claude Code에서 `/create-deck` 실행 후 사용자 대화 없이 blueprint 초안이 생성되는지 확인
- Preconditions: P1 compiler 완료 (✅)

---

**[skill-generate-blueprint]** | Priority: P0 | Scope: 발표 목적·구조를 기반으로 blueprint.yaml 초안을 생성하는 AI skill 문서

- Done Criteria:
  - `skills/generate-blueprint.md` 작성
  - 포함 내용: 목적 파악 질의 목록, 슬라이드 타입 선택 가이드, blueprint.yaml 작성 규칙, 검토·보완 루프 절차
  - P1/P2 slide 타입별 적합한 사용 케이스 명시
- Verification: skill 문서를 Claude에 제공 후 실제 blueprint.yaml 생성 가능 여부 확인
- Preconditions: P1 compiler 완료 (✅)

---

### P1 — 워크플로우 완성 및 콘텐츠 확장

---

**[p2-slide-types]** | Priority: P1 | Scope: P2 slide 6종 구현 — section-divider, comparison, timeline, flow, decision, appendix

- Done Criteria:
  - `src/templates/slides/` 에 6종 renderer 추가 및 defaultRegistry 등록
  - 각 타입 blueprint 예제 포함
  - `npm test` 통과 (renderer test 포함)
  - sample.pptx 의 timeline, appendix placeholder가 실제 렌더링으로 교체
- Verification: `npm run deck -- --blueprint examples/sample/blueprint.yaml` 전체 슬라이드 정상 렌더링
- Preconditions: P1 compiler 완료 (✅)

---

**[skill-review-deck]** | Priority: P1 | Scope: 생성된 deck의 구조·메시지·디자인 일관성을 AI가 검토하는 skill 문서

- Done Criteria:
  - `skills/review-deck.md` 작성
  - 검토 항목: 슬라이드 흐름, 메시지 일관성, 텍스트 분량, 차트/표 데이터 명확성, 청중 적합성
  - 검토 결과를 blueprint 수정 제안 형식으로 출력하는 절차 포함
- Verification: skill 문서 기반으로 실제 deck 검토 후 actionable 수정 제안 생성 가능 여부 확인
- Preconditions: skill-create-deck 완료

---

---

### P1 — vivid 고도화

---

**[vivid-preset-enhancement]** `FEAT-20260601-001` | Priority: P1 | Scope: vivid callout bar + chart palette 심화

- Done Criteria: Work 파일 `docs/works/phase1/FEAT-20260601-001-vivid-preset-enhancement.md` 참조
- Verification: preview로 callout bar 시각 확인, teal/modern 회귀 없음
- Preconditions: FEAT-20260531-007 완료 (✅)

---

### P2 — 공개 repo 완성도 및 preset 확장

---

**[preset-minimal-dark]** | Priority: P2 | Scope: minimal-dark design preset 추가

- Done Criteria:
  - `src/design/presets/minimal-dark/tokens.json` 및 문서 4종 작성
  - `--design minimal-dark` CLI 옵션으로 선택 가능
  - 기존 테스트 영향 없음
- Verification: `npm run deck -- --design minimal-dark` 정상 실행
- Preconditions: P1 compiler 완료 (✅)

---

**[cli-list-designs]** | Priority: P2 | Scope: `npm run list-designs` — 사용 가능한 design preset 목록 출력 CLI

- Done Criteria:
  - `src/cli/list-designs.ts` 구현
  - `src/design/presets/` 디렉토리를 스캔하여 preset 이름과 지원 theme 출력
  - `npm run list-designs` script 추가
- Verification: `npm run list-designs` 실행 시 default-modern (light, dark) 등 목록 출력
- Preconditions: P1 compiler 완료 (✅)

---

**[public-repo-docs]** | Priority: P2 | Scope: CONTRIBUTING.md, LICENSE, README 보완 (limitations, roadmap, skill 사용법)

- Done Criteria:
  - `CONTRIBUTING.md` — 개발 환경 설정, 테스트 실행, PR 가이드
  - `LICENSE` — MIT
  - `README.md` 보완: limitations, roadmap, skill 사용법, custom design 추가 방법
  - `README.md` + `docs/USER-MANUAL.md` 환경 설정 섹션 보강:
    - Pretendard 폰트 설치 안내 (macOS: `brew install --cask font-pretendard`, Windows: 수동 설치 링크)
    - PowerPoint 또는 LibreOffice Impress 필요 여부 명시
    - preview CLI 선택 의존성 안내 (LibreOffice + poppler/pdftoppm): macOS Homebrew, Windows Scoop/winget, Linux apt 설치 명령
    - clone 후 실행 체크리스트 (font → npm install → typecheck → test → validate)
- Verification: 파일 존재 및 내용 검토
- Preconditions: 없음

---

**[skill-convert-design-system]** | Priority: P2 | Scope: HTML/CSS design.md → ppt-design.md 변환 AI skill 문서

- Done Criteria:
  - `skills/convert-design-system.md` 작성
  - 변환 규칙: 웹 단위(px/rem) → PPT 단위(pt/inch), color token 추출, 폰트 fallback 처리
  - 변환 결과 검토 절차 포함
- Verification: 샘플 design.md 입력 시 ppt-design.md 초안 생성 가능 여부 확인
- Preconditions: 없음

---

---

### P3 — 장기 확장

---

**[public-repo-cleanup]** | Priority: P2 | Scope: public 전환 전 repo 경량화 + contributor 최적화 — **remote repo 생성 직전 별도 branch에서 수행**

> harness를 전면 제거하지 않는다. public 이후에도 AI 기반 유지보수가 계속되므로 harness workflow는 유지한다.
> 대신 "내부 상태 파일"은 정리하고, AI surface는 외부 contributor 친화적으로 재작성한다.
> harness 문서 자체는 "AI로 개발하는 방법"으로 포지셔닝 — 오픈소스 차별화 요소로 활용.

- Done Criteria:
  - **제거 (public 가치 없는 내부 상태):**
    - `docs/works/` — 완료된 작업 내역 제거 또는 archive
    - `docs/backlog/` — 내부 todo 제거 또는 `.dev/` 하위로 이동
    - `docs/retrospectives/` — 제거
    - `prompts/` — 제거
    - `docs/BOOTSTRAP.md` — 이미 완료된 부팅 절차, 제거
  - **유지 (설계 철학 공개, 오픈소스 강점):**
    - `docs/PLAN.md`, `PLAN-SUMMARY.md`, `SYSTEM-MANUAL.md`, `USER-MANUAL.md`
    - `docs/decisions/` — DR-014(언어정책) 등 product 관련 유지. harness 전용(DR-007, 008, 013)은 archive
    - `docs/STATUS.md` — 현재 개발 상태 공개 (많은 OSS 프로젝트가 이 형태 사용)
    - `skills/` — 이 repo의 핵심 AI workflow 기능
    - `.claude/commands/create-deck.md` — 핵심 product command
  - **재작성 (contributor 최적화):**
    - `CLAUDE.md` → 내부 harness 운영 규칙 대신 "이 repo를 AI로 기여하는 방법" 중심으로 재작성
    - `AGENTS.md` → 동일 방향으로 재작성
    - `.claude/commands/` harness 전용 커맨드(start, pick, work, close 등)는 숨김 또는 간소화
  - `npm test`, `npm run typecheck`, `npm run validate` 통과
- Verification: 외부 contributor가 clone 후 CLAUDE.md만 읽고 기여 방법을 파악할 수 있는지 확인
- Preconditions: remote repo 생성 직전. 개발 안정화 완료 후.

---

**[slide-layout-fine-tuning]** | Priority: P2 | Scope: 슬라이드 타입별 레이아웃 미세 조정 — 여백, 텍스트 크기, 카드 비율 등 실제 PPTX 확인 후 조정 |
**[pptx-document-metadata]** | Priority: P2 | Scope: PPTX 문서 속성(제목·저자·회사) 설정 — pptxgenjs 기본값("PptxGenJS") 대신 `deck.title`, `deck.author`/`brand.author`, `deck.version`으로 채우기 (`pptx.title`, `pptx.author`, `pptx.company`, `pptx.revision`) |
**[preset-enterprise-clean]** | Priority: P3 | Scope: enterprise-clean design preset 추가 |
**[custom-preset-support]** | Priority: P3 | Scope: `--design custom/my-company` 형식 custom preset 디렉터리 지원 |
**[skill-validate-deck]** | Priority: P3 | Scope: layout, overlap, typography, editability 검증 skill |
**[cli-convert-design]** | Priority: P3 | Scope: `npm run convert-design` — design.md → ppt-design.md CLI |
**[mermaid-fallback]** | Priority: P3 | Scope: draft/appendix용 Mermaid 렌더링 fallback |
**[pef-cli-global]** | Priority: P3 | Scope: npm package 공개 및 `pef` 전역 설치 |
**[export-pdf-hardening]** | Priority: P3 | Scope: `export-pdf.ts` edge case 강화 — `.pptx` 확장자 미검증 시 친절한 오류 메시지, 대문자 `.PPTX` 처리 |

---

## Done

| ID | Title | actual_end |
| --- | --- | --- |
| FEAT-20260530-001 | Work 2 — default-modern preset + P1 slide render + PPTX CLI | 2026-05-30 |
| vitest-security-upgrade | vitest 3.x 업그레이드 — Dependabot 취약점 2건 해소 | 2026-05-31 |
| examples-expanded | examples/strategy + examples/data-report 추가 | 2026-05-31 |
| repo-rebranding | ai-deck-compiler 리브랜딩 — README 업데이트, GitHub remote/About/Topics 설정, 디렉터리 정리 | 2026-05-31 |
| FEAT-20260531-006 | generate-architecture-slide skill — 자연어 설명 → architecture slide diagram spec 생성 | 2026-05-31 |
| skill-create-deck | create-deck end-to-end interactive workflow skill | 2026-05-31 |
| skill-generate-blueprint | generate-blueprint skill 문서 | 2026-05-31 |
| p2-slide-types | P2 slide 6종 구현 — timeline, flow, decision, comparison, section-divider, appendix | 2026-05-31 |
| skill-review-deck | review-deck AI skill 문서 | 2026-05-31 |
| pptx-document-metadata | PPTX 문서 속성 설정 — title/author/company/revision (compiler.ts 구현 완료) | 2026-05-31 |
| FEAT-20260531-007 | Design Preset 고도화 — teal/vivid 추가, section_label chip, hero accent line | 2026-06-01 |
