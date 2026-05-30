# Skill: generate-blueprint

발표 목적과 내용을 기반으로 blueprint.yaml 초안을 생성하는 집중형 skill.

`create-deck`의 Step 3~4에 해당하며, 이미 슬라이드 구조가 결정된 상황에서 blueprint 작성에 집중할 때 사용한다.

---

## 입력 정보 수집

다음 정보가 없으면 먼저 확인한다:

```
1. 발표 제목
2. 청중 (임원 / 팀 내부 / 고객 등)
3. 슬라이드 목록 (타입 + 제목)
4. 각 슬라이드의 주요 내용 또는 데이터
5. design preset (기본: default-modern)
6. theme (light | dark)
```

---

## Blueprint 생성 절차

### 1. Deck 헤더 작성

```yaml
deck:
  title: {발표 제목}
  design: default-modern
  theme: {light | dark}
  version: "1.0"
  audience: {청중} # 선택
```

### 2. 슬라이드별 초안 작성

각 슬라이드를 순서대로 작성한다.

**id 규칙:** `{type}-{순번}` 또는 의미 있는 식별자. 예: `hero-1`, `kpi-q2`, `chart-revenue`

**내용 작성 원칙:**
- 텍스트는 구체적으로 — "성과를 달성했습니다" ✗ → "배포 빈도 4배 향상 (4회/월 → 16회/월)" ✓
- body 항목은 3~5개로 제한
- kpi value는 따옴표로 감싸기 (`value: "124K"`)
- chart labels와 values 길이 일치 확인

### 3. 검토 후 제시

작성 완료 후:
```
blueprint.yaml 초안입니다.

[전체 내용 표시]

수정이 필요한 부분이 있으면 말씀해 주세요:
- 텍스트 수정 ("X번 슬라이드 제목 바꿔줘")
- 슬라이드 추가/제거
- 데이터 업데이트
- 순서 변경
```

---

## 슬라이드 타입별 작성 가이드

### hero
```yaml
- id: hero-1
  type: hero
  title: 발표 제목           # 필수, 간결하게
  subtitle: 부제목           # 선택
  cta: 날짜 또는 발표자      # 선택
```

### agenda
```yaml
- id: agenda-1
  type: agenda
  title: Agenda
  items:                     # 각 섹션 이름, 최대 6개 권장
    - "01 — 섹션 A"
    - "02 — 섹션 B"
    - "03 — 섹션 C"
```

### kpi
```yaml
- id: kpi-1
  type: kpi
  title: 핵심 지표
  kpis:                      # 최대 4개
    - label: 지표명
      value: "값"
      delta: "+10%"          # 선택
      trend: up              # up | down | neutral, 선택
```

### content
```yaml
- id: content-1
  type: content
  title: 슬라이드 제목
  body:                      # 3~5개 권장
    - 불렛 포인트 1
    - 불렛 포인트 2
    - 불렛 포인트 3
```

### two-column
```yaml
- id: two-col-1
  type: two-column
  title: 슬라이드 제목
  left:
    body:
      - 왼쪽 항목 1
      - 왼쪽 항목 2
  right:
    body:
      - 오른쪽 항목 1
      - 오른쪽 항목 2
```

### chart
```yaml
- id: chart-1
  type: chart
  title: 차트 제목
  chart:
    type: line               # bar|stacked-bar|line|area|pie|donut
    data:
      source: inline
      labels: [Q1, Q2, Q3, Q4]
      series:
        - name: 시리즈 1
          values: [100, 150, 200, 180]
        - name: 시리즈 2         # 선택 — 복수 시리즈
          values: [80, 120, 160, 200]
```

**chart type 선택 기준:**
- 시계열 트렌드 → `line` 또는 `area`
- 항목 간 비교 → `bar`
- 누적 비교 → `stacked-bar`
- 비율/구성 → `pie` 또는 `donut`

### table
```yaml
- id: table-1
  type: table
  title: 테이블 제목
  headers: [열1, 열2, 열3, 열4]
  rows:
    - ["행1-A", "행1-B", "행1-C", "행1-D"]
    - ["행2-A", "행2-B", "행2-C", "행2-D"]
```

### architecture
```yaml
- id: arch-1
  type: architecture
  title: 아키텍처 제목
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: {고유 ID}
        kind: service        # service|database|queue|gateway|client|cloud|container|cache|storage|external
        label: 표시 이름     # 짧게 (15자 이내 권장)
        zone: center         # top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right|left|right
    edges:
      - from: {node id}
        to: {node id}
        kind: sync           # sync|async|bidirectional|data-flow
        label: 설명          # 선택
    groups:                  # 선택
      - id: {그룹 ID}
        label: 그룹명
        nodes: [node-id-1, node-id-2]
```

**zone 배치 가이드:**
- 왼쪽에서 오른쪽으로 흐르는 구조 → `left`, `center`, `right`
- 계층형 구조 → `top-center`, `center`, `bottom-center`
- 복잡한 구조 → 3×3 그리드 전체 사용

**edge 역방향 주의:** 엣지는 어느 방향이든 가능. zone 위치와 관계없이 `from → to` 방향으로 화살표.

### summary
```yaml
- id: summary-1
  type: summary
  title: Summary
  body:                      # 핵심 내용 요약, 선택
    - 요약 포인트 1
    - 요약 포인트 2
  takeaways:                 # 청중이 기억할 것, 선택
    - Takeaway 1
    - Takeaway 2
    - Takeaway 3
```

---

## 검토 루프

사용자가 수정을 요청하면:

1. 어느 슬라이드의 어느 필드를 바꿀지 파악
2. 변경 후 해당 슬라이드만 재표시 ("변경됐습니다. 나머지는 그대로입니다.")
3. "다른 수정 사항이 있으신가요?"로 확인

모든 수정 완료 후:
```bash
npm run validate -- --blueprint blueprints/{slug}.yaml
```
로 schema 검증 후 이상 없으면 Step 5(생성)로 진행.

---

## 관련 파일

- `skills/create-deck.md` — 전체 워크플로우 (이 skill 포함)
- `schemas/blueprint.schema.json` — 전체 스키마
- `examples/basic/blueprint.yaml` — 참고 예제
- `examples/architecture/blueprint.yaml` — 아키텍처 참고 예제
