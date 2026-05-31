---
name: "export-pdf"
description: "생성된 PPTX를 PDF로 변환하는 skill. 환경 체크 후 LibreOffice가 없으면 설치 안내를 제공한다."
---

# export-pdf

`skills/export-pdf.md`를 로드하여 절차를 따른다.

**MUST:** 파일 경로 없이 변환을 실행하지 않는다.
LibreOffice가 없으면 변환을 시도하지 말고 설치 안내만 제공한다.

## Trigger

- 사용자가 PPTX를 PDF로 변환하거나 내보내기를 요청할 때
- "PDF로 내보내줘", "PDF 변환해줘", "/export-pdf" 의도가 감지될 때

## Procedure

`skills/export-pdf.md`의 Step 1~3을 순서대로 수행한다.

1. PPTX 파일 경로 확인 (없으면 질문)
2. `npm run export-pdf -- {path}` 실행 — 환경 체크는 CLI가 자동 수행
3. LibreOffice 없으면 오류 메시지 전달 + 설치 안내
4. 성공하면 생성된 PDF 경로 확인 + 후속 안내

상세: `skills/export-pdf.md`
