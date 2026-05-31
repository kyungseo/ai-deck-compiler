# Skill: create-deck

사용자와 대화하며 blueprint.yaml을 작성하고 editable PPTX를 생성하는 end-to-end 워크플로우.

**Claude Code 진입:** `/create-deck`
**단독 실행:** 이 파일 내용을 Claude 세션에 공유 후 시작 요청

---

## 이 skill이 하는 일

```
사용자 의도 표현
  → Step 1: 목적·청중·구조 파악 (대화)
  ── [GATE 1] 사용자 답변 수신 후 진행 ──
  → Step 2: 슬라이드 구조 제안 + 승인 대기
  ── [GATE 2] 구조 승인 후 진행 ──
  → Step 3: blueprint.yaml 초안 작성 + 검토 대기
  ── [GATE 3] 검토 완료 확인 후 진행 ──
  → Step 4: 슬라이드 내용 검토·보완 반복
  ── [GATE 4] "생성해줘" 확인 후 진행 ──
  → Step 5: PPTX 생성 (npm run deck)
  → Step 6: 결과 확인 + 필요 시 재수정
```

**MUST:** 각 GATE에서 반드시 멈추고 사용자 응답을 기다린다. "간단하게", "빠르게", "테스트용" 등의 말도 GATE를 건너뛰는 허가가 아니다.

---

## Step 1 — Brief Alignment (Context 수집)

다음 9개 속성을 확인한다. 사용자가 이미 제공한 정보는 건너뛴다.
모호한 항목이 있으면 최대 3개까지만 한 번에 질문한다.

```
발표 제작을 시작하기 전에 몇 가지 확인할게요.

[목적] 이 발표의 목적은?
  의사결정 요청 / 정보 전달 / 기술 제안 / 성과 보고 / 외부 제안

[청중] 누가 보나요?
  임원진 / 엔지니어링 팀 / 전사 / 고객 / 투자자

[분량] 발표 시간 또는 슬라이드 수?
  (예: 10분/8장, 20분/15장)

[핵심 메시지] 청중이 발표 후 기억해야 할 것 (한 문장)

[데이터] 포함할 수치나 차트가 있나요?

[톤] 발표 분위기는?
  데이터 중심·간결 / 설득·설명 중심 / 기술적·엄밀 / 친근·이야기 중심

[출처] 주요 데이터·주장의 근거는?
  내부 지표 / 외부 리서치 / 사용자 인터뷰 / 코드·시스템 현황

[품질 기준] 이 발표의 성공 기준은?
  의사결정 유도 / 이해도 향상 / 신뢰 구축 / 실행 동기 부여

[테마] light (비즈니스) / dark (기술·엔지니어링)

[작성자] 표지에 표시할 이름 또는 팀명?
  (기본값: 박경서 / 생략 시 기본값 사용)
```

---

## Step 2 — 슬라이드 구조 제안

수집한 정보를 바탕으로 슬라이드 구조를 제안한다.

### 슬라이드 타입 선택 가이드

| 상황 | 추천 타입 |
| --- | --- |
| 항상 첫 슬라이드 | `hero` |
| 4개 이상 섹션 있을 때 | `agenda` |
| 주요 섹션 사이 구분 | `section-divider` |
| 핵심 지표 3~4개 강조 | `kpi` |
| 텍스트 설명·불렛 포인트 | `content` |
| 좌우 비교 또는 두 관점 | `two-column` |
| 기존 vs 제안 명확한 대비 | `comparison` |
| 시계열·비교 데이터 | `chart` |
| 행/열 구조 데이터 | `table` |
| 시스템·인프라 구조 설명 | `architecture` |
| 결론·다음 단계 | `summary` |

### 목적별 권장 구성

**팀 성과 보고 (임원 대상, 15~20분):**
hero → agenda → kpi → chart → content → summary

**기술 제안서 (엔지니어링 팀, 30분):**
hero → agenda → content → architecture → two-column → chart → summary

**분기 리뷰 (전사, 10분):**
hero → kpi → chart → summary

**제안 제출 (고객, 20분):**
hero → agenda → content × 2 → two-column → summary

제안 형식:
```
다음 구조를 제안합니다:

01. [hero]        — {제목}
02. [agenda]      — {섹션 목록}
03. [kpi]         — {지표명}
04. [chart]       — {차트 제목}
05. [content]     — {슬라이드 제목}
06. [summary]     — Key Takeaways

이 구조로 진행할까요? 슬라이드를 추가·제거하거나 순서를 바꾸고 싶으면 말씀해 주세요.
```

→ **[GATE 2] 사용자 승인 후에만 blueprint 작성으로 진행한다.**

---

## Step 3 — Blueprint 초안 작성

승인된 구조를 바탕으로 `blueprints/{제목-slug}.yaml`을 작성한다.

### Blueprint 작성 규칙

```yaml
deck:
  title: # 발표 제목 (60자 이내)
  design: default-modern
  theme: light | dark  # Step 1에서 확인한 값
  version: "1.0"       # 문서 버전 — 표지 우측 상단에 자동 표시
  author: # 작성자 — 생략 시 기본값(박경서) 사용, 표지에 표시
  audience: # 청중 (선택)
```

**id 규칙:** 소문자, 하이픈, 고유값. 예: `hero-1`, `kpi-q2`, `arch-overview`

**언어 규칙 (DR-014):**
- `section_label`: 영어 UPPERCASE 고정 — `"01. PROBLEM"`, `"SOLUTION"`
- `left.label` / `right.label` (패널 라벨): 영어 UPPERCASE 권장 — `"CURRENT REALITY"`, `"OUR APPROACH"`
- `title`: 발표 언어 + Action Title 원칙 (결론 선언형 문장)
- `body` 항목: 발표 언어 + 기술 용어·지표는 영어 원문 유지

