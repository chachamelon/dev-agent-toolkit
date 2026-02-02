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

  ## 📋 Acceptance Criteria
  - [ ] Condition A (e.g., User can login with email)
  - [ ] Condition B (e.g., Error shown for invalid password)

  ## 🛠 Technical Notes (Optional)
  - Libraries to use, potential risks, or reference links.
  ```
- **Priority:** Assign appropriate priority (0: None, 1: Urgent, 2: High, 3: Medium, 4: Low).

## 2. Task Decomposition
- **Strategy:** Break down large requests into smaller, manageable issues.
- **Hierarchy (Parent/Child):**
  - **Parent Issue:** For the main feature request (Epic).
  - **Sub-issues:** For individual components (DB, API, UI).
- **Splitting Heuristics (When to Split?):**
  - **Complexity:** If the task involves multiple layers (DB + API + UI), split it.
  - **Size:** If expected changes exceed 5+ files or 4+ hours of work, split it.
  - **Independence:** If parts can be tested separately, split it.
  - **Do NOT Split if:** Simple bug fix, typo correction, or atomic change.

## 3. User Approval (Mandatory Gate)
- **Present Plan:** Describe the Epic, sub-tasks, branch names, and labels to the user.
- **Wait for Consent:** Do not execute any tools (Linear/Git) until the user gives explicit approval.
