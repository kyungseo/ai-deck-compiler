# User Manual — Presentation Compiler

---

## 이 도구가 해결하는 문제

PPT를 만들 때 흔히 겪는 문제들:

- AI에게 슬라이드를 만들어달라고 하면 매번 다른 레이아웃이 나온다
- 협업자가 템플릿을 조금씩 다르게 수정하면 deck이 뒤죽박죽이 된다
- 차트나 다이어그램이 이미지로 삽입되어 데이터를 수정할 수 없다
- 디자인 시스템과 실제 PPT 스타일이 따로 논다

Presentation Compiler는 이 문제들을 구조적으로 해결합니다.

---

## 설계 원칙

### 1. 레이아웃 무결성 (Layout Integrity)

**같은 blueprint를 실행하면 언제나 동일한 PPTX가 나옵니다.**

- 좌표·크기·간격은 모두 design preset의 규칙에 따라 계산됩니다
- AI가 "대충 여기쯤"으로 좌표를 결정하지 않습니다
- 재실행해도, 다른 컴퓨터에서 실행해도 결과가 같습니다
- blueprint.yaml 한 줄을 바꾸면 PPTX에서 정확히 그 부분만 바뀝니다

이것은 코드처럼 diff가 가능한 PPT를 의미합니다.
팀원이 같은 blueprint로 실행하면 같은 deck이 나옵니다.

### 2. AI-Native 경계

**AI는 내용(what)을 쓰고, 엔진은 형태(how)를 만듭니다.**

| AI의 역할 | 엔진의 역할 |
| --- | --- |
| 슬라이드 구조 결정 | 레이아웃 규칙 적용 |
| 텍스트·데이터 작성 | 좌표 계산 |
| diagram node 배치 지정 | shape 렌더링 |
| blueprint.yaml 생성 | PPTX 파일 생성 |

AI가 하면 안 되는 것: x/y 좌표 직접 결정, 미등록 layout 발명, 슬라이드 전체를 이미지로 렌더링

### 3. Editable 우선

**생성된 PPTX의 모든 요소는 PowerPoint에서 편집할 수 있습니다.**

- 텍스트 박스 → 텍스트 수정 가능
- 차트 → 데이터 수정 가능
- 표 → 셀 내용 수정 가능
- 다이어그램 → 도형·텍스트 개별 수정 가능

스크린샷이나 flat 이미지로 삽입하지 않습니다.

### 4. Design System 일관성

**모든 슬라이드는 같은 design preset을 공유합니다.**

token 하나를 바꾸면 (예: accent color) 전체 deck의 해당 색상이 일괄 변경됩니다.
design preset을 교체하면 (예: default-modern → minimal-dark) 내용은 그대로이고 스타일만 바뀝니다.

---

## 기본 워크플로우

> 상세 인터랙티브 가이드는 `/create-deck` 커맨드를 사용하세요.

### 수동 방식 (현재)

1. `blueprint.yaml` 작성
2. `npm run validate -- --blueprint <path>` 로 검증
3. `npm run deck -- --blueprint <path> --output <path>` 로 PPTX 생성

### AI 가이드 방식 — `/create-deck`

Claude Code에서 `/create-deck`을 입력하면 대화형 워크플로우가 시작됩니다.

```
Step 0: 입력 방식 판별 (간단 brief / source 제공 / AI research 위임)
Step 1: 목적·청중·분량·preset·테마·작성자·버전 질의
Step 2: 슬라이드 구조 제안 + 사용자 승인
Step 3: blueprint.yaml 초안 자동 작성
Step 4: 슬라이드별 내용 검토 및 수정 반복
Step 5: npm run validate → npm run deck 실행
Step 6: preview와 review-deck으로 결과 확인, 필요 시 재수정
```

입력 방식별 흐름:

