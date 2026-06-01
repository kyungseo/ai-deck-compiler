# Showcase Blueprint & PPTX Results

이 디렉터리는 `ai-deck-compiler` 자체를 소개하는 대표 showcase deck을 보관합니다.
같은 발표 내용을 preset/theme별 blueprint, PPTX, export PDF로 재생성할 수 있습니다.
showcase v1.1은 제품 메시지, repo 기반 evidence, architecture/flow, preset 비교, code block component를 하나의 실전형 deck 흐름 안에 담습니다.
PDF는 PPTX에서 `npm run export-pdf`로 반출한 파일입니다.

![Showcase gallery](showcase-gallery.png)

포함 기준:

- `showcase-teal-dark.blueprint.yaml` / `showcase-teal-dark.pptx` / `showcase-teal-dark.pdf` — 신규 deck 기본 추천 경험 (`teal + dark`)
- `showcase-vivid-dark.blueprint.yaml` / `showcase-vivid-dark.pptx` / `showcase-vivid-dark.pdf` — product demo와 feature showcase 톤 (`vivid + dark`)
- `showcase-modern-light.blueprint.yaml` / `showcase-modern-light.pptx` / `showcase-modern-light.pdf` — light/business 공유 문서 톤 (`modern + light`)
- `showcase-gallery.png` — README용 2×3 showcase gallery 이미지

재생성:

```bash
npm run deck -- --blueprint examples/results/showcase-teal-dark.blueprint.yaml --output examples/results/showcase-teal-dark.pptx
npm run deck -- --blueprint examples/results/showcase-vivid-dark.blueprint.yaml --output examples/results/showcase-vivid-dark.pptx
npm run deck -- --blueprint examples/results/showcase-modern-light.blueprint.yaml --output examples/results/showcase-modern-light.pptx
```

Preview 확인:

```bash
npm run preview -- examples/results/showcase-teal-dark.pptx --out temp/showcase-teal-preview
npm run preview -- examples/results/showcase-vivid-dark.pptx --out temp/showcase-vivid-preview
npm run preview -- examples/results/showcase-modern-light.pptx --out temp/showcase-modern-preview
```

PDF 반출:

```bash
npm run export-pdf -- examples/results/showcase-teal-dark.pptx --out examples/results/showcase-teal-dark.pdf
npm run export-pdf -- examples/results/showcase-vivid-dark.pptx --out examples/results/showcase-vivid-dark.pdf
npm run export-pdf -- examples/results/showcase-modern-light.pptx --out examples/results/showcase-modern-light.pdf
```

`teal`과 `vivid`의 light theme은 현재 dark fallback이므로 별도 결과물을 보관하지 않습니다.
