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

**Claude Code 주의:** `/create-deck`은 자체 대화형 GATE workflow다.
Claude Code의 `/plan` 또는 "Ready to code?" plan 화면으로 전환하지 않는다.
Step 2의 슬라이드 구조 제안이 이 workflow의 승인용 plan이며, implementation plan이나 Work plan으로 대체하지 않는다.

---

## Step 0 — Input Mode 판별

사용자 입력을 먼저 3가지 mode 중 하나로 분류한다.

| Mode | Trigger | 처리 원칙 |
| --- | --- | --- |
| brief-first | 주제·목적만 간단히 제공 | 핵심 질문을 최대 3개씩 묻고 structure proposal로 확장 |
| source-first | markdown, 파일 경로, 메모, 보고서 초안 제공 | source 요약 → narrative spine → slide plan → blueprint |
| AI-research-first | "알아서 작성", "자료 찾아서 작성", "초안부터 구성해줘" 등 | research 범위와 출처 기준 확인 → content draft → blueprint |

`source-first`의 source 처리와 구조 결정은 이 skill의 책임이다.

AI-research-first mode에서 실제 외부 검색은 tool 환경에 따라 제한될 수 있다.
검색 도구를 사용할 수 없으면 사용자 제공 source, 명시적 가정, 또는 추가 질문 기반으로 진행한다.

---

## Step 1 — Brief Alignment (Context 수집)

다음 속성을 확인한다. 사용자가 이미 제공한 정보는 건너뛴다.
처음에는 최대 3문항만 묻고, 부족한 항목은 후속 질문으로 채운다.

### Adaptive Interaction Rules

질문은 checklist를 채우기 위한 절차가 아니라, 좋은 deck을 만들기 위해 부족한 정보를 좁히는 대화다.

- 사용자가 이미 충분한 brief/source를 제공했다면 같은 내용을 다시 묻지 않는다.
- 처음 질문은 최대 3문항으로 제한한다. 목적·청중·분량/핵심 메시지가 이미 보이면 데이터·톤·근거 중 가장 중요한 항목만 추가 확인한다.
- 답변이 불완전해도 진행 가능한 경우에는 `Assumptions`를 짧게 제시하고, 사용자가 승인하면 Narrative Spine으로 이동한다.
- content가 약하면 바로 slide를 늘리지 않는다. 먼저 핵심 메시지, 근거 데이터, 청중 관점 중 무엇이 부족한지 짚고 보강 질문을 한다.
- 사용자가 “빠르게”, “초안만”, “예시로”라고 말하면 질문 수와 세부도를 줄일 수 있지만, GATE 승인 자체는 유지한다.
- 사용자가 특정 tone/preset/slide 수를 강하게 지정하면 기본 추천보다 사용자 의도를 우선한다. 단, 결과 품질 리스크가 있으면 한 문장으로 알려준다.

**초기 확인 (최대 3문항, 한 번에 묻는다):**

```
발표 제작을 시작하기 전에 몇 가지 확인할게요.

[진행 방식] 자료를 어떻게 준비할까요?
  간단 brief로 시작 / 정리된 파일·markdown 기반 / AI가 초안부터 구성
  (이미 자료나 brief를 제공했으면 생략)

[목적·청중] 이 발표의 목적과 주요 청중은?
  목적: 의사결정 요청 / 정보 전달 / 기술 제안 / 성과 보고 / 외부 제안
  청중: 임원진 / 엔지니어링 팀 / 전사 / 고객 / 투자자

[분량·메시지] 발표 시간 또는 슬라이드 수? 청중이 기억해야 할 핵심은?
  (예: 20분/15장 / 핵심 메시지: "배포 자동화로 릴리즈 주기 4배 단축")
```

**후속 확인 (초기 답변 후 필요 시 추가 질문):**

```
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
  (기본값: AI Deck Compiler / 생략 시 기본값 사용)

[버전] 문서 버전?
  (기본값: 1.0 / blueprint와 PPTX metadata 추적에 사용)
```

### Source-first 처리

