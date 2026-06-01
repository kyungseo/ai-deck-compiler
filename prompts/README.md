# Session Prompt Guide

이 디렉토리는 `ai-deck-compiler`를 Claude / Codex / Cursor에서 시작할 때 쓰는
세션 시작 fallback prompt만 보관한다.

Generic task prompt library는 이 repo의 public surface에서 제거했다.
반복 task prompt가 필요하면 source workflow repo인 `ai-workflow-harness`의 prompt library를 참조한다.

## Files

| 파일 | 역할 |
| --- | --- |
| `claude-session-start.md` | Claude Code slash command를 사용할 수 없을 때의 fallback prompt |
| `codex-session-start.md` | `AGENTS.md`를 사용할 수 없거나 수동 복원이 필요한 Codex fallback prompt |
| `cursor-session-start.md` | Cursor에서 `.cursor/rules`와 repo 상태를 함께 복원하는 session start prompt |

## Policy

- 이 repo에서는 product skill routing과 public release workflow에 필요한 session prompt만 유지한다.
- 기능 구현, 디버깅, 리팩토링, 리뷰 등 generic task prompt는 이 repo에 중복 보관하지 않는다.
- 세션 시작 절차가 바뀌면 이 문서와 session-start prompt 3종, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*.mdc` 정합성을 함께 확인한다.
