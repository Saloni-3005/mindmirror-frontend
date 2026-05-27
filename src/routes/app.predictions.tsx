import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlarmClock, Brain, Droplet, Moon, Sparkles, TrendingUp, Zap } from "lucide-react";
import { stressForecast } from "@/lib/mock-data";

export const Route = createFileRoute("/app/predictions")({
  component: PredictionsPage,
});

const tip = {
  background: "oklch(0.22 0.04 268 / 0.9)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
} as const;

function PredictionsPage() {
  return (
    <div className="space-y-6">
      {/* Hero forecast */}
      <section className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--color-warning)]/30 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles size={12} className="inline mr-1 text-accent" />
              Tomorrow's forecast · AI Prediction
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              Stress risk{" "}
              <span className="text-[color:var(--color-warning)]">High · 78%</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm md:text-base text-muted-foreground">
              Stress has trended upward across your last 3 sessions. Consider
              scheduling short breaks and protecting deep-work blocks tomorrow.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Tag tone="warning" label="3-day uptrend" />
              <Tag tone="primary" label="Sleep deficit detected" />
              <Tag tone="accent" label="High cognitive load" />
            </div>
          </div>

          <div className="relative h-56">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "risk", value: 78, fill: "var(--color-warning)" }]} startAngle={210} endAngle={-30}>
                <RadialBar background={{ fill: "oklch(1 0 0 / 0.08)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-xs text-muted-foreground">Predicted</p>
                <p className="text-4xl font-semibold text-[color:var(--color-warning)]">78%</p>
                <p className="text-xs text-muted-foreground">High risk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        <PredictCard
          icon={Brain}
          tone="primary"
          title="Burnout Detector"
          metric="Low"
          sub="Trending down 12%"
        >
          <div className="h-32">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: 28, fill: "var(--color-primary)" }]} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "oklch(1 0 0 / 0.06)" }} dataKey="value" cornerRadius={16} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </PredictCard>

        <PredictCard icon={Zap} tone="accent" title="Mental Health Risk" metric="Medium" sub="Watch over weekend">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { l: "Low", on: false, c: "var(--color-success)" },
              { l: "Medium", on: true, c: "var(--color-warning)" },
              { l: "High", on: false, c: "var(--color-destructive)" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-border/60 px-2 py-3"
                style={{ background: s.on ? `${s.c}` : "transparent", color: s.on ? "white" : undefined, opacity: s.on ? 1 : 0.65 }}
              >
                {s.l}
              </div>
            ))}
          </div>
        </PredictCard>

        <PredictCard icon={AlarmClock} tone="success" title="Best Productivity Window" metric="11 AM – 1 PM" sub="Peak focus zone">
          <div className="space-y-2">
            <Slot label="9 – 11 AM" pct={62} />
            <Slot label="11 AM – 1 PM" pct={92} highlight />
            <Slot label="2 – 4 PM" pct={58} />
            <Slot label="6 – 8 PM" pct={40} />
          </div>
        </PredictCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={14} /> Stress Forecast — Next 7 days
          </h3>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={stressForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="risk" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#forecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">AI Recommendations</h3>
          <p className="text-xs text-muted-foreground">Personalised for tomorrow</p>
          <ul className="mt-4 space-y-3 text-sm">
            <Reco icon={Moon} title="Sleep earlier" body="Aim for lights-out by 11 PM tonight." tone="primary" />
            <Reco icon={Brain} title="Reduce multitasking" body="Limit context switches to 3 per hour." tone="accent" />
            <Reco icon={Droplet} title="Hydration breaks" body="Glass of water every 90 minutes." tone="success" />
            <Reco icon={AlarmClock} title="Use focus timer" body="Two 50-min Pomodoros before lunch." tone="warning" />
          </ul>
        </div>
      </section>
    </div>
  );
}

function Tag({ tone, label }: { tone: "primary" | "accent" | "warning"; label: string }) {
  const t = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    warning: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
  }[tone];
  return <span className={`rounded-xl px-3 py-2 text-xs ${t}`}>{label}</span>;
}

function PredictCard({
  icon: Icon,
  title,
  metric,
  sub,
  tone,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  metric: string;
  sub: string;
  tone: "primary" | "accent" | "success";
  children: React.ReactNode;
}) {
  const t = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
  }[tone];
  return (
    <div className="glass rounded-3xl p-5 hover-lift">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className={`grid h-8 w-8 place-items-center rounded-xl ${t}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{metric}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Slot({ label, pct, highlight }: { label: string; pct: number; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-24 text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-card/50 overflow-hidden">
        <div
          className={`h-full ${highlight ? "gradient-primary" : "bg-muted-foreground/40"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right font-medium">{pct}%</span>
    </div>
  );
}

function Reco({
  icon: Icon,
  title,
  body,
  tone,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  body: string;
  tone: "primary" | "accent" | "success" | "warning";
}) {
  const t = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
    warning: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
  }[tone];
  return (
    <li className="flex gap-3 rounded-2xl bg-card/30 border border-border/60 p-3">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${t}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
