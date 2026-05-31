# System Manual — Presentation Compiler

> 이 문서는 시스템 설계자(사용자) 관점의 아키텍처·결정·철학 기록이다.
> 사용자 매뉴얼은 `docs/USER-MANUAL.md`, 제품 요약은 `docs/PLAN-SUMMARY.md` 참조.

---

## 1. 이 시스템이 존재하는 이유

### 문제

AI에게 "PPT 만들어줘"라고 하면:
- 매번 다른 레이아웃이 나온다
- 차트·도형이 이미지로 삽입되어 편집 불가
- AI가 x/y 좌표를 임의로 결정해서 디자인이 무너진다
- 디자인 시스템과 실제 결과물이 따로 논다

### 해결 방향

```
AI는 의도(What)를 작성하고
엔진은 형태(How)를 만든다
```

- AI → `blueprint.yaml` 작성 (무엇을 보여줄 것인가)
- 엔진 → `blueprint + design preset` → editable PPTX (어떻게 보여줄 것인가)

---

## 2. 핵심 설계 원칙

### 원칙 1: 레이아웃 무결성 (Layout Integrity)

같은 blueprint를 실행하면 언제나 동일한 PPTX가 나온다.
좌표·크기·간격은 규칙에 따라 계산된다. AI가 숫자를 추측하지 않는다.
blueprint.yaml 한 줄을 바꾸면 PPTX에서 정확히 그 부분만 바뀐다.

**실무적 의미:** PPT가 코드처럼 diff 가능하다. 팀원이 같은 blueprint를 실행하면 같은 결과가 나온다.

### 원칙 2: AI-Native 경계

| AI의 역할 | 엔진의 역할 |
| --- | --- |
| 슬라이드 구조 결정 | 레이아웃 규칙 적용 |
| 텍스트·데이터 작성 | 좌표 계산 |
| diagram node 배치 지정 (zone) | shape 렌더링 |
| blueprint.yaml 생성 | PPTX 파일 생성 |

AI 금지 사항: x/y 좌표 직접 결정, 미등록 layout 발명, 슬라이드를 이미지로 렌더링

### 원칙 3: Editable 우선

모든 출력 요소는 PowerPoint에서 편집 가능해야 한다.
텍스트, 차트, 표, 도형 모두 native XML. 스크린샷·이미지 삽입 금지.

### 원칙 4: Design System 일관성

token 하나를 바꾸면 전체 deck의 해당 스타일이 일괄 변경된다.
design preset을 교체하면 내용은 그대로이고 스타일만 바뀐다.

---

## 3. 파이프라인 아키텍처

```
사용자 의도
  ↓ [AI guided — skills/create-deck.md]
blueprint.yaml
  ↓
Schema Validation (Zod — src/schema/blueprint.ts)
  ↓
Parser (src/compiler/parser.ts)
  ↓
Compiler (src/compiler/compiler.ts)
  ↓ deck metadata → PPTX document properties
  ↓ design preset 로딩 (src/design/resolver.ts)
  ↓ TemplateRegistry 조회 (src/templates/registry.ts)
  ↓ 각 슬라이드 render 함수 실행
  ↓ Brand footer + Page number 추가
pptxgenjs
  ↓
Editable PPTX
```

### 핵심 컴포넌트

| 컴포넌트 | 경로 | 역할 |
| --- | --- | --- |
| Schema | `src/schema/blueprint.ts` | Zod 기반 blueprint 유효성 검사 |
| Parser | `src/compiler/parser.ts` | YAML → Blueprint 객체 |
| Resolver | `src/design/resolver.ts` | preset → ResolvedDesignTokens |
| Compiler | `src/compiler/compiler.ts` | Blueprint + tokens → pptxgenjs |
| TemplateRegistry | `src/templates/registry.ts` | slide type → render 함수 매핑 |
| Layout helpers | `src/templates/layout.ts` | SL 상수, hex(), zoneCenter() |

---

## 4. Blueprint 시스템

### 형식 결정: YAML (Markdown DSL 대신)

**결정 근거:** 초기 v2 설계는 markdown 기반 blueprint.md를 제안했으나 v3에서 YAML로 확정.
`blueprint.yaml`은 user-facing 기획/검토 산출물 이름을 유지하지만,
시스템 내부에서는 Deck Specification DSL로 취급한다.
`deck.spec.yaml` rename은 생태계 영향이 큰 major change 후보이며,
`deck.manifest.yaml`은 향후 assets/source/output version mapping 분리 시 검토한다.

