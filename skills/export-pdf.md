# Skill: export-pdf

생성된 PPTX를 PDF로 변환하는 skill.
환경을 체크하고, 필요한 도구가 없으면 OS별 설치 안내를 제공한다.

**진입 경로:**
- Claude Code: `/export-pdf`
- Codex CLI/App: `.agents/skills/export-pdf/SKILL.md` 로드
- Claude 채팅: 이 파일 내용을 참조하여 대화 절차 수행

---

## 이 skill이 하는 일

```
PPTX 파일 경로 입력
  → Step 1: 환경 체크 (LibreOffice 탐색)
     ├─ 없음 → OS별 설치 안내 출력 후 종료
     └─ 있음 → Step 2
  → Step 2: PPTX → PDF 변환 실행
  → Step 3: 결과 확인 + 후속 안내
```

**MUST:** 파일 경로 없이 변환을 실행하지 않는다.
LibreOffice가 없으면 변환을 시도하지 말고 설치 안내만 제공한다.

---

## Step 1 — 환경 체크 및 파일 경로 확인

PPTX 파일 경로가 제공되지 않으면 묻는다.

```
변환할 PPTX 파일 경로를 알려주세요.
(예: output/deck-v1.0.pptx)

PDF 출력 경로를 별도로 지정하려면 알려주세요.
(기본값: PPTX와 같은 디렉터리에 {이름}.pdf로 저장)
```

환경 체크는 CLI가 자동으로 수행한다.

```bash
npm run export-pdf -- output/deck-v1.0.pptx
```

LibreOffice가 없으면 CLI가 OS에 맞는 설치 안내를 출력하고 종료한다. 예시 (macOS):

```
  [오류] LibreOffice를 찾을 수 없습니다.
  설치 방법:
  brew install --cask libreoffice
```

AI는 이 출력을 사용자에게 그대로 전달하고 설치를 안내한다.
설치 후 다시 실행하면 된다.

---

## Step 2 — 변환 실행

```bash
# 기본 (PPTX와 같은 디렉터리에 저장)
npm run export-pdf -- output/deck-v1.0.pptx

# 출력 경로 지정
npm run export-pdf -- output/deck-v1.0.pptx --out output/deck-v1.0.pdf
```

변환이 완료되면 생성된 PDF 경로를 확인한다.

---

## Step 3 — 결과 확인 + 후속 안내

```
PDF가 생성됐습니다: output/deck-v1.0.pdf

PDF를 열어 확인해 주세요.
수정이 필요하면 blueprint.yaml을 고치고 다시 PPTX를 생성한 뒤 PDF로 변환하세요.

  npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}-v1.0.pptx
  npm run export-pdf -- output/{slug}-v1.0.pptx
```

---

## 관련 파일

- `skills/create-deck.md` — PPTX 생성 end-to-end 워크플로우
- `skills/review-deck.md` — 생성된 deck 검토
