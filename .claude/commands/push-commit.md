Push current work to remote.

Input:
$ARGUMENTS

Workflow:
1. Run git status
2. Ensure there are no merge conflicts
3. Determine target branch:
   - use $ARGUMENTS if provided
   - otherwise use current git branch
4. If there are uncommitted changes:
   - review changes
   - create a clean conventional commit
5. Push using:
   git push origin <target-branch>
6. Show:
   - pushed branch
   - latest commit SHA
   - commit message

Rules:
- Never use --force unless explicitly requested
- Abort if there are unresolved conflicts
- Keep commit messages clean and conventional