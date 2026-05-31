---
name: "generate-architecture-slide"
description: "자연어 아키텍처 설명을 받아 architecture slide diagram spec(source: inline)을 생성하는 skill"
---

# generate-architecture-slide

`skills/generate-architecture-slide.md`를 로드하여 절차를 따른다.

`create-deck` / `generate-blueprint` 내부에서 architecture slide 작성 시 내부적으로 이 절차를 따른다.
단독 호출 시에는 architecture slide snippet만 생성하고 종료한다.

## Trigger

- "아키텍처 슬라이드 만들어줘", "architecture slide 생성해줘", `/generate-architecture-slide` 의도 감지 시
- `create-deck` / `generate-blueprint` 진행 중 architecture slide 작성이 필요할 때

## Procedure

`skills/generate-architecture-slide.md`의 Step 0~7을 순서대로 수행한다.

1. Step 0: 호출 컨텍스트 판별 (단독 vs 내부 호출)
2. Step 1: 아키텍처 설명 입력 수집
3. Step 2: 컴포넌트 추출 + node kind 분류
4. Step 3: 토폴로지 분석 + 노드 수 확인 (9개 초과 시 협의)
5. Step 4: Zone 배치 (중복 금지)
6. Step 5: Edge 추출 + from/to 유효성 검증
7. Step 6: Groups 식별 (선택)
8. Step 7: YAML 출력 + 자체 체크리스트 수행

상세: `skills/generate-architecture-slide.md`
