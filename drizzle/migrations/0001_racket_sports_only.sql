ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_sport_check;
UPDATE public.profiles SET sport = 'table_tennis' WHERE sport NOT IN ('table_tennis','tennis','badminton','padel','pickleball');
UPDATE public.profiles SET contact_email = 'sam@example.test' WHERE contact_email IS NULL AND display_name = 'Sam';
ALTER TABLE public.profiles ADD CONSTRAINT profiles_sport_check CHECK (sport IN ('table_tennis','tennis','badminton','padel','pickleball'));