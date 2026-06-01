---
id: FEAT-20260601-008
title: "Cross-platform first-run setup — macOS + Windows 환경 설정 문서 보강 + export-pdf 확장자 검증"
status: Active
created: 2026-06-01
type: FEAT
branch: feature/FEAT-20260601-008-cross-platform-setup
---

# FEAT-20260601-008 — Cross-platform first-run setup

## Goal

clone 후 처음 실행하는 사용자가 macOS와 Windows 모두에서 막힘 없이 시작할 수 있도록
설치 안내 문서를 보강하고, CLI 확장자 검증의 소폭 UX hardening을 수행한다.

코드 구조(tools.ts의 플랫폼 감지 로직)는 이미 cross-platform이므로 이번 작업은
문서 누락 보완 + edge case 처리가 핵심이다.

---

## Scope

### 1. `README.md` — 요구사항 섹션 OS별 표로 교체

현재: LibreOffice/poppler 설치 명령이 macOS(`brew`) 전용 단일 줄.
변경: macOS/Windows/Linux 병기 표로 교체. Pretendard에 `brew install --cask font-pretendard` 추가.

### 2. `docs/USER-MANUAL.md` — pdftoppm(poppler) OS별 설치 표 추가

현재: preview 섹션에 LibreOffice 표는 있으나 pdftoppm/poppler 설치 표 없음.
변경: pdftoppm(poppler) OS별 표 추가.

### 3. `src/cli/export-pdf.ts` — 확장자 검증 + case-insensitive 처리

현재: `basename(resolved, '.pptx')` — `.PPTX`(대문자) 전달 시 stem 오계산. 비`.pptx` 파일도 통과.
변경: 확장자 소문자 정규화 + `.pptx`가 아닌 경우 명확한 오류 메시지 출력.

### 4. `src/cli/preview.ts` — 동일

### 5. `package.json` — `engines` 필드 추가

README에 Node.js 18+ 명시 → `package.json`에도 `"engines": { "node": ">=18" }` 반영.

---

## Non-goals

- `tools.ts` 플랫폼 감지 로직 변경 (이미 cross-platform)
- Windows scoop/winget 자동화 스크립트
- CONTRIBUTING.md 전체 작성 (public-repo-docs 항목 범위)

---

## Done Criteria

- [x] `README.md`: LibreOffice/poppler 설치 안내가 macOS/Windows/Linux 병기 표로 표현된다
- [x] `README.md`: Pretendard에 `brew install --cask font-pretendard` 명령이 추가된다
- [x] `USER-MANUAL.md`: pdftoppm(poppler) OS별 설치 표가 추가된다
- [x] `export-pdf.ts`: `.PPTX` 대문자 전달 시 정상 처리되고, 비`.pptx` 파일 전달 시 명확한 오류 메시지를 출력한다
- [x] `preview.ts`: 동일
- [x] `package.json`: `engines` 필드가 존재한다
- [x] `npm run typecheck` 통과
- [x] `npm test` 통과

---

## Verification

```bash
npm run typecheck
npm test
```

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| README 표 형식 기존 스타일 불일치 | 낮음 | USER-MANUAL 기존 표 스타일 그대로 차용 |
| extension 검증 추가로 기존 스크립트 호환성 | 낮음 | `.pptx` 소문자 사용자는 영향 없음 |

---

## Discovery

### 2026-06-01 — 구현 완료

- `tools.ts` 플랫폼 감지 로직은 이미 cross-platform (Windows 경로 포함) — 코드 변경 불필요.
- `README.md` 요구사항 섹션: LibreOffice/poppler 설치 안내를 OS별 표(macOS/Windows/Linux)로 교체. Pretendard brew 명령 추가.
- `USER-MANUAL.md`: preview 섹션 문제 해결 항목에 pdftoppm(poppler) OS별 설치 표 추가.
- `export-pdf.ts` + `preview.ts`: `.pptx` 확장자 case-insensitive 검증 + 유효성 메시지 추가. `.PPTX` 대문자 전달 시 stem 오계산 수정.
- `package.json`: `"engines": { "node": ">=18" }` 추가.
- `npm run typecheck` 통과, `npm test` 54/54 통과.
- 기능 테스트:
  - `export-pdf -- blueprint.yaml` → `[오류] .pptx 파일이 필요합니다` ✅
  - `preview -- blueprint.yaml` → 동일 오류 ✅
  - `export-pdf -- test.PPTX` (symlink) → stem `test-UPPERCASE` 정상 출력 ✅ (main() 내 basename 호출도 수정)
  - case-insensitive logic 단위 검증: `.PPTX`, `.Pptx` 모두 valid=true, stem 정상 ✅
