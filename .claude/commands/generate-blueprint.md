---
description: "발표 목적과 슬라이드 구조를 기반으로 blueprint.yaml 초안을 생성한다"
argument-hint: "[발표 제목 또는 슬라이드 구조 — 없으면 대화로 파악]"
disable-model-invocation: true
---

`skills/generate-blueprint.md`를 로드해서 아래 절차를 따라줘.

슬라이드 구조가 이미 결정된 상황에서 blueprint.yaml 작성에 집중할 때 사용한다.
처음부터 대화식으로 발표를 기획하려면 `/create-deck`을 사용한다.
markdown/source 처리와 slide plan 결정이 필요하면 `/create-deck`의 source-first 흐름을 사용한다.

## Step 1 — 입력 정보 수집

`$ARGUMENTS`가 있으면 발표 제목 또는 슬라이드 구조 힌트로 활용한다.
아래 정보가 없으면 확인한다:

```
1. 발표 제목
2. 청중 (임원 / 팀 내부 / 고객 등)
3. 슬라이드 목록 (타입 + 제목)
4. 각 슬라이드의 주요 내용 또는 데이터
5. design preset (기본: default-modern)
6. theme (light | dark)
7. author/team (선택)
8. version (기본: "1.0")
```

## Step 2 — Narrative Spine 작성

blueprint 작성 전 전체 스토리를 5~10문장으로 요약한다.
발표 흐름의 논리적 정합성을 먼저 확인한다.

## Step 3 — Blueprint 초안 생성

`skills/generate-blueprint.md`의 슬라이드 타입별 작성 가이드를 따라 `blueprints/{slug}.yaml`을 작성한다.

- blueprints/ 디렉토리가 없으면 생성한다
- 작성 후 전체 내용을 보여준다

```
각 슬라이드를 검토해 주세요. 수정할 내용이 있으면 말씀해 주세요.
```

## Step 4 — 검토·보완 반복

사용자 수정 요청을 반영하고 완료 시 아래 안내를 출력한다.

```
blueprint가 완성됐습니다.

PPTX를 생성하려면:
npm run validate -- --blueprint blueprints/{slug}.yaml
npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}-v{version}.pptx
```

---

**참고:**
- 전체 생성 절차: `skills/generate-blueprint.md`
- 슬라이드 타입 레이아웃: `src/design/presets/default-modern/ppt-layouts.md`
- Blueprint 스키마: `schemas/blueprint.schema.json`
