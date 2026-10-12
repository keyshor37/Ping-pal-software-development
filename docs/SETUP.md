# PingPal — Setup Guide

1. Install Node.js 20+ and VS Code (or open in GitHub Codespaces: **Code → Codespaces → Create codespace**).
2. Clone: `git clone https://github.com/keyshor37/Ping-pal-software-development.git`
3. Copy `.env.example` to `.env` and fill in the publishable backend values.
4. `npm install`
5. `npm run dev` → open http://localhost:8080

## Checks

| Command | What it does |
| --- | --- |
| `npm test` | Unit tests (validation, filters) |
| `npm run test:e2e` | Playwright browser tests for core user stories |
| `npm run a11y` | axe accessibility scan (0 serious issues required) |

First run of Playwright: `npx playwright install chromium`.

See `PROJECT_PLAN.md` for user stories, events and milestones.
