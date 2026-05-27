import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Globe,
  Lock,
  Smartphone,
  Sparkles,
  User,
  Moon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const tabs = [
  { v: "profile", l: "Profile", i: User },
  { v: "notifications", l: "Notifications", i: Bell },
  { v: "privacy", l: "Privacy", i: Lock },
  { v: "devices", l: "Devices", i: Smartphone },
  { v: "appearance", l: "Appearance", i: Moon },
  { v: "language", l: "Language", i: Globe },
  { v: "ai", l: "AI Preferences", i: Sparkles },
];

function SettingsPage() {
  return (
    <div className="glass rounded-3xl p-5 md:p-7">
      <Tabs defaultValue="profile" orientation="vertical" className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <TabsList className="h-auto bg-transparent p-0 flex flex-row lg:flex-col gap-1 overflow-x-auto justify-start">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              className="w-full justify-start gap-2 rounded-xl px-3 py-2.5 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <t.i size={14} /> {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0">
          <TabsContent value="profile" className="space-y-5 mt-0">
            <Section title="Profile" subtitle="Your public details inside MindMirror">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground text-xl font-semibold glow-primary">MJ</div>
                <Button variant="outline" className="rounded-xl border-border/60 bg-card/30">Change avatar</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" defaultValue="MJ Sharma" />
                <Field label="Email" defaultValue="mj@mindmirror.ai" />
                <Field label="Role" defaultValue="Student · Founder" />
                <Field label="Timezone" defaultValue="Asia/Kolkata" />
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-5 mt-0">
            <Section title="Notifications" subtitle="Choose what you'd like to hear about">
              <Toggle label="Daily wellness summary" desc="Every evening at 8 PM" defaultChecked />
              <Toggle label="Burnout alerts" desc="When risk crosses 60%" defaultChecked />
              <Toggle label="Focus break nudges" desc="During long working sessions" />
              <Toggle label="Weekly report email" desc="Sundays · 9 AM" defaultChecked />
            </Section>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-5 mt-0">
            <Section title="Privacy" subtitle="You control where your data lives">
              <Toggle label="On-device emotion processing" desc="Process face & voice locally" defaultChecked />
              <Toggle label="Anonymised analytics" desc="Help improve the AI models" />
              <Toggle label="Encrypt cloud backups" desc="End-to-end encryption" defaultChecked />
              <div className="pt-2">
                <Button variant="outline" className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10">
                  Delete all my data
                </Button>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="devices" className="space-y-5 mt-0">
            <Section title="Connected Devices" subtitle="Manage trusted devices">
              {[
                { n: "MacBook Pro · M3", l: "Mumbai · Active now", on: true },
                { n: "iPhone 15", l: "Last seen yesterday", on: true },
                { n: "iPad Air", l: "Last seen 5 days ago", on: false },
              ].map((d) => (
                <div key={d.n} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{d.n}</p>
                    <p className="text-xs text-muted-foreground">{d.l}</p>
                  </div>
                  <Switch defaultChecked={d.on} />
                </div>
              ))}
            </Section>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-5 mt-0">
            <Section title="Appearance" subtitle="Tune the interface">
              <Toggle label="Dark mode" desc="Recommended for evening sessions" defaultChecked />
              <Toggle label="Reduce motion" desc="Minimises animations" />
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Accent intensity</Label>
                <Slider defaultValue={[70]} max={100} step={1} className="mt-3" />
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="language" className="space-y-5 mt-0">
            <Section title="Language" subtitle="Pick your preferred language">
              <div className="grid gap-2 sm:grid-cols-3">
                {["English", "हिन्दी", "Español", "Français", "Deutsch", "日本語"].map((l, i) => (
                  <button
                    key={l}
                    className={`rounded-xl border px-4 py-3 text-sm text-left ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-card/30 hover:bg-card/50"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="ai" className="space-y-5 mt-0">
            <Section title="AI Preferences" subtitle="Shape how the AI responds">
              <Toggle label="Empathetic tone" desc="Warmer, more conversational replies" defaultChecked />
              <Toggle label="Action-first suggestions" desc="Lead with concrete next steps" />
              <Toggle label="Therapist-style reflections" desc="Mirror & ask follow-up questions" defaultChecked />
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Response detail</Label>
                <Slider defaultValue={[55]} max={100} step={1} className="mt-3" />
              </div>
            </Section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Separator className="bg-border/60 mb-5" />
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} className="h-11 rounded-xl bg-card/40 border-border/60" />
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/30 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
