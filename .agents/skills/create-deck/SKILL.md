---
name: "create-deck"
description: "사용자와 대화하며 blueprint.yaml을 작성하고 editable PPTX를 생성하는 end-to-end 인터랙티브 워크플로우"
---

# create-deck

`skills/create-deck.md`를 로드하여 절차를 따른다.

**MUST:** 각 GATE에서 반드시 멈추고 사용자 응답을 기다린다.
"간단하게", "빠르게", "테스트용" 등을 말해도 GATE를 건너뛰지 않는다.
승인 없이 다음 Step으로 진행하지 않는다.

## Trigger

- 사용자가 PPT, 발표 자료, deck, blueprint 생성을 요청할 때
- "PPT 만들어줘", "발표 자료 작성해줘", "/create-deck" 의도가 감지될 때

## Procedure

`skills/create-deck.md`의 Step 1~6를 순서대로 수행한다.

Gate 구조:
- [GATE 1] Context 수집 완료 → Step 2
- [GATE 2] 슬라이드 구조 승인 → Step 3
- [GATE 3] Blueprint 검토 완료 → Step 5
- [GATE 4] "생성해줘" 확인 → Step 5

Step 6(결과 확인)에서 review-deck으로 이어지는 선택 review loop를 안내한다.
상세: `skills/create-deck.md` §Step 6
