import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Users,
  MessageSquare,
  LayoutDashboard,
  ListOrdered,
  UsersRound,
  Trophy,
  ScrollText,
  Settings,
  Sliders,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { TierBadge } from "./tier-badge";
import { LanguageSwitcher } from "./language-switcher";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const superadminNav: NavItem[] = [
  { to: "/projects", label: "All Projects", icon: LayoutGrid },
  { to: "/users", label: "Users", icon: Users },
  { to: "/feedback", label: "Feedback", icon: MessageSquare },
];

const projectNavMain: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/lineup", label: "Lineup", icon: ListOrdered },
  { to: "/team", label: "Team", icon: UsersRound },
  { to: "/settings/general", label: "Contest settings", icon: Settings },
  { to: "/settings/criteria", label: "Scoring criteria", icon: Sliders },
];

const projectNavResults: NavItem[] = [
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/votes", label: "Vote log", icon: ScrollText },
];

export function Sidebar() {
  const { role, activeProject, exitProject } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const inProject = !!activeProject;

  return (
    <aside className="w-[244px] shrink-0 border-r border-hairline bg-surface flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-brand grid place-items-center shadow-sm">
          <div className="size-3.5 rounded-full bg-brand-foreground/85" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold tracking-tight leading-none">VoiceVibe</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            {role === "superadmin" ? "Platform" : "Organizer"}
          </span>
        </div>
      </div>

      {/* Project switcher */}
      <div className="px-3 pb-2">
        <button className="w-full flex items-center gap-2.5 rounded-lg border border-hairline bg-surface-2/60 hover:bg-surface-2 transition px-2.5 py-2 text-left">
          <div className={`size-7 rounded-md grid place-items-center text-[10px] font-bold ${
            inProject ? "bg-brand text-brand-foreground" : "bg-foreground text-background"
          }`}>
            {inProject ? activeProject!.initials : "ALL"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-tight">
              {inProject ? "Active Project" : "Workspace"}
            </div>
            <div className="text-xs font-semibold truncate">
              {inProject ? activeProject!.name : "All Projects"}
            </div>
          </div>
          <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0" />
        </button>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Current plan</span>
          <TierBadge compact />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {role === "superadmin" && !inProject && (
          <NavGroup label="Platform" items={superadminNav} pathname={pathname} />
        )}
        {role === "superadmin" && inProject && (
          <>
            <NavGroup label={activeProject!.name} items={projectNav} pathname={pathname} />
            <div className="mt-4 px-1">
              <button
                onClick={exitProject}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition"
              >
                <LogOut className="size-3.5" /> Exit to All Projects
              </button>
            </div>
          </>
        )}
        {role === "organizer" && (
          <NavGroup label="Workspace" items={projectNav} pathname={pathname} />
        )}
      </nav>

      {/* Language switcher */}
      <div className="px-3 py-2 border-t border-hairline flex justify-end">
        <LanguageSwitcher variant="icon" />
      </div>

      {/* User */}
      <div className="p-3 border-t border-hairline">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="size-8 rounded-full bg-gradient-to-br from-brand to-pink grid place-items-center text-[11px] font-semibold text-brand-foreground">
            {role === "superadmin" ? "SA" : "AB"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">
              {role === "superadmin" ? "Platform Admin" : "Anna Bērziņa"}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {role === "superadmin" ? "superadmin@voicevibe.app" : "anna.berzina@gmail.com"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({ label, items, pathname }: { label: string; items: NavItem[]; pathname: string }) {
  return (
    <div className="space-y-0.5">
      <div className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
        {label}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.to ||
          (item.to !== "/" && pathname.startsWith(item.to + "/")) ||
          (item.to === "/settings/general" && pathname.startsWith("/settings") && !pathname.startsWith("/settings/criteria"));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              active
                ? "bg-brand-soft text-brand font-semibold"
                : "text-foreground/70 hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <Icon className={`size-4 ${active ? "text-brand" : "text-muted-foreground"}`} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
