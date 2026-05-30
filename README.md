# Presentation Compiler

> [프로젝트 한 줄 설명 — 채워주세요]

## AI Workflow Harness

이 프로젝트는 Claude Code / Codex / Cursor 공통 AI 워크플로우 하네스를 포함합니다.
하네스는 Product track과 Harness track을 함께 운영하도록 설계되어 있습니다.
첫 세션에서는 프로젝트 identity, Product Definition, Project Initialization baseline을 먼저 정리한 뒤 Product track backlog를 만들고,
AI workflow 자체의 개선과 example pack 정비는 Harness track으로 분리합니다.

| Track | 목적 | 주요 파일 |
| --- | --- | --- |
| Product track | 실제 제품/서비스/콘텐츠 작업과 Phase backlog | `docs/backlog/PHASE1.md`, `docs/works/phase1/` |
| Harness track | AI workflow, command/rule, prompt, scaffold, process 개선 | `docs/backlog/HARNESS.md`, `docs/works/harness/` |

| 파일 | 역할 |
| --- | --- |
| `CLAUDE.md` | Claude Code 진입점 |
| `AGENTS.md` | Codex 진입점 |
| `docs/BEHAVIOR-PRINCIPLES.md` | 전역 행동 원칙 |
| `docs/STATUS.md` | 현재 작업 상태 |
| `docs/HARNESS-QUICK-REFERENCE.md` | 세션 실행 규칙 요약 |
| `docs/HARNESS-ARCHITECTURE.md` | harness 아키텍처와 정보 흐름 시각화 |
| `docs/HARNESS-MAINTAINER-GUIDE.md` | 유지보수·convention 가이드 |
| `docs/BOOTSTRAP.md` | scaffold 직후 프로젝트 부팅 checklist |
| `docs/WORKFLOW-MANUAL.md` | 사용자용 워크플로우 가이드 |
| `docs/AGENT-WORKFLOW.md` | 공통 운영 규칙 |
| `docs/works/` | Work 파일 (큰 작업의 SSoT) |
| `.claude/commands/` | `/start`, `/pick`, `/register`, `/work`, `/close`, `/done` 등 |
| `.agents/skills/` | Codex command skill |
| `.codex/hooks.json` | Codex hook 설정 |
| `prompts/` | 세션 시작 및 태스크 프롬프트 라이브러리 |

### 첫 세션

**Claude Code:**
```bash
claude        # Claude Code 열기
/start        # 하네스 로딩 확인 및 현재 상태 요약
```

**Codex:** repo root의 `AGENTS.md`를 기본 진입점으로 사용하고, 세션 첫 요청은 `/start` intent로 시작한다. `prompts/codex-session-start.md`는 수동 bootstrap이 필요한 fallback이다.

**Cursor:** `prompts/cursor-session-start.md` 내용을 세션 시작 시 붙여넣는다.

## 사전 작업

git repository는 자동으로 초기화되지 않는다. 첫 세션에서 `docs/BOOTSTRAP.md` §0 Repository Setup을 따라 초기화 여부를 먼저 결정한다.

스캐폴딩 직후 첫 `/start`에서는 `docs/STATUS.md` Next Actions를 확인한다.
Next Actions가 scaffold bootstrap/onboarding을 가리키면 `docs/BOOTSTRAP.md`를 §0부터 순서대로 채운다.
Bootstrap onboarding에 사용할 prompt는 `docs/BOOTSTRAP.md` §8에 있다.

1. `docs/STATUS.md` — 프로젝트 목표와 Phase 설명
2. `docs/PLAN-SUMMARY.md` Project Summary — 제품 목표와 핵심 workflow
3. `docs/PLAN-SUMMARY.md` Implementation Baseline — Runtime/Framework/Build/package 결정 (코드 개발 프로젝트)
4. `docs/PLAN.md` Project Initialization Plan — stack 선택 근거와 초기 구조
5. `docs/backlog/PHASE1.md` — baseline 완료 후 도출한 초기 작업 항목 (Work ID는 /work 착수 시 확정)
6. `docs/BEHAVIOR-PRINCIPLES.md` — 전역 행동 원칙 확인
7. `docs/AGENT-WORKFLOW.md` — Project Constants와 Verification Defaults

---

*Scaffolded 2026-05-30 — [AI Workflow Harness](docs/WORKFLOW-MANUAL.md)*
