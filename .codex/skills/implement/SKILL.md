---
name: implement
description: Implement a requested feature or fix cleanly
---

# Implement

Input: $ARGUMENTS

Workflow:

1. Understand the request and inspect related files
2. Find existing patterns before editing
3. Make a minimal implementation plan
4. Implement focused, production-ready code
5. Avoid unrelated refactors
6. Validate with tests/build/typecheck if available
7. Summarize changed files and key decisions

Rules:

- Follow project conventions
- Reuse existing abstractions
- Keep changes small and maintainable
- Do not hardcode secrets
- Do not modify unrelated files
- Ask before destructive actions
