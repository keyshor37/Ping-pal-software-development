# PingPal V1 Roadmap

- [x] Enable Lovable Cloud backend
- [x] Create `profiles` table + RLS policies + grants (migration)
- [x] Enable email/password auth (auto-confirm on, so fictional test accounts can log in)
- [x] Shared constants + validation (sports, skill levels, zod schemas)
- [x] Public browse/search/filter page at `/` (city, sport, skill, reset, contact email)
- [x] Auth page `/auth` (register with profile fields + login)
- [x] Protected `/profile` page (view/edit own profile) under `_authenticated`
- [x] Session-aware header (sign in/out) in root layout
- [x] Automated tests (validation, filters) + record results — 20/20 vitest, 13/13 Playwright
- [x] Two-user RLS privacy check + policy/grant inspection
- [x] Project plan doc: 10 user stories, events, milestones, teacher targets
- [ ] Performance measurement on physical phone over 4G (teacher evidence — needs real device)
- [ ] axe accessibility scan (teacher evidence)
- [ ] Dated availability checks during class hours (teacher evidence)
