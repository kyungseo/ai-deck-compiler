# PLAN.md — Presentation Compiler

> 요약: `docs/PLAN-SUMMARY.md`
> 원본 프로젝트 정의: `temp/work-plans/10-ai-native-pt-engineering-framework-3.md`

---

## 목표

blueprint.yaml + design preset → Editable PPTX를 규칙 기반으로 컴파일하는 AI-Native 엔진을 구축한다.

**핵심 원칙: AI writes intent. Code renders layout.**

- AI는 `blueprint.yaml`을 작성한다 (무엇을 보여줄 것인가)
- 엔진은 `blueprint + design preset`을 컴파일하여 editable PPTX를 생성한다 (어떻게 보여줄 것인가)
- 같은 blueprint를 실행하면 언제나 동일한 PPTX가 나온다 (규칙 기반 렌더링)
- AI는 x/y 좌표를 결정하지 않는다. 레이아웃은 규칙 기반이다.

**성공 기준:**
1. `blueprint.yaml` → editable PPTX 일관 생성 (같은 입력 = 같은 결과)
2. AI가 x/y 좌표를 결정하지 않음. 모든 좌표는 엔진이 규칙으로 계산
3. 모든 출력 요소(텍스트, 차트, 표, 도형)가 PowerPoint에서 native 편집 가능
4. Design preset 교체만으로 전체 덱 스타일 변경 가능

---

## Project Initialization Plan

### Stack Choices

이 프로젝트의 핵심 제약: editable PPTX를 TypeScript 에코시스템에서 규칙 기반으로 생성해야 한다.

| 영역 | 선택 | 결정 근거 |
| --- | --- | --- |
| Language | TypeScript | 타입 안전성, AI 코드 생성 친화적, discriminated union으로 15종 slide type 표현 |
| Runtime | Node.js 18+ | pptxgenjs가 Node.js 기반. Python-pptx 대신 Node.js로 단일 스택 통합 |
| PPTX 렌더링 | pptxgenjs ^3.12 | Editable output (native XML), native chart/table/shape, TypeScript-friendly API, 규칙 기반 렌더링 |
| Schema 검증 | zod ^3.23 | TypeScript-first, discriminated union으로 slide type별 schema 분기, JSON Schema 자동 생성 가능 |
| YAML 파싱 | yaml ^2.4 (eemeli) | YAML 1.2 지원, TypeScript-friendly, 경량 |
| 테스트 | vitest ^1 | Vite 기반, TypeScript 직접 실행, 빠른 HMR, snapshot 테스트 내장 |
| CLI 실행 | tsx ^4 | TypeScript를 빌드 없이 직접 실행, 개발 속도 우선 |

**채택하지 않은 선택지:**

| 검토 항목 | 미채택 이유 |
| --- | --- |
| Python-pptx | Python 런타임 추가. TypeScript 단일 스택을 깨는 비용이 큼 |
| Markdown DSL (blueprint.md) | Schema validation 불가. AI 생성 시 구조 오류 감지 어려움 |
| Mermaid (기본 경로) | 렌더링 결과가 이미지. Editable 원칙 위반. Draft/appendix fallback으로만 허용 |
| Keynote 지원 | MVP 범위 초과. Post-MVP roadmap으로 이동 |
| `deck.output` 필드 | blueprint와 CLI 관심사 혼재. CLI `--output` 옵션으로 분리 |

### Initial Structure

