# Development Guide
**Role:** Software Engineer
**Goal:** Implement features safely with strict version control and security.

## 1. Branching Strategy
- **Base Branch**: Always start from a clean, updated `main`.
- **Naming**:
  - `feature/description` (e.g., `feature/login-ui`)
  - `fix/description` (e.g., `fix/api-timeout`)
- **Status**: Update Linear issue to **In Progress** immediately after branching.

## 2. Security & Environment (CRITICAL)
- **No Secrets**: NEVER hardcode API keys, tokens, or passwords.
- **Environment**: If a new secret is needed:
  1. Add it to `.env` (locally).
  2. Update `.env.example` with the new key name (empty value).
  3. Verify `.gitignore` covers `.env`.

## 3. Atomic Implementation & Commits
- **Frequency**: Commit and Push **immediately** after each atomic task passes tests.
- **Conventional Commits**:
  - `feat(scope): description`
  - `fix(scope): description`
  - `refactor(scope): description`
- **Real-time Progress**: The user should see incremental progress on GitHub.

## 4. Execution Rule
- **TDD (Optional but Recommended)**: Create tests before logic for complex utilities.
- **Validation**: Run project-specific build/lint commands before every commit.