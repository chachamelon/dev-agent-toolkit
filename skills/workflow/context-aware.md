# Project Context Awareness Guide

## 1. Discovery Phase
- **Config Scan**: Read `package.json`, `.eslintrc`, `.gitignore`, `go.mod`, etc.
- **Style Scan**: Check indentation (spaces vs tabs), naming (camelCase vs snake_case).
- **Architecture**: Read `README.md` and `.project-context.md`.

## 2. Style Calibration (Mandatory Report)
- **Calibration Rule**: Before writing the first line of code, provide a **Calibration Report** to the user:
  > "I have analyzed the project context. I will follow:
  > - Indentation: 2 spaces
  > - Naming: camelCase for variables, PascalCase for components
  > - CSS: Tailwind Utility classes
  > **Does this match your expectations?**"

## 3. Technology Alignment
- **No New Tools**: Use existing libraries (e.g., use `axios` if present, don't add `fetch`).
- **File Placement**: Follow existing folder structures (e.g., `src/components`).

## 4. Execution Rule
- **Read-to-Calibrate**: Read at least one similar file before creating or modifying code to ensure perfect mimicry.