import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ScanFace,
  Activity,
  Eye,
  Sparkles,
  MessageCircle,
  FileText,
  Settings,
} from "lucide-react";
import { BrandMark } from "./brand-mark";

const items = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Live Scan", url: "/app/scan", icon: ScanFace },
  { title: "Emotion Analysis", url: "/app/emotion", icon: Activity },
  { title: "Attention Tracking", url: "/app/attention", icon: Eye },
  { title: "Predictions", url: "/app/predictions", icon: Sparkles },
  { title: "Chat Support", url: "/app/chat", icon: MessageCircle },
  { title: "Reports", url: "/app/reports", icon: FileText },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <BrandMark />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = path === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="rounded-xl h-10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-sidebar-accent/70"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-[18px] w-[18px]" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-primary-foreground font-semibold">
            MJ
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">MJ Sharma</p>
            <p className="text-xs text-muted-foreground truncate">Pro plan</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
