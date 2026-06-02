---
description: "사용자와 대화하며 blueprint.yaml을 작성하고 editable PPTX를 생성하는 end-to-end 인터랙티브 워크플로우"
argument-hint: "[발표 주제 또는 간단한 설명 — 없으면 대화로 파악]"
disable-model-invocation: true
---

`skills/create-deck.md`를 로드해서 아래 절차를 따라줘.

**MUST:** 각 Step 사이에 반드시 사용자 응답을 기다린다. 사용자가 "간단하게", "빠르게", "테스트용" 등을 말해도 GATE를 건너뛰지 않는다. 승인 없이 다음 Step으로 진행하지 않는다.
**MUST:** Claude Code의 `/plan` 또는 "Ready to code?" plan 화면으로 전환하지 않는다. `/create-deck`의 Step 2 구조 제안이 이 workflow의 승인용 plan이다.
**MUST:** Step 2에서는 implementation plan, file edit plan, Work plan이 아니라 사용자에게 보여줄 발표 Narrative Spine과 slide outline만 출력한다.

## Step 0 — Input mode 판별

`$ARGUMENTS`와 사용자 응답을 보고 `brief-first`, `source-first`, `AI-research-first` 중 하나로 분류한다.
세부 mode 처리와 질문은 `skills/create-deck.md`를 따른다.

## Step 1 — Context 수집

`$ARGUMENTS`가 있으면 발표 주제 힌트로 활용하고, 이미 파악된 항목은 건너뛴다.
모르는 항목만 질문한다. 한 번에 최대 3개까지만 묻고, `skills/create-deck.md`의 Adaptive Interaction Rules를 따른다.

```
PPT 제작을 도와드리겠습니다. 몇 가지 확인할게요.

1. 목적·청중: 어떤 상황의 발표이고 누가 보나요?
   (예: 임원 보고 / 기술 제안 / 고객 제안 / 내부 리뷰)

2. 분량·핵심 메시지: 발표 시간 또는 슬라이드 수, 꼭 기억해야 할 한 문장은 무엇인가요?

3. 입력 방식: 간단 brief / markdown·파일 경로 제공 / AI가 초안부터 구성 중 어떤 방식으로 시작할까요?
```

이미 위 정보가 충분하면 질문을 생략하고, 부족한 데이터·tone·preset·작성자/버전은 구조 제안 전후에 필요한 만큼만 후속 확인한다.

→ **[GATE 1] 사용자 답변을 받은 뒤에만 Step 2로 진행한다.**

## Step 2 — 슬라이드 구조 제안

`skills/create-deck.md` §Step 2의 슬라이드 타입 선택 가이드, semantic component selection, 목적별 권장 구성을 참고해서 구조를 번호 목록으로 제안한다.
이 단계에서는 파일을 쓰지 않는다. schema/existing blueprint 탐색은 구조 제안에 꼭 필요한 경우로 제한하고, 기존 동일 slug 파일이 있으면 새 파일명을 임의로 정하지 말고 Step 2 제안 또는 Step 3 시작 전에 사용자에게 확인한다.

**Claude Code MUST:** 사용자가 명시적으로 제외하지 않는 한 기본 구조에 `agenda`, 주요 섹션 사이 `section-divider`, 마지막 `closing`을 포함한다. `summary`는 deck의 결론·다음 행동을 2~3개로 정리할 가치가 있을 때만 포함한다.

제안 후 반드시 아래 문장으로 끝낸다:
```
이 구조로 진행할까요? 슬라이드를 추가·제거하거나 순서를 바꾸고 싶으면 말씀해 주세요.
```

→ **[GATE 2] 사용자가 구조를 승인한 뒤에만 Step 3으로 진행한다. 승인 없이 blueprint를 작성하지 않는다.**

## Step 3 — Blueprint 초안 작성

승인된 구조를 기반으로 `blueprints/{제목-slug}.yaml`을 작성한다.
`skills/create-deck.md`의 Step 3 blueprint 작성 규칙(Action Title 원칙, 언어 규칙, 슬라이드 타입별 YAML)을 따른다.
각 slide에는 `skills/create-deck.md`의 Speaker Notes 기준에 따라 `notes`를 작성한다.
일반 slide에는 showcase처럼 `section_label`을 기본 작성한다. 긴 Action Title은 renderer의 compact header가 처리할 수 있으므로 제목 의미를 약화하지 말고, 필요한 맥락은 `subtitle`, `body`, `callout`으로 분리한다.
본문, 표 셀, KPI label/value에는 `[^1]`, `[^]`, `[1]` 같은 footnote marker나 지원하지 않는 Markdown citation을 남기지 않는다. 표 셀과 KPI에는 이모지/경고 아이콘 대신 `주의`, `확인 필요`, `베타` 같은 짧은 텍스트를 쓴다. 출처나 보충 설명은 `notes` 또는 appendix slide로 이동한다.

- blueprints/ 디렉토리가 없으면 생성한다
- 파일명: 발표 제목을 소문자 하이픈으로 변환 (예: `q2-engineering-review.yaml`)
- 작성 후 전체 내용을 보여준다

작성 후 반드시 아래 문장으로 끝낸다:
```
각 슬라이드를 검토해 주세요. 수정할 내용이 있으면 말씀해 주시면 반영하겠습니다.
수정할 내용이 없으면 "진행해" 또는 "PPTX 생성해줘"라고 답해 주세요. 그러면 validation 후 PPTX를 생성하겠습니다.
```

→ **[GATE 3] 사용자가 검토 완료를 확인한 뒤에만 Step 4로 진행한다. 확인 없이 PPTX를 생성하지 않는다.**

## Step 4 — 검토·보완 반복

사용자 수정 요청을 반영하고 아래 문장으로 끝낸다:
```
수정했습니다. 다른 변경 사항이 있으신가요? 없으면 PPTX를 생성하겠습니다.
```

→ **[GATE 4] "없다" 또는 "생성해줘" 확인 후에만 Step 5로 진행한다.**

## Step 5 — Validation 및 PPTX 생성

```bash
npm run validate -- --blueprint blueprints/{slug}.yaml
npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}-v{version}.pptx
```

- validate 오류가 있으면 blueprint를 수정하고 재시도한다
- 성공하면 output 경로를 안내한다

## Step 6 — 결과 확인 + Review Loop (선택)

```
PPTX가 생성됐습니다: output/{slug}-v{version}.pptx

preview 생성 가능 여부를 판단한 뒤 사용자에게 먼저 확인하세요:

preview PNG를 생성해서 visual review까지 진행할까요?

사용자가 승인하면 실행:
npm run preview -- output/{slug}-v{version}.pptx --out output/{slug}-preview

PowerPoint에서 열어 확인해 주세요.
deck 검토를 원하시면 `/review-deck`을 사용하세요:
- 슬라이드 흐름·메시지·텍스트·차트·청중 적합성 검토
- preview visual과 PPTX metadata 검토
- blueprint 수정 제안 (slide id + 변경 전/후)
```

---

**참고:**
- 슬라이드 타입 목록: `skills/create-deck.md` §Step 2, `src/design/presets/teal/ppt-layouts.md`
- Blueprint 스키마: `schemas/blueprint.schema.json`
- 전체 워크플로우 상세: `skills/create-deck.md`
