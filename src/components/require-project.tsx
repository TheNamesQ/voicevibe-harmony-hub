import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { projects } from "@/lib/demo-data";
import type { ReactNode } from "react";

export function RequireProject({ children }: { children: ReactNode }) {
  const { activeProject, enterProject } = useApp();
  if (activeProject) return <>{children}</>;
  return (
    <div className="px-8 py-12">
      <div className="max-w-xl mx-auto rounded-xl border border-hairline bg-surface p-8 text-center">
        <h2 className="text-lg font-semibold tracking-tight">Pick a project to view</h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          This page lives inside a project. Enter one to continue.
        </p>
        <div className="mt-5 space-y-2 text-left">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => enterProject(p.id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-hairline hover:border-brand/40 hover:bg-surface-2 transition"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-md bg-brand text-brand-foreground grid place-items-center text-[10px] font-bold">{p.initials}</div>
                <div className="text-left">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.tier} · {p.date}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-brand">Enter →</span>
            </button>
          ))}
        </div>
        <div className="mt-6 text-xs">
          <Link to="/projects" className="text-muted-foreground hover:text-foreground">← Back to all projects</Link>
        </div>
      </div>
    </div>
  );
}
