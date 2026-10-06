import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SPORTS, SKILL_LEVELS, profileSchema, skillLabel, sportLabel, type PlayerProfile } from "@/lib/pingpal";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Pencil, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile — PingPal" },
      { name: "description", content: "View and edit your PingPal player profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

type FieldErrors = Record<string, string>;

function ProfilePage() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: "", city: "", sport: "", skill_level: "", contact_email: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: profile, isPending, isError, error } = useQuery({
    queryKey: ["my-profile", user.id],
    queryFn: async (): Promise<PlayerProfile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, city, sport, skill_level, contact_email, created_at, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as PlayerProfile | null;
    },
  });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name,
        city: profile.city,
        sport: profile.sport,
        skill_level: profile.skill_level,
        contact_email: profile.contact_email ?? "",
      });
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const out: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!out[key]) out[key] = issue.message;
      }
      setErrors(out);
      return;
    }
    setErrors({});
    setBusy(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: parsed.data.display_name,
        city: parsed.data.city,
        sport: parsed.data.sport,
        skill_level: parsed.data.skill_level,
        contact_email: parsed.data.contact_email || null,
      })
      .eq("user_id", user.id);
    setBusy(false);
    if (updateError) {
      setMessage({ kind: "err", text: `Could not save your profile: ${updateError.message}` });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["my-profile", user.id] });
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    setMessage({ kind: "ok", text: "Profile saved." });
    setEditing(false);
  }

  if (isPending) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <p className="text-muted-foreground">Loading your profile…</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          Could not load your profile: {error instanceof Error ? error.message : "unknown error"}
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="font-display text-2xl font-bold">No profile yet</h1>
        <p className="mt-2 text-muted-foreground">
          Your account exists but no player profile was saved. Please register again or contact
          support.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">My profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {user.email}. Only the fields below are visible to other players.
      </p>

      {!editing ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>{profile.display_name}</span>
              <Badge variant="secondary">
                <Trophy className="mr-1 h-3 w-3" aria-hidden="true" />
                {skillLabel(profile.skill_level)}
              </Badge>
            </CardTitle>
            <CardDescription>Your public player card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{sportLabel(profile.sport)}</p>
            <p className="text-muted-foreground">Login email: {user.email}</p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {profile.city}
            </p>
            {profile.contact_email && (
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {profile.contact_email}
              </p>
            )}
            <Button className="mt-4" onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Edit profile
            </Button>
            {message?.kind === "ok" && (
              <p role="status" className="mt-3 rounded-md bg-muted p-3 text-sm">
                {message.text}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>Changes are visible to other players immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Display name</Label>
                <Input
                  id="edit-name"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  aria-describedby={errors["display_name"] ? "edit-name-error" : undefined}
                />
                {errors["display_name"] && (
                  <p id="edit-name-error" role="alert" className="text-sm text-destructive">
                    {errors["display_name"]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  aria-describedby={errors["city"] ? "edit-city-error" : undefined}
                />
                {errors["city"] && (
                  <p id="edit-city-error" role="alert" className="text-sm text-destructive">
                    {errors["city"]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-sport">Sport</Label>
                <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
                  <SelectTrigger id="edit-sport">
                    <SelectValue placeholder="Choose a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors["sport"] && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors["sport"]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-skill">Skill level</Label>
                <Select
                  value={form.skill_level}
                  onValueChange={(v) => setForm({ ...form, skill_level: v })}
                >
                  <SelectTrigger id="edit-skill">
                    <SelectValue placeholder="Choose your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors["skill_level"] && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors["skill_level"]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-contact">Public contact email (optional)</Label>
                <Input
                  id="edit-contact"
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  aria-describedby={errors["contact_email"] ? "edit-contact-error" : undefined}
                />
                {errors["contact_email"] && (
                  <p id="edit-contact-error" role="alert" className="text-sm text-destructive">
                    {errors["contact_email"]}
                  </p>
                )}
              </div>
              {message?.kind === "err" && (
                <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {message.text}
                </p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setErrors({});
                    setMessage(null);
                    setForm({
                      display_name: profile.display_name,
                      city: profile.city,
                      sport: profile.sport,
                      skill_level: profile.skill_level,
                      contact_email: profile.contact_email ?? "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
