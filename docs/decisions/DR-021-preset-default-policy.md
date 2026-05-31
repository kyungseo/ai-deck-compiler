# DR-021: Design Preset 기본 추천 정책 — teal + dark

Date: 2026-06-01
Status: Accepted

## Question

AI workflow에서 새 deck 생성 시 기본 추천 preset과 theme을 무엇으로 지정하는가?

## Decision

`design: teal`, `theme: dark`를 AI workflow 기본 추천값으로 지정한다.
`default-modern`은 `modern`으로 canonical rename하고, `default-modern` 입력은 resolver alias로 계속 동작한다.
`modern`은 light/business tone 및 기존 blueprint 호환 전용 preset으로 역할을 분리한다.

## Options Considered

| 선택지 | 장점 | 단점 |
|---|---|---|
| `default-modern`을 기본값 유지 | 변경 없음 | 이름이 "기본값"처럼 보이지만 실제 권장 경험이 아님 |
| `teal + dark`를 기본 추천으로 지정 (채택) | b01~b08 기반 시각적으로 완성도 높음, AI-native dark deck에 적합 | light 수요는 별도 안내 필요 |
| `modern` + `teal` 병렬 유지, 기본값 없음 | 선택 자유도 높음 | AI가 매번 질문해야 함, 결과물 일관성 낮아짐 |

## Rationale

`teal`은 b01~b08 캡처본을 기반으로 설계한 charcoal-dark + deep teal accent preset으로,
AI-native 발표 도구의 첫인상을 결정하는 대표 경험이다.
`default-modern`이라는 이름은 "기본값" 의미를 내포하지만 실제 권장 경험과 어긋나므로
`modern`으로 rename하고 역할을 명확히 분리한다.
alias 호환으로 기존 blueprint는 재작성 없이 계속 동작한다.

## Consequences

- `skills/create-deck.md`, `skills/generate-blueprint.md`: `design: teal`, `theme: dark`를 기본값으로 제안
- `README.md`, `USER-MANUAL.md`, `SYSTEM-MANUAL.md`: teal 중심 설명, modern은 legacy/light로 표기
- `examples/results/`: teal+dark를 대표 결과물로 보관
- `src/design/presets/modern/`: 기존 `default-modern/` 디렉터리, 내용 동일
- `src/design/resolver.ts`: `PRESET_ALIASES['default-modern'] = 'modern'` alias 추가

## Reversal Cost

중간. skills/docs/examples에서 기본값 언급을 되돌려야 하며, alias 제거 시 기존 `default-modern` blueprint가 오류 발생.