사용자가 markdown 또는 파일 경로를 제공하면 먼저 다음을 수행한다.

1. source를 그대로 슬라이드에 복제하지 않고 핵심 주장, 근거, 수치, audience-specific message를 추출한다.
2. source 요약과 narrative spine을 제시한다.
3. 누락된 데이터·근거·청중 관점이 있으면 질문하거나 보강안을 제안한다.
4. 구조 승인 후 blueprint 작성으로 이동한다.

### AI-research-first / AI-draft-first 처리

사용자가 내용 구성을 위임하면 먼저 다음을 확인한다.
외부 검색이 불가한 경우에는 명시적 가정 기반 초안으로 진행한다.

- research 범위: 지역/기간/산업/경쟁사/기술 범위 (external search 가능한 경우)
- 출처 기준: 공식 문서, 리포트, 뉴스, 내부 자료 등
- 허용 수준: 출처 기반 사실과 AI 추론을 구분해서 표시

content가 빈약하면 바로 PPTX를 만들지 않고 추가 질문, source 요청, research 제안 중 하나로 보강한다.

---

## Step 2 — 슬라이드 구조 제안

수집한 정보를 바탕으로 슬라이드 구조를 제안한다.
이 단계에서는 파일을 작성하지 않는다. 사용자에게 보여줄 발표 Narrative Spine과 slide outline만 출력한다.
blueprint schema나 기존 `blueprints/` 파일 탐색은 구조 제안에 꼭 필요한 경우로 제한한다.
동일한 slug의 blueprint가 이미 있으면 새 파일명을 임의로 결정하지 말고, 구조 승인 후 Step 3 시작 전에 overwrite / 새 파일명 / 기존 파일 수정 중 무엇을 원하는지 확인한다.

### Narrative Spine — 구조 제안 전 스토리 뼈대 작성

슬라이드 목록을 나열하기 전, 발표 전체를 5~10문장으로 먼저 요약한다.
이 단계에서 발표 흐름의 논리적 정합성을 확인하고, 누락된 논리 단계를 발견한다.

**Story Arc (기승전결) 구조:**

| 구간 | 핵심 질문 | 슬라이드 매핑 |
| --- | --- | --- |
| 기 (Context) | 배경·현황이 무엇인가? | hero, agenda, kpi(현황) |
| 승 (Complication) | 어떤 문제·한계가 있는가? | content, chart(문제 데이터) |
| 전 (Resolution) | 어떻게 해결하는가? | architecture, content(해결책) |
| 결 (Impact) | 기대 효과와 다음 단계는? | chart(성과), summary |

예시:
```
현재 플랫폼은 월 4회 배포로 시장 속도를 따라가지 못하고 있다. [기]
배포 지연의 핵심 원인은 수동 릴리즈 프로세스와 관찰 가능성 부재다. [승]
클라우드 네이티브 마이그레이션으로 자동화된 배포 파이프라인을 구축한다. [전]
12개월 내 배포 빈도 4배 향상, MTTR 48h → 8h 달성이 목표다. [결]
```

source-first 모드에서는 source 요약 후 반드시 Narrative Spine을 먼저 제시하고 승인받는다.
brief-first 모드에서는 구조 제안 직전에 한 단락으로 스토리 흐름을 서술한다.

### Baseline Deck Grammar

`/create-deck`이 작성하는 기본 deck은 showcase 수준의 구조감을 갖춰야 한다.
사용자가 명시적으로 "목차 없이", "섹션 구분 페이지 없이", "ending 없이", "최대한 짧게"처럼 제외 의사를 밝힌 경우에만 아래 기본값을 생략한다.

```text
hero
→ agenda
→ section-divider + section slides
→ section-divider + section slides
→ optional summary
→ closing
```

기본 규칙:

