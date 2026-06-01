# Skills

Claude Code / Codex / Cursor가 사용하는 AI agent skill 문서 모음.

각 skill 문서는 AI agent가 순서대로 실행할 수 있는 절차와 규칙을 담고 있다.

## 사용 방법

**Claude Code:**
- `/create-deck` — 대화식 PPT 생성 워크플로우 시작
- Claude에게 직접 skill 문서를 공유하거나 참조 요청

**Codex:**
- `AGENTS.md` Product Skill Routing에 따라 `.agents/skills/{name}/SKILL.md` wrapper를 로드

**Cursor:**
- `.cursor/rules/product-skills.mdc`가 product skill intent를 canonical `skills/*.md`로 라우팅
- 예: `skills/create-deck.md 절차로 PPT 작성을 시작해줘. 먼저 구조를 제안하고 승인 후 생성해줘.`

## Core Skill 구조

```
create-deck (canonical — brief/blueprint/PPTX end-to-end)
     │
     ├──→ generate-architecture-slide (architecture slide 작성 시 내부 호출 또는 단독)
     │
     └──→ review-deck (생성 후 검토 loop)
```

## Skill 목록

| Skill | 파일 | 상태 | 설명 |
| --- | --- | --- | --- |
| create-deck | `create-deck.md` | ✅ 완료 | 대화식 end-to-end PPT 생성 워크플로우. blueprint 작성 단독 요청도 이 skill로 처리 |
| review-deck | `review-deck.md` | ✅ 완료 | 생성된 deck 구조·메시지·디자인 검토 + blueprint 수정 제안 |
| export-pdf | `export-pdf.md` | ✅ 완료 | PPTX → PDF 변환. 환경 체크 + LibreOffice 없을 시 설치 안내 |
| generate-architecture-slide | `generate-architecture-slide.md` | ✅ 완료 | 자연어 설명 → architecture slide diagram spec(source: inline) 생성. create-deck 내부 호출 또는 단독 사용 |
| customize-preset | `customize-preset.md` | 📄 문서 완료 | 스크린샷·브랜드 자산 → custom design preset 생성 (end-to-end 검증 미완) |
| convert-design-system | *(예정)* | 📋 backlog | HTML/CSS design.md → ppt-design.md 변환 |
| validate-deck | *(예정)* | 📋 backlog | layout·editability 검증 |
