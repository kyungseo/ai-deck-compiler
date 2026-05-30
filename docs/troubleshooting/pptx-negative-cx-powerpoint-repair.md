# PPTX 열기 시 PowerPoint 복구 메시지 — 음수 cx/cy

## 증상

`npm run deck`으로 생성한 PPTX를 PowerPoint(macOS)에서 열면 아래 메시지가 표시된다.

> "PowerPoint에서 {파일명}의 내용에 문제가 있습니다. 프레젠테이션 복구가 시도될 수 있습니다."

복구 버튼 클릭 후:

> "PowerPoint에서 {파일명} - 복구됨의 읽을 수 없는 내용을 제거했습니다."

## 영향 대상

`architecture` 슬라이드 타입을 포함하는 PPTX 중, **역방향 엣지**(노드 A → 노드 B에서 A가 B보다 오른쪽 또는 아래에 위치)가 있는 경우.

확인된 파일:
- `output/architecture.pptx` — `api(center) → cache(center-left)` 엣지: dx < 0
- `output/sample.pptx` — `gateway(center-left) → auth(top-center)`, `api(center) → cache(top-right)` 엣지: dy < 0

## 원인

OOXML 규격(`ST_PositiveCoordinate`)은 `<a:ext>` 요소의 `cx`, `cy` 속성에 **음수를 허용하지 않는다.**

`architecture.ts`에서 엣지를 `addShape('line', ...)` 으로 그릴 때, 종점이 시작점보다 왼쪽/위에 있으면 `w = to.cx - from.cx` 또는 `h = to.cy - from.cy` 가 음수가 된다. pptxgenjs는 이 값을 그대로 XML에 기록하여 `cx="-3657600"` 같은 유효하지 않은 값이 생성된다.

```xml
<!-- 수정 전: 유효하지 않은 XML -->
<a:off x="6099048" y="3863340"/>
<a:ext cx="-3657600" cy="0"/>   ← OOXML 규격 위반
```

## 조치

`src/templates/slides/architecture.ts` 엣지 렌더링 로직에서 좌표를 정규화:

```typescript
const dx = to.cx - from.cx;
const dy = to.cy - from.cy;
pptxSlide.addShape('line', {
  x: Math.min(from.cx, to.cx),
  y: Math.min(from.cy, to.cy),
  w: Math.abs(dx) || 0.01,      // 항상 양수
  h: Math.abs(dy) || 0.01,      // 항상 양수
  flipH: dx < 0 ? true : undefined,
  flipV: dy < 0 ? true : undefined,
  line: { ... },
});
```

커밋: `c8e274d` (fix: architecture 렌더러 역방향 엣지 음수 cx/cy 수정)

## 검증

```bash
# PPTX 재생성
npm run deck -- --blueprint examples/sample/blueprint.yaml --output output/sample.pptx
npm run deck -- --blueprint examples/architecture/blueprint.yaml --output output/architecture.pptx

# XML 음수 확인 (출력 없으면 정상)
unzip -p output/sample.pptx 'ppt/slides/*.xml' | grep -o 'cx="-[0-9]*"\|cy="-[0-9]*"'
```

PowerPoint에서 복구 메시지 없이 열리면 수정 완료.

## 관련 문서

- `src/templates/slides/architecture.ts` — 엣지 렌더링 로직
- `src/templates/layout.ts` — `zoneCenter()` 함수 (zone → 절대 좌표 변환)
- OOXML 규격: `ST_PositiveCoordinate` — DrawingML 좌표계 타입 정의
