# Skill: review-deck

생성된 deck(blueprint.yaml)을 분석하여 구조·메시지·디자인 일관성을 검토하고
blueprint 수정 제안을 actionable 형식으로 출력하는 skill.

**진입 경로:**
- Claude Code: `/review-deck`
- Codex CLI/App: `.agents/skills/review-deck/SKILL.md` 로드
- Claude 채팅: 이 파일 내용을 참조하여 대화 절차 수행

---

## 이 skill이 하는 일

```
blueprint.yaml 입력 (또는 경로 지정)
  → Step 1: 대상 파일과 검토 범위 확인
  ── [GATE 1] 파일 확인 후 진행 ──
  → Step 2: 7종 항목 분석
  → Step 3: 검토 보고서 출력
  ── [GATE 2] 보고서 확인 후 진행 ──
  → Step 4: blueprint 수정 제안 생성
  ── [GATE 3] 수정 적용 여부 확인 후 진행 ──
  → Step 5: (선택) 수정 적용
```

**MUST:** 각 GATE에서 반드시 멈추고 사용자 응답을 기다린다.
보고서와 수정 제안을 동시에 출력하지 않는다. 먼저 보고서를 확인받은 뒤 제안으로 진행한다.

---

## Step 1 — 대상 확인

blueprint 파일 경로가 제공되지 않으면 묻는다.

```
검토할 blueprint.yaml 경로를 알려주세요.
(예: blueprints/q2-review.yaml, examples/basic/blueprint.yaml)

특정 항목만 집중 검토를 원하면 말씀해 주세요:
- 전체 검토 (기본값)
- 슬라이드 흐름만
- 메시지 일관성만
- 텍스트 분량만
- 차트·표 데이터만
- 청중 적합성만
- preview visual만
- PPTX metadata만
```

파일을 읽어 `deck` 메타데이터(제목, 청중, 테마)와 슬라이드 목록을 파악한다.
PPTX 또는 preview PNG 경로가 제공되면 함께 확인한다.

→ **[GATE 1] 파일 확인 및 검토 범위 합의 후에만 분석을 시작한다.**

---

## Step 2 — 7종 항목 분석

### 1. 슬라이드 흐름 (Flow)

전체 슬라이드 순서의 논리적 흐름을 평가한다.

확인 기준:
- 오프닝(hero) → 본론 → 클로징(summary/closing) 구조가 갖춰져 있는가
- 섹션 전환이 자연스러운가 (`section-divider` 배치 적절성)
- 슬라이드 수가 발표 시간에 적합한가 (참고: 1장 = 약 1.5~2분)
- 흐름상 빠진 슬라이드나 불필요하게 중복된 슬라이드가 있는가

출력 형식:
```
[흐름] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제
평가: {1~2문장}
발견: {구체적 슬라이드 id 및 이유}
```

### 2. 메시지 일관성 (Message Consistency)

핵심 메시지가 전체 deck을 통해 일관되게 유지되는지 평가한다.

확인 기준:
- 각 슬라이드의 `title`이 Action Title 원칙(결론 선언형)을 따르는가
- hero의 제목과 summary의 takeaways가 같은 메시지를 강화하는가
- 슬라이드 간 주장이 상충하거나 방향이 엇갈리는 곳이 없는가
- section_label이 본문 내용과 일치하는가

출력 형식:
```
[메시지] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제
평가: {1~2문장}
발견: {구체적 슬라이드 id 및 이유}
```

### 3. 텍스트 분량 (Text Volume)

슬라이드당 텍스트 밀도가 적절한지 평가한다.

확인 기준:
- `content` 슬라이드의 `body` 항목이 5개를 초과하지 않는가
- 단일 `body` 항목이 40자(한국어 기준)를 넘지 않는가
- `two-column`의 좌우 항목 수가 균형을 이루는가 (±1개 이내)
- `summary`의 `takeaways`가 3개 이하로 핵심만 담고 있는가

