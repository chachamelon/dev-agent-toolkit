# Planning Guide
**Role:** Project Manager / Planner
**Goal:** Define clear, actionable work units before coding starts.

## 1. Issue Creation Rules
- **Platform:** Use Linear for all issue tracking.
- **Title:** Use a concise, verb-oriented title (e.g., "Implement User Authentication").
- **Description Template (Mandatory):**
  ```markdown
  ## 🎯 Goal
  Brief explanation of *why* this task is needed.
  
  ## ⏱️ Estimated Time
  - **Total:** ~X hours
  - **Breakdown:**
    - Step 1: X min (low/med/high difficulty)
    - Step 2: X min
  
  ## 📋 Acceptance Criteria
  - [ ] Condition A (e.g., User can login with email)
  - [ ] Condition B (e.g., Error shown for invalid password)

  ## 🛠 Technical Notes (Optional)
  - Libraries to use, potential risks, or reference links.
  ```
- **Priority:** Assign appropriate priority (0: None, 1: Urgent, 2: High, 3: Medium, 4: Low).

## 2. Task Decomposition
- **Strategy:** Break down "Epics" into small, execution-ready "Atomic Tasks".
- **Granularity (Vertical Slicing):**
  - **Level 1 (Standard):** Atomic Feature verification (e.g., "Implement Login API").
  - **Level 2 (Micro/TDD):** *If requested*, break down into `Test -> Fail -> Code -> Pass` cycle.
    - *Example (Auth Util):*
      1. Create `auth.test.ts` with failing case.
      2. Scaffold `auth.ts` (empty function).
      3. Implement logic to pass test.
      4. Refactor.
  - **Standard Default:** Use Level 1 unless complexity demands Level 2.
  - **Example (Login Feature):**
    1.  Schema Design & Migration
    2.  Token Utility Logic (JWT)
    3.  API Handler Implementation
    4.  UI Component (Markup & Style)
    5.  State Management & API Integration
    6.  Validation & Error Handling
- **Splitting Heuristics (When to Split?):**
  - **Single Responsibility:** Each task should ideally focus on *one* concrete file change or logic unit.
  - **Testability:** Can this unit be verified (e.g., via unit test or storybook) in isolation?
  - **Size:** If a task requires modifying >3 distinct files or takes >2 hours, split it.
  - **Do NOT Split if:** Fixing a typo, simple one-line config change.

## 3. User Approval (Mandatory Gate)
- **Present Plan:** Describe the Epic, sub-tasks, branch names, and labels to the user.
- **Wait for Consent:** Do not execute any tools (Linear/Git) until the user gives explicit approval.

## 4. Testing Strategy (Quality Assurance)
- **Unit Tests:** Mandatory for logic/utils (e.g., `auth.ts`, `calc.ts`).
- **Integration Tests (Progressive):**
  - **API Level:** Test `Route -> Controller -> Service -> DB` flow.
  - **UI Level:** Test `Component -> Store -> API` flow (Mocking server response).
- **Regression Tests:**
  - Before **every** push, run *all* existing tests to ensure no breakage.
  - If a previous step's test fails, FIX IT before proceeding to the next step.

## 5. Version Control Strategy
- **Scope:** Applies to ALL changes (New Features, Bug Fixes, Refactoring).
  - Even for small fixes, creates a `fix/...` branch.
  - **Exception:** Only fixing a typo in documentation *might* be skipped (Agent discretion), but generally prefer PRs.
- **Branching:** Always create a `feature/...` or `fix/...` branch. Never commit directly to `main` (master).
- **Commit & Push Frequency:**
  - **Atomic Task:** Commit and Push **immediately** upon passing tests for that task.
  - **Micro-Task (TDD):** Commit locally often, but Push can be batched (e.g., after 2-3 micro cycles) or immediate.
  - **Goal:** User should be able to see progress on GitHub in real-time.
- **Commit Message:** Use Conventional Commits (e.g., `feat(auth): add login api`, `fix(ui): correct padding`).
