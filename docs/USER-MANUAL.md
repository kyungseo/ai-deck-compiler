# User Manual — ai-deck-compiler

이 문서는 `ai-deck-compiler`를 처음 사용하는 사람을 위한 안내서입니다.
개발 구조나 renderer 구현을 고치려면 [SYSTEM-MANUAL](SYSTEM-MANUAL.md)을 보세요.

---

## 1. 무엇을 만드는 도구인가요?

`ai-deck-compiler`는 AI와 함께 `blueprint.yaml`을 작성하고, 이를 editable PowerPoint 파일(`.pptx`)로 컴파일하는 도구입니다.

쉽게 말하면:

- AI가 발표 기획서와 slide 내용을 씁니다.
- 사용자는 중간 산출물인 `blueprint.yaml`을 검토합니다.
- TypeScript 엔진이 design preset과 template을 적용해 PPTX를 만듭니다.
- 생성된 PPTX는 PowerPoint에서 직접 편집할 수 있습니다.

`blueprint.yaml`은 PPT 기획서이면서 compiler가 읽는 Deck Specification DSL입니다.
(DSL — Domain Specific Language: 특정 목적에 맞게 설계된 전용 기술 언어)
사용자는 "슬라이드에 무엇을 보여줄지"만 다루고, 좌표와 레이아웃은 엔진이 계산합니다.

---

## 2. 전체 흐름

```mermaid
flowchart TD
  A["Repo clone"] --> B["npm install"]
  B --> C["AI에게 deck 요청 또는 blueprint 직접 작성"]
  C --> D["blueprint.yaml 초안 생성"]
  D --> E["사용자 검토와 수정"]
  E --> F["npm run validate"]
  F --> G["npm run deck"]
  G --> H["editable PPTX 생성"]
  H --> I{"preview 생성할까요?"}
  I -->|Yes| J["npm run preview"]
  I -->|No| K["PowerPoint/Keynote에서 직접 확인"]
  J --> L["AI visual review"]
  K --> L
  L --> M{"수정 필요?"}
  M -->|Yes| D
  M -->|No| N["최종 deck"]
```

---

## 3. 설치와 첫 PPT 만들기

### 3.1 설치

```bash
git clone https://github.com/kyungseo/ai-deck-compiler.git
cd ai-deck-compiler
npm install
```

기본 design preset(`default-modern`)은 **Pretendard** 폰트를 사용합니다.
미설치 시 시스템 fallback 폰트로 렌더링되어 출력물 모양이 달라질 수 있습니다.