**슬라이드 타입별 필수 필드:**

```yaml
# hero
- id: hero-1
  type: hero
  title: 발표 제목
  subtitle: 부제목 (선택)
  cta: 날짜 또는 팀명 (선택)

# kpi — kpis 배열, 최대 4개
- id: kpi-1
  type: kpi
  title: 핵심 지표
  kpis:
    - label: 지표명
      value: "값"      # 따옴표로 감싸기
      delta: "+10%"    # 선택
      trend: up        # up | down | neutral

# chart — inline 데이터 사용
- id: chart-1
  type: chart
  title: 차트 제목
  chart:
    type: bar          # bar|stacked-bar|line|area|pie|donut
    data:
      source: inline
      labels: [Q1, Q2, Q3, Q4]
      series:
        - name: 시리즈명
          values: [100, 200, 150, 300]

# content — body 3~5개 항목 권장
- id: content-1
  type: content
  title: 슬라이드 제목
  body:
    - 핵심 포인트 1
    - 핵심 포인트 2
    - 핵심 포인트 3

# architecture — zone 기반 배치
- id: arch-1
  type: architecture
  title: 아키텍처 제목
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: api
        kind: service     # service|database|queue|gateway|client|cloud|container|cache|storage|external
        label: API Service
        zone: center      # top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right|left|right
    edges:
      - from: api
        to: db
        kind: sync        # sync|async|bidirectional|data-flow
        label: SQL (선택)

# summary
- id: summary-1
  type: summary
  title: Summary
  body:
    - 핵심 내용 요약
  takeaways:
    - 청중이 기억할 것 1
    - 청중이 기억할 것 2
```

초안 작성 후:
```
blueprints/{slug}.yaml을 작성했습니다.

[blueprint.yaml 내용 전체 표시]

각 슬라이드를 검토해 주세요. 수정할 내용이 있으면 말씀해 주세요.
```

→ **[GATE 3] 사용자가 검토 완료를 확인한 뒤에만 PPTX 생성으로 진행한다.**

---

## Step 4 — 검토·보완 반복

사용자 요청에 따라 blueprint를 수정한다.

수정 패턴:
- "3번 슬라이드 제목 바꿔줘" → 해당 id의 title 수정
- "KPI에 항목 추가해줘" → kpis 배열에 항목 추가
- "차트 데이터 수정해줘" → series.values 업데이트
- "슬라이드 순서 바꿔줘" → slides 배열 재정렬
- "슬라이드 하나 추가해줘" → 새 슬라이드 타입 선택 후 추가

수정 완료 후:
```
수정했습니다. 다른 변경 사항이 있으신가요?
없으면 PPTX를 생성하겠습니다.
```

→ **[GATE 4] "없다" 또는 "생성해줘" 확인 후에만 Step 5로 진행한다.**

---

## Step 5 — PPTX 생성

```bash
npm run validate -- --blueprint blueprints/{slug}.yaml
npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}.pptx
```

실행 결과:
- 성공: `output/{slug}.pptx` 생성 완료 안내
- 실패: 오류 메시지 해석 후 blueprint 수정 제안

```
PPTX가 생성됐습니다: output/{slug}.pptx

PowerPoint / Keynote에서 열어 확인해 주세요.
수정이 필요하면 말씀해 주세요.
```

---

## Step 6 — 결과 확인 + Review Loop (선택)

```
PPTX가 생성됐습니다: output/{slug}.pptx

PowerPoint에서 열어 확인해 주세요.
deck 검토를 원하시면 `/review-deck` 또는 `skills/review-deck.md`를 사용하세요:
- 슬라이드 흐름·메시지 일관성 검토
- 텍스트 분량·차트·표 데이터 명확성 검토
- 청중 적합성 평가
- blueprint 수정 제안 (slide id + 변경 전/후)
```

---

## 예제 세션

```
사용자: Q2 엔지니어링 성과 리뷰 PPT 만들어줘. 임원 보고용이야.

AI: 몇 가지 확인할게요.

    발표 시간이나 슬라이드 수는 어느 정도로 생각하세요?
    강조하고 싶은 핵심 지표가 있나요? (예: 배포 빈도, 장애 복구 시간 등)
    포함할 차트 데이터가 있나요?
    테마는 light / dark 중 어느 쪽이 좋으세요?

사용자: 20분, 배포 빈도랑 MTTR 개선 보여주고 싶어. 트렌드 차트 있어. dark.

AI: 알겠습니다. 다음 구조를 제안합니다:

    01. [hero]    — Q2 Engineering Performance Review
    02. [agenda]  — 4개 섹션 (현황 / 지표 / 성과 / 다음 분기)
    03. [kpi]     — 핵심 지표 (배포 빈도, MTTR, 변경 실패율)
    04. [chart]   — 배포 빈도 트렌드 (line)
    05. [chart]   — MTTR 개선 추이 (bar)
    06. [content] — 주요 이니셔티브
    07. [summary] — Key Takeaways + Next Quarter

    이 구조로 진행할까요?

사용자: ㅇㅇ, chart 데이터는 내가 줄게.

AI: 네, blueprint 초안을 작성하겠습니다.
    차트 데이터를 준비되면 알려주세요.
    [blueprints/q2-engineering-review.yaml 초안 작성 후 표시]
```

---

## 관련 파일

- `skills/generate-blueprint.md` — blueprint만 집중적으로 생성
- `src/design/presets/default-modern/ppt-layouts.md` — 슬라이드 타입별 레이아웃
- `src/design/presets/default-modern/ppt-chart-rules.md` — 차트 데이터 형식
- `schemas/blueprint.schema.json` — 전체 스키마 참조