- `agenda`: deck의 길이와 무관하게 기본 포함한다. 3장 이하의 초단기 deck이거나 사용자가 제외를 명시한 경우에만 생략한다.
- `section-divider`: 주요 흐름이 바뀌는 지점마다 기본 포함한다. 적어도 본론 시작 전 첫 section-divider는 포함한다.
- `closing`: 마지막 한 문장, Q&A, next step, contact 중 하나로 deck을 끝낸다. summary가 있어도 closing은 역할이 다르므로 기본 포함한다.
- `summary`: deck 전체 결론과 다음 행동을 2~3개로 정리할 가치가 있을 때 포함한다. 단순 안내·짧은 예시 deck에서는 생략할 수 있다.
- 일반 slide에는 `section_label`을 기본 작성한다. 예: `"01. PROBLEM"`, `"02. APPROACH"`, `"03. EVIDENCE"`.
- `section_label` 번호는 section-divider의 section 번호와 일관되게 유지한다.
- 사용자가 구조 제안에서 agenda / section-divider / closing을 제거하라고 승인하면 그 결정을 따른다.

### 슬라이드 타입 선택 가이드

AI는 source나 brief를 bullet로 그대로 옮기지 않고, 의미에 맞는 타입으로 승격한다.

| 상황 | 추천 타입 | 작성 원칙 / 경계 |
| --- | --- | --- |
| 항상 첫 슬라이드 | `hero` | — |
| 기본 목차 | `agenda` | 사용자가 제외하지 않으면 기본 포함. 3장 이하 초단기 deck만 생략 가능. |
| 주요 섹션 사이 구분 | `section-divider` | 본론 시작 전과 큰 흐름 전환 지점에 기본 포함. |
| 핵심 숫자 3~4개 강조 | `kpi` | 숫자·delta·trend 중심. 숫자가 근거 중 하나이면 `content`. |
| 텍스트 설명·불렛 포인트 | `content` | 숫자가 슬라이드 메시지 자체이면 `kpi`. |
| 좌우 중립 비교·두 관점 | `two-column` | 방향성 없는 병렬. 한쪽이 명확히 개선/제안이면 `comparison`. |
| 기존 vs 개선, 명확한 방향 대비 | `comparison` | 좌측(×), 우측(✓). 방향성 없으면 `two-column`. |
| 수치 추세·항목 비교·구성비 | `chart` | 추세·비교가 핵심. 항목이 많으면 `table`. |
| 행/열 구조의 다차원 비교 | `table` | 수치 추세가 핵심이면 `chart`. |
| 시스템·컴포넌트와 관계 | `architecture` | 구조·연결이 핵심. 순서가 핵심이면 `flow`. |
| 단계별 처리·업무 흐름 | `flow` | 방향·순서가 핵심. 구조·연결이 핵심이면 `architecture`. |
| 일정·로드맵·변화 과정 | `timeline` | 시간 순서나 milestone이 핵심. 인과 설명이 핵심이면 `content`. |
| 선택지·승인 요청·권고안 | `decision` | `recommendation`에 선택안을 쓴다. |
| 근거·명령·참고 자료 | `appendix` | 본문 흐름을 방해하지 않는 보조 정보. 핵심 메시지는 본문 slide에 둔다. |
| 결론·다음 단계 | `summary` | deck 결론을 정리할 가치가 있을 때 포함. closing을 대체하지 않는다. |
| 마지막 한 문장·Q&A | `closing` | 사용자가 제외하지 않으면 기본 포함. 새 정보 추가보다 기억할 문장에 집중. |

### 타입 선택 판단 예시 — 모호한 경계

**content vs kpi:**
- "배포 빈도 4배, MTTR 48h→8h, 변경 실패율 22%→5% — 3가지 수치가 메시지다" → `kpi`
- "마이크로서비스 전환으로 배포 빈도가 4배 향상됐고, 팀 간 의존성도 줄었다" → `content` (숫자는 근거 중 하나)

**two-column vs comparison:**
- "클라우드 A와 클라우드 B의 비용·성능 비교" → `two-column` (중립적 병렬, 방향성 없음)
- "수동 배포 방식과 자동화 배포의 차이" → `comparison` (기존이 문제, 제안이 해결 — 방향성 명확)

