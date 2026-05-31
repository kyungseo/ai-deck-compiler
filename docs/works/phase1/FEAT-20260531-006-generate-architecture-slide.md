---
id: FEAT-20260531-006
title: "generate-architecture-slide skill — 자연어 아키텍처 설명 → architecture slide blueprint"
status: Done
actual_end: 2026-05-31
type: FEAT
created: 2026-05-31
branch: feature/FEAT-20260531-006-generate-architecture-slide
---

# FEAT-20260531-006 — generate-architecture-slide skill

## Goal

자연어로 된 기술 아키텍처 설명을 받아 유효한 `architecture` slide blueprint YAML(source: inline)을 생성하는 AI skill 문서를 작성한다.

컴포넌트 추출 → node kind 분류 → 토폴로지 분석 → zone 배치 → edge 관계 → groups → YAML 출력 + 자체 검증.

- 엔진 코드 변경 없음. Product skill 품질 개선만.
- `generate-blueprint`, `create-deck` 내부 호출 또는 단독 사용 모두 지원.
- Claude Code / Codex / Claude 채팅 세 경로 지원.

## Discovery

**Schema 제약 (hard constraint):**

| 항목 | 허용 값 |
|---|---|
| node.kind | service / database / queue / gateway / client / cloud / container / cache / storage / external |
| node.zone | top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right (left = center-left, right = center-right 별칭) |
| edge.kind | sync / async / bidirectional / data-flow |

**Layout 제약 (가독성 제약, schema가 아님):**

- 최대 9개 노드: 3×3 zone 그리드 — 10개 이상은 반드시 시각적 겹침 발생
- source: file은 실제 다이어그램으로 렌더링되지 않음 → skill 출력은 source: inline 원칙

**자체 검증 필수 항목:**

- node.id 중복 금지
- node.zone 중복 금지 (left/right alias 혼용에 주의)
- edge.from / edge.to 는 반드시 존재하는 node.id 참조

**토폴로지 패턴 → zone 배치 규칙 (skill의 핵심):**

| 패턴 | zone 배치 |
|---|---|
| 좌→우 흐름 | left → center → right (또는 center-left → center → center-right) |
| 상→하 계층 | top-center → center → bottom-center |
| 3-tier 레이어드 | 상단 3셀 / 중단 3셀 / 하단 3셀 |
| 허브-스포크 | hub = center, spoke = 주변 최대 8셀 |
| 복합 | 외부 시스템 가장자리, 핵심 서비스 center 부근 |

## Scope

### 신규 파일

| 파일 | 작업 |
|---|---|
| `skills/generate-architecture-slide.md` | 신규 canonical skill |
| `.claude/commands/generate-architecture-slide.md` | 신규 Claude Code wrapper (얇은 wrapper 원칙) |
| `.agents/skills/generate-architecture-slide/SKILL.md` | 신규 Codex wrapper (얇은 wrapper 원칙) |

### 기존 파일 업데이트

| 파일 | 작업 |
|---|---|
| `AGENTS.md` | 상단 skill 목록 문장 + Product Skill Routing 표에 `generate-architecture-slide` 추가 (English Only) |
| `prompts/codex-session-start.md` | AGENTS.md 없음 fallback에 generate-architecture-slide 케이스 추가 |
| `docs/SYSTEM-MANUAL.md` | §6.1 AI 진입점 표 + Product skills 표에 행 추가 |
| `docs/USER-MANUAL.md` | §4 AI 요청 방법 표에 `/generate-architecture-slide` 추가 + 자연어 요청 예시 추가 |
| `README.md` | 주요 기능 또는 AI workflow 설명에 architecture slide 보조 skill 한 줄 반영 |
| `skills/README.md` | 📋 backlog → ✅ 완료 + create-deck / generate-blueprint 호출 관계 명시 |

## Skill 절차 설계