```
presentation-compiler/
├── src/
│   ├── schema/
│   │   ├── blueprint.ts          # Zod schema (15 slide types, discriminated union)
│   │   └── diagram-spec.ts       # SemanticDiagramSpec standalone schema
│   ├── compiler/
│   │   ├── types.ts              # NormalizedSlide, ResolvedDesignTokens, BrandToken
│   │   ├── parser.ts             # YAML → Blueprint (zod.parse)
│   │   └── compiler.ts           # Blueprint + tokens → pptxgenjs → PPTX
│   ├── templates/
│   │   ├── registry.ts           # TemplateRegistry — slide type → render 함수 매핑
│   │   ├── layout.ts             # SL 상수, CARD 상수, hex(), zoneCenter(), 공통 render helpers
│   │   ├── index.ts              # 모든 template 등록 (명시적, auto-loader 없음)
│   │   └── slides/               # slide type별 render 구현 (11종)
│   ├── design/
│   │   ├── resolver.ts           # preset → ResolvedDesignTokens
│   │   └── presets/
│   │       └── default-modern/   # 기본 design preset
│   │           ├── tokens.json
│   │           ├── ppt-design.md
│   │           ├── ppt-components.md
│   │           ├── ppt-layouts.md
│   │           └── ppt-chart-rules.md
│   └── cli/
│       ├── validate.ts           # npm run validate
│       ├── deck.ts               # npm run deck
│       └── preview.ts            # npm run preview (PPTX → PNG, LibreOffice + pdftoppm)
│
├── scripts/
│   └── gen-blueprint-schema.ts   # Zod → JSON Schema 생성 (npm run schema)
│
├── schemas/
│   └── blueprint.schema.json     # 자동 생성 (npm run schema)
│
├── tests/
│   ├── blueprint.test.ts         # Parser + schema validation (29 tests)
│   ├── renderer.test.ts          # Renderer 구조 검사 (5 tests)
│   └── snapshot.test.ts          # PPTX XML 구조 snapshot (5 tests)
│
├── examples/
│   ├── basic/blueprint.yaml      # 6-slide light theme
│   ├── architecture/blueprint.yaml # 5-slide dark theme, zone-based diagram
│   └── sample/blueprint.yaml     # 전체 타입 샘플 8-slide
│
├── blueprints/                   # 사용자 blueprint 위치 (.gitignore)
├── output/                       # 생성된 PPTX (.gitignore)
├── temp/                         # 작업 파일, 참고 자료 (.gitignore)
│
├── package.json
├── tsconfig.json                 # ES2022, strict, bundler resolution
└── .gitignore
```

**실행 entrypoint:**

```bash
npm run validate -- --blueprint <path>     # schema 검사
npm run deck -- --blueprint <path> \       # PPTX 생성
  --design default-modern \
  --theme light|dark \
  --output <path>
npm run preview -- --out <dir>             # PPTX → PNG (선택 도구 필요)
npm run schema                             # JSON Schema 재생성
npm test                                   # vitest 전체 실행
npm run typecheck                          # tsc --noEmit
```

### Dependency Rationale

**Runtime dependencies:**

| 패키지 | 버전 | 역할 | 선택 이유 |
| --- | --- | --- | --- |
| pptxgenjs | ^3.12 | PPTX 생성 | Node.js 기반, editable XML 출력, chart/table/shape native 지원 |
| zod | ^3.23 | Schema 검증 | TypeScript-first, discriminated union, JSON Schema 자동 생성 |
| yaml | ^2.4 | YAML 파싱 | YAML 1.2, eemeli 구현, TypeScript-friendly |

**Dev dependencies:**

| 패키지 | 버전 | 역할 |
| --- | --- | --- |
| vitest | ^1 | 테스트 프레임워크 |
| tsx | ^4 | TypeScript 직접 실행 (빌드 없이 CLI 개발) |
| typescript | ^5 | TypeScript 컴파일러 |
| zod-to-json-schema | ^3.25 | Zod → JSON Schema 변환 |
| jszip | ^3.10 | PPTX(zip) 내부 XML 파싱 (editable object 검증 테스트용) |

**의존성 추가 기준:**

1. Runtime 의존성: editable PPTX 생성 파이프라인에 필수인 경우에만 추가
2. Dev 의존성: 테스트, 타입 지원, 개발 도구에만 추가
3. 외부 CLI 도구(LibreOffice, pdftoppm): preview 기능에만 필요. optional, 설치 안내만 제공, repo 의존성 불포함

### Phase 1 Readiness Checklist

- [x] Runtime / Language 확정 — Node.js 18+, TypeScript
- [x] Framework / Library 확정 — pptxgenjs ^3.12, zod ^3.23, yaml ^2.4, vitest ^1, tsx ^4
- [x] Build tool 확정 — tsconfig.json (ES2022, strict, bundler resolution)
- [x] Base package / Module 확정 — src/ (schema/, compiler/, templates/, design/, cli/)
- [x] Data storage 확정 또는 Not Applicable — Not Applicable (file-based: blueprint.yaml, tokens.json)
- [x] Profiles / Environments 확정 — Not Applicable (CLI flags로 대체)
- [x] Verification defaults 확정 — typecheck, test, validate

---

## 기술 스택 선택 근거

### 핵심 설계 결정

