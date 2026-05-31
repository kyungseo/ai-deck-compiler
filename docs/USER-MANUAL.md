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

Claude Code에서 `/create-deck`을 입력하면 6단계 워크플로우가 시작됩니다.

```
Step 1: Claude가 목적·청중·분량·테마를 질의
Step 2: 슬라이드 구조 제안 + 사용자 승인
Step 3: blueprint.yaml 초안 자동 작성
Step 4: 슬라이드별 내용 검토 및 수정 반복
Step 5: npm run validate → npm run deck 실행
Step 6: 결과 확인, 필요 시 재수정
```

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

빠르게 blueprint.yaml을 작성하려면 `/generate-blueprint`를 사용하세요.
상세: `skills/generate-blueprint.md`

---

## Design Preset 선택 가이드

현재 제공 preset: `default-modern` (light / dark)
추가 preset(minimal-dark, enterprise-clean)은 backlog에서 관리 중입니다.

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