```
Step 0 — 호출 컨텍스트 판별
  ├─ 단독 command: architecture slide snippet만 생성
  └─ create-deck / generate-blueprint 내부 호출:
       전체 deck 맥락에 맞게 title / notes / section_label 일관성 유지

Step 1 — 입력 수집
  ├─ 아키텍처 설명 없음 → 질의 후 대기
  └─ 있음 → Step 2

Step 2 — 컴포넌트 추출 + node kind 분류
  - 명사/시스템명을 node로 식별
  - kind 판단 기준표에 따라 분류
  - node.id 할당 (영문 소문자 kebab-case)

Step 3 — 토폴로지 분석 + 노드 수 확인
  - 흐름 방향 판별: LR / TB / hub-spoke / layered / mixed
  - 노드 수 > 9 → 병합/분리/별도 slide 분할 제안 후 사용자 확인

Step 4 — Zone 배치
  - 토폴로지 패턴 → zone 할당 규칙 적용
  - zone 중복 검사 (alias 포함)
  - left/right alias 사용 최소화, 명시적 3×3 zone 우선

Step 5 — Edge 추출
  - 관계 방향과 프로토콜 → edge.kind 분류
  - from/to node.id 유효성 검증

Step 6 — Groups 식별 (선택)
  - 논리적 묶음이 명확하면 groups 추가
  - node.id 기준으로 묶기

Step 7 — YAML 출력 + 자체 체크리스트 수행
  - source: inline architecture slide YAML 출력
  - 자체 검증: node id 중복 / zone 중복 / edge 참조 유효성
  - npm run validate 통과 방법 안내
```

## Done Criteria

- [x] `skills/generate-architecture-slide.md` — 8단계 절차(Step 0~7), node kind 분류 기준표, 토폴로지별 zone 배치 규칙, edge kind 선택 가이드, YAML 예시 3종 포함
- [x] `.claude/commands/generate-architecture-slide.md` wrapper 추가 (얇은 wrapper)
- [x] `.agents/skills/generate-architecture-slide/SKILL.md` wrapper 추가 (얇은 wrapper)
- [x] `AGENTS.md` 상단 skill 목록 문장 + Product Skill Routing 표 업데이트
- [x] `prompts/codex-session-start.md` fallback + AGENTS.md 있음 목록 모두 업데이트
- [x] `docs/SYSTEM-MANUAL.md` §6.1 AI 진입점 표 + Product skills 표 업데이트
- [x] `docs/USER-MANUAL.md` §4 AI 요청 표 + 자연어 요청 예시 추가
- [x] `README.md` 주요 기능 표에 architecture slide skill 추가
- [x] `skills/README.md` 업데이트 (완료 상태 + 호출 관계)
- [x] Verification: 아래 검증 입력으로 유효한 YAML 생성 + `npm run validate` 통과 + `npm run deck` PPTX 생성 확인

## Verification

**검증 입력:**
```
"API Gateway → Auth Service → User DB, Auth Service는 Cache를 사용하고 외부 Client가 Gateway를 호출"
```

**기대 결과:**
- nodes ≤ 9
- 모든 node.id unique
- 모든 node.zone unique
- 모든 edge.from / edge.to 가 존재하는 node.id 참조
- diagram.source: inline
- `npm run validate` 통과
- `npm run deck` PPTX 생성 (최소 샘플 1개)

## YAML 예시 3종 (skill 문서에 포함할 것)

1. **좌→우 3단 흐름** — Client → API Gateway → Service → DB (4노드)
2. **3-tier 레이어드** — Presentation / Application / Data 각 레이어 3노드 (9노드 최대)
3. **허브-스포크** — API Gateway(center) + 주변 서비스들

## Risks

| Risk | Mitigation |
|---|---|
| 노드 10개 초과 입력 | Step 3에서 명시적 병합/분리 협의 후 사용자 확인 필수 |
| kind 불명확 (e.g. "인증 서버") | kind 판단 기준표 상세 작성 (역할/위치/통신방식 기준) |
| left/right alias 혼용으로 zone 중복 | Step 4에서 alias 최소화 + zone 중복 체크 명시 |
| source: file 생성 시 렌더링 불가 | skill 첫 줄에 source: inline 원칙 명시 |

## Verification 결과 (2026-05-31)

```bash
npm run validate -- --blueprint blueprints/verify-architecture-skill.yaml
# ✅ Blueprint valid. slides: 2

npm run deck -- --blueprint blueprints/verify-architecture-skill.yaml --output output/verify-architecture-skill.pptx
# ✅ Output: output/verify-architecture-skill.pptx
```

자체 체크: source: inline ✅ / nodes 5 ≤ 9 ✅ / node.id unique ✅ / node.zone unique ✅ / edge from/to valid ✅
