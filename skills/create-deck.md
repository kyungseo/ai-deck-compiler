# Skill: create-deck

사용자와 대화하며 blueprint.yaml을 작성하고 editable PPTX를 생성하는 end-to-end 워크플로우.

**진입 경로:**
- Claude Code: `/create-deck`
- Codex CLI/App: `.agents/skills/create-deck/SKILL.md` 로드
- Claude 채팅: 이 파일 내용을 참조하여 대화 절차 수행

---

## 이 skill이 하는 일

```
사용자 의도 표현
  → Step 0: 입력 모드 판별 (brief-first/source-first/AI-research-first)
  → Step 1: 목적·청중·preset·metadata 파악 (대화)
  ── [GATE 1] 사용자 답변 수신 후 진행 ──
  → Step 2: 슬라이드 구조 제안 + 승인 대기
  ── [GATE 2] 구조 승인 후 진행 ──
  → Step 3: blueprint.yaml 초안 작성 + 검토 대기
  ── [GATE 3] 검토 완료 확인 후 진행 ──
  → Step 4: 슬라이드 내용 검토·보완 반복
  ── [GATE 4] "생성해줘" 확인 후 진행 ──
  → Step 5: PPTX 생성 (npm run deck)
  → Step 6: Preview + review loop + 필요 시 재수정
```

**MUST:** 각 GATE에서 반드시 멈추고 사용자 응답을 기다린다. "간단하게", "빠르게", "테스트용" 등의 말도 GATE를 건너뛰는 허가가 아니다.

---

## Step 0 — Input Mode 판별

사용자 입력을 먼저 3가지 mode 중 하나로 분류한다.

| Mode | Trigger | 처리 원칙 |
| --- | --- | --- |
| brief-first | 주제·목적만 간단히 제공 | 핵심 질문을 최대 3개씩 묻고 structure proposal로 확장 |
| source-first | markdown, 파일 경로, 메모, 보고서 초안 제공 | source 요약 → narrative spine → slide plan → blueprint |
| AI-research-first | "알아서 작성", "자료 찾아서 작성" 등 | research 범위와 출처 기준 확인 → content draft → blueprint |

`source-first`의 source 처리와 구조 결정은 이 skill의 책임이다.
`generate-blueprint`는 구조가 정리된 뒤 Step 3~4의 blueprint 작성 단계만 위임받는다.

AI-research-first mode에서 실제 외부 검색은 tool 환경에 따라 제한될 수 있다.
검색 도구를 사용할 수 없으면 사용자 제공 source, 명시적 가정, 또는 추가 질문 기반으로 진행한다.

---

## Step 1 — Brief Alignment (Context 수집)

다음 속성을 확인한다. 사용자가 이미 제공한 정보는 건너뛴다.
모호한 항목이 있으면 최대 3개까지만 한 번에 질문한다.

```
발표 제작을 시작하기 전에 몇 가지 확인할게요.

[목적] 이 발표의 목적은?
  의사결정 요청 / 정보 전달 / 기술 제안 / 성과 보고 / 외부 제안

[청중] 누가 보나요?
  임원진 / 엔지니어링 팀 / 전사 / 고객 / 투자자

[분량] 발표 시간 또는 슬라이드 수?
  (예: 10분/8장, 20분/15장)

[입력 방식] 지금 제공할 자료가 있나요?
  간단 brief / markdown·파일 경로 제공 / AI가 자료 조사부터 작성

[핵심 메시지] 청중이 발표 후 기억해야 할 것 (한 문장)

[데이터] 포함할 수치나 차트가 있나요?

[톤] 발표 분위기는?
  데이터 중심·간결 / 설득·설명 중심 / 기술적·엄밀 / 친근·이야기 중심

[출처] 주요 데이터·주장의 근거는?
  내부 지표 / 외부 리서치 / 사용자 인터뷰 / 코드·시스템 현황

[품질 기준] 이 발표의 성공 기준은?
  의사결정 유도 / 이해도 향상 / 신뢰 구축 / 실행 동기 부여

[프리셋] 사용할 design preset은?
  teal (기본 추천): charcoal-dark + teal accent, AI-native, dark 우선 — 새 deck 기본값
  modern: modern, minimal, technical, light/dark 지원 — light 테마가 필요하거나 기존 blueprint 호환 시 사용
  vivid: deep-navy + vivid purple, secondary/experimental preset

[테마] dark (AI-native·기술·엔지니어링, teal/vivid 기본값) / light (비즈니스·보고서 — modern 사용 시 권장)

[작성자/브랜드] 표지와 PPTX metadata에 표시할 이름 또는 팀명?
  (기본값: ai-deck-compiler (Kyungseo.Park@gmail.com) / 생략 시 기본값 사용)

[버전] 문서 버전?
  (기본값: 1.0 / blueprint와 PPTX metadata 추적에 사용)
```