#### 1. Blueprint 형식: YAML (Markdown DSL 미채택)

v2 설계 초안은 blueprint.md (markdown DSL) 방식을 제안했으나 v3에서 YAML로 확정.

YAML 채택 이유:
- Zod discriminated union으로 15종 slide type을 타입 안전하게 검증 가능
- `zod-to-json-schema`로 JSON Schema 자동 생성 → IDE 자동완성 지원
- AI가 구조적 형식을 일관되게 생성하기 쉬움 (Markdown DSL은 파서 구현 비용 및 오류 가능성)
- 사람이 읽고 직접 수정 가능한 수준의 가독성

`blueprint.md`는 AI prompt template, 문서, 가이드 목적으로만 사용한다.

#### 2. PPTX 렌더링: pptxgenjs (python-pptx 미채택)

- 단일 Node.js 스택 유지 (Python 런타임 추가 불필요)
- TypeScript API로 타입 안전한 PPTX 생성
- native chart, table, shape를 editable XML로 생성 (이미지 아님)
- 규칙 기반 렌더링: 같은 API 호출 순서 → 같은 XML 구조

#### 3. 다이어그램 배치: Zone-based (절대 좌표 미사용)

AI가 node를 `zone`으로 지정하면 엔진이 좌표를 계산한다.

```
3×3 그리드 zone 목록:
top-left    top-center    top-right
center-left    center    center-right
bottom-left bottom-center bottom-right
+ left (= center-left), right (= center-right) 별칭
```

- AI가 숫자를 추측할 필요 없음
- 규칙 기반: zone → 좌표 공식이 고정됨
- 이력: 역방향 엣지(right→left)에서 음수 cx가 OOXML 위반 → `Math.abs()` + `flipH/flipV` 정규화로 수정
  (참조: `docs/troubleshooting/pptx-negative-cx-powerpoint-repair.md`)

#### 4. Template Registry: 명시적 등록 (auto-loader 미채택)

- `src/templates/index.ts`에서 명시적으로 모든 template 등록
- 미등록 type 요청 시 compile error (silent fallback 없음)
- 각 template: `id`, `supportedType`, `variants[]`, `render(slide, tokens, pptxSlide) => void`
- variant는 slide type당 최대 4개

#### 5. Design System: token 기반 preset

```json
{
  "colors": { "accent": "4F46E5", "bg-light": "F9F9F9", ... },
  "typography": { "title": { "size": 40, "bold": true, "font": "Pretendard" }, ... },
  "spacing": { ... },
  "shapes": { "service": "roundRect", "database": "cylinder", ... },
  "brand": { "name": "Presentation Compiler", "show": true, ... }
}
```

- token 하나를 바꾸면 전체 deck의 해당 스타일이 일괄 변경됨
- preset 교체 → 내용 그대로, 스타일만 변경
- light / dark theme: `tokens.json`의 `colors.light` / `colors.dark` 섹션

#### 6. Font: Pretendard

- 한/영 통합 폰트, 기술 문서·프레젠테이션에 적합
- system sans-serif fallback 체인 병기
- PPT 기준 pt 단위 사용 (웹 px 기준 아님)

---

## 아키텍처 상세

### 파이프라인

```
사용자 의도
  ↓ [AI guided — skills/create-deck.md]
blueprint.yaml
  ↓
Schema Validation (Zod — src/schema/blueprint.ts)
  ↓ 실패: 오류 메시지 출력 후 종료
Parser (src/compiler/parser.ts)
  ↓ YAML → Blueprint 객체
Compiler (src/compiler/compiler.ts)
  ↓ design preset 로딩 (src/design/resolver.ts)
  ↓ pptxgenjs 인스턴스 생성
  ↓ 각 slide: TemplateRegistry 조회 → render 함수 실행
  ↓ brand footer + page number 추가
pptxgenjs
  ↓
Editable PPTX (output/*.pptx)
```

### 핵심 컴포넌트

| 컴포넌트 | 경로 | 역할 |
| --- | --- | --- |
| Schema | `src/schema/blueprint.ts` | Zod discriminated union, 15 slide type 검증 |
| Parser | `src/compiler/parser.ts` | YAML 파일 → Blueprint 객체 (zod.parse) |
| Resolver | `src/design/resolver.ts` | preset name + theme → ResolvedDesignTokens |
| Compiler | `src/compiler/compiler.ts` | Blueprint + tokens → pptxgenjs → PPTX 저장 |
| TemplateRegistry | `src/templates/registry.ts` | slide type → render 함수 매핑. 미등록 type → 즉시 오류 |
| Layout helpers | `src/templates/layout.ts` | SL/CARD 상수, hex(), zoneCenter(), renderSectionHeader(), renderCardBackground(), renderPanelLabel() |