| 방식 | 사용자가 제공하는 것 | AI 처리 |
| --- | --- | --- |
| brief-first | 주제·목적 중심의 짧은 설명 | 핵심 질문 → 구조 제안 → blueprint |
| source-first | markdown, 메모, 보고서 초안, 파일 경로 | source 요약 → narrative spine → slide plan → blueprint |
| AI-research-first | 주제와 목표, "알아서 작성" 요청 | research 범위 확인 → 자료/가정 구분 → content draft → blueprint |

AI-research-first는 사용 가능한 검색 도구에 따라 실제 외부 조사가 제한될 수 있습니다.
검색 도구가 없으면 사용자가 제공한 source, 명시적 가정, 추가 질문을 기반으로 진행합니다.

**예시:**
```
사용자: /create-deck Q2 엔지니어링 성과 리뷰
Claude: PPT 제작을 도와드리겠습니다. 몇 가지 확인할게요.
        청중은 누구인가요? ...
```

전체 워크플로우 상세: `skills/create-deck.md`
blueprint만 빠르게 생성: `skills/generate-blueprint.md`

---

## Blueprint 작성 가이드

`blueprint.yaml`은 PPT 기획서이면서 컴파일러가 읽는 Deck Specification DSL입니다.
파일명은 계속 `blueprint.yaml`을 사용하지만, 역할은 deck metadata, slide structure, content를 담은 명세서입니다.

빠르게 blueprint.yaml을 작성하려면 `/generate-blueprint`를 사용하세요.
상세: `skills/generate-blueprint.md`

---

## Design Preset 선택 가이드

현재 제공 preset: `default-modern` (light / dark)
추가 preset(minimal-dark, enterprise-clean)은 backlog에서 관리 중입니다.

`default-modern` 특징:
- modern, minimal, technical presentation에 적합
- light/dark theme 지원
- footer brand와 page number 지원
- 표지와 PPTX metadata에 author/version 반영

회사 또는 개인 브랜드가 중요하면 `/create-deck` 초기 질문에서 작성자, 팀명, brand footer 요구사항을 알려주세요.
custom preset 제작은 `skills/customize-preset.md`를 기준으로 진행합니다.

---

## Metadata와 Version 관리

blueprint의 `deck` 값은 PPTX 산출물 metadata에도 반영됩니다.

```yaml
deck:
  title: Platform Modernization Strategy
  design: default-modern
  theme: dark
  version: "1.0"
  author: Platform Team
  audience: Engineering Leadership
```

반영 대상:
- PPTX title: `deck.title`
- PPTX author/creator: `deck.author` 또는 preset brand author fallback
- PPTX subject: `deck.title`과 `deck.audience` 기반
- PPTX revision: `deck.version`에서 안전한 정수형 revision으로 변환

파일명은 명시적으로 version을 포함하는 형태를 권장합니다.

```bash
npm run deck -- --blueprint blueprints/platform-modernization.yaml --output output/platform-modernization-v1.0.pptx
```

---

## 자주 묻는 질문

**Q. 같은 blueprint를 실행했는데 결과가 다릅니다.**

A. 두 가지를 확인하세요:
- blueprint.yaml이 동일한지 (`git diff blueprints/`)
- design preset 버전이 동일한지

blueprint와 preset이 같으면 결과는 반드시 같습니다.

**Q. AI가 만든 blueprint의 좌표가 이상해 보입니다.**

A. blueprint.yaml에는 좌표가 없습니다. 좌표는 엔진이 계산합니다.
AI는 slide type, 텍스트, zone만 지정합니다.

**Q. 차트 데이터를 나중에 바꾸고 싶습니다.**

A. 두 가지 방법이 있습니다:
1. blueprint.yaml의 `data.values`를 수정하고 재생성
2. 생성된 PPTX를 PowerPoint에서 직접 차트 데이터 편집

**Q. 생성된 PPTX를 Keynote에서 열 수 있나요?**

A. PPTX 형식이므로 Keynote에서 열 수 있지만, 일부 shape이 다르게 보일 수 있습니다.
Keynote 네이티브 지원은 Post-MVP 로드맵에 있습니다.