출력 형식:
```
[텍스트] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제
평가: {1~2문장}
발견: {초과 슬라이드 id + 항목 수}
```

### 4. 차트·표 데이터 명확성 (Data Clarity)

차트와 표의 데이터 구조가 의도를 명확히 전달하는지 평가한다.

확인 기준:
- `chart` 슬라이드의 `title`이 차트가 보여주는 결론을 담고 있는가 (예: "배포 빈도 40% 증가" vs "배포 빈도")
- 차트 타입이 데이터 형태에 맞는가 (비교→bar, 추세→line, 비율→pie/donut)
- `series.values`가 비어 있거나 placeholder 값(예: 0, 1, 2)으로 채워져 있지 않은가
- `table`의 `headers`와 `rows` 컬럼 수가 일치하는가
- `kpi`의 `delta`와 `trend` 방향이 일치하는가 (예: delta "+10%"인데 trend "down")

출력 형식:
```
[데이터] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제
평가: {1~2문장}
발견: {슬라이드 id + 구체적 이유}
```

### 5. 청중 적합성 (Audience Fit)

`deck.audience`에 명시된 청중에게 내용·언어·깊이가 적합한지 평가한다.

확인 기준:
- 임원 대상: 결론 먼저, KPI 중심, 기술 용어 최소화
- 엔지니어링 팀: 기술 세부사항 포함 가능, architecture 슬라이드 환영
- 고객·외부: 내부 지표·용어 노출 최소화, 가치 중심 서술
- 발표 언어(한국어/영어)가 `title`과 `body` 전체에 일관되게 적용되었는가

출력 형식:
```
[청중] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제
평가: {1~2문장}
발견: {부적합 슬라이드 id + 이유}
```

### 6. Preview Visual Review

preview PNG가 있으면 blueprint 구조 검토와 함께 실제 화면 기준으로 평가한다.

확인 기준:
- 제목/본문 overflow가 없는가
- 하단 또는 주요 영역에 과도한 빈 공간이 없는가
- chart/table 텍스트가 읽히는가
- preset/theme/brand footer가 일관되게 보이는가
- 강조 요소가 메시지 우선순위를 방해하지 않는가

preview가 없으면 다음 명령으로 생성을 제안한다.

```bash
npm run preview -- output/{slug}.pptx --out output/{slug}-preview
```

preview 도구가 없으면 PowerPoint/Keynote 수동 확인으로 대체한다.

출력 형식:
```
[Preview] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제 | ⏭️ 미확인
평가: {1~2문장}
발견: {slide 번호 또는 확인 불가 사유}
```

### 7. PPTX Metadata

PPTX 경로가 있으면 document properties가 blueprint metadata와 일치하는지 확인한다.

확인 기준:
- `dc:title`이 `deck.title`과 일치하는가
- `dc:creator`가 `deck.author` 또는 preset brand author fallback과 일치하는가
- `dc:subject`가 `deck.title`/`deck.audience` 기반으로 채워져 있는가
- `PptxGenJS Presentation` / `PptxGenJS` 기본값이 남아 있지 않은가

검증 명령:

```bash
unzip -p output/{slug}.pptx docProps/core.xml | rg "dc:title|dc:creator|dc:subject|cp:revision"
```

출력 형식:
```
[Metadata] ✅ 양호 | ⚠️ 개선 필요 | ❌ 문제 | ⏭️ 미확인
평가: {1~2문장}
발견: {불일치 필드 또는 확인 불가 사유}
```

---

## Step 3 — 검토 보고서 출력

7종 항목 결과를 하나의 보고서로 정리해 출력한다.

