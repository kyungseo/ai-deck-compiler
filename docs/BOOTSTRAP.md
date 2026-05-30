# BOOTSTRAP.md — Presentation Compiler

Scaffold 직후 이 파일을 먼저 채운다. 목표는 빈 harness를 프로젝트 identity와 production 성격에 맞게 부팅하는 것이다.

## 0. Repository Setup

- [x] git repository 초기화 여부 확인: `git status` 또는 `ls .git/` 실행. `git status`가 not a git repository 메시지로 실패하면 no-git bootstrap 상태로 판단
- [x] git repository가 없으면 사용자 승인 후 `git init`, default branch 결정, initial commit 여부 결정 — git repo 확인됨, 초기화 불필요
- [x] git repository가 없는 동안 commit/PR/branch workflow, `git diff` 기반 검증은 `Not Applicable`로 처리 — Not Applicable (repo 존재)
- [x] `--existing` overlay인 경우: 기존 branch/remote 정책을 먼저 확인하고, harness Gitflow를 무조건 강제하지 않는다 — 기존 repo에 harness overlay 적용됨. Gitflow 정책 확인 완료.

## 1. Project Identity

| 항목 | 내용 |
| --- | --- |
| 프로젝트 이름 | AI-Native Presentation Engineering Framework (engine: Presentation Compiler) |
| 한 줄 설명 | Compile presentations from design systems and blueprints |
| 주요 사용자 | AI-assisted presentation author (개인 / 팀 내부) |
| production 성격 | library / internal tool (public open-source) |
| 배포 또는 공개 방식 | public GitHub, npm package (Post-MVP) |
| 핵심 성공 기준 | blueprint.yaml → editable PPTX 결정론적 생성. AI가 x/y 좌표를 결정하지 않음. 19 parser tests 통과 기준 유지. |

## 2. Product Definition

제품 목표와 성공 기준을 먼저 확정한다. 이 단계가 완료되지 않으면 Phase 1 backlog를 만들지 않는다.

- [x] Phase 1 목표를 한 문장으로 정리 — blueprint.yaml + design preset → editable PPTX 결정론적 컴파일 엔진 구축 (P1 slide type 9종 + zone-based layout engine + PPTX CLI)
- [x] 주요 사용자와 첫 사용 시나리오 정리 — AI-assisted presentation author. 발표 목적·구조를 blueprint.yaml로 작성하면 editable PPTX가 결정론적으로 생성됨.
- [x] 핵심 성공 기준 정의 (§1 Project Identity에서 채운 항목 재확인) — §1 완료
- [x] `docs/PLAN-SUMMARY.md` Project Summary를 이 정보로 업데이트 — 완료

## 3. Project Initialization

코드 개발이 필요한 프로젝트만 해당한다. code development가 없는 프로젝트(content/research/no-code 운영 등)는 이 단계를 Not Applicable로 처리한다.

- [x] `docs/PLAN-SUMMARY.md` Implementation Baseline 표의 항목을 하나씩 결정한다 — 완료
- [x] 결정된 항목은 Readiness를 Ready로 업데이트한다 — 완료
- [x] 코드 개발이 필요 없는 항목은 Readiness를 Not Applicable로 표시한다 — Data storage, Profiles/Environments → Not Applicable
- [ ] 결정 근거는 `docs/PLAN.md` Project Initialization Plan에 기록한다 — stack 선택 근거는 `temp/work-plans/10-ai-native-pt-engineering-framework-3.md` §7에 있음. `docs/PLAN.md`로 이전 예정.
- [x] `docs/AGENT-WORKFLOW.md` Project Constants 작성 (Runtime, Framework, Build, Base package/module, Architecture) — feature/bootstrap-project-identity 브랜치에서 완료 예정

> 이 단계가 완료(또는 Not Applicable 처리)되지 않으면 `docs/backlog/PHASE1.md`에 기능 후보를 등록하지 않는다.
> 기능 candidate 제안 전에 Implementation Baseline Readiness를 먼저 확인한다.

## 4. Phase 1 Backlog Derivation

§2 Product Definition과 §3 Project Initialization이 완료된 뒤 Product track backlog를 도출한다.

