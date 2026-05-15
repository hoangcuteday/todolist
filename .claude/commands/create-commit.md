Create commit with conventional message.

Input: $ARGUMENTS

## Format
```
<type>(<scope>): <imperative summary>   # ≤50 chars, no period
<optional body — why, not what>
Closes: <TICKET>
```

Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`
Imperative mood ("add"/"fix"/"remove"). No "This commit does X", no AI attribution, no emoji.
Body only for: non-obvious *why*, breaking changes, migration notes.

## Procedure

1. Run `git status` and `git diff --stat` to review changes.
2. Stage specific changed files by name (do NOT use `git add -A`).
3. Draft commit message following the format above.
4. Show the user the staged files and proposed message for confirmation.
5. After confirmation, create the commit.

Report: committed files, message, short SHA.
