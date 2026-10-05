# PingPal — Requirements

## 1. Functional Requirements

### FR1. Player Registration

The system shall allow a player to create an account using:
- display name
- email address
- password
- city
- racket sport
- skill level

The system shall validate the registration information before creating the account.

### FR2. Player Login

The system shall allow a registered player to log in using their email address and password.

After successful login, the player shall be able to access their profile and the player search functionality.

### FR3. Player Profile

The system shall allow a logged-in player to view their profile, including:
- display name
- email address
- city
- racket sport
- skill level

### FR4. Edit Profile

The system shall allow a logged-in player to update:
- display name
- city
- racket sport
- skill level

The player shall not need to create a new account when updating their profile.

### FR5. Find Players

The system shall display registered players on the Find Players page.

Each player result shall display:
- display name
- city
- racket sport
- skill level
- contact email

### FR6. Search Players by City

The system shall allow a player to search for other players by city.

The system shall display only players matching the searched city.

### FR7. Filter Players by Sport

The system shall allow a player to filter other players by racket sport.

The initial supported sports shall be:
- Table Tennis
- Tennis
- Badminton
- Padel
- Pickleball

### FR8. Filter Players by Skill Level

The system shall allow a player to filter other players by skill level.

The initial skill levels shall be:
- Beginner
- Intermediate
- Advanced

### FR9. Combine Filters

The system shall allow players to combine:
- city
- racket sport
- skill level

The system shall display players matching all selected filters.

### FR10. Reset Filters

The system shall allow a player to clear the selected filters and return to the full player list.

### FR11. Contact a Player

The system shall display the contact email of a player in their player result.

Players can use the displayed email to contact each other outside PingPal and arrange a game.

PingPal will not include an internal messaging system in V1.

### FR12. Form Validation

The system shall validate all required form fields.

If a required field is missing or invalid, the system shall display a clear error message and shall not save the invalid information.

### FR13. Persistent Storage

The system shall store player account and profile information persistently in the application's database.

---

# 2. Non-Functional Requirements

The following five targets are required by Gate G2 and shall not be changed without discussing the change with the teacher.

## NFR1. Performance

**Target:** The first screen shall be usable within 2 seconds on the specified 4G test.

**Verification method:**
- Record the device used.
- Record the browser used.
- Record the test method/network conditions.
- Measure the time from opening PingPal until the first screen is usable.
- Record the date and result.

| Date | Device | Browser | 4G test method | Result | Pass/Fail |
|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD |

## NFR2. Accessibility

**Target:** Main tasks shall work by keyboard and axe shall report 0 serious issues.

**Verification method:**
- Test the main PingPal tasks using only the keyboard.
- Run axe on the relevant pages.
- Record the pages and tasks checked.
- Record the axe result.

Pages/tasks to check:
- Registration
- Login
- Profile
- Edit Profile
- Find Players
- Search by City
- Filter by Sport
- Filter by Skill Level
- Reset Filters

| Date | Page/Task | Keyboard works | Axe serious issues | Pass/Fail |
|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD |

## NFR3. Security

**Target:** Enable Row Level Security on every Supabase table and check that one test user cannot access another user's private records.

**Verification method:**
- Enable RLS on every Supabase table if Supabase is used.
- Create two fictional test users.
- Log in as User A.
- Attempt to access User B's private records.
- Verify that User A cannot access User B's private records.
- Repeat the test in the opposite direction.
- Record the results.

If the final application does not use Supabase, record why the Supabase RLS check does not apply and document the equivalent security/access-control test.

| Date | Database | Test users | Private records protected | Pass/Fail |
|---|---|---|---|---|
| TBD | TBD | Fictional User A/B | TBD | TBD |

## NFR4. Privacy

**Target:** Use 0 real personal-data fields in the client records used for the app, prompts or repository.

All development and testing shall use fictional records.

| Field | Why PingPal needs it | Development data |
|---|---|---|
| Display name | Identifies the player | Fictional |
| Email | Allows players to contact each other | Fictional |
| Password | Allows account authentication | Fictional |
| City | Allows players to find nearby players | Fictional |
| Racket sport | Allows players to find people who play the same sport | Fictional |
| Skill level | Allows players to find suitable opponents | Fictional |

No real personal information shall be placed in the repository, test data, prompts, screenshots, or seed data.

Example development player:

- Display name: Alex Example
- Email: alex@example.test
- City: Tallinn
- Sport: Table Tennis
- Skill level: Intermediate

## NFR5. Availability

**Target:** The development URL needs to work during all class hours, with same-day rollback after a failed deployment.

**Verification method:**
- Check the development URL during class hours.
- Record dated availability checks.
- Record any downtime.
- Record failed deployments.
- Record whether a failed deployment was rolled back on the same day.

One successful visit does not prove continuous availability.

| Date | Check time | URL working | Downtime | Deployment/Rollback notes |
|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD |

---

# 3. User Stories

## S1. Player Registration

**As a racket-sport player, I want to create an account so that other players can find me.**

**Given** the registration page is open  
**When** I enter a valid display name, email, password, city, racket sport and skill level and submit the form  
**Then** my account is created successfully.

**Given** the registration page is open  
**When** I leave a required field empty and submit the form  
**Then** I see a clear validation error and the account is not created.