YAML 선택 이유:
- Schema validation (Zod discriminated union)이 용이
- AI가 생성하기 쉬운 구조적 형식
- JSON Schema 자동 생성 가능 (`npm run schema`)
- 사람이 읽고 수정 가능

### Slide 타입 체계

| 구분 | 타입 목록 |
| --- | --- |
| P1 (구현 완료) | hero, agenda, content, two-column, kpi, table, chart, architecture, summary |
| P2 (구현 완료) | section-divider, comparison, timeline, flow, decision, appendix, closing |

### Zone-based 다이어그램

architecture 슬라이드의 AI-friendly 핵심 설계.
AI가 node를 zone으로 지정하면 엔진이 좌표를 계산한다.

```
3×3 그리드:
top-left    top-center    top-right
center-left    center    center-right
bottom-left bottom-center bottom-right
+ left, right (center-left/right 별칭)
```

**버그 이력:** 역방향 엣지(right→left, bottom→top)가 음수 cx/cy를 생성하여 OOXML 위반.
→ `Math.abs()` + `flipH/flipV` 정규화로 수정. (`docs/troubleshooting/pptx-negative-cx-powerpoint-repair.md`)

---

## 5. Design System

### Design Preset 구조

```
src/design/presets/{preset-name}/
  tokens.json          — 색상·타이포·spacing·shapes·brand 토큰
  ppt-design.md        — 디자인 시스템 개요
  ppt-components.md    — 컴포넌트 명세
  ppt-layouts.md       — 슬라이드 타입별 레이아웃
  ppt-chart-rules.md   — 차트 규칙
```

### 기본 Preset: default-modern

방향: modern, minimal, technical, AI-native
Canvas: 13.33" × 7.5" (LAYOUT_WIDE 16:9)
Font: Pretendard
Theme: light / dark

### Visual Density 원칙

슬라이드 하단 30%를 비우지 않는다.
비어 보이면 다음 중 하나 추가:
1. Key Takeaway box — accent 색상 강조 박스
2. Caption / Source — 데이터 출처 또는 핵심 문장
3. Accent bar — 얇은 colored bar (구분선)

### Brand 시스템

각 preset은 `brand` 섹션을 갖는다.

```json
{
  "brand": {
    "name": "Presentation Compiler",
    "show": true,
    "showPageNumbers": true,
    "fontSize": 10
  }
}
```

- 기본 preset의 브랜드: "Presentation Compiler" (footer 우측)
- 페이지 번호: footer 좌측 (표지 제외)
- 커스텀 preset에서 `brand.name`을 회사명으로 덮어쓸 수 있음

### Custom Preset 생성

사용자는 자신의 회사 브랜드로 custom preset을 만들 수 있다.
AI가 다음 reference material을 분석하여 tokens.json을 생성한다:

- 회사 PPT 스크린샷 (Claude Code에 이미지 첨부)
- 브랜드 가이드라인 문서
- 기존 .pptx 템플릿의 색상·폰트 정보

절차: `skills/customize-preset.md` 참조

---

## 6. AI Skills 아키텍처

### Skills 설계 철학 (from /doc command)

Blueprint-First Policy: 최종 PPTX 전에 blueprint를 먼저 검토·승인한다.
AI는 content를 만들고, 엔진이 형태를 만든다.

`create-deck`는 사용자 입력 방식을 먼저 판별한다.

| Mode | 역할 |
| --- | --- |
| brief-first | 짧은 주제·목적을 질문으로 보강해 구조화 |
| source-first | markdown/file/source를 요약하고 narrative spine과 slide plan으로 변환 |
| AI-research-first | research 범위와 출처 기준을 확인한 뒤 content draft 작성 |

`generate-blueprint`는 구조가 결정된 뒤 blueprint 작성에 집중한다.
source 처리와 구조 결정은 `create-deck` 책임이다.

### Slide 콘텐츠 품질 기준 (from /doc command)

**Action Title 원칙**
슬라이드 제목은 결론을 담은 선언형 문장이어야 한다.
- ✗ "Q2 성과"
- ✓ "배포 빈도 4배 향상으로 Q2 목표 초과 달성"

**Story Arc (기승전결)**
| 구간 | 역할 |
| --- | --- |
| 기 (Context) | 배경·현황 객관적 제시 |
| 승 (Complication) | 한계·Pain Point 심화 |
| 전 (Resolution) | 해결책·전략 제시 |
| 결 (Impact) | 수치 기대효과 + Next Step |