### 주요 타입

```typescript
// ResolvedDesignTokens (src/compiler/types.ts)
type ResolvedDesignTokens = {
  colors: Record<string, string>;       // hex 문자열 (# 없음)
  typography: Record<string, TypographyToken>;
  spacing: Record<string, number>;
  slideSize: { width: number; height: number };
  shapes: Record<string, string>;       // node kind → pptxgenjs shape name
  brand: BrandToken;
};

// BrandToken
type BrandToken = {
  name: string;
  show: boolean;
  showPageNumbers: boolean;
  fontSize: number;
  author: string;        // default: "박경서 (Kyungseo.Park@gmail.com)"
};
```

### Layout 상수 (src/templates/layout.ts)

```typescript
// Slide dimensions (inches)
const SL = {
  w: 13.33, h: 7.5,       // LAYOUT_WIDE 16:9
  mx: 0.5,  my: 0.4,       // outer margin
  cx: 0.5,  cy: 1.75,      // content area start
  cw: 12.33,               // content width (w - 2*mx)
  ty: 0.35, th: 0.82,      // section header (label + title) area
};

// Card area (모든 content slide 공통)
const CARD = {
  x: 0.5, y: 1.75,         // card background top-left
  w: 12.33, h: 5.1,
  iy: 2.05, ih: 4.65,      // inner content area (with padding)
};
```

### Design Preset 구조

```
src/design/presets/{preset-name}/
  tokens.json          — 색상·타이포·spacing·shapes·brand 토큰
  ppt-design.md        — 디자인 시스템 개요 및 원칙
  ppt-components.md    — 컴포넌트 명세 (card, badge, panel 등)
  ppt-layouts.md       — 슬라이드 타입별 레이아웃 spec
  ppt-chart-rules.md   — 차트 타입, 데이터 형식, 시각화 규칙
```

현재 구현된 preset: `default-modern` (light / dark theme)

### Slide Type 체계

| 구분 | 타입 목록 | 상태 |
| --- | --- | --- |
| P1 | hero, agenda, content, two-column, kpi, table, chart, architecture, summary | ✅ 구현 완료 |
| P2 | section-divider, comparison | ✅ 구현 완료 |
| P2 (예정) | timeline, flow, decision, appendix | 미구현 |

### 테스트 전략

| 테스트 종류 | 파일 | 목적 |
| --- | --- | --- |
| Blueprint Parser Test | `tests/blueprint.test.ts` | YAML → Blueprint 파싱 정확성, schema 유효성 검사 |
| Renderer Structure Test | `tests/renderer.test.ts` | 각 slide renderer가 오류 없이 실행되는지 smoke test |
| Snapshot Test | `tests/snapshot.test.ts` | PPTX XML 구조 회귀 방지 (timestamp 정규화 후 snapshot) |

현재 총 39 tests (parser 29, renderer 5, snapshot 5).

---

## 기술 결정 이력

| DR | 제목 | 결정 요약 |
| --- | --- | --- |
| DR-007 | 언어 정책 | 문서·prompt·rule은 한국어 primary, 기술 용어는 영어 혼용 |
| DR-008 | 문서 파일명 규칙 | `docs/decisions/DR-NNN-kebab-case.md` |
| DR-013 | Work 파일 spec | `docs/works/{category}/{ID}-{topic}.md` |
| DR-014 | PPT 언어 정책 | section_label 영문 UPPERCASE, title Action Title, body 발표 언어 |

---

## Phase 계획

### Phase 1 — Blueprint → Editable PPTX 규칙 기반 컴파일 엔진 구축

**목표:** 사용자가 AI와 대화하여 blueprint를 작성하고 editable PPTX를 생성하는 전체 워크플로우 완성

**범위:**

