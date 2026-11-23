# Requirements

## Functional requirements

- FR1: Users can register and sign in.
- FR2: Signed-in users can view and update their own profile.
- FR3: Public contact details are displayed only if the player chooses to share .
- FR4: Visitors can search or filter players by city.
- FR5: Visitors can filter by racket sport.
- FR6: Visitors can filter by skill level.
- FR7: Visitors can reset filters and see an appropriate empty state when there are no results.


## Non-functional requirements (targets to validate)

- **Performance:** First screen usable within 2 seconds on a 4G mobile connection; measure with Lighthouse using documented settings.
- **Accessibility:** Keyboard navigation works; automated axe checks report no serious or critical violations on key pages.
- **Security:** Private user data is not exposed through public endpoints; confirm database Row Level Security on relevant tables and test cross-user isolation.
- **Privacy:** Use fictional test data; collect informed consent from testers; allow opt-in contact visibility.
- **Availability:** Keep the development URL reachable during class hours and document any outages and recovery.

## User stories and acceptance criteria

### S1 — Browse players
As a visitor, I want to browse available players so I can see potential partners.
- Given the home page is available, when I open it, then I see a heading and player-browsing interface.
- **Status:** to verify  **PR:** [add real PR link]

### S2 — Search by city
As a visitor, I want to search players by city so I can find people near me.
- Given the search interface is visible, when I enter a city and submit, then the results reflect that city or show an empty state.
- **Status:** Pass  

### S3 — Reset search
As a visitor, I want to clear filters so I can start a new search.
- Given I applied a city filter, when I click Reset, then the city input is cleared.
- **Status:** Pass  

### S4 — Filter by sport
As a visitor, I want to choose a racket sport so I can see players interested in that sport.
- Given player filters are available, when I choose a sport, then the results reflect my selection or show an empty state.
- **Status:** Pass  

### S5 — Filter by skill level
As a visitor, I want to filter by skill level so I can find appropriately matched players.
- Given player filters are available, when I choose a skill level, then displayed players match that level or an empty state appears.
- **Status:** Pass  

### S6 — Reject incorrect login
As a user, I want login errors to be clear so I can try again without exposing account information.
- Given invalid login credentials, when I submit them, then I see a generic invalid-credentials error.
- **Status:** Pass  

### S7 — Protect my profile
As a user, I want my profile page to require authentication so my account is protected.
- Given I am signed out, when I open `/profile`, then I am redirected to the authentication page.
- **Status:** Not verified

### S8 — Edit my own profile
As a signed-in player, I want to change my city, sport and skill level so my public profile remains accurate.
- Given I am signed in to my account, when I save valid profile changes, then my updated values appear on my own profile.
- **Status:** Pass  


| # | Date | What is true on that date |
|---|---|---|
| 1 | 28.09.2026, session 4 | The start page is live on the dev URL |
| 2 | 12.10.2026, session 6 | The first story works on the dev URL |
| 3 | 19.10.2026, session 7 | One user task has an automated test |
| 4 | 09.11.2026, session 10 | v1 demo to the class |
| 5 | before 23.11.2026, session 12 | v2 with changes from client feedback |
