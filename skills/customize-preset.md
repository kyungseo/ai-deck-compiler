# Skill: customize-preset

사용자의 회사 브랜드·디자인 자산을 분석하여 custom design preset을 생성하는 skill.
Claude Code는 이미지를 볼 수 있으므로 스크린샷·레퍼런스를 직접 분석할 수 있다.

---

## 언제 사용하는가

- 회사 PowerPoint 템플릿이 있고, 이 엔진에서도 같은 스타일을 쓰고 싶을 때
- 브랜드 가이드라인(색상, 폰트)을 PPT에 적용하고 싶을 때
- 기존 PPT 스크린샷을 보고 "이런 느낌으로 만들어줘" 할 때

---

## Step 1 — Reference Material 수집

다음 중 하나 이상을 요청한다:

```
custom preset을 만들기 위해 다음 자료를 제공해 주세요.

[A] 회사 PPT 슬라이드 스크린샷
    (제목 슬라이드 + 본문 슬라이드 1~2장이면 충분합니다)

[B] 브랜드 컬러 정보
    (hex 코드: 예) 주색 #1B3A8C, 강조색 #FF6B00)

[C] 사용 폰트
    (예: Noto Sans KR, Apple SD Gothic Neo, Pretendard)

[D] 로고 또는 회사명
    (brand footer에 표시될 텍스트)

[E] 참고할 느낌
    (예: "Samsung 공식 발표 자료 느낌", "스타트업 투자 덱 느낌")
```

---

## Step 2 — 스크린샷 분석 (이미지 제공 시)

Claude Code는 첨부된 이미지를 직접 분석한다.

분석 항목:
1. **배경색** — 슬라이드 전체 배경 (light/dark 여부)
2. **주요 텍스트 색상** — 제목, 본문, 강조 색상 hex 추출
3. **강조/포인트 색상** — 버튼, 밑줄, 아이콘 등의 accent 색상
4. **폰트 스타일** — serif/sans-serif, 굵기, 크기 추정
5. **레이아웃 패턴** — safe margin, 제목 위치, 로고 위치
6. **전체 톤** — modern/corporate/minimal/bold 등

분석 결과를 사용자에게 먼저 제시하고 확인받는다:
```
분석 결과입니다:
- 배경: #FFFFFF (light)
- 주 텍스트: #1B2B4B (dark navy)
- 강조색: #FF6B00 (orange)
- 보조 강조: #1B3A8C (blue)
- 폰트: sans-serif, bold 제목 약 36pt
- 레이아웃: 좌측 정렬, 상단 로고

이 내용으로 preset을 만들어도 괜찮을까요?
수정할 항목이 있으면 말씀해 주세요.
```

---

## Step 3 — Preset 생성

확인된 정보를 바탕으로 preset 파일을 생성한다.

### 3-1. Preset 이름 결정

```
preset 이름을 정해주세요.
(예: my-company, samsung-style, startup-pitch)
```

### 3-2. 디렉토리 및 파일 생성

```
src/design/presets/{name}/
  tokens.json
  ppt-design.md
```

### tokens.json 생성 규칙

```json
{
  "brand": {
    "name": "{회사명 또는 사용자 입력}",
    "show": true,
    "showPageNumbers": true,
    "fontSize": 10
  },
  "colors": {
    "light": {
      "background": "{분석된 배경색}",
      "surface": "{배경보다 약간 어두운 색}",
      "border": "{구분선 색상}",
      "text-primary": "{주 텍스트 색상}",
      "text-secondary": "{보조 텍스트 색상}",
      "text-muted": "{흐린 텍스트 색상}",
      "accent": "{주 강조색}",
      "accent-alt": "{보조 강조색}",
      "node-fill": "{아키텍처 노드 배경}",
      "node-text": "{아키텍처 노드 텍스트}",
      "node-border": "{아키텍처 노드 테두리}",
      "group-fill": "{다이어그램 그룹 배경}",
      "group-border": "{다이어그램 그룹 테두리}",
      "edge": "{다이어그램 엣지 색상}",
      "chart-0": "{차트 시리즈 1}",
      "chart-1": "{차트 시리즈 2}",
      "chart-2": "{차트 시리즈 3}",
      "chart-3": "{차트 시리즈 4}",
      "chart-4": "{차트 시리즈 5}",
      "chart-5": "{차트 시리즈 6}"
    },
    "dark": {
      "..."
    }
  },
  "typography": {
    "title":    { "size": 40, "bold": true,  "font": "{폰트명}" },
    "subtitle": { "size": 24, "bold": false, "font": "{폰트명}" },
    "body":     { "size": 18, "bold": false, "font": "{폰트명}" },
    "caption":  { "size": 14, "bold": false, "font": "{폰트명}" },
    "label":    { "size": 12, "bold": false, "font": "{폰트명}" },
    "kpi-value":    { "size": 52, "bold": true,  "font": "{폰트명}" },
    "kpi-label":    { "size": 13, "bold": false, "font": "{폰트명}" },
    "node-label":   { "size": 11, "bold": false, "font": "{폰트명}" },
    "table-header": { "size": 14, "bold": true,  "font": "{폰트명}" },
    "table-cell":   { "size": 13, "bold": false, "font": "{폰트명}" }
  },
  "spacing": {
    "xs": 0.05, "sm": 0.1, "md": 0.2, "lg": 0.3, "xl": 0.5, "xxl": 0.8
  },
  "shapes": {
    "service":   "roundRect",
    "database":  "can",
    "queue":     "rect",
    "gateway":   "diamond",
    "client":    "rect",
    "cloud":     "cloud",
    "container": "rect",
    "cache":     "hexagon",
    "storage":   "can",
    "external":  "rect"
  }
}
```

### ppt-design.md 생성

분석 결과를 바탕으로 간략한 디자인 시스템 문서를 작성한다.
`src/design/presets/default-modern/ppt-design.md` 형식을 참고.

---

## Step 4 — 검증

```bash
npm run validate -- --blueprint examples/basic/blueprint.yaml
npm run deck -- --blueprint examples/basic/blueprint.yaml \
  --design {name} --theme light --output output/{name}-test.pptx
```

생성된 PPTX를 확인하고 수정이 필요한 토큰을 조정한다.

---

## Step 5 — 사용 안내

```
custom preset '{name}'이 생성됐습니다.

사용 방법:
npm run deck -- --blueprint blueprints/my-deck.yaml \
  --design {name} --theme light

blueprint.yaml에서 지정:
deck:
  design: {name}
  theme: light
```

---

## 폰트 주의사항

지정한 폰트가 시스템에 설치되어 있어야 PowerPoint에서 정상 표시된다.
설치되지 않은 폰트는 시스템 기본 폰트로 대체된다.

Pretendard가 설치되어 있으면 기본값으로 사용 가능.
회사 전용 폰트는 해당 폰트를 먼저 설치하고 preset에 지정한다.

---

## 관련 파일

- `src/design/presets/default-modern/tokens.json` — 참고 예시
- `src/design/resolver.ts` — preset 로딩 로직
- `docs/SYSTEM-MANUAL.md §5` — Design System 아키텍처
