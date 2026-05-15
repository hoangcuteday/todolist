---
name: create-commit
description: Create clean conventional git commits safely
---

# Create Commit

Input: $ARGUMENTS

## Commit Format

```text
<type>(<scope>): <imperative summary>
```

Rules:

- Max 50 characters
- Imperative mood only
- No period at the end
- No emoji
- No AI attribution

Types:

- feat
- fix
- refactor
- perf
- docs
- test
- chore
- build
- ci

Optional body:

- Explain WHY, not WHAT
- Mention breaking changes or migrations if needed

Optional footer:

```text
Closes: <TICKET>
```

## Workflow

1. Run:
   - git status
   - git diff --stat
   - git diff

2. Review modified files carefully

3. Stage files explicitly by filename
   - Never use:
     - git add .
     - git add -A
     - git commit -am

4. Generate a clean conventional commit message

5. Show:
   - staged files
   - commit message

6. Ask for confirmation before committing

7. After confirmation:
   - create commit
   - show short SHA and final message

## Rules

- Keep commits focused
- Split unrelated changes into separate commits
- Avoid committing generated files
- Infer scope from project structure and diff when possible
