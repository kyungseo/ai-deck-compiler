---
id: PATCH-20260602-001
title: "Security alert triage — public 전 critical vulnerability 확인"
status: Done
created: 2026-06-02
actual_end: 2026-06-02
type: PATCH
branch: feature/patch-20260602-001-security-alert-triage
---

# PATCH-20260602-001 — Security alert triage

## Goal

GitHub push 시 보고된 default branch critical vulnerability 알림을 public 전환 전에 확인하고,
현재 release gate 안에서 즉시 수정할 항목과 별도 후속 처리할 항목을 분리한다.

## Scope

- GitHub Dependabot/security alert 내용을 확인한다.
- 영향 대상 dependency, 취약점 등급, direct/transitive 여부, available fix 여부를 기록한다.
- lockfile 또는 dependency update가 필요한지 판단한다.
- 필요한 경우 최소 dependency update를 수행하고 검증한다.
- repo settings checklist의 vulnerability alerts 항목과 연결한다.

## Non-goals

- public repo settings 전체 적용
- dependency 전면 업그레이드
- unrelated package modernization
- feature 구현 또는 showcase 산출물 변경

## Done Criteria

- [x] critical vulnerability 알림의 대상 package와 경로가 확인된다.
- [x] 즉시 수정 / 별도 Work / false-positive 또는 accepted risk 판단이 Discovery에 기록된다.
- [x] 즉시 수정이 필요한 경우 dependency 또는 lockfile이 최소 범위로 갱신된다.
- [x] `npm run typecheck`, `npm test`, `npm run validate -- --blueprint examples/sample/blueprint.yaml`, `git diff --check` 통과.
- [x] Work 결과가 public release gate의 repo settings checklist와 연결된다.

## Verification

```bash
gh api repos/kyungseo/ai-deck-compiler/dependabot/alerts
npm run typecheck
npm test
npm run validate -- --blueprint examples/sample/blueprint.yaml
git diff --check
```

## Risks

| Risk | Mitigation |
| --- | --- |
| transitive dependency fix가 major upgrade를 요구함 | available fix와 blast radius를 먼저 확인하고 별도 Work로 분리 가능 |
| GitHub alert API 권한이 부족함 | `gh` 결과와 GitHub UI 확인 필요성을 Discovery에 기록 |
| package update가 rendering output에 영향 | 최소 update 후 typecheck/test/sample validation으로 회귀 확인 |

## Discovery

### 2026-06-02 — Start

- Current branch: `feature/patch-20260602-001-security-alert-triage`.
- Trigger: `git push` during public-release follow-up reported 2 critical vulnerabilities on the default branch.
- Initial boundary: triage first; update dependencies only when the alert details show a small, relevant, and verifiable fix path.

### 2026-06-02 — Alert triage

- `gh api repos/kyungseo/ai-deck-compiler/dependabot/alerts --paginate` showed two open critical alerts:
  - Alert #4: `vitest` direct dev dependency in `package.json`.
  - Alert #3: `vitest` direct dev dependency in `package-lock.json`.
- Both alerts point to the same advisory, `GHSA-5xrq-8626-4rwp` / `CVE-2026-47429`.
- Vulnerable range: `vitest < 4.1.0`; first patched version: `4.1.0`.
- Alerts #1 (`esbuild`) and #2 (`vite`) were already fixed before this Work.
- Repo default branch is `main`; this feature branch fixes the dependency path for `develop`, and GitHub default-branch alerts are expected to close after the release path brings the fix to `main`.

### 2026-06-02 — Implementation

- Updated `vitest` from `^3.2.4` to `^4.1.0`.
- Refreshed `package-lock.json`.
- Updated repository runtime guidance from Node.js 18+ to Node.js 20+ because Vitest 4 requires Node `^20.0.0 || ^22.0.0 || >=24.0.0`.
- Updated README, PLAN, PLAN-SUMMARY, and AGENT-WORKFLOW current references. Historical completed Work notes were left unchanged.

### 2026-06-02 — Verification

- `npm install --save-dev vitest@4.1.0`: pass, `found 0 vulnerabilities`.
- `npm install --package-lock-only`: pass, `found 0 vulnerabilities`.
- `npm audit --audit-level=critical`: pass, `found 0 vulnerabilities`.
- `npm run typecheck`: pass.
- `npm test`: pass, Vitest 4.1.0, 3 files / 59 tests.
- `npm run validate -- --blueprint examples/sample/blueprint.yaml`: pass after sandbox-external rerun. Initial sandbox run failed with known `tsx listen EPERM`.