| OS | 설치 방법 |
| --- | --- |
| macOS | `brew install --cask font-pretendard` |
| Windows / Linux | [Pretendard 릴리스 페이지](https://github.com/orioncactus/pretendard)에서 다운로드 |

### 3.2 샘플 blueprint 검증

```bash
npm run validate -- --blueprint examples/sample/blueprint.yaml
```

### 3.3 PPTX 생성

```bash
npm run deck -- \
  --blueprint examples/sample/blueprint.yaml \
  --output output/sample-v1.0.pptx
```

### 3.4 Preview 생성

```bash
npm run preview -- output/sample-v1.0.pptx --out output/sample-preview
```

Preview는 optional입니다.
LibreOffice와 `pdftoppm`이 없으면 실패할 수 있으며, 그 경우 PowerPoint 또는 Keynote에서 직접 확인하면 됩니다.

---

## 4. AI 환경별 빠른 시작

| 환경 | 시작 방법 | 설명 |
| --- | --- | --- |
| Claude Code | `/create-deck` | `.claude/commands/create-deck.md` wrapper가 canonical skill을 따라갑니다. |
| Claude Code | `/generate-blueprint` | 이미 구조가 정해진 deck의 blueprint만 빠르게 만듭니다. |
| Claude Code | `/review-deck` | 생성된 blueprint/PPTX/preview를 검토합니다. |
| Codex CLI | repo skill `create-deck` 사용 | `.agents/skills/create-deck/SKILL.md`를 통해 `skills/create-deck.md`를 로드합니다. |
| Codex App | repo-local skill 또는 SKILL.md 수동 로드 | 자동 노출은 환경별로 다를 수 있어 수동 로드 기준으로 설명합니다. |
| Claude App | `skills/*.md` 내용을 복사/참조 | native slash command 실행은 가정하지 않습니다. |
| Manual CLI | 직접 `blueprint.yaml` 작성 | AI 없이도 validate/deck/preview 명령으로 사용할 수 있습니다. |

가장 일반적인 시작은 `/create-deck` 또는 `skills/create-deck.md`입니다.

---

## 5. AI로 deck 만들기

### 5.1 입력 방식 3가지

| 방식 | 언제 쓰나요? | AI가 하는 일 |
| --- | --- | --- |
| brief-first | 주제와 목적만 짧게 말할 때 | 핵심 질문을 하고 구조를 제안합니다. |
| source-first | markdown, 메모, 보고서 초안이 있을 때 | source를 요약하고 narrative spine과 slide plan으로 바꿉니다. |
| AI-research-first | "알아서 조사해서 만들어줘"에 가까울 때 | research 범위와 출처 기준을 확인한 뒤 content draft를 만듭니다. |

AI-research-first는 도구 환경에 따라 실제 외부 검색이 제한될 수 있습니다.
검색 도구가 없으면 AI는 사용자가 제공한 자료, 명시적 가정, 추가 질문을 기반으로 진행합니다.

### 5.2 기본 요청 예시

```text
/create-deck

Q2 엔지니어링 성과 리뷰 deck을 만들어줘.
청중은 임원진이고, 15분 발표야.
핵심 메시지는 "플랫폼 안정성이 개선됐고 다음 분기에는 배포 자동화에 투자해야 한다"야.
dark theme로 해줘.
```

### 5.3 Markdown source를 주는 예시

```text
/create-deck

아래 markdown 보고서를 기반으로 고객 제안용 8장 deck을 만들어줘.
source-first로 진행하고, 원문을 그대로 복붙하지 말고 핵심 주장과 근거만 뽑아줘.

[여기에 markdown 붙여넣기]
```

### 5.4 AI에게 내용 작성을 맡기는 예시

```text
/create-deck

"AI-native presentation workflow"를 주제로 10장짜리 소개 deck을 만들어줘.
대상은 스타트업 CTO들이고, 기술적이지만 너무 깊지 않게.
필요하면 자료 조사 범위와 출처 기준을 먼저 물어봐.
```

---

## 6. Blueprint 기본 개념

`blueprint.yaml`은 deck의 title, design, theme, metadata, slide list를 담습니다.

```yaml
deck:
  title: Platform Modernization Strategy
  design: default-modern
  theme: dark
  version: "1.0"
  author: Platform Team
  audience: Engineering Leadership

slides:
  - id: hero
    type: hero
    title: Platform Modernization Strategy
    subtitle: From monolith operations to cloud-native delivery
```

**파일 저장 위치 관례:**

```text
blueprints/          ← blueprint 파일을 여기에 저장합니다
  q2-review.yaml
  platform-modernization.yaml

output/              ← 생성된 PPTX가 여기에 저장됩니다 (.gitignore 권장)
  q2-review-v1.0.pptx
```

`/create-deck`을 사용하면 AI가 `blueprints/` 디렉터리를 자동으로 생성합니다.
`output/` 디렉터리는 `.gitignore`에 추가해두는 것을 권장합니다.

중요한 규칙:

- `deck.design`은 사용할 design preset 이름입니다.
- `deck.theme`은 `light` 또는 `dark`입니다.
- `deck.version`은 표지와 PPTX metadata 추적에 사용됩니다.
- `deck.author`는 표지와 PPTX creator metadata에 반영됩니다.
- slide `type`은 지원되는 16개 type 중 하나여야 합니다.
- 좌표는 쓰지 않습니다. 레이아웃은 엔진이 계산합니다.
- `slide.notes`에 텍스트를 넣으면 PowerPoint 발표자 노트로 저장됩니다. 슬라이드 화면에 표시되지 않으므로 발표 중 참고할 내용을 자유롭게 쓸 수 있습니다.

---

## 7. 지원 Slide Type

| 목적 | Type |
| --- | --- |
| 표지 | `hero` |
| 목차 | `agenda` |
| 일반 설명 | `content`, `two-column` |
| 요약/마무리 | `summary`, `closing` |
| 데이터 | `kpi`, `chart`, `table` |
| 비교/결정 | `comparison`, `decision` |
| 흐름/일정 | `timeline`, `flow` |
| 구조/아키텍처 | `architecture` |
| 구분/부록 | `section-divider`, `appendix` |

---

## 8. Preset, Theme, Branding

기본 preset은 `default-modern`입니다.

| 항목 | 설명 |
| --- | --- |
| `default-modern` | modern, minimal, technical한 deck에 적합 |
| `light` | 비즈니스/보고서 톤 |
| `dark` | 기술/엔지니어링/컨퍼런스 톤 |
| brand footer | footer 우측에 brand 표시 |
| page number | 표지를 제외한 slide에 page number 표시 |

기본 author는 다음 값입니다.

```text
ai-deck-compiler (Kyungseo.Park@gmail.com)
```

deck마다 다른 작성자를 쓰려면 blueprint에 `deck.author`를 넣거나 `/create-deck` 초기 질문에서 작성자/팀명을 알려주세요.

---

## 9. Customization 방법

### 9.1 가볍게 바꾸기

가벼운 branding은 `deck.author`, 발표 title, theme, output filename만으로도 충분합니다.

```yaml
deck:
  title: Company AI Strategy
  design: default-modern
  theme: light
  version: "1.0"
  author: Acme Strategy Team
  audience: Executive Committee
```

### 9.2 Brand footer 바꾸기

brand footer는 preset token에서 관리합니다.
현재 기본 preset 위치:

```text
src/design/presets/default-modern/tokens.json
```

팀/회사 브랜드를 계속 쓸 예정이면 custom preset을 만드는 편이 좋습니다.

### 9.3 Custom preset 만들기

custom preset은 다음 자료를 기반으로 만들 수 있습니다.

- 회사 PPT 스크린샷
- 브랜드 가이드 PDF/문서
- 기존 PPT 템플릿
- 주요 색상, 폰트, 로고 사용 규칙

AI 요청 예시:

```text
custom preset을 만들고 싶어.
우리 회사 브랜드 가이드와 기존 발표 자료 캡처를 줄게.

목표:
- 회사 색상과 폰트를 반영
- footer에 "Acme AI Lab" 표시
- 기술 발표용 dark theme와 임원 보고용 light theme 둘 다 지원
- 기존 default-modern 레이아웃 밀도는 유지

먼저 필요한 자료 목록과 preset 이름을 제안해줘.
```

레이아웃 조정 요청 예시:

```text
default-modern 기반으로 우리 팀용 preset을 만들고 싶어.
표지는 더 여백 있게, kpi slide는 숫자를 더 크게,
architecture slide는 node 간 간격을 넓혀줘.
수정 대상 파일과 검증 방법을 먼저 계획해줘.
```

---

## 10. Metadata와 Version 관리

`deck` metadata는 PPTX document properties에도 반영됩니다.

| Blueprint field | PPTX metadata |
| --- | --- |
| `deck.title` | `dc:title` |
| `deck.author` | `dc:creator` |
| `deck.title + deck.audience` | `dc:subject` |
| `deck.version` | `cp:revision`용 안전한 정수 값 |
| preset brand name | `Company` |

파일명은 version을 포함하는 형태를 권장합니다.

```bash
npm run deck -- \
  --blueprint blueprints/platform-modernization.yaml \
  --output output/platform-modernization-v1.0.pptx
```

---

## 11. Preview와 Review Loop

PPTX 생성 후 AI는 preview 생성 가능 여부를 판단하고, 사용자에게 다음과 같이 질문합니다.

```text
preview PNG를 생성해서 visual review까지 진행할까요?
```

사용자가 승인하면:

```bash
npm run preview -- output/platform-modernization-v1.0.pptx --out output/platform-modernization-preview
```

AI review 항목:

- 제목과 본문 overflow
- 하단 빈 공간
- chart/table 가독성
- theme/preset 일관성
- metadata가 blueprint와 일치하는지
- slide 흐름과 메시지 강도

수정이 필요하면 blueprint를 고치고 다시 validate/deck/preview를 반복합니다.

---

## 12. 자주 묻는 질문

### Q. blueprint라는 이름을 꼭 써야 하나요?

현재는 `blueprint.yaml`을 유지합니다.
사용자 입장에서는 PPT 기획서이고, 시스템 입장에서는 Deck Specification DSL입니다.
`deck.spec.yaml` 같은 rename은 호환성 영향이 큰 후속 major change 후보입니다.

### Q. 생성된 PPTX가 이미지인가요?

아닙니다.
텍스트, 차트, 표, 도형은 가능한 한 native editable PowerPoint 객체로 생성됩니다.

### Q. 같은 blueprint인데 결과가 달라질 수 있나요?

같은 blueprint와 같은 design preset이면 같은 PPTX가 나와야 합니다.
결과가 다르면 blueprint, preset token, dependency version 차이를 확인하세요.

### Q. PowerPoint 없이 preview할 수 있나요?

가능합니다.
`npm run preview`는 LibreOffice와 `pdftoppm`을 사용해 PPTX를 PNG로 변환합니다.
다만 이 도구들이 설치되어 있지 않으면 PowerPoint/Keynote 수동 확인으로 대체하세요.

### Q. 더 자세한 구조는 어디서 보나요?

- 개발 구조: [SYSTEM-MANUAL](SYSTEM-MANUAL.md)
- 설계와 roadmap: [PLAN](PLAN.md)
- AI skill 절차: `skills/*.md`

---

## 13. 문제 해결

### 출력물 폰트가 이상하게 보여요

Pretendard 폰트가 설치되지 않으면 시스템 fallback 폰트로 렌더링됩니다.
[§3.1 설치](#31-설치)의 폰트 설치 안내를 따라 설치한 뒤 다시 생성하세요.

### `npm run preview`가 실패해요

LibreOffice와 `pdftoppm`(poppler) 설치 여부를 확인하세요.
설치되지 않은 환경에서는 PowerPoint/Keynote에서 직접 열어 확인하세요.

### `npm run validate`가 오류를 내요

오류 메시지에 어떤 슬라이드의 어떤 필드가 문제인지 명시됩니다.
가장 흔한 원인:
- 지원하지 않는 slide `type` 사용
- 필수 필드(`id`, `type`, `title`) 누락
- `kpis`, `chart.data` 등 타입별 필수 구조 누락

전체 schema: `schemas/blueprint.schema.json`

더 자세한 개발·시스템 문제는 [SYSTEM-MANUAL §9 문제 해결](SYSTEM-MANUAL.md#9-문제-해결)을 참고하세요.
