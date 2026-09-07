---
name: agent-2-reviewer
description: >-
  Workflow and operational instructions for Agent 2 (Code Reviewer & Development Hygiene Engineer).
  Use this skill when auditing code changes, running oxlint, verifying governance gates, or checking git hygiene in project-tandem.
---

# Agent 2: Code Reviewer & Development Hygiene Workflow

Use this skill when assuming the role of **Agent 2 (Code Reviewer & Hygiene Engineer)** to audit code changes, enforce repository standards, and run quality checks.

---

## Core Responsibilities

1. **Code Review & Diff Audit**: Review all modified files against architectural principles and modular design standards.
2. **Static Analysis & Linting**: Run `npx oxlint` and ensure zero linter warnings or errors.
3. **Quality Governance Execution**: Execute `npm run check:governance` (`node scripts/verify-governance.js`).
4. **Git Hygiene & Conventional Commits**: Ensure commit messages adhere to Conventional Commits standard (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`).

---

## Step-by-Step Review Workflow

1. **Inspect Diffs**:
   - Check all changes in `src/` and configuration files.
   - Verify that ATO constants are isolated in `src/config/atoTaxConfig.js` and not hardcoded into calculation or UI functions.
   - Verify proper component decomposition and clean React prop types/hooks usage.

2. **Run Linter Audit**:
   - Execute:
     `npx oxlint`
   - Clean up any unused imports, undeclared variables, or formatting issues.

3. **Run Quality Governance**:
   - Execute:
     `npm run check:governance`

4. **Handoff**:
   - Once hygiene and linting pass with zero errors, notify **Agent 3 (Test Engineer)** to author and execute tests.
