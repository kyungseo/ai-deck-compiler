---
id: FEAT-20260601-011
title: "create-deck skill 콘텐츠 정비 — B안 구조 개선"
status: Archived
created: 2026-06-01
actual_end: 2026-06-01
type: FEAT
branch: feature/FEAT-20260601-011-create-deck-skill-improvement
---

# FEAT-20260601-011 — create-deck skill 콘텐츠 정비

## Goal

FEAT-20260601-010에서 통합 완료된 `skills/create-deck.md`의 콘텐츠 품질을 강화한다.
중복 구조 정리, Action Title 원칙 위치 재배치, 슬라이드 타입 판단 예시 확장을 통해
AI가 이 skill을 읽었을 때 정확하게 동작하도록 개선한다.

이 파일은 AI workflow 전반에서 main command로 사용되므로, 구조적 불명확함이
모든 도구(Claude Code, Codex, Cursor)에서 반복 오류로 이어질 수 있다.

---

## Motivation

FEAT-20260601-010 통합 완료 후 세션 분석(2026-06-01)에서 발견된 3가지 구조적 약점:

1. **타입 선택 가이드 중복**
   - "슬라이드 타입 선택 가이드"(상황 → 추천 타입)와 "Semantic component selection"(입력 내용 → 우선 표현) 두 테이블이 유사한 목적을 이중 서술.
   - AI가 어느 것을 우선할지, 둘 다 참조해야 하는지 불명확.

2. **Action Title 원칙 위치 어긋남**
   - Step 2 Emphasis hierarchy에서 "Action Title 원칙을 따른다"고만 언급하고 실제 원칙은 Step 3에 있음.
   - 구조 제안(Step 2) 단계에서 슬라이드 제목을 작성할 때 원칙을 아직 읽지 않음 → 주제 라벨형 제목 오류 발생 가능.

3. **판단 예시 부족**
   - callout 판단 예시 1개뿐이고 결론이 불확정 ("context에 따라 3가지 모두 가능").
   - 슬라이드 타입 간 ambiguous 쌍(4가지)에 대한 판단 예시 없음.

---

## Scope (B안)

### 변경 대상

- `skills/create-deck.md` 만 변경. 타 파일 없음.

### 작업 항목

1. **두 타입 선택 표 통합**
   - "슬라이드 타입 선택 가이드" + "Semantic component selection"을 단일 섹션으로 재편.
   - 각 타입에 "언제 쓰는가 + ambiguous 쌍과의 구분"을 판단 예시로 추가.

2. **Action Title 원칙 Step 2로 이동**
   - Step 3에 있던 Action Title 원칙(✗/✓ 예시 포함)을 Step 2 구조 제안 섹션으로 이동.
   - Step 3에는 "Step 2 Action Title 원칙 참조" forward reference만 남김.

3. **component emphasis 결정 가이드 신설**
   - callout / recommendation / takeaways 우선순위 명확화.
   - 판단 예시를 "불확정 나열"에서 "우선순위 기반 결정 트리"로 재작성.

4. **Step 1 질문 재배치**
   - 현재 12가지 속성이 동등하게 나열됨.
   - 필수(목적·청중·분량·핵심 메시지) → 선택(데이터·톤·출처·품질 기준 등) 순으로 재배치.

5. **예제 세션 보강**
   - 현재 예제는 Step 2(구조 제안)까지만 커버.
   - Step 3 blueprint YAML 스니펫 2~3개 슬라이드 추가.

---

## Non-goals

- `skills/create-deck.md` 외 파일 변경 없음
- 새 슬라이드 타입 추가 없음
- blueprint 스키마 변경 없음
- `skills/generate-blueprint.md` 삭제 없음

---

## Done Criteria

- [x] 두 타입 선택 표가 하나의 통합 섹션으로 합쳐지고, 각 타입에 판단 예시 포함
- [x] ambiguous 쌍 4가지 판단 예시 포함 (two-column vs comparison, chart vs table, flow vs architecture, content vs kpi)
- [x] Action Title 원칙이 Step 2 내에 위치하고 Step 3에는 forward reference만 남음
- [x] component emphasis 결정 가이드가 우선순위 기반으로 재작성됨
- [x] Step 1에 [진행 방식] 질문 복구 + "초기 최대 3문항 + 후속 확인" 구조로 정리
- [x] 예제 세션에 blueprint YAML 스니펫 포함 (hero + kpi + summary 등 2~3개)
- [x] 변경 후 GATE 1~4 흐름이 손상되지 않음 (파일 전체 재독 확인)
- [x] Action Title 예외에 summary 추가 (`takeaways`에 실제 결론을 담는다 정책 명시)
- [x] proposal format placeholder를 결론형 제목으로 업데이트 + Action Title 적용 범위 명시
- [x] YAML 필수 필드 placeholder 명시 + kpi/content Action Title 예시 교체
- [x] AI-research-first 설명에 AI-draft-first 의미 보강
- [x] 변경 전후 라인 수 기록: 535줄(FEAT-010 시작) → 596줄(B안) → 600줄(최종)

---

## Discovery

### 2026-06-01 — 구현 완료

- FEAT-20260601-010 통합 완료 직후 콘텐츠 분석 결과로 이 Work 시작.
- 535줄(FEAT-010) → 600줄(FEAT-011 최종). 순증 +65줄.
- B안 전체 구현: 타입 선택 표 통합, ambiguous 4쌍 판단 예시, Action Title Step 2 이동, component emphasis 결정 가이드, 초기 3문항 + [진행 방식] 복구, YAML placeholder 명시, AI-draft-first 설명 보강.
- 재검토 2회 반영: 예제 세션 3문항 정렬, chart/content Action Title 보정, summary "Summary" 예외 정책 명시.
