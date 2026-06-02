---
id: CHORE-20260602-004
title: "docs final review — README/USER/SYSTEM public 정합성 점검"
status: Archived
created: 2026-06-02
actual_end: 2026-06-02
type: CHORE
branch: feature/chore-20260602-002-public-transition
---

# CHORE-20260602-004 — docs final review

## 목표

Public release 전에 README, USER-MANUAL, SYSTEM-MANUAL, examples 문서가 실제 제품 상태와
일치하는지 확인하고, public 사용자가 README만 보고 설치, 예제 확인, create-deck 시작까지
진행할 수 있게 정리한다.

## 범위

- `README.md`
- `docs/USER-MANUAL.md`
- `docs/SYSTEM-MANUAL.md`
- examples/results 관련 문서
- stale phrase search 결과에 따른 최소 문구 수정

## 제외 범위

- showcase PPTX/PDF/gallery 재생성
- GitHub repo settings 변경
- code quality audit
- release tag 또는 GitHub Release 생성
- create-deck workflow 기능 추가

## 완료 기준

- [x] public 사용자가 README만 보고 설치/예제 확인/create-deck 시작 가능하다.
- [x] USER-MANUAL은 사용자 흐름 중심, SYSTEM-MANUAL은 유지보수자 구조 중심으로 역할이 분리되어 있다.
- [x] examples/results의 `blueprint.yaml`, `.pptx`, `.pdf`, gallery 구조 설명이 명확하다.
- [x] 오래된 `generate-blueprint` 독립 진입점, `default-modern` 기본값, stale command 설명이 제거되거나 현행 의미로 정리되어 있다.
- [x] showcase 재생성 없이 문서 정합성만 확인한다는 non-goal이 지켜진다.

## 검증

```bash
rg -n "generate-blueprint|default-modern|default modern|modern default|showcase|create-deck|blueprint.yaml|npm run deck|npm run preview|npm run export-pdf" README.md docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md examples/results
git diff --check
```

## 리스크

| Risk | Mitigation |
| --- | --- |
| public-facing 문구가 과장될 수 있음 | 기능과 제한을 실제 지원 범위 기준으로 표현 |
| README가 다시 길어질 수 있음 | README는 시작 경로 중심, 상세는 USER/SYSTEM으로 분리 |
| showcase 재생성으로 scope가 커질 수 있음 | 이번 Work의 non-goal로 유지 |

## 발견 기록

### 2026-06-02 — 시작

- `PATCH-20260602-002` archive 후 착수했다.
- 후보 출처: `docs/backlog/PHASE1.md` `[docs-final-review]`.
- 현재 우선순위: public release 전 사용자-facing 문서 정합성 확인.

### 2026-06-02 — 검토와 수정

- README:
  - 첫 진입 경로에서 설치, `examples/results`, create-deck 시작 방법이 보이는지 확인했다.
  - PPTX 생성 전에 blueprint 검토와 명시적 생성 승인이 보이도록 `/create-deck` 흐름을 수정했다.
  - 테스트 수를 59에서 61로 수정했다.
- USER-MANUAL:
  - 첫 사용 흐름에 PPTX 생성 전 blueprint 검토와 생성 승인을 포함했다.
  - preview review가 자동 실행처럼 보이지 않고 사용자 승인 후 진행되도록 mermaid 흐름을 수정했다.
  - callout 설명을 예전 bottom bar 표현에서 현재 card-bottom inset panel 기준으로 수정했다.
- SYSTEM-MANUAL:
  - create-deck 역할 설명에 preview 승인/review loop를 반영했다.
  - 현재 테스트 수를 59에서 61로 수정했다.
- examples/results:
  - `showcase-gallery.png`, showcase blueprint 3개, PPTX 3개, PDF 3개가 있는지 확인했다.
  - showcase 재생성은 하지 않았다.
- stale phrase 결과:
  - 검토 대상 문서에 `generate-blueprint` 또는 `/generate-blueprint` user-facing 진입점이 남아 있지 않다.
  - `default-modern`은 기본 추천이 아니라 명시적 resolver alias 설명으로만 남아 있다.

### 2026-06-02 — 검증

- `rg -n "59 tests|59개|generate-blueprint|/generate-blueprint|default modern|modern default|하단 강조 bar|AI: 시각 검토|PPTX를 바로 생성|blueprint.yaml을 작성하고, PPTX" README.md docs/USER-MANUAL.md docs/SYSTEM-MANUAL.md examples/results/README.md`: 통과, match 없음.
- `ls examples/results`: 통과, README, gallery, blueprint/PPTX/PDF 3세트 확인.
- `git diff --check`: 통과.

### 2026-06-02 — 아카이브

- Done Criteria를 모두 완료하고 검증했다.
- 다음 release-gate 항목을 시작하기 전에 Public Clean Baseline Gate에 Active/Done-pending Work가 남지 않도록 즉시 archive했다.
