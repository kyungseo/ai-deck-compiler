# docs/works/

Work 파일 디렉토리. 큰 작업 단위의 Single Source of Truth.

Work 파일 스펙: `docs/decisions/DR-013-work-file-spec.md`
공통 운영 규칙: `docs/HARNESS-PROTOCOL.md` Work File Rules

## 카테고리

| 카테고리 | 경로 | 용도 |
| --- | --- | --- |
| phase1/ | `docs/works/phase1/` | Product track Phase 1 작업 |
| harness/ | `docs/works/harness/` | Harness track 개선 작업 |

## Lifecycle

| Status | Location | Meaning |
| --- | --- | --- |
| Active | `docs/works/{category}/` | `docs/STATUS.md` Active Work에 pointer 존재 |
| Done | `docs/works/{category}/` | 완료 검증 통과, archive 대기 가능 |
| Archived | `docs/archive/docs/works/{category}/` | 완전 종결 |

Backlog `Candidate`는 후보 pool이다. Work 파일은 착수 승인 후 `Active` 상태로 생성한다.
