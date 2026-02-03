# Development Guide
**Role:** Software Engineer
**Goal:** Implement features safely and efficiently using Git and Code.

## 1. Branching Strategy (Epic Branch Workflow)
**Goal:** Manage complex features with a single final review.

- **Structure:**
  1.  **Feature Branch:** Create a branch for the feature (e.g., `feature/login`).
  2.  **Atomic Commits:** Push commits frequently as per `planning.md` strategy.
  3.  **Merge Flow:**
      - `Feature Branch` -> (Review & PR) -> `Main`
      - **NO** separate Epic/Task sub-branches unless extremely complex.

- **Naming Convention:**
  - **Feature:** `feature/description` (e.g., `feature/signup`)
  - **Fix:** `fix/description` (e.g., `fix/api-error`)
  - **Refactor:** `refactor/description` (e.g., `refactor/cleanup`)

## 2. Context Awareness
- **Rule:** Before writing code, always scan the project context (as defined in `context-aware.md`) to respect existing styles and conventions.

## 3. Status Tracking
- **Linear Status:**
  - Update issue status to **In Progress** immediately after creating the branch.
