import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Smartphone, EyeOff, Bed, Activity, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/app/attention")({
  component: AttentionPage,
});

const tip = {
  background: "oklch(0.22 0.04 268 / 0.9)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
} as const;

const focusSession = Array.from({ length: 30 }).map((_, i) => ({
  m: `${i}m`,
  focus: 50 + Math.round(Math.sin(i * 0.4) * 20 + Math.random() * 10 + 25),
}));

function AttentionPage() {
  const metrics = [
    { icon: Eye, label: "Eye Contact", value: 84, suffix: "%", tone: "primary" as const },
    { icon: EyeOff, label: "Looking Away", value: 12, suffix: " times", tone: "warning" as const },
    { icon: Smartphone, label: "Phone Alerts", value: 2, suffix: "", tone: "danger" as const },
    { icon: Activity, label: "Blink Frequency", value: 14, suffix: "/min", tone: "accent" as const },
    { icon: Bed, label: "Sleepiness", value: 18, suffix: "%", tone: "success" as const },
    { icon: Award, label: "Attention Grade", value: "A−", suffix: "", tone: "primary" as const, isText: true },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
      <div className="glass rounded-3xl p-5">
        <h3 className="text-sm font-semibold">Live Camera Feed</h3>
        <p className="text-xs text-muted-foreground">Tracking gaze, blink rate and posture</p>
        <div className="mt-4 relative aspect-[4/3] overflow-hidden rounded-2xl bg-[oklch(0.16_0.04_268)] border border-border/60">
          <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
            <defs>
              <radialGradient id="bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.32 0.08 282)" />
                <stop offset="100%" stopColor="oklch(0.16 0.04 268)" />
              </radialGradient>
            </defs>
            <rect width="400" height="300" fill="url(#bg)" />
            <ellipse cx="200" cy="150" rx="80" ry="100" fill="oklch(0.45 0.08 282)" opacity="0.7" />
            <circle cx="175" cy="135" r="5" fill="white" />
            <circle cx="225" cy="135" r="5" fill="white" />
            <path d="M170 185 Q200 200 230 185" stroke="white" strokeWidth="2" fill="none" />
            {/* face mesh */}
            {Array.from({ length: 80 }).map((_, i) => {
              const a = (i / 80) * Math.PI * 2;
              return (
                <circle key={i} cx={200 + Math.cos(a) * 85} cy={150 + Math.sin(a) * 100} r="1" fill="oklch(0.82 0.13 210)" opacity="0.6" />
              );
            })}
          </svg>
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-xs backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-success)] animate-pulse" /> Tracking
          </div>
          <div className="absolute right-3 top-3 rounded-lg bg-background/60 px-2 py-1 text-[11px] backdrop-blur">
            Gaze: forward
          </div>
          <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-background/50 px-3 py-2 text-xs backdrop-blur flex justify-between">
            <span>Posture: upright</span>
            <span>Distance: 62cm</span>
            <span>Light: good</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <AttentionMetric key={m.label} {...m} />
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-5 xl:col-span-2">
        <h3 className="text-sm font-semibold">Session Focus Timeline</h3>
        <p className="text-xs text-muted-foreground">Last 30 minutes of work</p>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={focusSession} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="focusA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} interval={4} />
              <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tip} />
              <Area type="monotone" dataKey="focus" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#focusA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AttentionMetric({
  icon: Icon,
  label,
  value,
  suffix,
  tone,
  isText,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: number | string;
  suffix: string;
  tone: "primary" | "accent" | "success" | "warning" | "danger";
  isText?: boolean;
}) {
  const t = {
    primary: "text-primary bg-primary/15",
    accent: "text-accent bg-accent/15",
    success: "text-[color:var(--color-success)] bg-[color:var(--color-success)]/15",
    warning: "text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/15",
    danger: "text-destructive bg-destructive/15",
  }[tone];
  const pct = typeof value === "number" ? Math.min(100, Number(value)) : 80;
  return (
    <div className="glass rounded-2xl p-4 hover-lift">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-xl ${t}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
        <span className="text-sm text-muted-foreground">{suffix}</span>
      </p>
      {!isText && <Progress value={pct} className="mt-3 h-1.5 bg-card/40" />}
    </div>
  );
}
