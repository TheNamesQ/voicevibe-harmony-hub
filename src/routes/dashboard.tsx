import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { useApp } from "@/lib/app-context";
import { rigaTeam, rigaRanking } from "@/lib/demo-data";
import { CheckCircle2, Circle, Clock, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireProject>
      <Dashboard />
    </RequireProject>
  ),
});

function Dashboard() {
  const { activeProject } = useApp();
  if (!activeProject) return null;

  const judges = rigaTeam.filter((t) => t.role === "Judge");
  const votesCast = judges.reduce((a, j) => a + (j.votesCast ?? 0), 0);
  const votesTotal = judges.reduce((a, j) => a + (j.votesTotal ?? 0), 0);

  const checklist = [
    { label: "Project basics", done: true },
    { label: "Groups created", done: true },
    { label: "Participants added", done: true },
    { label: "Judges invited", done: true },
    { label: "Scoring criteria configured", done: true },
    { label: "Branding uploaded", done: false },
  ];
  const checklistDone = checklist.filter((c) => c.done).length;

  return (
    <div>
      <PageHeader
        breadcrumb={<span>Workspace · Dashboard</span>}
        title={activeProject.name}
        description={`${activeProject.tier} tier · ${activeProject.date} · ${activeProject.location}`}
        action={
          <Link
            to="/lineup"
            className="px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-dark"
          >
            Manage lineup
          </Link>
        }
      />

      <div className="px-8 py-7 space-y-7">
        {/* Setup checklist */}
        {checklistDone < checklist.length && (
          <div className="rounded-xl border border-hairline bg-gradient-to-br from-brand-soft/50 to-transparent p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">Setup progress</div>
                <div className="text-base font-semibold mt-0.5">
                  {checklistDone} of {checklist.length} complete
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {Math.round((checklistDone / checklist.length) * 100)}%
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {checklist.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-hairline text-sm"
                >
                  {c.done ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground" />
                  )}
                  <span className={c.done ? "text-foreground/70 line-through" : "font-medium"}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Stat label="Groups" value={activeProject.groups.toString()} />
          <Stat label="Participants" value={activeProject.participants.toString()} />
          <Stat label="Judges" value={activeProject.judges.toString()} />
          <Stat label="Votes cast" value={`${votesCast}`} sub={`of ${votesTotal}`} tone="brand" />
        </div>

        {/* Two-up */}
        <div className="grid grid-cols-[1.2fr_1fr] gap-5">
          {/* Judge progress */}
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Judge scoring progress</h3>
              <Link to="/team" className="text-xs font-semibold text-brand hover:underline">View team</Link>
            </div>
            <div className="space-y-3.5">
              {judges.map((j) => {
                const pct = Math.round(((j.votesCast ?? 0) / (j.votesTotal ?? 1)) * 100);
                const tone =
                  j.status === "complete" ? "bg-success" :
                  j.status === "not-started" ? "bg-muted-foreground/30" : "bg-brand";
                return (
                  <div key={j.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-surface-2 grid place-items-center text-[10px] font-semibold">
                          {j.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium">{j.name}</span>
                        {j.status === "complete" && <CheckCircle2 className="size-3.5 text-success" />}
                        {j.status === "not-started" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-warning bg-warning-soft px-1.5 py-0.5 rounded">
                            <Clock className="size-2.5" /> Hasn't started
                          </span>
                        )}
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">{j.votesCast}/{j.votesTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${tone} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 5 ranking */}
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Trophy className="size-4 text-brand" /> Current top 5</h3>
              <Link to="/ranking" className="text-xs font-semibold text-brand hover:underline">Full ranking</Link>
            </div>
            <ol className="space-y-1">
              {rigaRanking.slice(0, 5).map((r, i) => {
                const medal = i === 0 ? "bg-gold/15 text-gold border-gold/30" :
                  i === 1 ? "bg-silver/15 text-foreground border-silver/40" :
                  i === 2 ? "bg-bronze/15 text-bronze border-bronze/30" : "bg-surface-2 text-muted-foreground border-hairline";
                return (
                  <li key={r.participantId} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-2/60 transition">
                    <span className={`size-7 rounded-full border grid place-items-center text-xs font-bold tabular-nums ${medal}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.group}</div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">{r.total.toFixed(1)}</div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "brand" }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={`text-2xl font-semibold tracking-tight tabular-nums ${tone === "brand" ? "text-brand" : ""}`}>
          {value}
        </span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}
