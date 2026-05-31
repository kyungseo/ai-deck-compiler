---
name: "review-deck"
description: "생성된 deck(blueprint.yaml)을 분석하여 구조·메시지·디자인 일관성을 검토하고 blueprint 수정 제안을 출력하는 skill"
---

# review-deck

`skills/review-deck.md`를 로드하여 절차를 따른다.

**MUST:** 보고서와 수정 제안을 동시에 출력하지 않는다.
각 GATE에서 반드시 멈추고 사용자 응답을 기다린다.

## Trigger

- 사용자가 생성된 PPT, deck, blueprint 검토를 요청할 때
- "deck 검토해줘", "PPT 리뷰해줘", "/review-deck" 의도가 감지될 때
- create-deck Step 6 이후 review loop로 연결될 때

## Procedure

`skills/review-deck.md`의 Step 1~5를 순서대로 수행한다.

Gate 구조:
- [GATE 1] 대상 파일·검토 범위 확인 → Step 2
- [GATE 2] 검토 보고서 확인 → Step 4
- [GATE 3] 수정 적용 여부 확인 → Step 5

검토 항목 7종: 슬라이드 흐름, 메시지 일관성, 텍스트 분량, 차트·표 데이터 명확성, 청중 적합성, preview visual, PPTX metadata
상세: `skills/review-deck.md`
