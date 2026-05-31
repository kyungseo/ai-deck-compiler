# Skills

Claude Code / Codex / Cursor가 사용하는 AI agent skill 문서 모음.

각 skill 문서는 AI agent가 순서대로 실행할 수 있는 절차와 규칙을 담고 있다.

## 사용 방법

**Claude Code:**
- `/create-deck` — 대화식 PPT 생성 워크플로우 시작
- Claude에게 직접 skill 문서를 공유하거나 참조 요청

**Codex / Cursor:**
- skill 파일 내용을 세션 초반에 붙여넣거나 참조 요청

## Core Skill 삼각형

```
create-deck ──→ generate-blueprint (Step 3~4 내부 또는 단독)
     │
     └──→ review-deck (생성 후 검토 loop)
```

## Skill 목록

| Skill | 파일 | 상태 | 설명 |
| --- | --- | --- | --- |
| create-deck | `create-deck.md` | ✅ 완료 | 대화식 end-to-end PPT 생성 워크플로우 |
| generate-blueprint | `generate-blueprint.md` | ✅ 완료 | blueprint.yaml 초안 생성 (단독 또는 create-deck 내부) |
| review-deck | `review-deck.md` | ✅ 완료 | 생성된 deck 구조·메시지·디자인 검토 + blueprint 수정 제안 |
| customize-preset | `customize-preset.md` | 📄 문서 완료 | 스크린샷·브랜드 자산 → custom design preset 생성 (end-to-end 검증 미완) |
| generate-architecture-slide | *(예정)* | 📋 backlog | 기술 아키텍처 설명 → architecture slide blueprint 생성 |
| convert-design-system | *(예정)* | 📋 backlog | HTML/CSS design.md → ppt-design.md 변환 |
| validate-deck | *(예정)* | 📋 backlog | layout·editability 검증 |
