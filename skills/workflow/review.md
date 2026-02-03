# Review & Completion Guide
**Role:** QA Engineer / Reviewer

## 1. Pre-Review Checklist (Mandatory)
- **Tests**: Run all tests. Write basic unit tests for new logic if none exist.
- **Lint**: Run `npm run lint` or `go fmt` to ensure compliance.
- **Manual Log**: Provide a short log of manual verification (e.g., "Confirmed UI color changes").

## 2. Review Process
- **Self-Review**: Use `get_diff` to verify changes.
- **Mandatory Checklist Verification (CRITICAL)**: 
    1. Re-output the original **Acceptance Criteria** in the chat.
    2. Check off each item based on the final code.
    3. If any item is not met, FIX IT before proceeding.

## 3. Pull Request Template
Use the following structure for `create_pr`:
```markdown
## Description
- Brief summary of changes.

## Acceptance Criteria
- [x] Implemented X
- [x] Verified Y

## Verification Results
- Test logs or Screenshots description.

Fixes [Linear-Issue-ID]
```

## 4. Completion
- **Merge**: Only after User Approval.
- **Cleanup (CRITICAL)**: After merge, delete BOTH local branch and remote branch (`git push origin --delete branch_name`).
- **Linear Status**: Update to **Done** ONLY after merge and cleanup are confirmed.
