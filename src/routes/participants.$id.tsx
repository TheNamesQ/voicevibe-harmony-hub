import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { findParticipant, getGroup, getParticipantScores, rigaCriteria, rigaRanking } from "@/lib/demo-data";
import { ArrowLeft, Trophy } from "lucide-react";

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
      />
      <div className="px-8 py-7 grid grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Per-criterion */}
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <h3 className="text-sm font-semibold mb-4">Scores by judge</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-hairline">
                  <th className="text-left font-semibold pb-3">Judge</th>
                  {rigaCriteria.map((c) => (
                    <th key={c.id} className="text-right font-semibold pb-3">{c.name}</th>
                  ))}
                  <th className="text-right font-semibold pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {scores.map((s, i) => {
                  const total = s.technique + s.expression + s.presence;
                  return (
                    <tr key={i}>
                      <td className="py-3.5">
                        <div className="font-medium">{s.judge}</div>
                        {s.comment && <div className="text-xs text-muted-foreground italic mt-0.5">"{s.comment}"</div>}
                      </td>
                      <td className="py-3.5 text-right tabular-nums">{s.technique}</td>
                      <td className="py-3.5 text-right tabular-nums">{s.expression}</td>
                      <td className="py-3.5 text-right tabular-nums">{s.presence}</td>
                      <td className="py-3.5 text-right font-semibold tabular-nums">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-hairline bg-gradient-to-br from-brand-soft to-transparent p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand mb-2">
              <Trophy className="size-3.5" /> Current standing
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">#{rank + 1}</span>
              <span className="text-sm text-muted-foreground">overall</span>
            </div>
            {ranking && (
              <div className="mt-3 pt-3 border-t border-brand/15">
                <div className="text-xs text-muted-foreground">Average total</div>
                <div className="text-xl font-semibold tabular-nums">{ranking.total.toFixed(1)} / 30</div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-hairline bg-surface p-5 space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Performance</h4>
            <Row label="Song" value={p.song} />
            <Row label="Group" value={group?.name ?? "—"} />
            <Row label="Studio" value={p.studio} />
            <Row label="Performance #" value={`#${p.number}`} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