- [ ] `docs/backlog/PHASE1.md` Active Candidates에 초기 작업 후보 등록 (Work ID는 /work 착수 시 확정)
- [ ] 각 후보에 Done Criteria, Verification, Preconditions 작성
- [ ] 즉시 착수할 항목이 있으면 `docs/STATUS.md` Active Work로 올릴 내용 제안
- [ ] 큰 작업이면 `docs/works/phase1/`에 Work 파일 생성 여부 판단
- [ ] 완료 후 `docs/STATUS.md` Next Actions에서 scaffold bootstrap onboarding 항목 제거 또는 다음 실제 작업으로 교체

## 5. Harness Track Setup

AI workflow 자체의 조정은 Harness track으로 분리한다.

- [ ] tool entrypoint(`AGENTS.md`, `CLAUDE.md`)가 프로젝트에 맞는지 확인
- [ ] `docs/AGENT-WORKFLOW.md` Verification Defaults 작성
- [ ] `README.md`, `docs/PLAN-SUMMARY.md`, `AGENTS.md`, `CLAUDE.md`에 프로젝트 identity 보정이 필요한지 확인
- [ ] `.claude/rules/`, `.cursor/rules/`, `prompts/`에 role/rule/prompt naming 보정이 필요한지 확인
- [ ] command/rule/prompt 조정이 필요하면 `docs/backlog/HARNESS.md`에 후보 등록 (Work ID는 /work 착수 승인 시 확정)
- [ ] `docs/works/harness/` Work 파일이 필요한 규모인지 판단

## 6. Core Document Fill Order

1. `docs/BOOTSTRAP.md` — identity, production 성격, setup checklist
2. `docs/STATUS.md` — 현재 phase, Active Work, OQ, Next Actions
3. `docs/PLAN-SUMMARY.md` Project Summary — 프로젝트 요약, 제품 목표
4. `docs/PLAN-SUMMARY.md` Implementation Baseline — Runtime/Framework/Build/package 결정 (코드 프로젝트)
5. `docs/PLAN.md` Project Initialization Plan — stack 선택 근거, 초기 구조 (코드 프로젝트)
6. `docs/backlog/PHASE1.md` — Product track backlog (baseline 완료 후)
7. `docs/backlog/HARNESS.md` — Harness track backlog
8. `docs/AGENT-WORKFLOW.md` — Project Constants, Verification Defaults

## 7. Example Pack Review

`generic` profile이면 아래 항목은 기본적으로 포함되지 않는다. `spring-boot` 또는 다른 stack-specific pack을 선택했다면 프로젝트 identity에 맞게 정비한다.

- [ ] 포함된 example pack이 실제 production 성격과 맞는지 확인
- [ ] stack-specific rule glob이 실제 source path와 맞는지 확인
- [ ] role 파일명이 역할과 일치하는지 확인 (예: backend 전용이 아니면 `role-backend` 같은 이름을 쓰지 않음)
- [ ] prompt description과 package/path placeholder가 프로젝트명이나 조직명으로 고정되어 있지 않은지 확인
- [ ] README와 manual에 example pack이 optional임을 명시
- [ ] 필요 없는 example pack은 제거하거나 `docs/backlog/HARNESS.md`에 정리 작업으로 등록

## 8. First Session Prompt

```text
docs/BEHAVIOR-PRINCIPLES.md, docs/AGENT-WORKFLOW.md, docs/STATUS.md, docs/BOOTSTRAP.md를 읽어줘.

이 프로젝트를 scaffold 직후 부팅하려고 해.
다음 순서로 제안해줘:

1. 프로젝트 identity와 production 성격 확인 (§1)
2. Product Definition: 제품 목표, 주요 사용자, 성공 기준 (§2)
3. Project Initialization: PLAN-SUMMARY.md Implementation Baseline 결정 (§3, 코드 개발 프로젝트만)
4. Implementation Baseline이 비어 있으면 feature candidate 대신 Project Initialization을 첫 후보로 제안
5. Harness track 정비 항목, example pack 정비 필요 여부 (§5, §7)

파일 수정은 내 승인 전까지 하지 마.
```

## 9. Completion Rule

Bootstrap onboarding은 `docs/STATUS.md` Next Actions의 pointer로만 다시 발견된다.
이 checklist를 채우고 Product/Harness backlog 후보를 만든 뒤에는 `docs/STATUS.md` Next Actions에서 scaffold bootstrap onboarding 항목을 제거하거나 다음 실제 작업으로 교체한다.
항목이 남아 있으면 daily `/start`가 매 세션 bootstrap 후속 작업을 계속 제안한다.
