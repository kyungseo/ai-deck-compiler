---
name: "generate-blueprint"
description: "발표 목적과 내용을 기반으로 blueprint.yaml 초안을 생성하는 집중형 skill"
---

# generate-blueprint

`skills/generate-blueprint.md`를 로드하여 절차를 따른다.

create-deck의 Step 3~4에 해당하며,
슬라이드 구조가 이미 결정된 상황에서 blueprint 작성에 집중할 때 단독으로 사용한다.
source-first의 source 요약과 구조 결정은 create-deck에서 처리한다.

## Trigger

- 슬라이드 구조는 정해져 있고 blueprint.yaml만 빠르게 생성하고 싶을 때
- "blueprint 작성해줘", "yaml 만들어줘", "/generate-blueprint" 의도가 감지될 때

## Procedure

`skills/generate-blueprint.md`의 절차를 순서대로 수행한다.

1. 입력 정보 수집 (제목, 청중, 슬라이드 목록, 데이터, design, theme, author, version)
2. Narrative Spine 작성
3. blueprint.yaml 초안 생성
4. 검토·보완 반복

상세: `skills/generate-blueprint.md`
