import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  SPORTS,
  SKILL_LEVELS,
  loginSchema,
  registrationSchema,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register — PingPal" },
      { name: "description", content: "Log in to PingPal or create your player profile." },
      { property: "og:title", content: "Sign in or register — PingPal" },
      { property: "og:description", content: "Log in to PingPal or create your player profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type FieldErrors = Record<string, string>;

function zodToFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({});
  const [loginMessage, setLoginMessage] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  // Register state
  const [reg, setReg] = useState({
    email: "",
    password: "",
    display_name: "",
    city: "",
    sport: "",
    skill_level: "",
    contact_email: "",
  });
  const [regErrors, setRegErrors] = useState<FieldErrors>({});
  const [regMessage, setRegMessage] = useState("");
  const [regBusy, setRegBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginMessage("");
    const parsed = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!parsed.success) {
      setLoginErrors(zodToFieldErrors(parsed.error));
      return;
    }
    setLoginErrors({});
    setLoginBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoginBusy(false);
    if (error) {
      // Deliberately generic: do not reveal whether the email exists.
      setLoginMessage("Invalid email or password. Please check both and try again.");
      return;
    }
    navigate({ to: "/profile" });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegMessage("");
    const parsed = registrationSchema.safeParse(reg);
    if (!parsed.success) {
      setRegErrors(zodToFieldErrors(parsed.error));
      return;
    }
    setRegErrors({});
    setRegBusy(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (signUpError) {
      setRegBusy(false);
      setRegMessage(
        signUpError.message.toLowerCase().includes("already")
          ? "This email is already registered. Try logging in instead."
          : `Registration failed: ${signUpError.message}`,
      );
      return;
    }

    const user = signUpData.user;
    if (!user) {
      setRegBusy(false);
      setRegMessage("Registration failed. Please try again.");
      return;
    }

    if (!signUpData.session) {
      setRegBusy(false);
      setRegMessage(
        "Account created! Please check your email to confirm your address, then log in.",
      );
      setTab("login");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: user.id,
      display_name: parsed.data.display_name,
      city: parsed.data.city,
      sport: parsed.data.sport,
      skill_level: parsed.data.skill_level,
      contact_email: parsed.data.contact_email || parsed.data.email,
    });
    setRegBusy(false);

    if (profileError) {
      setRegMessage(`Account created, but saving your profile failed: ${profileError.message}`);
      return;
    }
    navigate({ to: "/profile" });
  }

  const regField = (
    id: string,
    label: string,
    input: React.ReactNode,
    errorKey: string,
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {input}
      {regErrors[errorKey] && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {regErrors[errorKey]}
        </p>
      )}
    </div>
  );

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="font-display text-center text-3xl font-bold tracking-tight">
        Welcome to PingPal
      </h1>
      <p className="mt-2 text-center text-muted-foreground">
        Log in or create your player profile.
      </p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Log in</CardTitle>
              <CardDescription>Use the email and password you registered with.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    aria-describedby={loginErrors["email"] ? "login-email-error" : undefined}
                  />
                  {loginErrors["email"] && (
                    <p id="login-email-error" role="alert" className="text-sm text-destructive">
                      {loginErrors["email"]}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    aria-describedby={loginErrors["password"] ? "login-password-error" : undefined}
                  />
                  {loginErrors["password"] && (
                    <p id="login-password-error" role="alert" className="text-sm text-destructive">
                      {loginErrors["password"]}
                    </p>
                  )}
                </div>
                {loginMessage && (
                  <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {loginMessage}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={loginBusy}>
                  {loginBusy ? "Logging in…" : "Log in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create your player profile</CardTitle>
              <CardDescription>
                Your email and password stay private. Only your player profile is public.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                {regField(
                  "reg-email",
                  "Email",
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={reg.email}
                    onChange={(e) => setReg({ ...reg, email: e.target.value })}
                    aria-describedby={regErrors["email"] ? "reg-email-error" : undefined}
                  />,
                  "email",
                )}
                {regField(
                  "reg-password",
                  "Password (at least 8 characters)",
                  <Input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    value={reg.password}
                    onChange={(e) => setReg({ ...reg, password: e.target.value })}
                    aria-describedby={regErrors["password"] ? "reg-password-error" : undefined}
                  />,
                  "password",
                )}
                {regField(
                  "reg-name",
                  "Display name",
                  <Input
                    id="reg-name"
                    type="text"
                    autoComplete="nickname"
                    value={reg.display_name}
                    onChange={(e) => setReg({ ...reg, display_name: e.target.value })}
                    aria-describedby={regErrors["display_name"] ? "reg-name-error" : undefined}
                  />,
                  "display_name",
                )}
                {regField(
                  "reg-city",
                  "City",
                  <Input
                    id="reg-city"
                    type="text"
                    autoComplete="address-level2"
                    value={reg.city}
                    onChange={(e) => setReg({ ...reg, city: e.target.value })}
                    aria-describedby={regErrors["city"] ? "reg-city-error" : undefined}
                  />,
                  "city",
                )}
                {regField(
                  "reg-sport",
                  "Sport",
                  <Select value={reg.sport} onValueChange={(v) => setReg({ ...reg, sport: v })}>
                    <SelectTrigger
                      id="reg-sport"
                      aria-describedby={regErrors["sport"] ? "reg-sport-error" : undefined}
                    >
                      <SelectValue placeholder="Choose a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                  "sport",
                )}
                {regField(
                  "reg-skill",
                  "Skill level",
                  <Select
                    value={reg.skill_level}
                    onValueChange={(v) => setReg({ ...reg, skill_level: v })}
                  >
                    <SelectTrigger
                      id="reg-skill"
                      aria-describedby={regErrors["skill_level"] ? "reg-skill-error" : undefined}
                    >
                      <SelectValue placeholder="Choose your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_LEVELS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                  "skill_level",
                )}
                {regField(
                  "reg-contact",
                  "Public contact email (optional — defaults to your login email)",
                  <Input
                    id="reg-contact"
                    type="email"
                    placeholder="Shown on your public profile"
                    value={reg.contact_email}
                    onChange={(e) => setReg({ ...reg, contact_email: e.target.value })}
                    aria-describedby={regErrors["contact_email"] ? "reg-contact-error" : undefined}
                  />,
                  "contact_email",
                )}
                {regMessage && (
                  <p role="status" className="rounded-md bg-muted p-3 text-sm">
                    {regMessage}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={regBusy}>
                  {regBusy ? "Creating account…" : "Register"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