**Given** an account already exists with the same email  
**When** I try to register using that email  
**Then** I see an error explaining that the email is already registered.

---

## S2. Player Login

**As a registered player, I want to log in so that I can access my PingPal account.**

**Given** I have a registered account  
**When** I enter the correct email and password and select Login  
**Then** I am logged in successfully.

**Given** I enter an incorrect password  
**When** I select Login  
**Then** I see an invalid-login error and remain logged out.

---

## S3. View Profile

**As a player, I want to view my profile so that I can check my information.**

**Given** I am logged in  
**When** I open my profile  
**Then** I see my display name, email, city, racket sport and skill level.

---

## S4. Edit Profile

**As a player, I want to edit my profile so that my information stays up to date.**

**Given** I am logged in and viewing my profile  
**When** I change my city or skill level and save the changes  
**Then** my updated information is saved and displayed.

**Given** I am editing my profile  
**When** I enter invalid or missing required information  
**Then** I see a validation error and the invalid changes are not saved.

---

## S5. Find Players

**As a player, I want to see other registered players so that I can find someone to play with.**

**Given** registered fictional players exist  
**When** I open the Find Players page  
**Then** I see player results containing their display name, city, sport, skill level and contact email.

**Given** no players are available  
**When** I open the Find Players page  
**Then** I see a clear "No players found" message.

---

## S6. Search by City

**As a player, I want to search for players by city so that I can find people near me.**

**Given** players from different cities exist  
**When** I search for Tallinn  
**Then** I see only players from Tallinn.

**Given** no players exist in the searched city  
**When** I search for that city  
**Then** I see "No players found."

---

## S7. Filter by Sport

**As a player, I want to filter players by racket sport so that I can find people who play the same sport.**

**Given** players participate in different racket sports  
**When** I select Table Tennis as the sport filter  
**Then** I see only players who selected Table Tennis.

---

## S8. Filter by Skill Level

**As a player, I want to filter players by skill level so that I can find a suitable opponent.**

**Given** players have different skill levels  
**When** I select Intermediate as the skill-level filter  
**Then** I see only players with Intermediate skill level.

---

## S9. Combine Filters

**As a player, I want to combine city, sport and skill-level filters so that I can find the most suitable players.**

**Given** players from different cities, sports and skill levels exist  
**When** I select Tallinn, Table Tennis and Intermediate  
**Then** I see only players matching all three criteria.

**Given** no player matches the selected criteria  
**When** I apply the filters  
**Then** I see "No players found."

---

## S10. Contact a Player

**As a player, I want to see another player's email so that I can contact them and arrange a game.**

**Given** player results are displayed  
**When** I view a player result  
**Then** I can see that player's contact email.

**Given** I have found a suitable player  
**When** I use the displayed email address  
**Then** I can contact the player outside PingPal.

---

# 4. Events

Events are written in past tense and are arranged according to the PingPal user journey.

| # | Event | Command that starts the event |
|---|---|---|
| 1 | Player registered | SubmitRegistrationForm |
| 2 | Player logged in | SubmitLoginForm |
| 3 | Player profile loaded | OpenMyProfile |
| 4 | Player profile updated | SubmitProfileChanges |
| 5 | Player list loaded | OpenFindPlayers |
| 6 | Players searched by city | SubmitCitySearch |
| 7 | Players filtered by sport | SelectSportFilter |
| 8 | Players filtered by skill level | SelectSkillLevelFilter |
| 9 | Players filtered by multiple criteria | ApplyPlayerFilters |
| 10 | Player filters reset | ClickResetFilters |
| 11 | Player contact information displayed | OpenPlayerResult |

---

# 5. Milestones

## Milestone 1 — Session 4

**Deployed Hello Page**

The PingPal project shall have a working hello page deployed to the development URL.

---

## Milestone 2 — Session 6

**First Story Live**

The first complete user story shall be implemented and available in the deployed application.

---

## Milestone 3 — Session 7

**Core Stories Tested**

The core PingPal user stories shall have automated Playwright browser tests.

---

## Milestone 4 — Session 10

**V1 Demo**

The V1 demo shall demonstrate:
- registration
- login
- player profiles
- profile editing
- finding players
- city search
- sport filtering
- skill-level filtering
- combined filtering
- contacting a player using their email

---

## Milestone 5 — Session 11

**V2 Development**

The team shall work on V2 improvements after the V1 demo.

V2 work shall be completed before Session 12.

Possible V2 improvements include:
- improved search
- additional sports
- improved accessibility
- improved validation
- improved UI/UX
- additional automated tests
- performance improvements

---

# 6. Product Scope

## Included in V1

- Player registration
- Player login
- Player profiles
- Profile editing
- Find Players
- Search by city
- Filter by racket sport
- Filter by skill level
- Combined filters
- Player contact email

## Not Included in V1

- Internal messaging
- Coaches
- Coach bookings
- Payments
- Donations
- Complex recommendation algorithms
- Social media features

---

# 7. Development Data

Only fictional data shall be used during development and testing.

Example:

**Name:** Alex Example  
**Email:** alex@example.test  
**City:** Tallinn  
**Sport:** Table Tennis  
**Skill level:** Intermediate

No real personal data shall be committed to the repository or used in automated tests.

