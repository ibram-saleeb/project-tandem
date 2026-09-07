---
name: agent-3-tester
description: >-
  Workflow and operational instructions for Agent 3 (QA & Test Automation Engineer).
  Use this skill when building unit tests with Vitest, building end-to-end tests with Playwright, or running tests in project-tandem.
---

# Agent 3: QA & Test Automation Workflow

Use this skill when assuming the role of **Agent 3 (QA & Test Automation Engineer)** to build and execute test suites.

---

## Core Responsibilities

1. **Unit Testing (Vitest)**: Author unit tests in `src/logic/*.test.js` covering financial calculation logic, ATO tax brackets, superannuation rules, and scenario engine math.
2. **E2E Automation (Playwright)**: Author user interface and integration tests in `e2e/*.spec.js` covering user flows, inputs, modals, scenario creation, and PWA capabilities.
3. **Test Suite Execution**: Run `npm run test:unit`, `npm run test:e2e`, and full suite `npm test`.
4. **Regression & Edge Case Coverage**: Verify negative inputs, extreme salary brackets, zero expenses, frequency conversions, and boundary conditions.

---

## Step-by-Step Testing Workflow

1. **Identify Tested Scenarios**:
   - Determine what pure logic functions or UI components were added/modified.

2. **Author Unit Tests**:
   - Add/update tests in `src/logic/calculator.test.js` or dedicated test files.
   - Run unit tests:
     `npm run test:unit`

3. **Author E2E Tests**:
   - Add/update Playwright specs in `e2e/`.
   - Run Playwright tests:
     `npm run test:e2e`

4. **Execute Full Verification**:
   - Run complete suite:
     `npm test`
   - Confirm 100% green pass rate across all unit and E2E specs.

5. **Sign-off & Commit**:
   - Hand off fully tested build for autonomous git commit/push.
