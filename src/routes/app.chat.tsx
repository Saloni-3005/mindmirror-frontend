import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Send, Sparkles, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

interface Msg { role: "ai" | "user"; text: string }

const seed: Msg[] = [
  { role: "ai", text: "Hi MJ — how are you feeling today? You can talk freely; I'll listen." },
  { role: "user", text: "Honestly a bit overwhelmed with deadlines this week." },
  { role: "ai", text: "That makes sense. Your stress signal is up 12% vs last week. Want to try a 4-7-8 breathing reset, or shall we map out the deadlines together?" },
];

const recents = [
  { t: "Pre-exam anxiety", time: "Today" },
  { t: "Sleep + focus", time: "Yesterday" },
  { t: "Motivation reset", time: "Mon" },
  { t: "Burnout check-in", time: "Last week" },
];

const quickChips = ["I feel stressed", "Low motivation", "Anxiety", "Need focus help", "Feeling lonely"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  function send(text: string) {
    if (!text.trim()) return;
    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages([
        ...next,
        {
          role: "ai",
          text:
            "I hear you. Let's break this down — what's the one thing weighing on you most right now? Even naming it will lower its grip.",
        },
      ]);
    }, 1300);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr] h-[calc(100vh-9rem)]">
      {/* Sidebar */}
      <aside className="glass rounded-3xl p-4 hidden lg:flex flex-col">
        <Button className="rounded-xl gradient-primary text-primary-foreground glow-primary">
          <Plus size={16} className="mr-2" /> New conversation
        </Button>
        <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Recent chats</p>
        <ScrollArea className="mt-2 -mx-2 flex-1">
          <ul className="px-2 space-y-1">
            {recents.map((r) => (
              <li
                key={r.t}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-card/50 cursor-pointer"
              >
                <MessageSquare size={14} className="text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate">{r.t}</p>
                  <p className="text-[11px] text-muted-foreground">{r.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>

      {/* Chat */}
      <section className="glass rounded-3xl flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-border/60 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-primary text-primary-foreground glow-primary">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Mira · AI Therapist</h3>
            <p className="text-xs text-[color:var(--color-success)]">Calm · Listening</p>
          </div>
        </header>

        <ScrollArea className="flex-1 p-5">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {typing && (
              <div className="flex gap-2">
                <Avatar />
                <div className="rounded-2xl rounded-tl-sm bg-card/50 border border-border/60 px-4 py-3">
                  <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground mx-0.5" />
                  <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground mx-0.5" style={{ animationDelay: "0.15s" }} />
                  <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground mx-0.5" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border/60 p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickChips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="rounded-full border border-border/70 bg-card/40 px-3 py-1.5 text-xs hover:bg-card/70 hover:border-primary/40 transition"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/40 p-1.5 pl-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your thoughts…"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-10 px-0"
            />
            <Button type="button" variant="ghost" size="icon" className="rounded-xl">
              <Mic size={16} />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="rounded-xl gradient-primary text-primary-foreground"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Avatar() {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl gradient-primary text-primary-foreground">
      <Sparkles size={14} />
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm gradient-primary text-primary-foreground px-4 py-3 text-sm shadow-lg">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Avatar />
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card/50 border border-border/60 px-4 py-3 text-sm">
        {msg.text}
      </div>
    </div>
  );
}
