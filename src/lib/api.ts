// frontend/src/lib/api.ts

const BASE = import.meta.env.VITE_API_URL ?? "https://mindmirror-backend-fue5.onrender.com";

// ── Token helpers ─────────────────────────────────────────────────────────────
export function saveToken(token: string) {
  localStorage.setItem("mm_token", token);
}
export function getToken(): string | null {
  return localStorage.getItem("mm_token");
}
export function clearToken() {
  localStorage.removeItem("mm_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function apiLogin(
  email: string,
  password: string
): Promise<{ access_token: string; user_id: string }> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Login failed");
  }
  return res.json();
}

export async function apiSignup(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Signup failed");
  }
  return res.json();
}

// ── Face Emotion ──────────────────────────────────────────────────────────────
export async function apiFaceEmotion(blob: Blob): Promise<{ face_emotion: string }> {
  const form = new FormData();
  form.append("file", blob, "frame.jpg");
  const res = await fetch(`${BASE}/scan/face`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Face API failed");
  return res.json();
}

// ── Voice Emotion ─────────────────────────────────────────────────────────────
export async function apiVoiceEmotion(blob: Blob): Promise<{ voice_emotion: string }> {
  const form = new FormData();
  form.append("file", blob, "voice.wav");
  const res = await fetch(`${BASE}/scan/voice`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Voice API failed");
  return res.json();
}

// ── Text Sentiment ────────────────────────────────────────────────────────────
export async function apiSentiment(
  text: string
): Promise<{ sentiment: string; stress_probability: number }> {
  const res = await fetch(`${BASE}/scan/sentiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Sentiment API failed");
  return res.json();
}

// ── Attention ─────────────────────────────────────────────────────────────────
export async function apiAttention(
  blob: Blob
): Promise<{ focus: string; attention_percent: number }> {
  const form = new FormData();
  form.append("file", blob, "frame.jpg");
  const res = await fetch(`${BASE}/scan/attention`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Attention API failed");
  return res.json();
}

// ── Fuse All Results ──────────────────────────────────────────────────────────
export async function apiFuse(
  face: string,
  voice: string,
  focus: string,
  sentiment: string
) {
  const res = await fetch(`${BASE}/scan/fuse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),          // ← token yahan zaruri hai
    },
    body: JSON.stringify({ face, voice, focus, sentiment }),
  });
  if (!res.ok) throw new Error("Fuse API failed");
  return res.json();
}

// ── Profile APIs (sab mein token chahiye) ─────────────────────────────────────
function profileFetch(path: string) {
  return fetch(`${BASE}${path}`, { headers: authHeaders() }).then((r) => r.json());
}

export const apiHistory         = () => profileFetch("/profile/history");
export const apiStressHistory   = () => profileFetch("/profile/stress");
export const apiPredict         = () => profileFetch("/profile/predict");
export const apiBurnout         = () => profileFetch("/profile/burnout");
export const apiRisk            = () => profileFetch("/profile/risk");
export const apiRecommendations = () => profileFetch("/profile/recommendations");
export const apiPredictions     = () => profileFetch("/profile/predictions");