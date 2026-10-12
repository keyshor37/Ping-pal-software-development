# Decisions

- Framework: TanStack Start (React + TypeScript + Vite), built and hosted with Lovable. Why: the project was built in Lovable, which uses this stack. The start page is `src/routes/index.tsx` instead of `src/App.tsx`.
- Database: Supabase (via Lovable Cloud). Why: stories need to save accounts and player profiles. Built-in auth keeps passwords out of our tables.
- Security: Row Level Security on every table. Profiles are publicly readable (for Find Players); only the owner can insert/update their own profile. Login email is never copied into the public contact email.
- Tests: Vitest for logic, Playwright for e2e and axe accessibility.
