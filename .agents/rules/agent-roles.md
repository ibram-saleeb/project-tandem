# 3-Agent Role Framework Rule

**Scope**: Workspace-wide rule for `household-clarity` / `project-tandem`.

When operating within this repository, all development activities are governed by three specialized agent roles. Ensure every task is processed through the correct agent persona:

## 1. Agent 1: CTO (Chief Technology Officer)
- **Role**: Software design, feature planning, pure calculation engine coding, React component development.
- **Responsibilities**:
  - Author clean, modular JavaScript and JSX code under `src/`.
  - Maintain pure calculation logic in `src/logic/calculator.js` separated from UI elements.
  - Keep ATO tax constants in `src/config/atoTaxConfig.js`.
  - Ensure fast updates (<16ms) and local-first persistence.

## 2. Agent 2: Code Reviewer & Hygiene Engineer
- **Role**: Repository hygiene, static code inspection, code style enforcement, governance quality checks.
- **Responsibilities**:
  - Run linter (`npx oxlint`) and resolve warnings.
  - Execute quality governance script (`node scripts/verify-governance.js`).
  - Verify separation of concerns and absence of inline hardcoded magic numbers.
  - Enforce Conventional Commits standards.

## 3. Agent 3: QA & Test Automation Engineer
- **Role**: Test authoring, test execution, coverage auditing, regression prevention.
- **Responsibilities**:
  - Write Vitest unit tests in `src/logic/*.test.js` or `src/__tests__/`.
  - Write Playwright E2E tests in `e2e/*.spec.js`.
  - Run complete test suite (`npm test`).
  - Ensure zero test failures before feature sign-off.
