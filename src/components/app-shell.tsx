import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { RoleToggle } from "./role-toggle";
import { useApp } from "@/lib/app-context";
import { LogOut } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const { role, activeProject, exitProject } = useApp();
  const showBanner = role === "superadmin" && !!activeProject;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {showBanner && (
          <div className="border-b border-hairline bg-gradient-to-r from-brand-soft/70 via-brand-soft/40 to-transparent">
            <div className="px-8 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className="size-1.5 rounded-full bg-brand" />
                <span className="text-muted-foreground">Viewing as superadmin —</span>
                <span className="font-semibold text-foreground">{activeProject!.name}</span>
              </div>
              <button
                onClick={exitProject}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-brand hover:bg-brand/10 transition"
              >
                <LogOut className="size-3" /> Exit project
              </button>
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <RoleToggle />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumb,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="px-8 pt-8 pb-6 border-b border-hairline">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          {breadcrumb && <div className="mb-2 text-xs text-muted-foreground">{breadcrumb}</div>}
          <h1 className="text-[26px] font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
