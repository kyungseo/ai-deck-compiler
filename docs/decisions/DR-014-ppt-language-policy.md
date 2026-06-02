# DR-014: PPT 콘텐츠 작성 언어 원칙

Date: 2026-05-30
Status: Accepted

## Question

blueprint.yaml의 슬라이드 콘텐츠(제목, 본문, 라벨 등)를 어떤 언어로, 어떤 기준으로 작성할 것인가?

## Decision

**발표 언어(Presentation Language)** 는 청중을 따른다. 발표 언어가 결정되면 슬라이드 콘텐츠의 대부분은 그 언어로 작성한다. 단, 아래 필드는 언어와 무관하게 고정 규칙을 적용한다.

---

## 필드별 언어 규칙

### 1. `section_label` — 항상 영어 UPPERCASE

`section_label`은 슬라이드 상단의 소형 디자인 요소로 기능한다. 짧고 명료하게, 영어 대문자로 작성한다.

```yaml
section_label: "01. PROBLEM"       # ✓
section_label: "SOLUTION"          # ✓
section_label: "Q2 RESULTS"        # ✓
section_label: "01. 문제 정의"     # ✗ — 한국어 사용 금지
```

형식: `{NN.} {KEYWORD}` — 번호는 선택, 키워드는 1~3단어

### 2. `left.label` / `right.label` (패널 라벨) — 영어 UPPERCASE 권장

two-column, comparison 슬라이드의 패널 라벨. 디자인 요소로 기능하므로 영어 대문자를 권장한다.

```yaml
left:
  label: "CURRENT REALITY"    # ✓
right:
  label: "PROPOSED APPROACH"  # ✓
```

| 슬라이드 타입 | 기본 라벨 쌍 |
|---|---|
| comparison | `BEFORE` / `AFTER` |
| two-column (비교) | `CURRENT REALITY` / `OUR APPROACH` |
| two-column (분석) | `PROBLEM` / `SOLUTION` |
| two-column (비교 분석) | `OPTION A` / `OPTION B` |

### 3. `title` — Action Title 원칙 + 발표 언어

모든 슬라이드의 `title` 필드는 **주제 라벨이 아닌, 결론을 담은 선언형 문장**이어야 한다 (Action Title 원칙). 발표 언어로 작성한다.

```
✗ "Q2 성과"                            — 주제 라벨
✓ "배포 빈도 4배 향상으로 Q2 목표 초과 달성"  — 결론 선언

✗ "Architecture Overview"              — 주제 라벨
✓ "마이크로서비스 전환으로 장애 격리와 독립 배포 확보"  — 결론 선언

✗ "Key Metrics"                        — 주제 라벨
✓ "MTTR 48h → 8h, 변경 실패율 22% → 5%로 안정성 회복"  — 수치 기반 결론
```

**예외 — 선언형 문장이 자연스럽지 않은 경우:**

| 슬라이드 | 예외 적용 | 예시 |
|---|---|---|
| `hero` | 간결한 제목 허용 (선언 불필요) | `Platform Modernization 2026` |
| `agenda` | 'Agenda' 또는 'Contents' 고정 허용 | `Agenda` |
| `section-divider` | 섹션명 그대로 허용 | `현황 및 문제 진단` |

### 4. `subtitle` — 발표 언어 1문장

제목 아래 맥락을 보완하는 한 문장. 발표 언어로 작성한다.

```yaml
subtitle: "수동 프로세스가 속도를 막는 근본 원인"   # ✓ (한국어 발표)
subtitle: "Why legacy deployment holds us back"     # ✓ (영어 발표)
```

### 5. `body` 항목 — 발표 언어 + 기술 용어 원문 유지

본문 불렛 포인트는 발표 언어로 작성하되, 기술 스택명·제품명·성능 지표는 영어 원문을 유지한다 (DR-007 Bilingual Rules 준용).

```yaml
body:
  - "CI/CD Pipeline 자동화로 배포 소요 시간 3일 → 2시간 단축"  # ✓
  - "Kubernetes 기반 장애 격리로 MTTR 80% 개선"                 # ✓
  - "시아이씨디 파이프라인 자동화"                              # ✗ — 음차 금지
```

### 6. 숫자·단위 — 약식 표기, 언어 무관

수치는 간결한 약식 표기를 사용한다. 발표 언어에 상관없이 동일하게 적용한다.

| 표기 방식 | 예시 |
|---|---|
| 배수 | `4×`, `3배` |
| 증감률 | `+12%`, `-30%` |
| 시간 | `48h → 8h`, `2일 → 2시간` |
| 금액 | `$1M`, `₩10억` |
| 규모 | `10K`, `1M+` |

---

## 발표 언어 결정 기준

| 청중 | 권장 발표 언어 |
|---|---|
| 국내 임원·팀 | 한국어 (기술 용어 영어 원문) |
| 글로벌·해외 | 영어 |
| 혼합 (국내+해외) | 발표자 판단 또는 이중 버전 |

발표 언어는 `create-deck` Step 1 [청중] 속성에서 확인한다.

---

## 요약표

| 필드 | 언어 규칙 |
|---|---|
| `section_label` | 영어 UPPERCASE 고정 |
| `left.label` / `right.label` | 영어 UPPERCASE 권장 |
| `title` | 발표 언어 + Action Title 원칙 |
| `subtitle` | 발표 언어 1문장 |
| `body` 항목 | 발표 언어 + 기술 용어 영어 원문 |
| 숫자·단위 | 언어 무관 약식 표기 |

---

## Rationale

`section_label`과 패널 라벨은 슬라이드 상단에 소형 타이포그래피로 렌더링되는 디자인 요소다. 영어 대문자가 시각적으로 균형이 잡히고, 국제 표준 피치덱(Template 02 스타일)과 일관성을 유지한다. 또한 한국어 청중 대상 발표에서도 영어 대문자 라벨은 섹션 구분 표식으로 자연스럽게 받아들여진다.

기술 용어 영어 원문 유지(DR-007 Bilingual Rules 준용)는 정확한 의미 전달과 검색·참조 편의를 위해서다. 음차는 의미를 희석하고 청중의 검색을 어렵게 만든다.

---

## Consequences

- blueprint.yaml 작성 시 위 규칙을 기본값으로 적용한다.
- `skills/create-deck.md`에 이 DR을 참조한다. deprecated `generate-blueprint` wrapper는 `create-deck` 절차로 라우팅한다.
- AI가 blueprint를 생성할 때 `section_label`은 자동으로 영어 UPPERCASE로 작성한다.
- 기존 examples/의 blueprint는 이 DR 기준으로 별도 수정하지 않는다 (예제 목적 유지).

## Linked DR

- DR-007: 파일 유형별 작성 언어 원칙 (Bilingual Rules 원본)

## Reversal Cost

Low — blueprint.yaml은 사용자가 직접 작성·수정하는 파일이므로 언어 정책 변경 시 기존 파일에 영향 없음.