**chart vs table:**
- "분기별 배포 빈도 추이 (Q1~Q4)" → `chart line` (추세가 핵심)
- "팀별 배포 빈도·장애 건수·MTTR 비교" → `table` (3가지 속성을 행/열로 읽어야 이해됨)

**flow vs architecture:**
- "PR 생성 → 리뷰 → CI 통과 → 병합 → 배포" → `flow` (순서가 핵심)
- "API 서버, DB, 캐시, CDN이 어떻게 연결되는가" → `architecture` (연결 관계가 핵심)

**summary vs closing vs appendix:**
- "오늘 결론 3가지와 다음 행동" → `summary`
- "From plan to editable deck"처럼 마지막에 남길 한 문장 → `closing`
- "재생성 명령, 상세 수치 출처, 참고 링크" → `appendix`

### Action Title 원칙

슬라이드 `title`은 주제 라벨이 아니라 결론을 담은 선언형 문장이어야 한다.

```
✗ "Q2 성과"
✓ "배포 빈도 4배 향상으로 Q2 목표 초과 달성"

✗ "아키텍처 개요"
✓ "마이크로서비스 전환으로 장애 격리와 독립 배포 확보"

✗ "주요 지표"
✓ "MTTR 48h → 8h, 변경 실패율 22% → 5%로 안정성 회복"
```

예외: `hero`(간결 제목 허용), `agenda`('Agenda' 고정 허용), `section-divider`(섹션명 허용), `summary`('Summary' 고정 허용 — 단, `takeaways`에 실제 결론을 담는다)

구조 제안(GATE 2 이전) 단계에서 슬라이드 제목 초안을 작성할 때도 이 원칙을 적용한다.

### Emphasis hierarchy

| Field | 역할 |
| --- | --- |
| `title` | 슬라이드 결론. Action Title 원칙을 따른다. |
| `subtitle` | 제목 아래 맥락 보완. |
| `body` | 근거와 설명. |
| `callout` | 해당 슬라이드에서 기억할 한 문장. |
| `recommendation` | decision slide의 권고/선택. |
| `takeaways` | deck 또는 섹션 전체 요약. |
| `notes` | 발표자용 메모. 핵심 전달 메시지, 예상 질문, 전환 멘트를 담는다. |

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
- 본문, 표 셀, KPI label/value에는 footnote marker나 지원하지 않는 Markdown citation을 남기지 않는다.
  - 금지 예: `[^1]`, `[^]`, `[1]`, raw footnote definition.
  - 출처나 보충 설명이 필요하면 `notes`의 Expected question/Talk track 또는 appendix slide로 이동한다.
- 표 셀과 KPI에는 이모지/경고 아이콘 대신 짧은 텍스트를 쓴다.
  - 예: `⚠️` 대신 `주의`, `확인 필요`, `베타`.

component emphasis 결정 가이드:

강조 표현을 선택할 때 아래 순서로 판단한다.

1. **deck 전체 결론인가?** → `summary.takeaways`
2. **선택·승인·권고 문장인가?** → `decision.recommendation`
3. **이 슬라이드에서 가장 기억할 1문장인가?** → `callout`
4. 위에 해당 없으면 → `body` 항목에 포함

| 문장 | 판단 |
| --- | --- |
| "이 발표의 핵심: 파트너십으로 진입하고 2027년 내재화를 재검토한다" | deck 결론 → `summary.takeaways` |
| "2026년 파트너십 진입, 2027년 내재화 재검토를 권고한다" | 권고 문장 → `decision.recommendation` |
| "현 아키텍처는 일 10만 요청에서 병목이 발생한다" | 이 슬라이드 핵심 → `callout` |
| "배포 자동화는 3단계로 진행한다" | 설명 문장 → `body` 항목 |

callout 부가 기준:
- body bullet을 그대로 복사하지 않는다.
- 권장 밀도: 6장 deck 기준 1~2장. hard rule이 아니라 산만함을 막는 품질 가이드.

### Speaker Notes

