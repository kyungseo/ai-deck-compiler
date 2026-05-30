---
description: "사용자와 대화하며 blueprint.yaml을 작성하고 editable PPTX를 생성하는 end-to-end 인터랙티브 워크플로우"
argument-hint: "[발표 주제 또는 간단한 설명 — 없으면 대화로 파악]"
disable-model-invocation: true
---

`skills/create-deck.md`를 로드해서 아래 절차를 따라줘.

## 시작 방법

`$ARGUMENTS`가 있으면 그것을 발표 주제 힌트로 사용하고, 없으면 아래 질문으로 시작한다.

## Step 1 — Context 수집

다음을 확인한다. 이미 제공된 정보는 건너뛴다.

```
PPT 제작을 도와드리겠습니다. 몇 가지 확인할게요.

1. 발표 목적: 어떤 상황의 발표인가요?
   (예: 팀 성과 보고 / 기술 제안 / 투자자 설명 / 고객 제안 / 내부 리뷰)

2. 청중: 누가 보나요?
   (예: 임원진 / 엔지니어링 팀 / 전사 / 고객)

3. 분량: 발표 시간 또는 슬라이드 수?

4. 핵심 메시지: 청중이 기억해야 할 것은? (한 문장)

5. 데이터·차트: 포함할 숫자·데이터가 있나요?

6. 테마: light (비즈니스) / dark (기술·엔지니어링) 중?
```

## Step 2 — 슬라이드 구조 제안

`skills/create-deck.md` §Step 2의 슬라이드 타입 선택 가이드와 목적별 권장 구성을 참고해서 구조를 제안한다.
번호 목록으로 제시하고 사용자 승인을 받는다.

## Step 3 — Blueprint 초안 작성

승인된 구조를 기반으로 `blueprints/{제목-slug}.yaml`을 작성한다.
`skills/generate-blueprint.md`의 슬라이드 타입별 작성 가이드를 따른다.

- blueprints/ 디렉토리가 없으면 생성한다
- 파일명: 발표 제목을 소문자 하이픈으로 변환 (예: `q2-engineering-review.yaml`)
- 작성 후 전체 내용을 보여준다

## Step 4 — 검토·보완 반복

사용자 수정 요청을 반영하고 "다른 변경 사항이 있으신가요?"로 확인한다.

## Step 5 — Validation 및 PPTX 생성

```bash
npm run validate -- --blueprint blueprints/{slug}.yaml
npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}.pptx
```

- validate 오류가 있으면 blueprint를 수정하고 재시도한다
- 성공하면 output 경로를 안내한다

## Step 6 — 결과 확인

```
PPTX가 생성됐습니다: output/{slug}.pptx

PowerPoint에서 열어 확인해 주세요.
추가 수정이 필요하면 말씀해 주세요.
```

---

**참고:**
- 슬라이드 타입 목록: `src/design/presets/default-modern/ppt-layouts.md`
- Blueprint 스키마: `schemas/blueprint.schema.json`
- 전체 워크플로우 상세: `skills/create-deck.md`
