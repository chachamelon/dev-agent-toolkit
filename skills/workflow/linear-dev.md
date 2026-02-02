# Linear Workflow Guide

This guide outlines the standard operating procedure for managing tasks using Linear, focused on three key phases: Planning, Tracking, and Completing.

## 1. Planning Phase
**Goal:** Define clear, actionable units of work.

- **Issue Creation:**
  - **Title:** Use a concise, verb-oriented title (e.g., "Implement User Authentication").
  - **Description:** clearly state the *Why*, *What*, and *Acceptance Criteria*.
  - **Priority:** Assign appropriate priority (Urgent, High, Medium, Low).
- **Task Decomposition:**
  - **Hierarchy (Parent/Child):**
    - Create a **Parent Issue** for the main user request (e.g., "Implement User Authentication").
    - Break down the work into **Sub-issues** linked to the Parent Issue (e.g., "Design DB", "Build API").
  - **Atomicity:** Sub-issues must be testable, shippable units.
  - **Granularity:** Each sub-issue should ideally take less than 1-2 days.
  - **Example:**
    - *Parent:* "Build User Registration"
      - *Sub-issue 1:* "Design User DB Schema & Migration"
      - *Sub-issue 2:* "Implement Sign-up API with Validation"
      - *Sub-issue 3:* "Build Sign-up UI Form"
- **Estimation:**
  - Assign estimate points (e.g., T-shirt sizes or Fibonacci) based on complexity, not just time.
- **Cycles:**
  - Assign the issue to the current active cycle if it's to be worked on immediately.

## 2. Branching Strategy
**Goal:** Standardize branch names for better tracking and automation.

- **Naming Convention:** `type/issue-id-short-description`
  - **Types:**
    - `feature/`: New features (e.g., `feature/PRO-123-user-login`).
    - `fix/`: Bug fixes (e.g., `fix/PRO-124-nav-crash`).
    - `refactor/`: Code restructuring without behavioral changes.
    - `docs/`: Documentation only changes.
    - `chore/`: Build tasks, package manager configs, etc.
  - **Format Rules:**
    - Use **lowercase** only.
    - Use **hyphens (-)** to separate words.
    - Include the **Linear Issue ID** (e.g., `PRO-123`) immediately after the type for auto-linking.

## 3. Tracking Phase
**Goal:** Maintain visibility on progress and blockers.

- **Status Updates:**
  - **Todo:** Task is prioritized but work hasn't started.
  - **In Progress:** Work has actively begun. Assign yourself to the issue.
  - **In Review:**
  - Code is implemented and a PR is open. Link the PR to the Linear issue.
  - **Self-Review:** Before requesting a review, read through your own changes.
  - **Review Request:** Assign a reviewer (e.g., the user or another agent).
  - **Pre-Review Checklist (Mandatory):**
    - ✅ **Tests:** 
      - If tests exist: Run and ensure pass.
      - If missing: **Write basic unit tests** for new logic.
      - If impossible: Provide a detailed **Manual Verification Log** in the PR.
    - ✅ **Lint/Format:** Run linter/formatter to ensure code style compliance.
    - ✅ **Docs:** Update README or API documentation if functionality changed.
  - **Feedback Loop:** Address comments and push updates to the same branch. Do not merge until approved.
- **Comments:**
  - Post updates on the issue for any blockers or scope changes.
  - Keep technical discussions on the PR, but strategic decisions on the Linear ticket.

## 3. Completing Phase
**Goal:** Ensure high-quality delivery and closure.

- **Verification:**
  - Verify all acceptance criteria are met.
  - Ensure CI/CD checks pass on the linked PR.
- **Closing:**
  - Issues should automatically close when the PR is merged (if linked correctly using "Fixes PROJECT-123").
  - If closing manually, ensure the resolution state is accurate (Done, Canceled, Duplicate).
