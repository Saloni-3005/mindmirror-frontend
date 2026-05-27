import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { emotionDistribution, moodTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/app/emotion")({
  component: EmotionPage,
});

const tip = {
  background: "oklch(0.22 0.04 268 / 0.9)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
} as const;

const radar = [
  { trait: "Joy", score: 78 },
  { trait: "Calm", score: 70 },
  { trait: "Focus", score: 82 },
  { trait: "Energy", score: 64 },
  { trait: "Stress", score: 38 },
  { trait: "Sadness", score: 22 },
];

const triggers = [
  { name: "Work pressure", value: 38 },
  { name: "Sleep quality", value: 24 },
  { name: "Social", value: 18 },
  { name: "Diet", value: 12 },
  { name: "Other", value: 8 },
];

const PIE = ["var(--color-primary)", "var(--color-accent)", "var(--color-warning)", "var(--color-secondary)", "var(--color-destructive)"];

function EmotionPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Emotional Profile</h3>
          <p className="text-xs text-muted-foreground">Aggregated traits over the last 30 days</p>
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 12 }} />
                <Radar dataKey="score" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
                <Tooltip contentStyle={tip} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Emotion Distribution</h3>
          <p className="text-xs text-muted-foreground">This month</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={emotionDistribution} innerRadius={56} outerRadius={92} dataKey="value" paddingAngle={4} stroke="none">
                  {emotionDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Mood Volatility</h3>
          <p className="text-xs text-muted-foreground">Higher = more swings</p>
          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={moodTrend}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="happy" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="stress" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Top Emotional Triggers</h3>
          <p className="text-xs text-muted-foreground">Estimated influence</p>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={triggers} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} width={110} />
                <Tooltip contentStyle={tip} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
