# Product statement · PingPal

## Client
Recreational racket-sport players (students and young adults, ages 18–35) across the Baltic and Nordic regions (specifically Tallinn, Riga, Vilnius, and Helsinki) who want regular, skill-matched playing partners for Table Tennis, Tennis, Badminton, Padel, and Pickleball.

## The process today
Players currently ask around across fragmented channels: local WhatsApp/Telegram groups, Facebook communities (e.g. "Padel Helsinki", "Badminton Tallinn"), or sports center boards. They wait hours or days for replies, trade back-and-forth messages about locations, and frequently end up with mismatched skill levels or cancelled games.

## Baseline metric
- **Time to find a partner:** 24 to 72 hours from first posting in a group chat to confirming a game.
- **Match quality:** ~40% of games result in mismatched skill levels (beginner vs. advanced), reducing enjoyment.
- **Search effort:** 3 to 5 separate messages across multiple channels per match request.

## The statement
When a recreational racket-sport player in the Baltic or Nordic region is looking for an impromptu or weekly game but has no partner at their skill level nearby, PingPal lets them instantly browse and filter active player profiles by city, sport, and skill level, so that partner discovery time drops from days to under 5 minutes without in-app messaging or booking friction.

## Out of scope (PingPal V1)
- Paid coaches, coaching directories, and coaching bookings
- In-app chat, direct messaging, and push notifications (players connect directly using optional public contact details)
- Court booking, facility management, and venue reservations
- Payments, fees, subscriptions, and donation processing
- Sports outside the five racket sports (Table Tennis, Tennis, Badminton, Padel, Pickleball)

## Red-team notes
- **Privacy & Safety:** Private login credentials and registration emails must never be exposed through public browse APIs. Contact info is strictly opt-in.
- **Empty State Risk:** In low-density cities, visitors may see "No players found." Clear empty-state messaging and easy filter resets are essential to avoid user abandonment.
- **Skill Level Inflation:** Self-assessed skill levels (Beginner, Intermediate, Advanced) can be subjective; profiles should provide clear descriptive benchmarks.
- **Inactive / Ghost Profiles:** Stale profiles may lead to unanswered inquiries; last active / updated dates help players pick responsive partners.