**Narrative Spine**
blueprint 작성 전 전체 스토리를 5~10문장으로 요약한다.
슬라이드를 보기 전에 흐름의 정합성을 확인하는 단계.

### Skills 목록

| Skill | 파일 | 상태 |
| --- | --- | --- |
| create-deck | `skills/create-deck.md` | ✅ 완료 |
| generate-blueprint | `skills/generate-blueprint.md` | ✅ 완료 |
| review-deck | `skills/review-deck.md` | ✅ 완료 |
| customize-preset | `skills/customize-preset.md` | 📄 문서 완료 (end-to-end 검증 미완) |
| generate-architecture-slide | *(예정)* | P1 backlog |
| convert-design-system | *(예정)* | P2 backlog |
| validate-deck | *(예정)* | P3 backlog |

### Claude Code Commands

| 커맨드 | 파일 | 역할 |
| --- | --- | --- |
| `/create-deck` | `.claude/commands/create-deck.md` | 대화식 PPT 생성 |
| `/review-deck` | `.claude/commands/review-deck.md` | deck 검토 + blueprint 수정 제안 |
| `/generate-blueprint` | `.claude/commands/generate-blueprint.md` | blueprint.yaml 초안 생성 |

---

## 7. 주요 기술 결정

| 결정 | 선택 | 이유 |
| --- | --- | --- |
| PPTX 렌더링 엔진 | pptxgenjs | Editable output, native chart, TypeScript-friendly |
| Blueprint 형식 | YAML (blueprint.yaml) | Schema validation, AI 생성 친화, JSON Schema 자동 생성 |
| Schema 검증 | Zod | TypeScript-first, discriminated union 지원 |
| 다이어그램 배치 | Zone-based | AI가 좌표 추측 없이 논리적 위치 지정 가능 |
| Python-pptx 미채택 | — | pptxgenjs가 Node.js 기반으로 통합 단순, TypeScript 타입 안전성 |
| Markdown DSL 미채택 | — | YAML이 schema validation에 유리, AI 생성 정확성 높음 |
| Font | Pretendard | 한/영 통합, 설치 확인, technical 문서에 어울림 |

---

## 8. CLI 참조

| 명령 | 역할 |
| --- | --- |
| `npm run validate -- --blueprint <path>` | blueprint 유효성 검사 |
| `npm run deck -- --blueprint <path> --design <name> --theme light\|dark --output <path>` | PPTX 생성 |
| `npm run schema` | schemas/blueprint.schema.json 재생성 |
| `npm test` | 전체 테스트 (43 tests) |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run list-designs` | *(예정)* 사용 가능한 preset 목록 |

---

## 9. 구현 현황 및 로드맵

### 완료

- ✅ P1 slide 9종 renderer (hero, agenda, content, two-column, kpi, table, chart, architecture, summary)
- ✅ P2 slide 7종 renderer (section-divider, comparison, timeline, flow, decision, appendix, closing)
- ✅ default-modern design preset (light/dark)
- ✅ zone-based layout engine
- ✅ blueprint.yaml Schema (Zod + JSON Schema)
- ✅ CLI: validate, deck, schema
- ✅ PPTX document properties metadata 반영
- ✅ 테스트 43개 (parser, renderer, snapshot)
- ✅ Skills: create-deck, generate-blueprint, review-deck
- ✅ README, USER-MANUAL

### 예정 (PHASE1.md backlog)

- ⬜ skills: generate-architecture-slide
- ⬜ preset: minimal-dark, enterprise-clean
- ⬜ CLI: list-designs
- ⬜ CONTRIBUTING.md, LICENSE
- ⬜ pef CLI 전역 설치 (Post-MVP)

---

## 10. 참고 문서

| 문서 | 역할 |
| --- | --- |
| `docs/USER-MANUAL.md` | 사용자 매뉴얼 |
| `docs/PLAN-SUMMARY.md` | 제품 요약 및 Implementation Baseline |
| `docs/backlog/PHASE1.md` | Phase 1 작업 후보 목록 |
| `docs/troubleshooting/` | 이슈 해결 기록 |
| `temp/work-plans/10-ai-native-pt-engineering-framework-3.md` | 원본 프로젝트 정의서 |
| `skills/` | AI agent skill 문서 |
| `src/design/presets/default-modern/ppt-design.md` | 디자인 시스템 상세 |