blueprint 초안에는 기본적으로 모든 slide에 `notes`를 작성한다.
사용자가 "notes 제외" 또는 "슬라이드 본문만"을 명시한 경우에만 생략한다.

notes는 슬라이드 화면에 보이지 않는 발표자용 정보다. 본문을 반복하지 말고 발표자가 실제로 말할 내용을 압축한다.

권장 구성:

```text
Key message: 이 슬라이드에서 반드시 전달할 한 문장.
Talk track: 발표자가 20~40초 안에 설명할 요지.
Expected question: 청중이 물을 수 있는 질문 또는 확인 포인트.
Transition: 다음 슬라이드로 넘어가는 연결 멘트.
```

작성 기준:

- `hero`: 발표 목적과 오늘의 약속을 짧게 설명한다.
- `agenda`/`section-divider`: 왜 이 순서로 보는지, 다음 섹션에서 확인할 질문을 적는다.
- `chart`/`kpi`/`table`: 숫자의 해석, 주의할 기준, 데이터 한계를 적는다.
- `architecture`/`flow`: diagram을 읽는 순서와 강조할 boundary를 적는다.
- `decision`: 권고 이유와 trade-off 질문에 대한 답변 포인트를 적는다.
- `summary`/`closing`: 청중이 가져가야 할 결론과 next action을 적는다.
- notes가 길어져야 할 정보는 slide body로 끌어올리지 말고 appendix 또는 source 문서로 분리한다.

Icon policy:

- title에 arbitrary emoji를 자동 삽입하지 않는다.
- 아이콘은 이번 workflow에서 schema/render 대상이 아니다.
- 향후 icon을 지원할 때도 제한된 semantic icon set을 사용하고, title 문자열보다 section_label chip 또는 title-leading icon을 우선 검토한다.

### 목적별 권장 구성

**팀 성과 보고 (임원 대상, 15~20분):**
hero → agenda → section-divider → kpi → chart → section-divider → content → summary → closing

**기술 제안서 (엔지니어링 팀, 30분):**
hero → agenda → section-divider → content → architecture → section-divider → two-column → chart → summary → closing

**제품/도구 showcase (외부 공개, 10~15분):**
hero → agenda → section-divider → content → comparison → kpi → chart → section-divider → architecture → flow → table → summary → appendix → closing

**실행 계획/roadmap 공유 (팀 리드, 20분):**
hero → agenda → section-divider → content → timeline → section-divider → decision → summary → closing

**분기 리뷰 (전사, 10분):**
hero → agenda → section-divider → kpi → chart → summary → closing

**제안 제출 (고객, 20분):**
hero → agenda → section-divider → content × 2 → section-divider → two-column → summary → closing

제안 형식:
```
다음 구조를 제안합니다:

01. [hero]    — {발표 제목}
02. [agenda]  — {섹션 목록}
03. [section-divider] — 01. {첫 섹션명}
04. [kpi]     — {결론형 지표 제목}
05. [chart]   — {결론형 차트 제목}
06. [section-divider] — 02. {다음 섹션명}
07. [content] — {결론형 슬라이드 제목}
08. [summary] — Summary (필요 시)
09. [closing] — {마지막 메시지 또는 Q&A}

이 구조로 진행할까요? 슬라이드를 추가·제거하거나 순서를 바꾸고 싶으면 말씀해 주세요.
```

hero, agenda, section-divider, summary, closing을 제외한 슬라이드 제목은 구조 제안 단계부터 Action Title 원칙을 적용한다.

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
  author: # 작성자 — 생략 시 기본값(AI Deck Compiler) 사용, 표지와 PPTX metadata에 표시
  audience: # 청중 (선택)