### Source-first 처리

사용자가 markdown 또는 파일 경로를 제공하면 먼저 다음을 수행한다.

1. source를 그대로 슬라이드에 복제하지 않고 핵심 주장, 근거, 수치, audience-specific message를 추출한다.
2. source 요약과 narrative spine을 제시한다.
3. 누락된 데이터·근거·청중 관점이 있으면 질문하거나 보강안을 제안한다.
4. 구조 승인 후 blueprint 작성으로 이동한다.

### AI-research-first 처리

사용자가 내용 작성을 대부분 위임하면 먼저 다음을 확인한다.

- research 범위: 지역/기간/산업/경쟁사/기술 범위
- 출처 기준: 공식 문서, 리포트, 뉴스, 내부 자료 등
- 허용 수준: 출처 기반 사실과 AI 추론을 구분해서 표시

content가 빈약하면 바로 PPTX를 만들지 않고 추가 질문, source 요청, research 제안 중 하나로 보강한다.

---

## Step 2 — 슬라이드 구조 제안

수집한 정보를 바탕으로 슬라이드 구조를 제안한다.

### 슬라이드 타입 선택 가이드

| 상황 | 추천 타입 |
| --- | --- |
| 항상 첫 슬라이드 | `hero` |
| 4개 이상 섹션 있을 때 | `agenda` |
| 주요 섹션 사이 구분 | `section-divider` |
| 핵심 숫자 3~4개 강조 | `kpi` |
| 텍스트 설명·불렛 포인트 | `content` |
| 좌우 비교 또는 두 관점 | `two-column` |
| 기존 vs 제안 명확한 대비 | `comparison` |
| 시간 추세·항목 비교·구성비 데이터 | `chart` |
| 행/열 구조의 다차원 비교 | `table` |
| 시스템·인프라 구성요소와 관계 | `architecture` |
| 단계별 처리·업무 흐름 | `flow` |
| 선택지·승인 요청·권고안 | `decision` |
| 결론·다음 단계 | `summary` |

### Semantic component selection

AI는 source나 brief를 bullet로 그대로 옮기지 않고, 의미에 맞는 표현으로 승격한다.

| 입력 내용 | 우선 표현 | 작성 규칙 |
| --- | --- | --- |
| 숫자 3~4개가 핵심 | `kpi` | 숫자, delta, trend 중심. 긴 설명은 줄인다. |
| 시간에 따른 변화 | `chart` line/area | labels와 values 길이를 맞춘다. |
| 항목 간 수치 비교 | `chart` bar/stacked-bar | 수치가 핵심이면 table보다 chart 우선. |
| 구성비·비율 | `chart` pie/donut | 항목이 많으면 table로 전환. |
| 여러 속성의 행/열 비교 | `table` | headers와 rows 컬럼 수 일치. |
| 컴포넌트·시스템 관계 | `architecture` | node/edge/zone으로 구조화. |
| 순서·단계·처리 흐름 | `flow` | A → B → C 방향성이 핵심일 때. |
| 양자택일·승인·권고 | `decision` | `recommendation`에 선택안을 쓴다. |
| 현재 vs 제안 비교 | `comparison` 또는 `two-column` | 대비가 핵심이면 comparison 우선. |
| 청중이 기억할 결론 | `summary.takeaways` | deck 또는 섹션 전체 결론. |
| 슬라이드 내부 강조 문장 1개 | `content`/`flow`의 `callout` | slide type이 아니라 optional field. 남발 금지. |

### Emphasis hierarchy

| Field | 역할 |
| --- | --- |
| `title` | 슬라이드 결론. Action Title 원칙을 따른다. |
| `subtitle` | 제목 아래 맥락 보완. |
| `body` | 근거와 설명. |
| `callout` | 해당 슬라이드에서 기억할 한 문장. |
| `recommendation` | decision slide의 권고/선택. |
| `takeaways` | deck 또는 섹션 전체 요약. |

title 작성 기준:

