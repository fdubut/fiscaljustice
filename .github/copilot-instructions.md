# Copilot Instructions

## Build & Dev Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — ESLint across all TS/TSX files
- No test framework is configured

## Architecture

This is a static React SPA for **fiscaljustice.com**, focused on Washington State tax policy. It has two pages:

- **Introduction** (`/`) — Editorial content explaining fiscal justice in WA
- **Simulator** (`/simulator`) — Interactive tax revenue calculator with sliders for income tax (rate + threshold), sales tax rate, and property tax rate. Shows revenue impact and progress toward funding universal healthcare and childcare.

Routing uses React Router v7 with a shared `Layout` component (navbar + footer wrapping an `<Outlet />`).

### Data Layer

All fiscal data lives in `src/data/`:

- **`constants.ts`** — WA tax rates, tax bases, current revenue, program costs, and income distribution brackets. All values are sourced from public data (WA DOR, ITEP, Census) with inline citations. Contains `estimateIncomeAboveThreshold()` for piecewise-linear interpolation of income distribution.
- **`research-data.json`** — 125 research data points with source URLs across 13 categories. This is reference material, not directly imported by components.

Revenue calculations in the Simulator scale proportionally from actual FY2024 figures (sales/property tax) or use the income distribution model (income tax).

## Conventions

- Tailwind CSS v4 via `@tailwindcss/vite` plugin — styles use utility classes directly, no separate CSS files beyond the single `@import "tailwindcss"` in `index.css`
- Components in `src/components/`, pages in `src/pages/` — each file exports a single default function component
- All monetary values in the data layer use **billions** (e.g., `totalAGIBillions: 536`); the `formatBillions()` helper in Simulator handles display formatting
- Data sources must include citations — every constant has a comment referencing its source, and `DATA_SOURCES` provides labeled URLs rendered as links in the UI

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml` (Node 20, `npm ci && npm run build`, uploads `dist/`).
