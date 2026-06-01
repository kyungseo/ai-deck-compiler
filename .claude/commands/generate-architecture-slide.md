---
description: "자연어 아키텍처 설명을 받아 architecture slide의 diagram spec(source: inline)을 생성한다"
argument-hint: "[아키텍처 설명 — 없으면 대화로 파악]"
disable-model-invocation: true
---

`skills/generate-architecture-slide.md`를 로드해서 절차를 따라줘.

`create-deck` 또는 `generate-blueprint` 안에서 architecture slide를 작성할 때 이 절차를 따른다.
단독 실행 시에는 architecture slide snippet만 생성하고 종료한다.

**MUST:** 출력은 항상 `source: inline`이다.
**MUST:** node.id / node.zone 중복 없음, edge.from / edge.to 는 반드시 존재하는 node.id 참조, 노드 수 ≤ 9.

`$ARGUMENTS`가 있으면 아키텍처 설명 힌트로 활용한다.

`skills/generate-architecture-slide.md`의 Step 0~7을 순서대로 수행한다.
