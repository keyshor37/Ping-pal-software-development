import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  EMPTY_FILTERS,
  SPORTS,
  SKILL_LEVELS,
  isEmptyFilters,
  matchesFilters,
  skillLabel,
  sportLabel,
  type PlayerProfile,
  type ProfileFilters,
} from "@/lib/pingpal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, RotateCcw, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PingPal — Find players for your sport in your city" },
      {
        name: "description",
        content:
          "PingPal helps recreational players find other players for the same racket sport in their city. Browse player profiles by city, sport, and skill level.",
      },
      { property: "og:title", content: "PingPal — Find players near you" },
      {
        property: "og:description",
        content: "Browse recreational player profiles by city, sport, and skill level.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const [draft, setDraft] = useState<ProfileFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<ProfileFilters>(EMPTY_FILTERS);

  const { data: profiles, isPending, isError, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: async (): Promise<PlayerProfile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, city, sport, skill_level, contact_email, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PlayerProfile[];
    },
  });

  const visible = useMemo(
    () => (profiles ?? []).filter((p) => matchesFilters(p, applied)),
    [profiles, applied],
  );

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ ...draft });
  };

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <section className="py-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Find Players
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          PingPal connects recreational players in the same city, for the same racket sport, at the same
          level. Browse the players below — no account needed.
        </p>
      </section>

      <section aria-labelledby="filters-heading" className="rounded-xl border bg-card p-4 sm:p-6">
        <h2 id="filters-heading" className="font-display text-lg font-semibold">
          Search and filter players
        </h2>
        <form
          onSubmit={applyFilters}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="filter-city">City</Label>
            <Input
              id="filter-city"
              type="text"
              placeholder="e.g. Helsinki"
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-sport">Sport</Label>
            <Select
              value={draft.sport}
              onValueChange={(v) => setDraft({ ...draft, sport: v === "any" ? "" : v })}
            >
              <SelectTrigger id="filter-sport">
                <SelectValue placeholder="Any sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any sport</SelectItem>
                {SPORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-skill">Skill level</Label>
            <Select
              value={draft.skill_level}
              onValueChange={(v) => setDraft({ ...draft, skill_level: v === "any" ? "" : v })}
            >
              <SelectTrigger id="filter-skill">
                <SelectValue placeholder="Any level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any level</SelectItem>
                {SKILL_LEVELS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="flex-1">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              disabled={isEmptyFilters(draft) && isEmptyFilters(applied)}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </form>
      </section>

      <section aria-labelledby="results-heading" className="mt-8" aria-live="polite">
        <h2 id="results-heading" className="font-display text-lg font-semibold">
          {isPending ? "Loading players…" : `${visible.length} player${visible.length === 1 ? "" : "s"} found`}
        </h2>

        {isError && (
          <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            Could not load players: {error instanceof Error ? error.message : "unknown error"}
          </p>
        )}

        {!isPending && !isError && visible.length === 0 && (
          <p className="mt-4 rounded-md border border-dashed p-6 text-center text-muted-foreground">
            No players found. Try resetting the filters — or be the first to{" "}
            <Link to="/auth" className="font-medium text-primary underline underline-offset-4">
              create a profile
            </Link>
            .
          </p>
        )}

        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.user_id}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="truncate">{p.display_name}</span>
                    <Badge variant="secondary" className="shrink-0">
                      <Trophy className="mr-1 h-3 w-3" aria-hidden="true" />
                      {skillLabel(p.skill_level)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">{sportLabel(p.sport)}</p>
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {p.city}
                  </p>
                  {p.contact_email && (
                    <a
                      href={`mailto:${p.contact_email}`}
                      className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4"
                      aria-label={`Email ${p.display_name}`}
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      {p.contact_email}
                    </a>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
