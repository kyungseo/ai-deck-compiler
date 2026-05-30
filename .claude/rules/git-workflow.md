---
paths:
  - "**"
---

# Git Workflow Rules

Before committing, always run in this order:

1. `git status` — confirm full working tree state (unstaged + untracked)
2. `git add <files>` — stage intended files
3. `git status` — verify nothing is missed before committing
4. `git diff --cached` — review staged content

NEVER use `git diff --cached` alone as the only pre-commit check.
It does not show unstaged modifications or untracked files.

## Branch Isolation Check

Before staging or committing, check the current branch:

```bash
git branch --show-current
```

If the branch is `develop` or `main` AND any of the following files are staged — move to FAIL:

- `CLAUDE.md`, `.claude/rules/**`, `tools/git-hooks/**`

FAIL response: report current branch and the staged protected files, then propose creating a `feature/*` or `hotfix/*` branch.

Exception: skip this check if `.git/MERGE_HEAD` exists (merge commit).

## Commit Approval

- Commit only after validation is complete.
- Report validation result, diff summary, and proposed commit message before committing.
- Wait for user approval before committing.

## Commit Message Format

Follow Conventional Commits:

```
<type>: <subject>

<body>
```

**Type prefix** (always English): `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `ci`, `config`, `perf`, `build`, `revert`.

**Subject line**: Korean primary; English for technical terms, file paths, identifiers.

**Body**: Korean primary with English technical terms inline. Explain *why*, not *what*.

**Co-author trailer** (always English):
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Branch Flow

- `feature/*` → `develop` (PR, always `--base develop`)
- `develop` → `main` (release PR only)

NEVER open a PR from a feature branch without `--base develop`.

## Post-PR Merge Cleanup

**feature → develop PR:**
1. `git checkout develop && git pull origin develop`
2. `git branch -d feature/{name}`
3. Suggest next feature branch name

**develop → main PR:**
`git checkout main && git pull origin main`, then sync develop:
`git checkout develop && git merge origin/main && git push origin develop`
