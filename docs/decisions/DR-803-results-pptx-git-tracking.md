# DR-803: Showcase examples/results/*.pptx git 추적 정책

Date: 2026-06-01
Status: Accepted

## Question

showcase용 preset별 대표 PPTX 결과물을 git으로 추적할 것인가, gitignore로 제외할 것인가?

## Decision

showcase artifact인 `examples/results/*.pptx`를 git으로 추적한다.
`*.pptx` 전역 gitignore 규칙에 `!examples/results/*.pptx` 예외를 추가한다.
`output/`은 기존대로 gitignore 유지한다.

## Options Considered

| 선택지 | 장점 | 단점 |
|---|---|---|
| 모든 .pptx gitignore (기존) | 저장소 경량, 이진 파일 없음 | repo를 봤을 때 결과물을 바로 확인 불가 |
| showcase examples/results/*.pptx만 추적 (채택) | GitHub에서 즉시 다운로드 가능, 첫인상 강화 | 렌더러 변경 시 수동 재생성 필요, binary diff |
| CI로 자동 재생성 | 항상 최신 상태 | CI 설정 복잡, 현 단계에서 과잉 |

## Rationale

"AI와 대화해서 만든 결과물이 바로 보기 좋은 PPT처럼 보이는가"를 repo 첫 방문자가
직접 확인할 수 있어야 한다. 3개 파일 × ~150KB = ~450KB로 용량 부담이 낮고,
`examples/results/README.md`에 재생성 명령을 문서화하여 staleness를 관리한다.

## Consequences

- `.gitignore`: `!examples/results/*.pptx` 예외 추가 (불필요한 `!examples/results/` 디렉터리 예외는 제거)
- `examples/results/`: showcase blueprint 3개 + pptx 3개 + export PDF 3개 + showcase gallery 이미지 + README.md 추적
- 렌더러 변경 시 `examples/results/README.md`의 재생성 명령으로 수동 업데이트 필요
- CI 미도입 상태에서는 staleness가 발생할 수 있음 — 허용된 trade-off

## Reversal Cost

낮음. `!examples/results/*.pptx` 예외 제거 후 `git rm --cached examples/results/*.pptx`로 추적 해제.
