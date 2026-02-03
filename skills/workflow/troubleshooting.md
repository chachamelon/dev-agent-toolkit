# Troubleshooting & Error Recovery Guide

## 1. Analysis Tools
- **Grep Logic**: Use `search_file_content` to trace error strings across the project.
- **Dependency Check**: Use `read_file` on `go.sum` or `package-lock.json` for version issues.
- **Log Review**: In background processes, check redirected log files.

## 2. Recovery Protocols
- **Merge Conflicts**:
  1. `git merge --abort`.
  2. Analyze diffs.
  3. Propose manual resolution plan to the user.
- **Test Failures**:
  1. Analyze raw output for specific line numbers.
  2. Attempt **one** self-fix if it's a minor error.
  3. If it persists, report to the user with a hypothesis.

## 3. Systematic Loop
1. **Analyze**: Use tools to gather data.
2. **Hypothesize**: Explain *why* it's failing.
3. **Verify**: Run a targeted test or check.
4. **Fix & Regress**: Apply fix and run ALL existing tests.