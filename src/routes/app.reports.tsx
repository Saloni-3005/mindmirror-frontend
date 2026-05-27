import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Mail, Sheet, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reportRows, stressTimeline } from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

const tip = {
  background: "oklch(0.22 0.04 268 / 0.9)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
} as const;

function ReportsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Weekly Summary" sub="Nov 18 – Nov 24" metric="+8%" tone="success" trendUp />
        <ReportCard title="Monthly Emotional Trends" sub="November" metric="Positive" tone="primary" trendUp />
        <ReportCard title="Productivity Score" sub="7-day avg" metric="78 / 100" tone="accent" trendUp />
        <ReportCard title="Burnout Summary" sub="30-day window" metric="Low" tone="warning" trendUp={false} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Stress History Timeline</h3>
              <p className="text-xs text-muted-foreground">Aggregated daily stress score</p>
            </div>
            <ExportRow />
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <AreaChart data={stressTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="t" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="s" stroke="var(--color-secondary)" strokeWidth={2.5} fill="url(#hist)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold">Risk History</h3>
          <p className="text-xs text-muted-foreground">Last 6 weeks</p>
          <ul className="mt-4 space-y-3 flex-1">
            {[
              { w: "Wk 47", r: "Low", c: "var(--color-success)" },
              { w: "Wk 46", r: "Low", c: "var(--color-success)" },
              { w: "Wk 45", r: "Medium", c: "var(--color-warning)" },
              { w: "Wk 44", r: "Low", c: "var(--color-success)" },
              { w: "Wk 43", r: "High", c: "var(--color-destructive)" },
              { w: "Wk 42", r: "Medium", c: "var(--color-warning)" },
            ].map((x) => (
              <li key={x.w} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{x.w}</span>
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${x.c}25`, color: x.c }}>
                  {x.r}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Focus Sessions</h3>
            <p className="text-xs text-muted-foreground">Daily breakdown</p>
          </div>
          <ExportRow />
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Mood</TableHead>
                <TableHead>Stress</TableHead>
                <TableHead>Focus</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportRows.map((r) => (
                <TableRow key={r.date} className="border-border/60">
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell>{r.mood}</TableCell>
                  <TableCell>
                    <Badge tone={r.stress === "High" ? "danger" : r.stress === "Moderate" ? "warning" : "success"}>{r.stress}</Badge>
                  </TableCell>
                  <TableCell>{r.focus}</TableCell>
                  <TableCell className="text-right">
                    <Badge tone={r.risk === "Medium" ? "warning" : r.risk === "High" ? "danger" : "success"}>{r.risk}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function ExportRow() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" className="rounded-xl border-border/60 bg-card/30">
        <FileText size={14} className="mr-1.5" /> PDF
      </Button>
      <Button size="sm" variant="outline" className="rounded-xl border-border/60 bg-card/30">
        <Sheet size={14} className="mr-1.5" /> CSV
      </Button>
      <Button size="sm" variant="outline" className="rounded-xl border-border/60 bg-card/30">
        <Mail size={14} className="mr-1.5" /> Email
      </Button>
    </div>
  );
}

function ReportCard({
  title,
  sub,
  metric,
  tone,
  trendUp,
}: {
  title: string;
  sub: string;
  metric: string;
  tone: "primary" | "accent" | "success" | "warning";
  trendUp: boolean;
}) {
  const t = {
    primary: "text-primary bg-primary/15",
    accent: "text-accent bg-accent/15",
    success: "text-[color:var(--color-success)] bg-[color:var(--color-success)]/15",
    warning: "text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/15",
  }[tone];
  return (
    <div className="glass rounded-3xl p-5 hover-lift flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${t}`}>
          {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{metric}</p>
      <Button size="sm" variant="ghost" className="mt-4 self-start rounded-xl text-primary hover:bg-primary/10">
        <Download size={14} className="mr-1.5" /> Download PDF
      </Button>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "success" | "warning" | "danger" }) {
  const c = {
    success: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
    warning: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
    danger: "bg-destructive/15 text-destructive",
  }[tone];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c}`}>{children}</span>;
}