| 항목 | 상태 |
| --- | --- |
| P1 slide 9종 renderer | ✅ 완료 |
| P2 slide 2종 renderer (section-divider, comparison) | ✅ 완료 |
| default-modern preset (light/dark), Apple 원칙 + Indigo accent | ✅ 완료 |
| zone-based layout engine | ✅ 완료 |
| CLI: validate, deck, schema | ✅ 완료 |
| CLI: preview (PPTX → PNG, 선택 설치) | ✅ 완료 |
| 테스트 39개 | ✅ 완료 |
| Skills: create-deck, generate-blueprint | ✅ 완료 |
| README, SYSTEM-MANUAL, USER-MANUAL | ✅ 완료 |
| Skills 품질 개선, review-deck, architecture-slide skill | 🔄 진행 중 (FEAT-20260530-002) |
| P2 slide 4종 (timeline, flow, decision, appendix) | ⬜ backlog |
| examples/strategy/, examples/data-report/ | ⬜ backlog |
| preset-minimal-dark | ⬜ backlog |
| PPTX 문서 속성 (title, author, company) | ⬜ backlog |

**완료 기준:**
- blueprint.yaml → PPTX 전체 워크플로우 AI 단독 수행 가능
- `/create-deck` 실행 시 사용자 대화만으로 PPTX 생성 가능
- 34개 이상 테스트 통과

### Phase 2 — 공개 repo 완성 및 확장 (Post-MVP)

**범위 (후보):**

- `preset-minimal-dark`, `preset-enterprise-clean`
- `pef` CLI 전역 설치 (npm package 공개)
- `--design custom/my-company` custom preset 지원
- Mermaid fallback (draft/appendix용)
- Keynote export (외부 도구 연계)
- CONTRIBUTING.md, LICENSE
- `skills/validate-deck.md`, `skills/convert-design-system.md`

---

## 플랫폼 지원

**목표:** macOS, Windows 양 플랫폼 지원

핵심 파이프라인(`validate`, `deck`, `schema`, `test`, `typecheck`)은 Node.js 기반이므로 플랫폼 독립적이다.
`preview` CLI는 LibreOffice + pdftoppm(poppler)를 외부 도구로 사용하며, 각 플랫폼별 경로를 탐지한다.

| 항목 | macOS | Windows |
| --- | --- | --- |
| 핵심 CLI (validate, deck, test) | ✅ 검증됨 | 미검증 |
| preview CLI (LibreOffice) | ✅ Homebrew 경로 지원 | 예정 (Program Files 경로) |
| preview CLI (pdftoppm) | ✅ poppler via Homebrew | 예정 (Scoop/winget 경로) |
| path separator | 자동 처리 (Node.js path) | 자동 처리 (Node.js path) |

**검증 방법:** clone 후 실제 실행 시뮬레이션으로 확인한다.

```bash
# 검증 시나리오 (macOS / Windows 공통)
git clone <repo-url>
cd presentation-compiler
npm install
npm run typecheck                                    # 타입 오류 없음
npm test                                             # 전체 테스트 통과
npm run validate -- --blueprint examples/basic/blueprint.yaml
npm run deck -- --blueprint examples/basic/blueprint.yaml \
  --design default-modern --theme light \
  --output output/basic.pptx                         # PPTX 생성 확인
```

Windows 검증은 `[public-repo-docs]` 또는 `[cross-platform-validation]` backlog 항목으로 추적한다.

---

## 리스크

| 리스크 | 영향 | 대응 |
| --- | --- | --- |
| pptxgenjs visual fidelity 한계 | HTML 디자인 대비 차이 | 초기부터 PPT 기준으로 설계. HTML 1:1 재현 목표 없음 |
| AI-generated layout drift | 결과 비일관성 | AI를 input 생성에만 사용. 렌더링은 100% 규칙 기반 |
| font availability | Pretendard 미설치 환경 | fallback 체인 명시 (system sans-serif). 폰트 embed 옵션 Post-MVP 검토 |
| architecture diagram 복잡도 | 복잡한 edge crossing | MVP는 zone-based 단방향 흐름만 지원. 복잡 구조는 Mermaid fallback |
| PPTX 문서 속성 기본값 | "PptxGenJS" author/title 표시 | deck.title, deck.author로 채우는 작업 backlog 등록됨 (`[pptx-document-metadata]`) |
| Windows 미검증 | clone 후 실행 실패 가능 | clone 후 실행 시뮬레이션으로 검증 예정. preview CLI 외 핵심 경로는 Node.js 추상화로 위험 낮음 |
