# Presentation Compiler

> Compile presentations from design systems and blueprints.

AI가 structured input(blueprint.yaml)을 작성하고, 규칙 기반 컴파일 엔진이 editable PPTX를 생성합니다.
같은 blueprint는 항상 같은 PPTX를 만듭니다. AI가 x/y 좌표를 결정하거나 슬라이드를 이미지로 렌더링하지 않습니다.

```
blueprint.yaml + design preset → Editable PPTX
```

---

## 특징

- **AI-Native 경계 명확** — AI는 blueprint를 작성하고, 엔진은 규칙대로 렌더링 (같은 입력 = 항상 같은 결과)
- **Editable 출력** — 텍스트, 차트, 표, 다이어그램 모두 native PowerPoint XML (이미지 아님)
- **Design System 기반** — `tokens.json`으로 색상·타이포그래피·간격 일괄 적용
- **Zone-based 다이어그램** — AI가 node를 zone(top-left, center 등)에 배치하면 엔진이 좌표 계산
- **Schema Validation** — Zod schema로 blueprint 유효성 검사

---

## 요구사항

- Node.js 18+
- npm 9+

---

## 설치

```bash
git clone <repo-url>
cd presentation-compiler
npm install
```

---

## 빠른 시작

### 1. blueprint 유효성 검사

```bash
npm run validate -- --blueprint examples/basic/blueprint.yaml
```

### 2. PPTX 생성

```bash
npm run deck -- \
  --blueprint examples/basic/blueprint.yaml \
  --design default-modern \
  --theme light \
  --output output/basic.pptx
```

### 3. JSON Schema 재생성

```bash
npm run schema   # schemas/blueprint.schema.json 업데이트
```

### 4. 테스트

```bash
npm test         # vitest (34 tests)
npm run typecheck
```

---

## Blueprint 형식

```yaml
deck:
  title: My Presentation        # 필수
  design: default-modern        # 필수 — design preset 이름
  theme: light | dark           # 필수
  version: "1.0"                # 기본값 "1.0"
  audience: Engineering         # 선택

slides:
  - id: hero-1                  # 필수, 고유값
    type: hero                  # 필수 — 지원 타입 목록 참조
    title: Hello World          # 필수
    notes: Speaker notes        # 선택 — presenter notes
    subtitle: Subtitle text     # 타입별 추가 필드
    cta: Get Started
```

전체 스키마: `schemas/blueprint.schema.json`
DSL 상세: `src/design/presets/default-modern/ppt-chart-rules.md`

---

## 지원 Slide 타입

### P1 — 구현 완료

| Type | 주요 필드 |
| --- | --- |
| `hero` | `subtitle`, `cta` |
| `agenda` | `items[]` |
| `content` | `body[]` |
| `two-column` | `left.body[]`, `right.body[]` |
| `kpi` | `kpis[]{label, value, delta, trend}` |
| `table` | `headers[]`, `rows[][]` |
| `chart` | `chart{type, data}` — bar, stacked-bar, line, area, pie, donut |
| `architecture` | `diagram` — zone-based inline 또는 file |
| `summary` | `body[]`, `takeaways[]` |

### P2 — 구현 예정

`section-divider`, `comparison`, `timeline`, `flow`, `decision`, `appendix`

---

## Architecture Diagram

zone-based 레이아웃 — AI가 node를 zone에 배치하면 엔진이 좌표 계산:

```yaml
- id: arch-1
  type: architecture
  title: System Architecture
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: api
        kind: service          # service|database|queue|gateway|client|cloud|container|cache|storage|external
        label: API Service
        zone: center           # top-left|top-center|top-right|center-left|center|center-right|...
    edges:
      - from: api
        to: db
        kind: sync             # sync|async|bidirectional|data-flow
        label: SQL
    groups:
      - id: backend
        label: Backend
        nodes: [api, db]
```

---

## Design Presets

### default-modern (기본)

| 항목 | 값 |
| --- | --- |
| Canvas | 13.33" × 7.5" (LAYOUT_WIDE 16:9) |
| Font | Pretendard |
| Theme | light / dark |

Preset 파일 위치: `src/design/presets/default-modern/`

| 파일 | 내용 |
| --- | --- |
| `tokens.json` | 색상·타이포그래피·spacing·shapes 토큰 |
| `ppt-design.md` | Design system 개요 |
| `ppt-components.md` | 컴포넌트 명세 |
| `ppt-layouts.md` | 슬라이드 타입별 레이아웃 |
| `ppt-chart-rules.md` | 차트 규칙 및 데이터 형식 |

---

## 예제

| 파일 | 설명 |
| --- | --- |
| `examples/basic/blueprint.yaml` | 기본 6-slide deck (light theme) |
| `examples/architecture/blueprint.yaml` | 시스템 아키텍처 5-slide deck (dark theme) |
| `examples/sample/blueprint.yaml` | 전체 슬라이드 타입 샘플 8-slide |

---

## 프로젝트 구조

```
src/
├── schema/blueprint.ts       # Zod schema (15 slide types)
├── compiler/
│   ├── parser.ts             # YAML → Blueprint
│   └── compiler.ts           # Blueprint → PPTX
├── templates/
│   ├── registry.ts           # TemplateRegistry
│   ├── layout.ts             # SL constants, zoneCenter()
│   ├── index.ts              # P1 template 등록
│   └── slides/               # 9종 slide renderer
├── design/
│   ├── resolver.ts           # preset → ResolvedDesignTokens
│   └── presets/default-modern/
└── cli/
    ├── validate.ts           # npm run validate
    └── deck.ts               # npm run deck

schemas/
└── blueprint.schema.json     # JSON Schema (자동 생성)

examples/
├── basic/
├── architecture/
└── sample/
```

---

## AI Agent 사용 가이드

이 도구는 AI가 blueprint를 작성하고 CLI가 PPTX를 생성하는 방식으로 사용합니다.

**AI가 해야 할 것:**
- `blueprint.yaml` 작성·수정
- slide narrative 개선
- diagram semantic spec 작성 (zone 지정)

**AI가 하면 안 되는 것:**
- 임의 x/y 좌표 결정
- 미등록 layout 발명
- design token 무시
- blueprint 없이 PPTX 직접 수정

---

## 개발

```bash
npm test             # 전체 테스트 (34 tests)
npm run typecheck    # TypeScript 타입 검사
npm run schema       # JSON Schema 재생성
npm run validate -- --blueprint <path>
npm run deck -- --blueprint <path> --output <path>
```

스냅샷 업데이트:
```bash
npm test -- --update-snapshots
```

---

## AI Workflow Harness

이 프로젝트는 Claude Code / Codex / Cursor 공통 AI 워크플로우 하네스를 포함합니다.

| 파일 | 역할 |
| --- | --- |
| `CLAUDE.md` | Claude Code 진입점 |
| `AGENTS.md` | Codex 진입점 |
| `docs/STATUS.md` | 현재 작업 상태 |
| `docs/BEHAVIOR-PRINCIPLES.md` | 전역 행동 원칙 |
| `.claude/commands/` | `/start`, `/pick`, `/work`, `/close` 등 |

---

## 라이선스

MIT
