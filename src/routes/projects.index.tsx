import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { projects, type Project } from "@/lib/demo-data";
import { useApp } from "@/lib/app-context";
import { Plus, ArrowRight, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects · VoiceVibe" },
      { name: "description", content: "Overview of all VoiceVibe competitions." },
    ],
  }),
  component: ProjectsOverview,
});

function StatusPill({ status }: { status: Project["status"] }) {
  const map = {
    "on-track": { label: "On track", cls: "bg-success-soft text-success" },
    attention: { label: "Needs attention", cls: "bg-warning-soft text-warning" },
    complete: { label: "Complete", cls: "bg-brand-soft text-brand" },
    "not-started": { label: "Not started", cls: "bg-muted text-muted-foreground" },
  } as const;
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${m.cls}`}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {m.label}
    </span>
  );
}

function ProjectsOverview() {
  const { enterProject } = useApp();
  const totals = {
    projects: projects.length,
    participants: projects.reduce((a, p) => a + p.participants, 0),
    judges: projects.reduce((a, p) => a + p.judges, 0),
    avgScoring: Math.round(projects.reduce((a, p) => a + p.scoring, 0) / projects.length),
  };

  const needsAttention = projects.filter((p) => p.status === "attention" || p.status === "not-started");

  return (
    <div>
      <PageHeader
        breadcrumb={<span className="text-muted-foreground">Platform · Projects</span>}
        title="Projects"
        description={`Overseeing ${projects.length} competitions across the Baltics & Nordics.`}
        action={
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand text-brand-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-dark transition-colors"
          >
            <Plus className="size-4" /> New project
          </Link>
        }
      />

      <div className="px-8 py-7 space-y-7">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryStat label="Active projects" value={totals.projects.toString()} />
          <SummaryStat label="Total participants" value={totals.participants.toString()} />
          <SummaryStat label="Judges across platform" value={totals.judges.toString()} />
          <SummaryStat label="Avg scoring progress" value={`${totals.avgScoring}%`} tone="brand" />
        </div>

        {/* Attention strip */}
        {needsAttention.length > 0 && (
          <div className="rounded-xl border border-warning/30 bg-warning-soft/40 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="size-7 rounded-full bg-warning/20 text-warning grid place-items-center text-xs font-bold">
                {needsAttention.length}
              </div>
              <span className="text-foreground/80">
                <span className="font-semibold text-foreground">{needsAttention.length} projects</span> need your attention soon.
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {needsAttention.map((p) => p.name).join(" · ")}
            </span>
          </div>
        )}

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">All projects</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Sorted by competition date</span>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onEnter={() => enterProject(p.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone?: "brand" }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold tracking-tight mt-2 ${tone === "brand" ? "text-brand" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function ProjectCard({ project, onEnter }: { project: Project; onEnter: () => void }) {
  const tierTint = {
    Free: "text-muted-foreground bg-muted",
    Starter: "text-foreground bg-surface-2 border border-hairline",
    Professional: "text-brand bg-brand-soft",
    Enterprise: "text-foreground bg-gradient-to-r from-brand-soft to-warning-soft",
  }[project.tier];
  const barColor = {
    "on-track": "bg-brand",
    attention: "bg-warning",
    complete: "bg-success",
    "not-started": "bg-muted-foreground/30",
  }[project.status];

  return (
    <div className="group rounded-xl border border-hairline bg-surface p-6 hover:border-brand/40 hover:shadow-card transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusPill status={project.status} />
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${tierTint}`}>
              {project.tier}
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-brand transition-colors">
            {project.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {project.date}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {project.location}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-semibold tracking-tight tabular-nums">{project.scoring}%</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">scored</div>
        </div>
      </div>

      <div className="mt-5 h-1 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all`} style={{ width: `${project.scoring}%` }} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-hairline pt-4">
        <Mini label="Groups" value={project.groups.toString()} />
        <Mini label="Participants" value={project.participants.toString()} />
        <Mini label="Judges" value={project.judges.toString()} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Organizer: <span className="text-foreground font-medium">{project.organizer}</span>
        </div>
        <Link
          to="/dashboard"
          onClick={onEnter}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:gap-2 transition-all"
        >
          Enter project <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{label}</div>
      <div className="text-base font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