```
## Deck Review — {deck.title}

| 항목 | 상태 | 핵심 발견 |
|------|------|----------|
| 슬라이드 흐름 | ✅/⚠️/❌ | {한 줄 요약} |
| 메시지 일관성 | ✅/⚠️/❌ | {한 줄 요약} |
| 텍스트 분량 | ✅/⚠️/❌ | {한 줄 요약} |
| 차트·표 데이터 | ✅/⚠️/❌ | {한 줄 요약} |
| 청중 적합성 | ✅/⚠️/❌ | {한 줄 요약} |
| Preview | ✅/⚠️/❌/⏭️ | {한 줄 요약} |
| Metadata | ✅/⚠️/❌/⏭️ | {한 줄 요약} |

총 {n}개 개선 항목 발견.

수정 제안을 보여드릴까요?
```

→ **[GATE 2] 보고서를 확인한 뒤 수정 제안 진행 여부를 확인한다.**

---

## Step 4 — Blueprint 수정 제안

⚠️ 또는 ❌ 항목에 대해 blueprint 수정 제안을 생성한다.
각 제안은 slide id, 필드, 변경 전/후를 명시한다.

출력 형식:

```
### 수정 제안

**[1] {슬라이드 id} — {항목명}**
이유: {왜 변경이 필요한가}

변경 전:
  {field}: {현재 값}

변경 후:
  {field}: {제안 값}

---

**[2] {슬라이드 id} — {항목명}**
이유: {왜 변경이 필요한가}

변경 전:
  {field}: {현재 값}

변경 후:
  {field}: {제안 값}
```

제안 우선순위 기준: ❌ → ⚠️, 흐름·메시지 문제 → 데이터·텍스트 문제

→ **[GATE 3] 적용할 제안 번호를 확인한다. "전체 적용", "1, 3번만", "직접 수정" 중 선택.**

---

## Step 5 — 수정 적용 (선택)

사용자가 승인한 제안을 blueprint.yaml에 직접 반영한다.

```bash
# 수정 후 유효성 검사
npm run validate -- --blueprint {path}
```

수정 완료 후:
```
{n}개 항목을 수정했습니다.

다시 PPTX를 생성하려면:
npm run deck -- --blueprint {path} --output output/{slug}-v{version}.pptx
```

---

## 예제 세션

```
사용자: blueprints/q2-review.yaml 검토해줘.

AI: 파일을 읽겠습니다. 전체 검토로 진행할까요,
    아니면 특정 항목만 집중 검토할까요?

사용자: 전체로.

AI: ## Deck Review — Q2 Engineering Performance Review

    | 항목 | 상태 | 핵심 발견 |
    |------|------|----------|
    | 슬라이드 흐름 | ✅ | 7장 구성, 흐름 자연스러움 |
    | 메시지 일관성 | ⚠️ | slide chart-2 title이 결론이 아닌 제목형 |
    | 텍스트 분량 | ⚠️ | content-3 body 7개 — 권장(5개) 초과 |
    | 차트·표 데이터 | ✅ | 데이터 완비, 타입 적절 |
    | 청중 적합성 | ✅ | 임원 대상에 적합 |

    총 2개 개선 항목 발견. 수정 제안을 보여드릴까요?

사용자: 응.

AI: ### 수정 제안

    **[1] chart-2 — 메시지 일관성**
    이유: title이 현상 기술(배포 빈도 추이)이며 결론이 없음

    변경 전:
      title: "배포 빈도 추이"

    변경 후:
      title: "배포 빈도 40% 개선 — 분기 최고치 달성"

    ---

    **[2] content-3 — 텍스트 분량**
    이유: body 7개 → 청중이 한 슬라이드에서 소화하기 어려움

    변경 전:
      body: [7개 항목]

    변경 후:
      body: [상위 5개 핵심 항목만 유지, 나머지는 notes로 이동]

    적용할 항목을 알려주세요. (전체 적용 / 1번만 / 직접 수정)
```

---

## 관련 파일

- `skills/create-deck.md` — blueprint 작성 skill
- `skills/generate-blueprint.md` — blueprint 집중 생성 skill
- `src/design/presets/default-modern/ppt-layouts.md` — 슬라이드 타입별 레이아웃
- `schemas/blueprint.schema.json` — 전체 스키마 참조
