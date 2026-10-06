# PingPal V1 — Project Plan

PingPal helps recreational players find other players for the same sport in their city.

## User stories (Given/When/Then)

1. **Valid registration** — Given a visitor on the auth page, when they submit email, password, display name, city, sport, and skill level with valid values, then an account and a public player profile are created and they land on their profile page.
2. **Invalid registration** — Given a visitor on the register form, when they submit missing or invalid values (short password, bad email, unknown sport/skill), then the registration is rejected and each field shows a message explaining how to fix it.
3. **Successful login** — Given a registered player, when they log in with the correct email and password, then they are signed in and taken to their profile.
4. **Incorrect login** — Given a visitor on the login form, when they enter a wrong password or unknown email, then they see a generic "Invalid email or password" message that does not reveal whether the email exists.
5. **View profile** — Given a logged-in player, when they open "My profile", then they see their display name, city, sport, skill level, and optional contact email.
6. **Edit profile** — Given a logged-in player, when they edit display name, city, sport, or skill level and save, then the changes persist and are visible in the public player list.
7. **Search by city** — Given a visitor on the home page, when they search a city (any letter case), then only players in matching cities are shown.
8. **Filter by sport and skill** — Given a visitor, when they pick a sport and/or skill level, then only matching players are shown.
9. **Combine and reset filters** — Given a visitor, when they combine city + sport + skill filters, then only players matching all are shown; when they press Reset, every filter clears and the full list returns.
10. **Contact a player by email** — Given a visitor viewing a player with a contact email, when they click "Contact by email", then their email app opens addressed to that player (mailto link).

## Events (time order, past tense, with the action that starts each)

1. **VisitorOpenedBrowsePage** — visitor navigates to `/`.
2. **VisitorSubmittedInvalidRegistration** — visitor clicks "Register" with invalid values.
3. **PlayerRegistered** — visitor clicks "Register" with valid values (`supabase.auth.signUp` + profile insert).
4. **PlayerLoggedIn** — player clicks "Log in" (`supabase.auth.signInWithPassword`).
5. **LoginRejected** — player clicks "Log in" with wrong credentials.
6. **PlayerViewedProfile** — player opens "My profile".
7. **PlayerEditedProfile** — player clicks "Save changes" on the edit form.
8. **VisitorSearchedByCity** — visitor types a city and clicks "Search".
9. **VisitorFilteredBySportAndSkill** — visitor picks sport/skill and clicks "Search".
10. **VisitorResetFilters** — visitor clicks "Reset".
11. **VisitorContactedPlayer** — visitor clicks a "Contact by email" link.
12. **PlayerSignedOut** — player clicks "Sign out".

These events were derived from the implemented V1 flows; reconcile against the class event storm before claiming they match it.

## Milestones

- Session 4: deployed hello page.
- Session 6: first story live.
- Session 7: core stories tested with Playwright.
- Session 10: V1 demo.
- Session 11: start V2 and complete it before Session 12.

## Non-functional targets and evidence

### Performance
Target: first screen usable within 2 seconds on a physical phone over 4G.
Status: **not yet measured** — record device, date, method, and three cache-cleared timings.

### Accessibility
Target: main tasks keyboard-operable; axe reports zero serious issues on registration, login, profile edit, and search/filter.
Built in: labels on every input, `role="alert"`/`aria-live` status messages, visible focus via default focus rings, heading order h1 → h2.
Status: **axe scan not yet run** — record date and results when done.

### Security
- RLS enabled on every app table: verified 2026-10-06 (`pg_tables.rowsecurity = true` for `public.profiles`; it is the only app table).
- Policies: `profiles_public_read` (SELECT to anon + authenticated), `profiles_insert_own` / `profiles_update_own` (authenticated, `auth.uid() = user_id`). No DELETE policy.
- Two-user privacy check (2026-10-06, fictional users alex@example.test / sam@example.test): cross-user UPDATE as Alex affected 0 rows (Sam's city unchanged); INSERT for another user blocked; anon UPDATE blocked; own UPDATE succeeded; public SELECT returns only public profile fields (no password column exists — passwords live in Supabase Auth, never in the profiles table).

### Privacy
Zero real personal-data records. Only fictional test accounts (alex@example.test, sam@example.test) exist.
Field justification: display name (identify player), city (match by location), sport (match by activity), skill level (match by level), contact email (optional, lets visitors reach the player), timestamps (ordering/auditing). Login email and password are authentication data, kept in the auth system, never in the public profile table.

### Availability
Target: development URL works during all class hours; record dated checks/downtime and a same-day rollback procedure.
Rollback procedure: in Lovable, open project history and restore the last working version; the database migration is additive-only so a frontend rollback does not break data.
Status: **continuous checks not yet recorded** — one successful visit is not proof of availability.

## Test evidence (run 2026-10-06)

- `bunx vitest run`: 20/20 passed (validation, city search, sport/skill filters, combined filters, reset, contact email).
- Playwright browser run: 13/13 passed (invalid registration messages, valid registration ×2, profile edit, generic wrong-login error, correct login, public browse, no private data exposed, case-insensitive city search, reset, combined filters, mailto link, signed-out profile redirect).