```

**id 규칙:** 소문자, 하이픈, 고유값. 예: `hero-1`, `kpi-q2`, `arch-overview`

**언어 규칙 (DR-801):**
- `section_label`: 영어 UPPERCASE 고정 — `"01. PROBLEM"`, `"SOLUTION"`
- `left.label` / `right.label` (패널 라벨): 영어 UPPERCASE 권장 — `"CURRENT REALITY"`, `"OUR APPROACH"`
- `title`: 발표 언어 + Action Title 원칙 (Step 2 참조)
- `body` 항목: 발표 언어 + 기술 용어·지표는 영어 원문 유지

**section_label 작성 규칙:**
- hero / section-divider / closing을 제외한 일반 slide에는 `section_label`을 기본 작성한다.
- agenda에는 `"00. AGENDA"`를 권장한다.
- section 안의 일반 slide에는 `"01. PROBLEM"`, `"02. APPROACH"`, `"03. EVIDENCE"`처럼 번호와 영문 라벨을 함께 쓴다.
- appendix에는 `"APPENDIX"`를 쓴다.
- 사용자가 section chip을 원하지 않거나 매우 짧은 deck이라고 승인한 경우에만 생략한다.

**headline overflow 작성 규칙:**
- 일반 slide의 긴 Action Title은 renderer가 compact header typography와 더 큰 title box로 대응한다.
- headline이 길다는 이유만으로 메시지를 "현황", "개요", "결과" 같은 라벨형 제목으로 약화하지 않는다.
- 제목이 2줄 이상으로 길어질 정도의 맥락은 `subtitle`, `body`, `callout`으로 분리한다.
- hero / section-divider / closing은 큰 typography를 쓰므로 더 짧은 제목을 우선한다.

**슬라이드 타입별 필수 필드:**

아래 `title`과 `body` 항목은 스키마 구조 참조용 placeholder다. 실제 blueprint 작성 시 `title`은 Action Title 원칙(Step 2)을 적용한다.

```yaml
# hero
- id: hero-1
  type: hero
  title: 발표 제목
  subtitle: 부제목 (선택)
  cta: 날짜 또는 팀명 (선택)
  notes: |
    Key message: 오늘 발표의 목적과 청중이 얻어갈 결론을 먼저 고정한다.
    Talk track: 제목과 부제를 연결해 왜 이 주제가 지금 중요한지 설명한다.
    Expected question: 발표 범위와 의사결정 필요 여부.
    Transition: 먼저 전체 흐름을 짚고 핵심 지표나 문제 정의로 이동한다.

# kpi — kpis 배열, 최대 4개
- id: kpi-1
  type: kpi
  section_label: "01. PERFORMANCE"
  title: MTTR 48h → 8h, 변경 실패율 22% → 5%로 안정성 회복  # Action Title 예시
  kpis:
    - label: 지표명
      value: "값"      # 따옴표로 감싸기
      delta: "+10%"    # 선택
      trend: up        # up | down | neutral

# chart — inline 데이터 사용
- id: chart-1
  type: chart
  section_label: "01. PERFORMANCE"
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
  section_label: "02. APPROACH"
  title: 배포 자동화 3단계로 릴리즈 주기 단축 확보  # Action Title 예시
  body:
    - 핵심 포인트 1
    - 핵심 포인트 2
    - 핵심 포인트 3
  notes: |
    Key message: 이 슬라이드는 핵심 주장의 근거를 압축해 설명한다.
    Talk track: body 항목을 그대로 읽지 말고 원인, 영향, 다음 행동 순서로 풀어 말한다.
    Expected question: 근거 데이터와 적용 범위.
    Transition: 다음 slide에서 숫자, 구조, 또는 선택지로 구체화한다.

# architecture — zone 기반 배치
- id: arch-1
  type: architecture
  section_label: "02. ARCHITECTURE"
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
  section_label: "03. TAKEAWAYS"
  title: Summary
  body:
    - 핵심 내용 요약
  takeaways:
    - 청중이 기억할 것 1
    - 청중이 기억할 것 2

# two-column — 좌우 두 관점 또는 비교
- id: two-col-1
  type: two-column
  section_label: "02. COMPARISON"
  title: 슬라이드 제목
  left:
    label: "CURRENT APPROACH"   # 영어 UPPERCASE 권장, 선택
    body:
      - 왼쪽 항목 1
      - 왼쪽 항목 2
  right:
    label: "PROPOSED APPROACH"  # 영어 UPPERCASE 권장, 선택
    body:
      - 오른쪽 항목 1
      - 오른쪽 항목 2

