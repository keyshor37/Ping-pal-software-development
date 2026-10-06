import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  isEmptyFilters,
  loginSchema,
  matchesFilters,
  profileSchema,
  registrationSchema,
  type PlayerProfile,
} from "./pingpal";

const validProfile = {
  display_name: "Alex",
  city: "Helsinki",
  sport: "tennis",
  skill_level: "intermediate",
  contact_email: "alex@example.test",
};

describe("registration validation", () => {
  it("accepts a valid registration", () => {
    const result = registrationSchema.safeParse({
      ...validProfile,
      email: "alex@example.test",
      password: "correct-horse-9",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing display name with a helpful message", () => {
    const result = registrationSchema.safeParse({
      ...validProfile,
      display_name: "",
      email: "alex@example.test",
      password: "correct-horse-9",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "display_name")).toBe(true);
    }
  });

  it("rejects an invalid email", () => {
    const result = registrationSchema.safeParse({
      ...validProfile,
      email: "not-an-email",
      password: "correct-horse-9",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = registrationSchema.safeParse({
      ...validProfile,
      email: "alex@example.test",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a sport outside the allowed list", () => {
    const result = registrationSchema.safeParse({
      ...validProfile,
      sport: "quidditch",
      email: "alex@example.test",
      password: "correct-horse-9",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a skill level outside the allowed list", () => {
    const result = registrationSchema.safeParse({
      ...validProfile,
      skill_level: "pro",
      email: "alex@example.test",
      password: "correct-horse-9",
    });
    expect(result.success).toBe(false);
  });
});

describe("profile edit validation", () => {
  it("accepts a valid edit", () => {
    expect(profileSchema.safeParse(validProfile).success).toBe(true);
  });

  it("allows clearing the optional contact email", () => {
    expect(profileSchema.safeParse({ ...validProfile, contact_email: "" }).success).toBe(true);
  });

  it("rejects an invalid contact email", () => {
    expect(profileSchema.safeParse({ ...validProfile, contact_email: "nope" }).success).toBe(false);
  });

  it("rejects a city that is too short", () => {
    expect(profileSchema.safeParse({ ...validProfile, city: "A" }).success).toBe(false);
  });
});

describe("login validation", () => {
  it("accepts email and password", () => {
    expect(loginSchema.safeParse({ email: "alex@example.test", password: "x" }).success).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "alex@example.test", password: "" }).success).toBe(false);
  });
});

const players: PlayerProfile[] = [
  {
    user_id: "1",
    display_name: "Alex",
    city: "Helsinki",
    sport: "tennis",
    skill_level: "intermediate",
    contact_email: "alex@example.test",
    created_at: "",
    updated_at: "",
  },
  {
    user_id: "2",
    display_name: "Sam",
    city: "Tampere",
    sport: "table_tennis",
    skill_level: "beginner",
    contact_email: null,
    created_at: "",
    updated_at: "",
  },
  {
    user_id: "3",
    display_name: "Rin",
    city: "helsinki",
    sport: "tennis",
    skill_level: "advanced",
    contact_email: "rin@example.test",
    created_at: "",
    updated_at: "",
  },
];

describe("player search and filters", () => {
  it("returns everyone with empty filters", () => {
    expect(players.filter((p) => matchesFilters(p, EMPTY_FILTERS))).toHaveLength(3);
  });

  it("searches by city case-insensitively", () => {
    const result = players.filter((p) => matchesFilters(p, { ...EMPTY_FILTERS, city: "HELSINKI" }));
    expect(result.map((p) => p.display_name).sort()).toEqual(["Alex", "Rin"]);
  });

  it("filters by sport", () => {
    const result = players.filter((p) => matchesFilters(p, { ...EMPTY_FILTERS, sport: "table_tennis" }));
    expect(result.map((p) => p.display_name)).toEqual(["Sam"]);
  });

  it("filters by skill level", () => {
    const result = players.filter((p) =>
      matchesFilters(p, { ...EMPTY_FILTERS, skill_level: "advanced" }),
    );
    expect(result.map((p) => p.display_name)).toEqual(["Rin"]);
  });

  it("combines city, sport, and skill filters", () => {
    const result = players.filter((p) =>
      matchesFilters(p, { city: "helsinki", sport: "tennis", skill_level: "intermediate" }),
    );
    expect(result.map((p) => p.display_name)).toEqual(["Alex"]);
  });

  it("reset filters match everyone again", () => {
    expect(isEmptyFilters(EMPTY_FILTERS)).toBe(true);
    expect(players.filter((p) => matchesFilters(p, EMPTY_FILTERS))).toHaveLength(3);
  });

  it("contact email is optional and preserved when present", () => {
    expect(players[0]?.contact_email).toBe("alex@example.test");
    expect(players[1]?.contact_email).toBeNull();
  });
});
