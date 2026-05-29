import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Eye,
  Mic,
  Smartphone,
  Sparkles,
  Type,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceWaveform } from "@/components/voice-waveform";
import {
  apiFaceEmotion,
  apiVoiceEmotion,
  apiSentiment,
  apiAttention,
  apiFuse,
} from "@/lib/api";

export const Route = createFileRoute("/app/scan")({
  component: ScanPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScanResults {
  face_emotion: string;
  voice_emotion: string;
  sentiment: string;
  stress_probability: number;
  focus: string;
  attention_percent: number;
  basic_emotion: string;
  final_state: string;
  stress_score: number;
  stress_level: string;
}

// ─── Webcam helpers ───────────────────────────────────────────────────────────

// Mode 1: Capture single frame from live webcam
async function captureWebcamFrame(
  videoEl: HTMLVideoElement
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth || 640;
  canvas.height = videoEl.videoHeight || 480;
  canvas.getContext("2d")!.drawImage(videoEl, 0, 0);
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9)
  );
}
// Mode 2: Use an uploaded image file directly
function imageFileToBlob(file: File): Blob {
  return file;
}
// Mic recording (10 seconds)
async function recordAudio(seconds = 10): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  return new Promise((resolve) => {
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      resolve(new Blob(chunks, { type: "audio/wav" }));
    };
    recorder.start();
    setTimeout(() => recorder.stop(), seconds * 1000);
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ScanPage() {
  const [results, setResults] = useState<ScanResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [userText, setUserText] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);   // uploaded image
  const [scanMode, setScanMode] = useState<"camera" | "upload">("camera");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start webcam when camera mode is active
  useEffect(() => {
    if (scanMode !== "camera") return;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        // Camera not available — silently fall back
        setScanMode("upload");
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [scanMode]);

  async function runFullScan() {
    if (!userText.trim()) return;
    setLoading(true);
    try {
      // ── Step 1: Get image blob (camera frame OR uploaded image) ──
      let frameBlob: Blob | null = null;

      if (scanMode === "camera" && videoRef.current) {
        frameBlob = await captureWebcamFrame(videoRef.current);
      } else if (scanMode === "upload" && imageBlob) {
        frameBlob = imageBlob;
      }

      if (!frameBlob) {
        alert("Please provide an image (camera or upload) before scanning.");
        setLoading(false);
        return;
      }

      // ── Step 2: Face + Attention + Sentiment (parallel) ──
      const [faceRes, attentionRes, sentimentRes] = await Promise.all([
        apiFaceEmotion(frameBlob),
        apiAttention(frameBlob),
        apiSentiment(userText),
      ]);

      // ── Step 3: Record voice (sequential — needs mic) ──
      const audioBlob = await recordAudio(10);
      const voiceRes = await apiVoiceEmotion(audioBlob);

      // ── Step 4: Fuse everything ──
      const fuseRes = await apiFuse(
        faceRes.face_emotion,
        voiceRes.voice_emotion,
        attentionRes.focus,
        sentimentRes.sentiment
      );

      setResults({
        ...faceRes,
        ...voiceRes,
        ...attentionRes,
        ...sentimentRes,
        ...fuseRes,
      });
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Build metric tiles from results (or show defaults)
  const metrics = [
    {
      icon: User,
      label: "Face Emotion",
      value: results?.face_emotion ?? "—",
      tone: "primary" as const,
      sub: results ? "Live detection" : "Not scanned yet",
    },
    {
      icon: Mic,
      label: "Voice Emotion",
      value: results?.voice_emotion ?? "—",
      tone: "accent" as const,
      sub: results ? "Tone analysed" : "Not scanned yet",
    },
    {
      icon: Type,
      label: "Text Sentiment",
      value: results?.sentiment ?? "—",
      tone: "success" as const,
      sub: results
        ? `Stress prob: ${results.stress_probability}%`
        : "Not scanned yet",
    },
    {
      icon: Zap,
      label: "Stress Score",
      value: results ? String(results.stress_score) : "—",
      tone: "warning" as const,
      sub: results?.stress_level ?? "Not scanned yet",
    },
    {
      icon: Activity,
      label: "Focus Score",
      value: results ? `${results.attention_percent}%` : "—",
      tone: "primary" as const,
      sub: results?.focus ?? "Not scanned yet",
    },
    {
      icon: Eye,
      label: "Final State",
      value: results?.final_state ?? "—",
      tone: "accent" as const,
      sub: results?.basic_emotion ?? "Awaiting scan",
    },
    {
      icon: Sparkles,
      label: "Basic Emotion",
      value: results?.basic_emotion ?? "—",
      tone: "primary" as const,
      sub: "Fused result",
    },
    {
      icon: Smartphone,
      label: "Stress Level",
      value: results?.stress_level ?? "—",
      tone: "success" as const,
      sub: results ? "Calculated" : "Not scanned yet",
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      {/* ── Left panel ── */}
      <div className="space-y-4">
        <WebcamCard
          videoRef={videoRef}
          scanMode={scanMode}
          setScanMode={setScanMode}
          onImageUpload={(blob) => setImageBlob(blob)}
          faceEmotion={results?.face_emotion}
        />
        <VoiceCard voiceEmotion={results?.voice_emotion} />
        <TextCard
          text={userText}
          setText={setUserText}
          sentiment={results?.sentiment}
          loading={loading}
        />
      </div>

      {/* ── Right panel ── */}
      <div className="glass-strong rounded-3xl p-5 md:p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Real-time AI detection
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              Detection Center
            </h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-success)]/15 px-3 py-1 text-xs text-[color:var(--color-success)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-success)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-success)]" />
            </span>
            Live
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 flex-1">
          {metrics.map((m) => (
            <MetricTile key={m.label} {...m} />
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniMetric
            label="Attention"
            value={results ? `${results.attention_percent}%` : "—"}
          />
          <MiniMetric
            label="Focus Level"
            value={results?.focus ?? "—"}
          />
          <MiniMetric
            label="Stress Level"
            value={results?.stress_level ?? "—"}
          />
        </div>

        {/* ── Full Scan Button ── */}
        <Button
          onClick={runFullScan}
          disabled={loading || !userText.trim()}
          className="mt-6 h-14 w-full rounded-2xl gradient-primary text-primary-foreground text-base font-medium glow-primary hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={18} className="mr-2" />
          {loading ? "Scanning… please wait" : "Start Full AI Analysis"}
        </Button>

        {results && (
          <Link
            to="/app/dashboard"
            className="mt-3 block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View full dashboard →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── WebcamCard — supports Camera + Upload mode ───────────────────────────────

function WebcamCard({
  videoRef,
  scanMode,
  setScanMode,
  onImageUpload,
  faceEmotion,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  scanMode: "camera" | "upload";
  setScanMode: (m: "camera" | "upload") => void;
  onImageUpload: (blob: Blob) => void;
  faceEmotion?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onImageUpload(imageFileToBlob(file));
  }

  return (
    <div className="glass rounded-3xl p-5">
      {/* Header + mode toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Live Webcam Scan</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setScanMode("camera")}
            className={`rounded-xl px-3 py-1 text-xs transition-colors ${
              scanMode === "camera"
                ? "bg-primary text-primary-foreground"
                : "bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setScanMode("upload")}
            className={`rounded-xl px-3 py-1 text-xs transition-colors ${
              scanMode === "upload"
                ? "bg-primary text-primary-foreground"
                : "bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Camera view */}
      {scanMode === "camera" && (
        <div className="mt-4 grid place-items-center">
          <div className="relative h-64 w-64 rounded-full overflow-hidden border-2 border-primary/40">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 rounded-full bg-background/60 px-2 py-1 text-[10px] backdrop-blur">
              Detecting…
            </div>
          </div>
        </div>
      )}

      {/* Upload view */}
      {scanMode === "upload" && (
        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-card/20 py-8 hover:border-primary/50 hover:bg-card/40 transition-colors"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded"
                className="h-40 w-40 rounded-full object-cover"
              />
            ) : (
              <>
                <Upload size={28} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Click to upload a photo
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Detected emotion</p>
          <p className="font-semibold">
            {faceEmotion ? (
              <>
                {faceEmotion} ·{" "}
                <span className="text-primary">Detected</span>
              </>
            ) : (
              <span className="text-muted-foreground">Not scanned yet</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs">Mode</p>
          <p className="font-semibold capitalize">{scanMode}</p>
        </div>
      </div>
    </div>
  );
}

// ─── VoiceCard ────────────────────────────────────────────────────────────────

function VoiceCard({ voiceEmotion }: { voiceEmotion?: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/15 text-accent">
            <Mic size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Voice Mood</h3>
            <p className="text-xs text-muted-foreground">
              Recorded during scan…
            </p>
          </div>
        </div>
        <span className="text-xs text-accent">
          {voiceEmotion ?? "Waiting"}
        </span>
      </div>
      <div className="mt-3">
        <VoiceWaveform />
      </div>
      <div className="mt-3 flex justify-between text-xs">
        <span className="text-muted-foreground">
          Tone:{" "}
          <span className="text-foreground font-medium">
            {voiceEmotion ?? "—"}
          </span>
        </span>
        <span className="text-muted-foreground">
          Status:{" "}
          <span className="text-foreground font-medium">
            {voiceEmotion ? "Analysed" : "Pending scan"}
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── TextCard ─────────────────────────────────────────────────────────────────

function TextCard({
  text,
  setText,
  sentiment,
  loading,
}: {
  text: string;
  setText: (v: string) => void;
  sentiment?: string;
  loading: boolean;
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-sm font-semibold">How are you feeling today?</h3>
      <p className="text-xs text-muted-foreground">
        Write a few words — we'll analyse the sentiment.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Today I felt a little overwhelmed but managed to focus during the afternoon…"
        className="mt-3 min-h-24 rounded-2xl bg-card/40 border-border/60 resize-none"
        maxLength={500}
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.length}/500</span>
        {sentiment && (
          <span
            className={`text-xs font-medium ${
              sentiment === "Positive"
                ? "text-[color:var(--color-success)]"
                : "text-[color:var(--color-warning)]"
            }`}
          >
            Sentiment: {sentiment}
          </span>
        )}
        {!sentiment && (
          <span className="text-xs text-muted-foreground">
            {loading ? "Analysing…" : "Run scan to analyse"}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── MetricTile ───────────────────────────────────────────────────────────────

function MetricTile({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  sub: string;
  tone: "primary" | "accent" | "success" | "warning";
}) {
  const t = {
    primary: "text-primary bg-primary/15",
    accent: "text-accent bg-accent/15",
    success:
      "text-[color:var(--color-success)] bg-[color:var(--color-success)]/15",
    warning:
      "text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/15",
  }[tone];

  const [shown, setShown] = useState(value);
  useEffect(() => {
    setShown(value);
  }, [value]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/30 p-4 hover-lift">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-xl ${t}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight">{shown}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

// ─── MiniMetric ───────────────────────────────────────────────────────────────

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/30 border border-border/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}