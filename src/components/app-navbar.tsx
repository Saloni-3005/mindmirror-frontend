import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

export function AppNavbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/60 px-4 md:px-6 backdrop-blur-xl">
      <SidebarTrigger className="rounded-lg" />
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search insights, reports…"
            className="h-10 w-64 rounded-xl bg-card/40 pl-9 border-border/60"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-xl glass hover-lift"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-primary-foreground font-semibold">
          MJ
        </div>
      </div>
    </header>
  );
}
