---
description: "생성된 deck(blueprint.yaml)의 구조·메시지·디자인 일관성을 검토하고 blueprint 수정 제안을 출력한다"
argument-hint: "[blueprint 파일 경로 — 없으면 대화로 파악]"
disable-model-invocation: true
---

`skills/review-deck.md`를 로드해서 아래 절차를 따라줘.

**MUST:** 보고서와 수정 제안을 동시에 출력하지 않는다. 각 GATE에서 반드시 멈추고 사용자 응답을 기다린다.

## Step 1 — 대상 확인

`$ARGUMENTS`가 있으면 blueprint 파일 경로로 사용한다. 없으면 아래 안내를 출력한다.

```
검토할 blueprint.yaml 경로를 알려주세요.
(예: blueprints/q2-review.yaml, examples/basic/blueprint.yaml)

특정 항목만 집중 검토를 원하면 말씀해 주세요:
- 전체 검토 (기본값)
- 슬라이드 흐름만 / 메시지 일관성만 / 텍스트 분량만 / 차트·표 데이터만 / 청중 적합성만
- preview visual만 / PPTX metadata만
```

파일을 읽어 `deck` 메타데이터(제목, 청중, 테마)와 슬라이드 목록을 파악한다.
PPTX 또는 preview PNG 경로가 제공되면 함께 확인한다.

→ **[GATE 1] 파일 확인 및 검토 범위 합의 후에만 분석을 시작한다.**

## Step 2 — 7종 항목 분석

`skills/review-deck.md` §Step 2의 기준에 따라 분석한다.

검토 항목: 슬라이드 흐름 / 메시지 일관성 / 텍스트 분량 / 차트·표 데이터 명확성 / 청중 적합성 / preview visual / PPTX metadata

## Step 3 — 검토 보고서 출력

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

→ **[GATE 2] 보고서 확인 후 수정 제안 진행 여부를 확인한다.**

## Step 4 — Blueprint 수정 제안

`skills/review-deck.md` §Step 4의 출력 형식을 따른다.
각 제안: slide id + field + 변경 전/후. 우선순위: ❌ → ⚠️, 흐름·메시지 → 데이터·텍스트.

→ **[GATE 3] 적용할 제안 번호를 확인한다. "전체 적용" / "번호 지정" / "직접 수정" 중 선택.**

## Step 5 — 수정 적용 (선택)

사용자가 승인한 제안을 blueprint.yaml에 반영하고 유효성 검사를 실행한다.

```bash
npm run validate -- --blueprint {path}
```

---

**참고:**
- 전체 검토 기준: `skills/review-deck.md`
- Blueprint 스키마: `schemas/blueprint.schema.json`
