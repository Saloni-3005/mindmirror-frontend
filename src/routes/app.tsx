import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const TITLES: Record<string, { t: string; s: string }> = {
  "/app/dashboard": { t: "Dashboard", s: "Your emotional wellness, at a glance" },
  "/app/scan": { t: "Live Emotion Scan", s: "Real-time multimodal analysis" },
  "/app/emotion": { t: "Emotion Analysis", s: "Deep emotional insights" },
  "/app/attention": { t: "Attention Tracking", s: "Focus & engagement metrics" },
  "/app/predictions": { t: "Predictions", s: "Tomorrow, modelled today" },
  "/app/chat": { t: "Chat Support", s: "Your AI emotional companion" },
  "/app/reports": { t: "Reports", s: "Exportable wellness analytics" },
  "/app/settings": { t: "Settings", s: "Personalize your MindMirror" },
};

function AppLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const meta = TITLES[path] ?? { t: "MindMirror AI", s: "" };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <AppNavbar title={meta.t} subtitle={meta.s} />
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
