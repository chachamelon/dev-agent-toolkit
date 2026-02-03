---
name: Git & Linear Workflow Manager
description: A comprehensive skill for managing the software development lifecycle using Git (GitHub) and Linear. This skill guides the agent through Planning, Development, Review, and Troubleshooting phases, ensuring best practices in issue tracking, branching strategies, testing, and code review.
---

# Git & Linear Workflow Manager

This skill provides a structured approach to software development, integrating project management (Linear) with version control (GitHub). It is divided into four main phases:

1.  **Planning (`planning.md`)**: Defining tasks, estimating time, creating Linear issues, and establishing verification plans.
2.  **Context & Development (`context-aware.md`, `development.md`)**: Writing code that respects existing patterns, managing feature branches, and tracking progress.
3.  **Review (`review.md`)**: Creating Pull Requests, conducting self-reviews, and handling feedback.
4.  **Troubleshooting (`troubleshooting.md`)**: Systematic debugging and issue resolution.

## Usage Instructions

When starting a new task or user request, follow this flow:

### Phase 1: Planning & Setup
1.  **Read `planning.md`**: Understand the rules for issue creation and task decomposition.
2.  **Project Analysis**:
    - Use `git_status` and `list_branches` to check current state.
    - Read `.project-context.md` (if available) or scan key files to understand the codebase (`context-aware.md`).
3.  **Issue Management**:
    - Use `list_teams` and `get_states` (Linear) to get IDs.
    - Create a structured issue in Linear using `create_issue` with the mandatory template from `planning.md`.
4.  **Branching**:
    - Create a new branch using `create_branch` (`feature/...` or `fix/...`).
    - Update the Linear issue status to "In Progress" (`update_issue`).
    - **Wait for User Approval** before proceeding to code.

### Phase 2: Development & Testing
1.  **Read `development.md`**: Follow the Atomic Task and Commit strategy.
2.  **Implementation**:
    - Write code (TDD is encouraged for logic).
    - **Verify frequently**: Run tests *before* every commit.
    - **Commit & Push**:
        - Use `git_add` and `git_commit` with conventional commit messages.
        - `git_push` changes to the remote branch immediately after passing tests.

### Phase 3: Review & Merge
1.  **Read `review.md`**: Understand the PR creation and self-review process.
2.  **Create PR**:
    - Use `create_pr` to open a Pull Request on GitHub.
    - Link the Linear issue in the PR description (e.g., "Fixes LIN-123").
3.  **Self-Correction**:
    - Review your own code. If you find bugs, fix them and push updates *before* asking the user to review.
4.  **Completion**:
    - Once merged (or approved), update Linear issue status to "Done".

### Phase 4: Troubleshooting (If needed)
- If a test fails or a bug is reported, refer to `troubleshooting.md` for a Root Cause Analysis (RCA) approach.
- Don't just "try" fixes. Analyze -> Hypothesize -> Verify -> Fix.

## Tools Reference
- **GitHub**: `git_status`, `list_branches`, `create_branch`, `git_add`, `git_commit`, `git_push`, `git_pull`, `create_pr`, `get_diff`
- **Linear**: `list_teams`, `get_labels`, `get_states`, `create_issue`, `update_issue`, `get_viewer`
