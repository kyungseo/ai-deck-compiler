# Skill: create-deck

사용자와 대화하며 blueprint.yaml을 작성하고 editable PPTX를 생성하는 end-to-end 워크플로우.

**Claude Code 진입:** `/create-deck`
**단독 실행:** 이 파일 내용을 Claude 세션에 공유 후 시작 요청

---

## 이 skill이 하는 일

```
사용자 의도 표현
  → Step 1: 목적·청중·구조 파악 (대화)
  → Step 2: 슬라이드 구조 제안 + 승인
  → Step 3: blueprint.yaml 초안 작성
  → Step 4: 슬라이드 내용 검토·보완 반복
  → Step 5: PPTX 생성 (npm run deck)
  → Step 6: 결과 확인 + 필요 시 재수정
```

---

## Step 1 — Context 수집

다음 질문으로 발표 맥락을 파악한다. 사용자가 이미 일부 정보를 제공했으면 해당 항목은 건너뛴다.

```
다음을 확인할게요:

1. 발표 목적: 어떤 상황에서 쓰는 발표인가요?
   (예: 팀 성과 보고 / 기술 제안 / 투자자 설명 / 고객 제안 / 내부 리뷰)

2. 청중: 누가 보나요?
   (예: 임원진 / 엔지니어링 팀 / 전사 / 고객 / 투자자)

3. 분량: 발표 시간이나 슬라이드 수?
   (예: 10분/8장, 20분/15장, 제한 없음)

4. 핵심 메시지: 청중이 발표 후 기억해야 할 것은?
   (한 문장이면 충분합니다)

5. 데이터·차트: 포함할 숫자나 차트가 있나요?
   (예: 분기 매출 추이, 팀 KPI, 비교 데이터)

6. 테마: light / dark 중 어느 것이 어울리나요?
   (기본: dark — 기술/엔지니어링 발표, light — 비즈니스/클라이언트 발표)
```

---

## Step 2 — 슬라이드 구조 제안

수집한 정보를 바탕으로 슬라이드 구조를 제안한다.

### 슬라이드 타입 선택 가이드

| 상황 | 추천 타입 |
| --- | --- |
| 항상 첫 슬라이드 | `hero` |
| 4개 이상 섹션 있을 때 | `agenda` |
| 핵심 지표 3~4개 강조 | `kpi` |
| 텍스트 설명·불렛 포인트 | `content` |
| 좌우 비교 또는 두 관점 | `two-column` |
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

수정하거나 추가할 슬라이드가 있으면 말씀해 주세요.
확인되면 blueprint.yaml 초안을 작성하겠습니다.
```

---

## Step 3 — Blueprint 초안 작성

승인된 구조를 바탕으로 `blueprints/{제목-slug}.yaml`을 작성한다.

### Blueprint 작성 규칙

```yaml
deck:
  title: # 발표 제목 (60자 이내)
  design: default-modern
  theme: light | dark  # Step 1에서 확인한 값
  version: "1.0"
  audience: # 청중 (선택)
```

**id 규칙:** 소문자, 하이픈, 고유값. 예: `hero-1`, `kpi-q2`, `arch-overview`

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
각 슬라이드를 검토해 주세요. 수정할 내용을 말씀해 주시면 반영하겠습니다.

[blueprint.yaml 내용 전체 표시]
```

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

## Step 6 — 결과 확인 (선택)

```
deck 검토를 원하시면 말씀해 주세요.
- 슬라이드 흐름·메시지 일관성 검토
- 청중 적합성 평가
- 개선 제안
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
