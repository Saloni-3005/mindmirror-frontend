import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

type Tone = "primary" | "accent" | "success" | "warning" | "danger";

const toneStyles: Record<Tone, { bg: string; text: string; stroke: string; fill: string }> = {
  primary: {
    bg: "bg-primary/15",
    text: "text-primary",
    stroke: "var(--color-primary)",
    fill: "var(--color-primary)",
  },
  accent: {
    bg: "bg-accent/15",
    text: "text-accent",
    stroke: "var(--color-accent)",
    fill: "var(--color-accent)",
  },
  success: {
    bg: "bg-[color:var(--color-success)]/15",
    text: "text-[color:var(--color-success)]",
    stroke: "var(--color-success)",
    fill: "var(--color-success)",
  },
  warning: {
    bg: "bg-[color:var(--color-warning)]/15",
    text: "text-[color:var(--color-warning)]",
    stroke: "var(--color-warning)",
    fill: "var(--color-warning)",
  },
  danger: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    stroke: "var(--color-destructive)",
    fill: "var(--color-destructive)",
  },
};

interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  trend: number;
  status?: string;
  icon: LucideIcon;
  tone?: Tone;
  data: { i: number; v: number }[];
}

export function KpiCard({
  label,
  value,
  suffix = "",
  trend,
  status,
  icon: Icon,
  tone = "primary",
  data,
}: KpiCardProps) {
  const display = useCountUp(value);
  const t = toneStyles[tone];
  const positive = trend >= 0;
  const gradId = `spark-${tone}-${label.replace(/\s/g, "")}`;

  return (
    <div className="glass hover-lift rounded-3xl p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {display}
            <span className="text-base font-medium text-muted-foreground">{suffix}</span>
          </p>
          {status && (
            <span className={cn("mt-1 inline-block text-xs font-medium", t.text)}>{status}</span>
          )}
        </div>
        <div
          className={cn(
            "grid h-10 w-10 place-items-center rounded-2xl",
            t.bg,
            t.text,
          )}
        >
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
            positive ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]" : "bg-destructive/15 text-destructive",
          )}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? "+" : ""}
          {trend}%
        </div>
        <div className="h-12 w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.fill} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={t.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={t.stroke}
                strokeWidth={2}
                fill={`url(#${gradId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
