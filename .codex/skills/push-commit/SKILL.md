---
name: push
description: Safely commit and push current work to remote
---

# Push

Input:
$ARGUMENTS

## Workflow

1. Run:
   - git status
   - git branch --show-current

2. Ensure:
   - no unresolved merge conflicts
   - working tree is valid

3. Determine target branch:
   - use $ARGUMENTS if provided
   - otherwise use current branch

4. If there are uncommitted changes:
   - review diff
   - create a clean conventional commit
   - ask for confirmation before committing

5. Push using:

```bash
git push origin <target-branch>
```

6. Show:
   - pushed branch
   - latest commit SHA
   - latest commit message

## Rules

- Never use --force unless explicitly requested
- Abort if there are unresolved conflicts
- Keep commits focused and conventional
- Never push secrets or generated artifacts
- Confirm before destructive git operations