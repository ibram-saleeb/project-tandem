# Changelog

All notable changes to **Tandem** (Project Tandem) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-09-08

### Added
- **3-Agent Architectural & Operational Convention (`.agents/`)**: Master rules and skills for Agent 1 (CTO & Lead Architect), Agent 2 (Code Reviewer & Development Hygiene Engineer), and Agent 3 (QA & Test Automation Engineer).
- **5-Year Household Net Worth Trajectory (`FinancialCopilot.jsx`)**: New interactive intelligence tab forecasting 5-year combined liquid surplus and compounded Super Guarantee wealth (~6% p.a. net growth).
- **HECS/HELP Debt & Pre-Tax Salary Sacrifice Integration (`IncomeSection.jsx`)**: Dedicated controls per partner for compulsory HECS repayment tracking and salary sacrifice packaging.
- **v1.3.0 Playwright E2E Spec Suite (`e2e/v130-features.spec.js`)**: Playwright automation verifying 5-year wealth forecast card rendering and HECS debt toggle interactions.

---

## [1.2.0] - 2026-08-19

### Changed & Improved
- **Luxury FinTech Design Overhaul**: Eradicated "AI slop" clutter, emojis, and boxy containers in favor of a sleek, Linear/Monzo/Apple Wallet aesthetic.
- **Strict 4-Color Luxury FinTech Palette**: Unified design tokens into Obsidian Canvas (`#060913`), Slate Surfaces (`#0D1322`), Sapphire Indigo (`#6366F1`), Vibrant Emerald (`#10B981`), and Coral Crimson (`#F43F5E`).
- **Streamlined Header Toolbar**: Replaced 6 developer icon buttons with a clean, focused action bar and a sleek `•••` Tools & Settings popover dropdown.
- **Refined Household Intelligence**: Modernized Copilot into clean, vector-driven financial intelligence cards.
- **Autonomous Visual Preview Pipeline (`scripts/capture-preview.js`)**: Playwright-driven autonomous visual inspection across mobile and desktop viewports.

### Fixed
- **ATO Stage 3 Tax Top Bracket ($190,000+ at 45%)**: Added missing 45% top bracket to `atoTaxConfig.js` ensuring high-earner incomes are accurately calculated.
- **Fixed Expense Normalisation in Copilot**: Normalised frequency conversions so fixed commitment percentages are mathematically bounded.

### Added
- **Pure Unit & Property-Based Test Suite (Vitest)**: 14 sub-millisecond mathematical and tax tests (`src/logic/calculator.test.js`).
- **Adversarial & Security Test Suite (Playwright)**: 5-vector red-team tests for $0/negative division-by-zero resilience, XSS resistance, 14-day paywall defense, and corrupt data rejection.
- **Total Test Suite**: 26/26 automated tests passing in CI/CD quality gates.

---

## [1.1.0] - 2026-08-19

### Added
- **14-Day Free Trial Engine (`useTrialState.js`)**: Automatic first-install tracking, elapsed day calculation, remaining days counter, and auto-expiration after 14 days.
- **Top Header Status Pill (`Header.jsx`)**: Real-time trial days indicator (`✨ 14 days left` / `🔒 Trial Expired`) with instant preview modal trigger.
- **"Full App Launching Soon" Paywall Modal (`PaywallModal.jsx`)**: High-converting early-access paywall screen with VIP launch list email capture (50% launch discount), premium roadmap feature highlights, data safety reassurance, and developer test overrides.
- **Google Play Store Asset Pipeline (`generate-play-store-assets.js`)**: Playwright-driven generation of 512x512 PNG app icon, 1024x500 feature graphic, and high-resolution mobile store screenshots in `public/store-assets/`.
- **PWA Web Manifest Store Compliance (`manifest.json`)**: 100% compliant web manifest with multi-resolution PNG icons (`192x192` & `512x512` with `any` + `maskable` tags), desktop and mobile screenshots, and shortcut intent routing.
- **Android Digital Asset Links (`.well-known/assetlinks.json`)**: Deployed domain ownership certificate fingerprint (`BA:FC:E0:F6...`) enabling full-screen native Android Trusted Web Activity execution without browser URL chrome.
- **Google Play Store Internal Testing Deployment**: Packaged, signed, and published Android App Bundle (`Tandem.aab`) with package ID `app.pages.project_tandem.twa` and original signing key (`SHA1: 24:D6:68:B1...`) to Google Play Internal Testing.
- **Cloudflare Pages Production Deployment & Tooling**: Direct Cloudflare Pages production deployments via Wrangler CLI, and Cloudflare agent environment integration (13 skills & 5 MCP servers).

---

## [1.0.0] - 2026-07-28

### Added
- **Initial Production Release (v1.0.0)** of **Tandem — Household Financial Clarity**.
- **Tandem Financial Copilot Engine (`FinancialCopilot.jsx`)**: Real-time tax bracket proximity, fixed vs flexible expense ratios, emergency runway buffer calculations, and partner equity parity tabs.
- **Recharts Financial Visualizations**:
  - Interactive Donut Chart (`CashflowDonutChart.jsx`) for visual expense category distribution.
  - Stacked Bar Chart (`PartnerTaxBarChart.jsx`) for Partner 1 vs Partner 2 gross income, ATO tax, Medicare levy, and spendable take-Home pay.
- **What-If Live Scenario Engine (`ScenarioEngine.jsx`)**:
  - Scenario Impact Comparison Cards (replacing desktop HTML tables).
  - Quick stress-test presets (Parental Leave, Single Income, Mortgage Surge).
- **Data Portability & Backup Engine (`ExportModal.jsx`)**: Complete CSV export, JSON backup, and state restore capabilities.
- **Mobile-First FinTech Layout & Design Tokens**:
  - Monzo-style floating mobile bottom navigation bar (`NavTabs.jsx`).
  - Strict 3-tone Deep Midnight Obsidian design system with custom dark select dropdowns and SVG chevrons.
- **ATO Stage 3 FY 24-25/25-26 Tax Engine (`calculator.js`)**: Pure mathematical model for resident income tax, 2% Medicare levy, and employer Super Guarantee (12%).
