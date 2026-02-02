# Development Guide
**Role:** Software Engineer
**Goal:** Implement features safely and efficiently using Git and Code.

## 1. Branching Strategy (Epic Branch Workflow)
**Goal:** Manage complex features with a single final review.

- **Structure:**
  1.  **Epic Branch:** Create a long-lived branch for the main feature (e.g., `feature/PRO-100-user-auth`).
  2.  **Task Branches:** Create short-lived branches *from the Epic Branch* for sub-tasks (e.g., `temp/PRO-101-db`).
  3.  **Merge Flow:**
      - **Agent Self-Review:** Use `get_diff` to inspect changes in `Task Branch`.
      - `Task Branch` -> (Merge) -> `Epic Branch`
      - `Epic Branch` -> (Final PR & Review) -> `Master/Main`

- **Naming Convention:**
  - **Epic Branch:** `feature/issue-id-description` (e.g., `feature/PRO-100-signup`)
  - **Task Branch:** `temp/issue-id-description` (e.g., `temp/PRO-101-api`)
  - **Fix Branch:** `fix/issue-id-description` (for simple bugs)

## 2. Context Awareness
- **Rule:** Before writing code, always scan the project context (as defined in `context-aware.md`) to respect existing styles and conventions.

## 3. Status Tracking
- **Linear Status:**
  - Update issue status to **In Progress** immediately after creating the branch.