# section-divider — 섹션 구분 슬라이드
- id: section-div-1
  type: section-divider
  number: "01"              # 좌측 accent 컬럼 대형 숫자, 선택
  section: "SECTION 01"    # 영어 UPPERCASE, 선택
  title: 섹션 제목          # Action Title 예외 허용
  subtitle: 이 섹션에서 다룰 내용  # 선택

# comparison — 기존 vs 제안 명확한 대비
- id: comparison-1
  type: comparison
  section_label: "02. COMPARISON"
  title: 기존 방식과 제안 방향의 핵심 차이
  left:
    label: "CURRENT APPROACH"   # 생략 시 "BEFORE" 기본값
    body:
      - "수동 배포 체크리스트"
      - "격주 릴리즈 사이클"
  right:
    label: "PROPOSED APPROACH"  # 생략 시 "AFTER" 기본값
    body:
      - "자동화 게이트 검증"
      - "일일 배포 가능"

# table — 행/열 비교
- id: table-1
  type: table
  section_label: "03. EVIDENCE"
  title: 세 가지 preset은 같은 content를 다른 발표 톤으로 전환한다
  headers: [Preset, Theme, Best for]
  rows:
    - [teal, dark, AI-native technical story]
    - [modern, light, Executive report]
    - [vivid, dark, Product showcase]

# timeline — 일정·milestone
- id: timeline-1
  type: timeline
  section_label: "03. ROADMAP"
  title: 3단계 전환으로 rollout risk를 낮춘다
  items:
    - date: Week 1
      label: Baseline
      description: 현재 지표와 pain point 정리
    - date: Week 2
      label: Pilot
      description: 핵심 workflow 1개에 적용
    - date: Week 3
      label: Rollout
      description: 검증 결과를 기준으로 확장

# flow — 단계별 처리 흐름
- id: flow-1
  type: flow
  section_label: "02. WORKFLOW"
  title: Review gate를 통과하며 초안이 산출물로 바뀐다
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: brief
        kind: client
        label: Brief
        zone: left
      - id: blueprint
        kind: service
        label: blueprint.yaml
        zone: center
      - id: pptx
        kind: storage
        label: Editable PPTX
        zone: right
    edges:
      - from: brief
        to: blueprint
        kind: data-flow
      - from: blueprint
        to: pptx
        kind: data-flow
  callout: Preview review 후 필요한 수정만 blueprint에 반영한다

# decision — 선택지와 권고
- id: decision-1
  type: decision
  section_label: "04. DECISION"
  title: Public showcase는 제품 자체를 설명하는 deck으로 둔다
  options:
    - label: Generic sample
      pros:
        - 만들기 쉽다
      cons:
        - 제품 메시지가 약하다
    - label: Product proof deck
      pros:
        - workflow와 출력 품질을 동시에 보여준다
      cons:
        - content 품질 기준이 높다
  recommendation: Product proof deck을 대표 예제로 유지한다

# appendix — 보조 정보와 code block
- id: appendix-1
  type: appendix
  section_label: "APPENDIX"
  title: Appendix
  body:
    - "```bash\nnpm run validate -- --blueprint blueprints/example.yaml\nnpm run deck -- --blueprint blueprints/example.yaml --output output/example-v1.0.pptx\n```"
    - 상세 근거와 source는 speaker notes 또는 별도 문서에 둔다

# closing — 마지막 메시지
- id: closing-1
  type: closing
  message: Thank you
  title: From prompt to editable proof artifact
  subtitle: Questions and next steps
```

comparison은 좌측(×, 회색) vs 우측(✓, accent) 시각 대비. 양쪽 항목 수를 맞추는 것이 좋다.

초안 작성 후:
```
blueprints/{slug}.yaml을 작성했습니다.

[blueprint.yaml 내용 전체 표시]

