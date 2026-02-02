# Troubleshooting & Error Recovery Guide
**Role:** Reliability Engineer
**Goal:** Handle errors gracefully and propose solutions instead of just failing.

## 1. Git Merge Conflicts
**Scenario:** `git merge` fails due to conflicting changes.
- **Protocol:**
  1.  **Abort:** Immediately run `git merge --abort` to return to a clean state.
  2.  **Analyze:** Use `get_diff` to identify conflicting files and lines.
  3.  **Report:** Inform the user clearly:
      > "Merge conflict detected in `src/api.js`.
      > - Current (Master): Using `fetch`
      > - Incoming (My Branch): Using `axios`
      > **How should I proceed? (Keep Master / Use Mine / Manual Fix)**"
  4.  **Wait:** Do not attempt to auto-resolve logic conflicts without approval.

## 2. Test Failures
**Scenario:** `npm test` fails during the Pre-Review Checklist.
- **Protocol:**
  1.  **Read Logs:** Analyze the error message (don't just say "failed").
  2.  **Self-Correction (Try Once):**
      - If it's a minor syntax error or import path error, try to fix it immediately.
      - If logic is fundamentally wrong, **Stop**.
  3.  **Report:**
      > "Tests failed. The error indicates `User ID is null`.
      > I suspect the Mock DB wasn't initialized.
      > **Shall I debug this, or would you like to see the code first?**"

## 3. Tool Execution Failures
**Scenario:** Linear API timeout, Git command error, or Network issue.
- **Protocol:**
  1.  **Retry:** Attempt the operation up to **3 times** with exponential backoff (wait 1s, 2s, 4s).
  2.  **Fallback:**
      - If `linear-manager` fails, ask: "Linear is down. Should I proceed with local Git work only?"
  3.  **Report:** Provide the raw error code/message for debugging.

## 4. Branch Name Collisions
**Scenario:** `create_branch` fails because the branch already exists.
- **Protocol:**
  1.  **Check:** Is the existing branch stale (old) or active?
  2.  **Action:**
      - If stale: Ask to delete/overwrite.
      - If active: Append a suffix (e.g., `feature/login-v2`) and notify the user.
