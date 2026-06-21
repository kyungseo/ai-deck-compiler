# Decision Records

`ai-deck-compiler`의 결정 근거 인덱스. 각 DR은 하나의 결정 이유(WHY)를 기록한다.

DR ID 대역(`docs/HARNESS-NAMING-RULES.md` §DR ID): framework/source DR은 799번 이하(`DR-0xx`~`DR-7xx`), 이 repository의 product-local DR은 800–999번(`DR-8xx`~`DR-9xx`)을 쓴다. Superseded DR은 `docs/archive/docs/decisions/`로 이동한다.

## Framework DR (source 유래, `DR-0xx`~`DR-7xx`)

| DR | Title | Status |
| --- | --- | --- |
| DR-007 | 파일 유형별 작성 언어 원칙 | Accepted (Amended) |
| DR-008 | docs/ 파일명 대소문자 표준 | Accepted |
| DR-013 | Work 파일 기반 작업 단위 체계 도입 | Accepted (Amended 2026-06-07) |
| DR-014 | Archive 구조 정책 — 경로 미러링 및 버전 관리 | Accepted |
| DR-027 | Troubleshooting / Retrospective 파일 최소 스펙 | Accepted |
| DR-029 | DR Registration Triage + Draft DR Lifecycle Completion | Accepted |

## Product DR (ai-deck-compiler 제품 결정, `DR-8xx`~`DR-9xx`)

| DR | Title | Status |
| --- | --- | --- |
| DR-801 | PPT 콘텐츠 작성 언어 원칙 | Accepted |
| DR-802 | Design Preset 기본 추천 정책 — teal + dark | Accepted |
| DR-803 | Showcase examples/results/*.pptx git 추적 정책 | Accepted |
| DR-804 | generate-blueprint → create-deck 통합 | Accepted |

<!-- 2026-06-21 namespace migration (harness CHORE-20260621-004): harness namespace 정책에 따라 기존 저번호 product DR을 800번대로 renumber. archive의 old-ID 참조는 historical로 보존. -->
