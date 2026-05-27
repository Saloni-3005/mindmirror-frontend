// Shared dummy data for the MindMirror AI dashboard
export const moodTrend = [
  { day: "Mon", happy: 62, sad: 22, stress: 40 },
  { day: "Tue", happy: 68, sad: 18, stress: 38 },
  { day: "Wed", happy: 55, sad: 30, stress: 52 },
  { day: "Thu", happy: 72, sad: 16, stress: 34 },
  { day: "Fri", happy: 78, sad: 14, stress: 30 },
  { day: "Sat", happy: 84, sad: 10, stress: 24 },
  { day: "Sun", happy: 80, sad: 12, stress: 28 },
];

export const emotionDistribution = [
  { name: "Happy", value: 42 },
  { name: "Neutral", value: 28 },
  { name: "Stressed", value: 18 },
  { name: "Sad", value: 8 },
  { name: "Angry", value: 4 },
];

export const focusHeatmap = [
  { time: "8am", focus: 55 },
  { time: "10am", focus: 78 },
  { time: "12pm", focus: 84 },
  { time: "2pm", focus: 62 },
  { time: "4pm", focus: 70 },
  { time: "6pm", focus: 58 },
  { time: "8pm", focus: 42 },
];

export const stressTimeline = [
  { t: "00:00", s: 22 },
  { t: "04:00", s: 18 },
  { t: "08:00", s: 40 },
  { t: "12:00", s: 58 },
  { t: "16:00", s: 64 },
  { t: "20:00", s: 36 },
  { t: "24:00", s: 24 },
];

export const sparkline = (seed = 1) =>
  Array.from({ length: 12 }, (_, i) => ({
    i,
    v: 30 + Math.round(Math.sin(i * 0.7 + seed) * 18 + Math.random() * 8 + 25),
  }));

export const stressForecast = [
  { day: "Mon", risk: 38 },
  { day: "Tue", risk: 52 },
  { day: "Wed", risk: 64 },
  { day: "Thu", risk: 78 },
  { day: "Fri", risk: 70 },
  { day: "Sat", risk: 44 },
  { day: "Sun", risk: 32 },
];

export const reportRows = [
  { date: "Nov 18", mood: "Happy", stress: "Low", focus: "82%", risk: "Low" },
  { date: "Nov 19", mood: "Neutral", stress: "Moderate", focus: "74%", risk: "Low" },
  { date: "Nov 20", mood: "Stressed", stress: "High", focus: "58%", risk: "Medium" },
  { date: "Nov 21", mood: "Happy", stress: "Low", focus: "86%", risk: "Low" },
  { date: "Nov 22", mood: "Neutral", stress: "Moderate", focus: "70%", risk: "Low" },
  { date: "Nov 23", mood: "Calm", stress: "Low", focus: "88%", risk: "Low" },
  { date: "Nov 24", mood: "Focused", stress: "Low", focus: "84%", risk: "Low" },
];
