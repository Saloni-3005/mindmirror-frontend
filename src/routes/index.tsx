import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, ShieldCheck, Sparkles, Activity, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BrandMark } from "@/components/brand-mark";
import { apiLogin, apiSignup, saveToken } from "@/lib/api";

export const Route = createFileRoute("/")(
  {
  head: () => ({
    meta: [
      { title: "MindMirror AI — Understand Your Mind Before It Speaks" },
      {
        name: "description",
        content:
          "Premium mental wellness AI that reads face, voice and text emotion in real time — emotional analytics, focus tracking and burnout prediction.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await apiLogin(email, password);
        saveToken(data.access_token);
        navigate({ to: "/app/scan" });
      } else {
        await apiSignup(email, password);
        setMode("login");
        setError("Account created! Please sign in.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-60 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-8 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        {/* Left */}
        <section className="flex-1">
          <BrandMark size={44} />
          <div className="mt-12 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles size={12} className="text-accent" />
              Emotional Intelligence · Real-time
            </span>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Understand your mind <br />
              <span className="gradient-text">before it speaks.</span>
            </h1>
            <p className="max-w-lg text-base text-muted-foreground md:text-lg">
              MindMirror AI analyses your face, voice and words to map stress,
              focus and burnout — turning silent emotions into clear, actionable
              wellness insights.
            </p>
          </div>

          <div className="relative mt-10 hidden lg:block">
            <div className="relative h-72 w-full max-w-lg">
              <div className="absolute inset-0 rounded-[2rem] glass p-6">
                <div className="grid h-full grid-cols-3 gap-4">
                  <div className="col-span-2 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity size={12} /> Live emotion stream
                    </div>
                    <div className="float-y mx-auto grid h-24 w-24 place-items-center rounded-full bg-background/40 backdrop-blur-xl pulse-ring">
                      <Brain className="text-primary" size={42} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      {["Joy", "Calm", "Focus"].map((l) => (
                        <div key={l} className="rounded-lg bg-background/40 px-2 py-1 text-center">{l}</div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-accent/15 p-3">
                      <p className="text-[10px] uppercase text-muted-foreground">Stress</p>
                      <p className="text-xl font-semibold text-accent">Low</p>
                    </div>
                    <div className="rounded-2xl bg-primary/15 p-3">
                      <p className="text-[10px] uppercase text-muted-foreground">Focus</p>
                      <p className="text-xl font-semibold text-primary">82%</p>
                    </div>
                    <div className="rounded-2xl bg-[color:var(--color-success)]/15 p-3">
                      <p className="text-[10px] uppercase text-muted-foreground">Mood</p>
                      <p className="text-xl font-semibold text-[color:var(--color-success)]">+12%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[color:var(--color-success)]" />
              On-device privacy · Encrypted
            </div>
            <span>Trusted by students, professionals & therapists</span>
          </div>
        </section>

        {/* Right - Login Card */}
        <section className="w-full lg:w-[440px]">
          <div className="glass-strong rounded-3xl p-7 md:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to continue your wellness journey."
                  : "Join MindMirror to start tracking your wellness."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@mind.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-card/40 pl-10 border-border/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl bg-card/40 pl-10 border-border/60"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className={`text-xs px-1 ${error.includes("created") ? "text-[color:var(--color-success)]" : "text-destructive"}`}>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </Button>

              <div className="relative my-2">
                <Separator className="bg-border/60" />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    New to MindMirror?{" "}
                    <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="text-primary hover:text-accent">
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => { setMode("login"); setError(""); }} className="text-primary hover:text-accent">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.65 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1S8.7 5.9 12 5.9c1.88 0 3.14.8 3.86 1.49l2.64-2.55C16.93 3.3 14.7 2.4 12 2.4 6.96 2.4 2.9 6.46 2.9 11.5S6.96 20.6 12 20.6c6.93 0 9.2-4.85 9.2-7.34 0-.5-.05-.88-.13-1.26H12z" />
    </svg>
  );
}