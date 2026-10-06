import { z } from "zod";

export const SPORTS = [
  { value: "table_tennis", label: "Table Tennis" },
  { value: "tennis", label: "Tennis" },
  { value: "badminton", label: "Badminton" },
  { value: "padel", label: "Padel" },
  { value: "pickleball", label: "Pickleball" },
] as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const SPORT_VALUES = SPORTS.map((s) => s.value) as [string, ...string[]];
export const SKILL_VALUES = SKILL_LEVELS.map((s) => s.value) as [string, ...string[]];

export function sportLabel(value: string): string {
  return SPORTS.find((s) => s.value === value)?.label ?? value;
}

export function skillLabel(value: string): string {
  return SKILL_LEVELS.find((s) => s.value === value)?.label ?? value;
}

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name must be at most 50 characters."),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters.")
    .max(80, "City must be at most 80 characters."),
  sport: z.enum(SPORT_VALUES, { message: "Please choose a racket sport from the list." }),
  skill_level: z.enum(SKILL_VALUES, { message: "Please choose a skill level from the list." }),
  contact_email: z
    .string()
    .trim()
    .email("Enter a valid email address, e.g. alex@example.test.")
    .optional()
    .or(z.literal("")),
});

export const registrationSchema = profileSchema.extend({
  email: z.string().trim().email("Enter a valid email address, e.g. alex@example.test."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;

export interface PlayerProfile {
  user_id: string;
  display_name: string;
  city: string;
  sport: string;
  skill_level: string;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileFilters {
  city: string;
  sport: string;
  skill_level: string;
}

export const EMPTY_FILTERS: ProfileFilters = { city: "", sport: "", skill_level: "" };

/** Case-insensitive client-side matching used to keep the visible list
 * consistent with the server query (which uses ilike for city). */
export function matchesFilters(profile: PlayerProfile, filters: ProfileFilters): boolean {
  if (filters.city.trim() && !profile.city.toLowerCase().includes(filters.city.trim().toLowerCase())) {
    return false;
  }
  if (filters.sport && profile.sport !== filters.sport) {
    return false;
  }
  if (filters.skill_level && profile.skill_level !== filters.skill_level) {
    return false;
  }
  return true;
}

export function isEmptyFilters(filters: ProfileFilters): boolean {
  return !filters.city.trim() && !filters.sport && !filters.skill_level;
}