- 일반 슬라이드 title은 한 줄에 들어갈 정도의 핵심 결론으로 축약한다.
- 제목이 두 줄로 넘어갈 것 같으면 핵심 명사구나 짧은 선언문으로 줄이고, 맥락은 `subtitle`, `body`, `callout`으로 보낸다.
- hero/closing처럼 큰 타이포그래피를 쓰는 슬라이드는 특히 짧은 제목을 우선한다.
- 긴 설명형 제목보다 스캔 가능한 action title을 선호한다.

body 항목 코드 표기 기준:

- CLI 명령, 파일 경로, 코드 스니펫은 backtick(`` ` ``)으로 감싼다.
  - 예: `` `npm run deck -- --blueprint example.yaml --output out.pptx` ``
- 여러 줄 코드는 body 항목 하나에 fenced code string으로 작성할 수 있다. 첫 줄은 세 개의 backtick과 언어명(예: bash), 마지막 줄은 세 개의 backtick만 둔다.
- backtick/fenced code 항목은 지원 slide에서 boxed monospace block으로 렌더링된다.
- `bash`, `js`/`ts`, `java` fenced code는 기본 syntax color가 적용된다.
- 일반 설명 문장과 코드 항목을 같은 body 안에 혼용할 수 있다.

callout 사용 기준:

- 핵심 메시지, 결론, 주의 문장, 의사결정 포인트가 1문장으로 분명할 때만 쓴다.
- 선택/승인/권고 문장은 먼저 `decision.recommendation` 후보로 본다.
- deck 전체 결론은 먼저 `summary.takeaways` 후보로 본다.
- body bullet을 그대로 복사하지 않는다.
- 권장 밀도: 6장 deck 기준 1~2장 정도. hard rule이 아니라 산만함을 막는 품질 가이드다.

Icon policy:

- title에 arbitrary emoji를 자동 삽입하지 않는다.
- 아이콘은 이번 workflow에서 schema/render 대상이 아니다.
- 향후 icon을 지원할 때도 제한된 semantic icon set을 사용하고, title 문자열보다 section_label chip 또는 title-leading icon을 우선 검토한다.

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
  design: teal          # 기본 추천 (dark-first). light 필요 시 modern 사용
  theme: dark           # teal/vivid는 dark 우선. light 원하면 design: modern
  version: "1.0"       # 문서 버전 — 표지 우측 상단에 자동 표시
  author: # 작성자 — 생략 시 기본값(ai-deck-compiler) 사용, 표지와 PPTX metadata에 표시
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
npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}-v{version}.pptx
```

실행 결과:
- 성공: `output/{slug}-v{version}.pptx` 생성 완료 안내
- 실패: 오류 메시지 해석 후 blueprint 수정 제안

```
PPTX가 생성됐습니다: output/{slug}-v{version}.pptx

PowerPoint / Keynote에서 열어 확인해 주세요.
수정이 필요하면 말씀해 주세요.
```

---

## Step 6 — 결과 확인 + Review Loop (선택)

```
PPTX가 생성됐습니다: output/{slug}-v{version}.pptx

AI가 preview 생성 가능 여부를 확인한 뒤 사용자에게 묻습니다:

preview PNG를 생성해서 visual review까지 진행할까요?

npm run preview -- output/{slug}-v{version}.pptx --out output/{slug}-preview

사용자가 승인하면 preview를 생성하고, 실패하면 PowerPoint/Keynote 수동 확인으로 fallback합니다.

검토 항목:
- 시각적 밀도와 빈 공간
- 제목/본문 overflow
- chart/table 가독성
- theme/preset 일관성
- PPTX 속성의 title/author/subject가 blueprint metadata와 일치하는지

preview 도구가 없으면 PowerPoint/Keynote에서 수동 확인합니다.
deck 검토를 원하시면 `/review-deck` 또는 `skills/review-deck.md`를 사용하세요:
- 슬라이드 흐름·메시지 일관성 검토
- 텍스트 분량·차트·표 데이터 명확성 검토
- 청중 적합성 평가
- preview 기반 visual review
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
- `src/design/presets/teal/ppt-layouts.md` — 슬라이드 타입별 레이아웃 (teal 기본값)
- `src/design/presets/teal/ppt-chart-rules.md` — 차트 데이터 형식
- `src/design/presets/modern/ppt-layouts.md` — legacy/light 전용 레이아웃 참조
- `schemas/blueprint.schema.json` — 전체 스키마 참조
