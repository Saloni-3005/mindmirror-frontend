import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { apiHistory } from "@/lib/api";

export const Route = createFileRoute("/app/emotion")({
  component: EmotionPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface HistoryRow {
  face_emotion: string;
  voice_emotion: string;
  final_state: string;
  stress_score: number;
  stress_level: string;
  focus_level: string;
  sentiment: string;
  recorded_at: string;
}

// ── Data transformers ─────────────────────────────────────────────────────────

const EMOTION_LABELS = ["Happy", "Neutral", "Sad", "Angry", "Fear", "Disgust", "Surprise"];
const STRESS_MAP: Record<string, number> = { Low: 25, Moderate: 55, High: 80, Critical: 95 };

function toEmotionDistribution(rows: HistoryRow[]) {
  const counts: Record<string, number> = {};
  rows.forEach((r) => {
    const e = r.face_emotion || r.final_state || "Neutral";
    counts[e] = (counts[e] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function toMoodTrend(rows: HistoryRow[]) {
  // Group by day (last 7 days)
  const dayMap: Record<string, { happy: number; stress: number; count: number }> = {};
  rows.forEach((r) => {
    const day = new Date(r.recorded_at).toLocaleDateString("en-IN", { weekday: "short" });
    if (!dayMap[day]) dayMap[day] = { happy: 0, stress: 0, count: 0 };
    dayMap[day].happy += r.face_emotion === "Happy" ? 1 : 0;
    dayMap[day].stress += STRESS_MAP[r.stress_level] ?? 40;
    dayMap[day].count += 1;
  });
  return Object.entries(dayMap).map(([day, d]) => ({
    day,
    happy: Math.round((d.happy / d.count) * 100),
    stress: Math.round(d.stress / d.count),
  }));
}

function toRadarData(rows: HistoryRow[]) {
  if (!rows.length) return [];
  const total = rows.length;
  const happy  = rows.filter((r) => r.face_emotion === "Happy").length;
  const neutral = rows.filter((r) => r.face_emotion === "Neutral").length;
  const highFocus = rows.filter((r) => r.focus_level === "High").length;
  const lowStress = rows.filter((r) => r.stress_level === "Low").length;
  const sad = rows.filter((r) => r.face_emotion === "Sad").length;
  const avgStress =
    rows.reduce((s, r) => s + (STRESS_MAP[r.stress_level] ?? 40), 0) / total;

  return [
    { trait: "Joy",    score: Math.round((happy / total) * 100) },
    { trait: "Calm",   score: Math.round((neutral / total) * 100) },
    { trait: "Focus",  score: Math.round((highFocus / total) * 100) },
    { trait: "Energy", score: Math.round((lowStress / total) * 100) },
    { trait: "Stress", score: Math.round(avgStress) },
    { trait: "Sadness",score: Math.round((sad / total) * 100) },
  ];
}

function toTriggers(rows: HistoryRow[]) {
  const stressCount   = rows.filter((r) => r.stress_level === "High" || r.stress_level === "Critical").length;
  const negSentiment  = rows.filter((r) => r.sentiment === "Negative").length;
  const lowFocus      = rows.filter((r) => r.focus_level === "Low").length;
  const sadAngry      = rows.filter((r) => ["Sad", "Angry", "Fear"].includes(r.face_emotion)).length;
  const total         = rows.length || 1;
  return [
    { name: "Work pressure",  value: Math.round((stressCount / total) * 100) },
    { name: "Negative mood",  value: Math.round((negSentiment / total) * 100) },
    { name: "Low focus",      value: Math.round((lowFocus / total) * 100) },
    { name: "Neg. emotions",  value: Math.round((sadAngry / total) * 100) },
  ].sort((a, b) => b.value - a.value);
}

// ── Styles ────────────────────────────────────────────────────────────────────

const tip = {
  background: "oklch(0.22 0.04 268 / 0.9)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12, fontSize: 12, color: "white",
} as const;

const PIE_COLORS = [
  "var(--color-primary)", "var(--color-accent)", "var(--color-warning)",
  "var(--color-secondary)", "var(--color-destructive)",
];

// ── Component ─────────────────────────────────────────────────────────────────

function EmotionPage() {
  const [history, setHistory]   = useState<HistoryRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    apiHistory()
      .then((data) => {
        const rows: HistoryRow[] = data.history ?? [];
        setHistory(rows);
      })
      .catch(() => setError("Could not load history. Please scan first."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
        Loading your emotion history…
      </div>
    );
  }

  if (error || history.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-muted-foreground text-sm">
          {error || "No scan data yet. Run a scan first to see your emotion analysis."}
        </p>
      </div>
    );
  }

  const emotionDistribution = toEmotionDistribution(history);
  const moodTrend           = toMoodTrend(history);
  const radar               = toRadarData(history);
  const triggers            = toTriggers(history);

  return (
    <div className="space-y-6">
      {/* Scan count badge */}
      <p className="text-xs text-muted-foreground">
        Based on your last{" "}
        <span className="text-foreground font-medium">{history.length}</span> scans
      </p>

      <section className="grid gap-4 lg:grid-cols-3">
        {/* Radar */}
        <div className="glass rounded-3xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Emotional Profile</h3>
          <p className="text-xs text-muted-foreground">Aggregated traits from your scans</p>
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

        {/* Pie */}
        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Emotion Distribution</h3>
          <p className="text-xs text-muted-foreground">All scans combined</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={emotionDistribution} innerRadius={56} outerRadius={92}
                  dataKey="value" paddingAngle={4} stroke="none">
                  {emotionDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {/* Mood trend */}
        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Mood Trend</h3>
          <p className="text-xs text-muted-foreground">Happy % vs stress score by day</p>
          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={moodTrend}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="happy"  stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="stress" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Triggers */}
        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Top Emotional Triggers</h3>
          <p className="text-xs text-muted-foreground">Estimated influence (%)</p>
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