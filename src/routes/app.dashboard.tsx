import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Brain, Flame, Smile, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import {
  emotionDistribution,
  focusHeatmap,
  moodTrend,
  sparkline,
  stressTimeline,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

const PIE_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-warning)",
  "var(--color-secondary)",
  "var(--color-destructive)",
];

const tooltipStyle = {
  background: "oklch(0.22 0.04 268 / 0.9)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  backdropFilter: "blur(12px)",
  fontSize: 12,
  color: "white",
} as const;

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute right-40 bottom-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Daily reflection · Sun, Nov 24
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              Hello, MJ <span className="inline-block">👋</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm md:text-base text-muted-foreground">
              Today your emotional state is{" "}
              <span className="text-[color:var(--color-success)] font-medium">improving</span>.
              Stress is down, focus is steady — keep the momentum.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-xl gradient-primary text-primary-foreground glow-primary">
                <Link to="/app/reports">
                  View full report <ArrowUpRight size={16} className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl border-border/60 bg-card/30">
                <Link to="/app/scan">Run live scan</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <HeroStat label="Stress" value="Moderate" tone="warning" />
            <HeroStat label="Mood trend" value="Positive" tone="success" />
            <HeroStat label="Focus" value="78%" tone="primary" />
          </div>
        </div>
      </section>

      {/* KPI row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Emotional Score" value={82} suffix="%" trend={6} status="Healthy" icon={Smile} tone="primary" data={sparkline(1)} />
        <KpiCard label="Stress Risk" value={42} suffix="%" trend={-8} status="Moderate" icon={Flame} tone="warning" data={sparkline(2)} />
        <KpiCard label="Focus Rate" value={76} suffix="%" trend={4} status="Steady" icon={Target} tone="accent" data={sparkline(3)} />
        <KpiCard label="Burnout Risk" value={18} suffix="%" trend={-12} status="Low" icon={Brain} tone="success" data={sparkline(4)} />
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-5 lg:col-span-2">
          <ChartHeader title="Mood Trend" sub="Past 7 days" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(1 0 0 / 0.1)" }} />
                <Line type="monotone" dataKey="happy" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="stress" stroke="var(--color-warning)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sad" stroke="var(--color-accent)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[
            { c: "var(--color-primary)", l: "Happy" },
            { c: "var(--color-warning)", l: "Stress" },
            { c: "var(--color-accent)", l: "Sad" },
          ]} />
        </div>

        <div className="glass rounded-3xl p-5">
          <ChartHeader title="Emotion Distribution" sub="This week" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDistribution}
                  innerRadius={60}
                  outerRadius={92}
                  dataKey="value"
                  paddingAngle={4}
                  stroke="none"
                >
                  {emotionDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {emotionDistribution.map((e, i) => (
              <div key={e.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{e.name}</span>
                <span className="ml-auto font-medium">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <ChartHeader title="Focus by Time of Day" sub="Average over last 7 days" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusHeatmap} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-accent)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="time" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
                <Bar dataKey="focus" fill="url(#barFocus)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <ChartHeader title="Stress Timeline" sub="Today" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stressTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="stressArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="t" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="s" stroke="var(--color-warning)" strokeWidth={2.5} fill="url(#stressArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value, tone }: { label: string; value: string; tone: "warning" | "success" | "primary" }) {
  const cls = {
    warning: "text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/10",
    success: "text-[color:var(--color-success)] bg-[color:var(--color-success)]/10",
    primary: "text-primary bg-primary/10",
  }[tone];
  return (
    <div className={`rounded-2xl p-4 ${cls}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

export function ChartHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function Legend({ items }: { items: { c: string; l: string }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
      {items.map((i) => (
        <div key={i.l} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: i.c }} />
          {i.l}
        </div>
      ))}
    </div>
  );
}
