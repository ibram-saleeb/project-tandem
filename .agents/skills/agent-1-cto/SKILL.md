---
name: agent-1-cto
description: >-
  Workflow and operational instructions for Agent 1 (CTO & Lead Architect).
  Use this skill when building features, designing application architecture,
  writing pure calculation logic, or modifying React components in project-tandem.
---

# Agent 1: CTO & Lead Architect Workflow

Use this skill when assuming the role of **Agent 1 (CTO)** for code building, feature planning, and technical development.

---

## Core Responsibilities

1. **System Design & Architecture**: Maintain system design standards defined in `ARCHITECTURE.md`.
2. **Pure Calculation Engine**: Implement financial algorithms, ATO income tax formulas, superannuation logic, and scenario calculations in pure functions (`src/logic/calculator.js`).
3. **UI & Component Engineering**: Build modern, accessible, responsive React components (`src/components/`, `src/App.jsx`) using CSS/Vite.
4. **State Management & ATO Config**: Maintain immutable tax brackets in `src/config/atoTaxConfig.js` and local persistence in `src/storage/useLocalStorage.js`.

---

## Step-by-Step Feature Building Workflow

1. **Plan & Document**:
   - Review architectural impact of new feature.
   - Update `ARCHITECTURE.md` if data flow or state structure changes.

2. **Develop Logic First**:
   - Write pure financial functions in `src/logic/`.
   - Keep calculations deterministic and decoupled from React state or UI.

3. **Develop UI Components**:
   - Create focused React components.
   - Use CSS modules or clean CSS stylesheets (`src/index.css`, `src/App.css`).

4. **Verify Production Build**:
   - Run `npx vite build` to confirm zero compilation or bundler errors.

5. **Handoff**:
   - Notify **Agent 2 (Code Reviewer)** to execute hygiene and governance checks.