각 슬라이드를 검토해 주세요. 수정할 내용이 있으면 말씀해 주세요.
수정할 내용이 없으면 "진행해" 또는 "PPTX 생성해줘"라고 답해 주세요. 그러면 validation 후 PPTX를 생성하겠습니다.
```

→ **[GATE 3] 사용자가 검토 완료를 확인한 뒤에만 Step 4 검토·보완 반복으로 진행한다.**

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

    자료를 어떻게 준비할까요? (간단 brief 기반 / 정리된 파일 제공 / AI가 초안부터 구성)
    발표 시간이나 슬라이드 수는요? 임원진이 꼭 기억해야 할 핵심 지표나 메시지가 있나요?
    강조할 수치나 차트 데이터가 있나요?

사용자: 20분, 배포 빈도랑 MTTR 개선 보여주고 싶어. 트렌드 차트 있어. dark.

AI: 알겠습니다. 다음 구조를 제안합니다:

    01. [hero]    — Q2 Engineering Performance Review
    02. [agenda]  — 4개 섹션 (현황 / 지표 / 성과 / 다음 분기)
    03. [kpi]     — 배포 빈도 4배 향상, MTTR 48h → 8h, 변경 실패율 22% → 5%로 안정성 회복
    04. [chart]   — 주간 배포 빈도는 자동화 이후 4배 증가
    05. [chart]   — MTTR은 48h에서 8h로 단축
    06. [content] — 자동화 게이트와 관찰 가능성이 안정성 개선을 견인
    07. [summary] — Summary

    이 구조로 진행할까요?

사용자: ㅇㅇ, chart 데이터는 내가 줄게.

AI: 네, blueprint 초안을 작성하겠습니다.
    차트 데이터를 준비되면 알려주세요.
```

```yaml
# blueprints/q2-engineering-review.yaml (초안 예시)
deck:
  title: Q2 Engineering Performance Review
  design: teal
  theme: dark
  version: "1.0"
  author: Engineering Team
  audience: 임원진

slides:
  - id: hero-1
    type: hero
    title: Q2 Engineering Performance Review
    subtitle: 배포 자동화와 안정성 강화 성과
    cta: "2026 Q2 | Engineering"

  - id: agenda-1
    type: agenda
    title: 오늘 볼 것
    section_label: "00. AGENDA"
    items:
      - 성과 지표
      - 안정성 개선
      - Q3 실행 계획

  - id: section-performance
    type: section-divider
    number: "01"
    section: "PERFORMANCE"
    title: Q2 성과는 배포 속도와 안정성을 함께 개선했다
    subtitle: 핵심 지표를 먼저 확인한다

  - id: kpi-1
    type: kpi
    section_label: "01. PERFORMANCE"
    title: 배포 빈도 4배 향상으로 Q2 목표 초과 달성
    kpis:
      - label: 배포 빈도
        value: "4x"
        delta: "+300%"
        trend: up
      - label: MTTR
        value: "8h"
        delta: "-83%"
        trend: down
      - label: 변경 실패율
        value: "5%"
        delta: "-17pp"
        trend: down

  - id: summary-1
    type: summary
    section_label: "02. TAKEAWAYS"
    title: Summary
    body:
      - 배포 자동화 파이프라인 구축으로 분기 목표 초과 달성
      - MTTR 48h → 8h, 장애 격리 체계 확보
    takeaways:
      - 자동화 게이트 도입으로 배포 빈도 4배, 안정성 지표 전 항목 개선
      - Q3 목표: 일일 배포 체계 완성 + 관찰 가능성 강화

  - id: closing-1
    type: closing
    message: Next step
    title: Q3는 일일 배포 체계 완성에 집중한다
    subtitle: Discussion and decision
```

---

## 관련 파일

- `src/design/presets/teal/ppt-layouts.md` — 슬라이드 타입별 레이아웃 (teal 기본값)
- `src/design/presets/teal/ppt-chart-rules.md` — 차트 데이터 형식
- `src/design/presets/modern/ppt-layouts.md` — legacy/light 전용 레이아웃 참조
- `schemas/blueprint.schema.json` — 전체 스키마 참조
