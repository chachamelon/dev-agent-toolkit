# Project Context Awareness Guide

This guide instructs the AI agent on how to adapt to the specific conventions, technology stack, and style of any given project **before** writing code.

## 1. Discovery Phase (Scan First)
**Goal:** Understand the "Law of the Land" (local conventions) before making changes.

- **Check Configuration Files:**
  - `package.json`, `pyproject.toml`, `Cargo.toml`: Identify languages, frameworks, and dependencies.
  - `.eslintrc`, `.prettierrc`, `tslint.json`, `.pylintrc`: Understand coding style and linting rules.
  - `.editorconfig`: Check indentation (spaces vs tabs) and line endings.

- **Check Documentation:**
  - `README.md`: Read for architectural overview and setup instructions.
  - `CONTRIBUTING.md`: Look for specific contribution guidelines or commit message formats.
  - `.ai-rules.md` (or similar): Check for any explicit AI instructions if they exist.

## 2. Style Adaptation (Mimicry)
**Goal:** Write code that looks like it was written by the existing team.

- **Indentation:** Match the existing indentation (2 spaces, 4 spaces, tabs).
- **Naming Conventions:**
  - Verify variable/function naming (camelCase, snake_case, PascalCase) by reading existing source files.
- **Project Structure:**
  - Place files in directories that match the existing pattern (e.g., `src/components`, `tests/unit`).

## 3. Technology Alignment
**Goal:** Use available tools, do not introduce new ones arbitrarily.

- **Libraries:** Use existing dependencies found in `package.json` (e.g., if `axios` is installed, don't use `node-fetch`).
- **Test Framework:** Use the established test runner (Jest, Mocha, PyTest) found in configuration.

## 4. Deployment Awareness
**Goal:** Recognize how the code is shipped to production.

- **Check for CI/CD Configs:**
  - `.github/workflows/*.yml`: GitHub Actions.
  - `.gitlab-ci.yml`: GitLab CI.
  - `vercel.json` / `netlify.toml`: Cloud Platform deployment.
  - `Dockerfile` / `docker-compose.yml`: Containerized environment.

- **Action:**
  - If CD config exists, assume **Auto-Deployment** upon merge.
  - Notify the user: "Changes merged. Deployment should start automatically via [System Name]."

## 5. Execution Rule
- **Always read at least one related file** in the codebase to "calibrate" your style before creating a new file.
