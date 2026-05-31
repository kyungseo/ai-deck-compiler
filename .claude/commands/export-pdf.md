---
description: "생성된 PPTX를 PDF로 변환한다. 환경 체크 후 LibreOffice가 없으면 설치 안내를 제공한다."
argument-hint: "[PPTX 파일 경로 — 없으면 대화로 파악]"
disable-model-invocation: true
---

`skills/export-pdf.md`를 로드해서 아래 절차를 따라줘.

**MUST:** 파일 경로 없이 변환을 실행하지 않는다. LibreOffice가 없으면 변환을 시도하지 말고 설치 안내만 제공한다.

## Step 1 — 파일 경로 확인

`$ARGUMENTS`가 있으면 PPTX 경로로 사용한다. 없으면 묻는다.

```
변환할 PPTX 파일 경로를 알려주세요.
PDF 출력 경로를 별도로 지정하려면 알려주세요. (기본값: PPTX와 같은 디렉터리)
```

## Step 2 — 변환 실행

```bash
npm run export-pdf -- {pptx-path}
# 출력 경로 지정 시:
npm run export-pdf -- {pptx-path} --out {pdf-path}
```

LibreOffice가 없으면 CLI 오류 메시지를 사용자에게 전달하고 설치를 안내한다.
설치 안내 내용은 `skills/export-pdf.md` §Step 1을 참조한다.

## Step 3 — 결과 확인

생성된 PDF 경로를 확인하고 후속 수정 워크플로우를 안내한다.

---

**참고:**
- 전체 절차: `skills/export-pdf.md`
- PPTX 생성: `npm run deck`
- Preview 생성: `npm run preview`
