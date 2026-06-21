import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { Button } from "@/components/ui/button";
import { findParticipant, getGroup, getParticipantScores, rigaCriteria, rigaRanking } from "@/lib/demo-data";
import { ArrowLeft, FileDown, Mail } from "lucide-react";

export const Route = createFileRoute("/participants/$id")({
  component: () => (
    <RequireProject>
      <ParticipantDetail />
    </RequireProject>
  ),
});

function ParticipantDetail() {
  const { id } = Route.useParams();
  const p = findParticipant(id);

  if (!p) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-sm text-muted-foreground">Participant not found.</p>
        <Link to="/ranking" className="text-brand text-sm font-semibold">← Back to ranking</Link>
      </div>
    );
  }

  const group = getGroup(p.groupId);
  const scores = getParticipantScores(p.id);
  const rank = rigaRanking.findIndex((r) => r.participantId === p.id);
  const ranking = rigaRanking.find((r) => r.participantId === p.id);
  const criteriaKeys = ["technique", "expression", "presence"] as const;

  const avgPerCriterion = rigaCriteria.map((c, idx) => {
    const key = criteriaKeys[idx];
    const vals = scores.map((s) => s[key]);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { id: c.id, name: c.name, avg, max: c.max };
  });

  return (
    <div>
      <PageHeader
        breadcrumb={
          <Link to="/ranking" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3" /> Ranking
          </Link>
        }
        title={p.name}
        description={`${group?.name ?? ""} · ${p.studio}`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="size-3.5" /> Email report
            </Button>
            <Button size="sm">
              <FileDown className="size-3.5" /> PDF report
            </Button>
          </div>
        }
      />

      <div className="px-8 py-6 max-w-6xl space-y-4">
        {/* Summary row: performance info + standing + criterion bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Performance info */}
          <div className="rounded-xl border border-hairline bg-surface p-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Performance
            </div>
            <dl className="space-y-2.5">
              <Row label="Number" value={`#${p.number}`} />
              <Row label="Song" value={p.song} highlight />
              <Row label="Group" value={group?.name ?? "—"} />
              <Row label="Studio" value={p.studio} />
            </dl>
          </div>

          {/* Standing + criterion bars (spans 2) */}
          <div className="md:col-span-2 rounded-xl border border-hairline bg-surface p-4 flex flex-col md:flex-row gap-5">
            <div className="flex items-center gap-6 md:pr-6 md:border-r border-hairline">
              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Rank
                </div>
                <div className="text-3xl font-semibold tabular-nums tracking-tight">
                  {rank + 1}
                  <span className="text-sm font-normal text-muted-foreground ml-0.5">
                    /{rigaRanking.length}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Avg score
                </div>
                <div className="text-3xl font-semibold tabular-nums tracking-tight text-brand">
                  {ranking ? ranking.total.toFixed(1) : "—"}
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-2.5 py-1 min-w-0">
              {avgPerCriterion.map((c) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="tabular-nums">
                      {c.avg.toFixed(1)}<span className="text-muted-foreground">/{c.max}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-brand/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${(c.avg / c.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Judge feedback grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Judge scores & comments
            </h3>
            <span className="text-[11px] text-muted-foreground tabular-nums">{scores.length} judges</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scores.map((s, i) => {
              const total = s.technique + s.expression + s.presence;
              const initials = s.judge.split(" ").map((n) => n[0]).slice(0, 2).join("");
              return (
                <div
                  key={i}
                  className="rounded-xl border border-hairline bg-surface overflow-hidden flex flex-col"
                >
                  <div className="px-4 py-2.5 border-b border-hairline flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {initials}
                      </div>
                      <span className="text-xs font-semibold truncate">{s.judge}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-brand-soft text-brand text-xs font-semibold rounded tabular-nums shrink-0">
                      {total}
                    </span>
                  </div>
                  <div className="p-4 flex-grow flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { name: rigaCriteria[0].name, val: s.technique, max: rigaCriteria[0].max },
                        { name: rigaCriteria[1].name, val: s.expression, max: rigaCriteria[1].max },
                        { name: rigaCriteria[2].name, val: s.presence, max: rigaCriteria[2].max },
                      ].map((c) => (
                        <div key={c.name} className="text-center p-1.5 bg-muted/40 rounded">
                          <div className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground truncate">
                            {c.name}
                          </div>
                          <div className="text-xs font-semibold tabular-nums mt-0.5">
                            {c.val}
                            <span className="text-muted-foreground font-normal">/{c.max}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {s.comment && (
                      <p className="text-[11px] leading-relaxed italic text-muted-foreground">
                        "{s.comment}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="text-[11px] text-muted-foreground shrink-0">{label}</span>
      <span
        className={`text-xs font-semibold truncate ${highlight ? "text-brand" : ""}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
