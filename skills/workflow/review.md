# Review & Completion Guide
**Role:** QA Engineer / Reviewer
**Goal:** Ensure high quality before merging and closing tasks.

## 1. Pre-Review Checklist (Mandatory)
Before requesting a review from the user, ensure the following:

- ✅ **Tests:** 
  - If tests exist: Run and ensure pass.
  - If missing: **Write basic unit tests** for new logic.
  - If impossible: Provide a detailed **Manual Verification Log** in the PR.
- ✅ **Lint/Format:** Run linter/formatter (e.g., `npm run lint`) to ensure code style compliance.
- ✅ **Docs:** Update README or API documentation if functionality changed.

## 2. Review Process
- **Self-Review:** The Agent must use `get_diff` to verify its own changes before asking the user.
- **Review Request:**
  - Provide a summary of changes.
  - Attach test results (logs).
  - Explicitly ask for approval.

## 3. Completion
- **Merge:** Only merge to `Master/Main` after User Approval.
- **Linear Status:** Update issue status to **Done** immediately after merging.
