import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { Button } from "@/components/ui/button";
import { findParticipant, getGroup, getParticipantScores, rigaCriteria, rigaRanking } from "@/lib/demo-data";
import { ArrowLeft, FileDown, Mail, Music, Users, Building2, Hash, Trophy, MessageSquareQuote } from "lucide-react";

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

  const avgPerCriterion = rigaCriteria.map((c, idx) => {
    const key = idx === 0 ? "technique" : idx === 1 ? "expression" : "presence";
    const vals = scores.map((s) => s[key as "technique" | "expression" | "presence"]);
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
        actions={
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

      <div className="px-8 py-7 max-w-5xl space-y-6">
        {/* 1. Performance details */}
        <section className="rounded-xl border border-hairline bg-surface p-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Performance details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailCell icon={<Hash className="size-3.5" />} label="Performance #" value={`#${p.number}`} />
            <DetailCell icon={<Music className="size-3.5" />} label="Song" value={p.song} />
            <DetailCell icon={<Users className="size-3.5" />} label="Group" value={group?.name ?? "—"} />
            <DetailCell icon={<Building2 className="size-3.5" />} label="Studio" value={p.studio} />
          </div>
        </section>

        {/* 2. Current standing */}
        <section className="rounded-xl border border-hairline bg-gradient-to-br from-brand-soft via-brand-soft/40 to-transparent p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand mb-4">
            <Trophy className="size-3.5" /> Current standing
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Overall rank</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight tabular-nums">#{rank + 1}</span>
                <span className="text-sm text-muted-foreground">of {rigaRanking.length}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Average total</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight tabular-nums">
                  {ranking ? ranking.total.toFixed(1) : "—"}
                </span>
                <span className="text-sm text-muted-foreground">/ 30</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">By criterion</div>
              {avgPerCriterion.map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="tabular-nums font-medium">{c.avg.toFixed(1)} / {c.max}</span>
                  </div>
                  <div className="h-1.5 bg-brand/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${(c.avg / c.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Judge scores - card layout */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Judge scores & comments
            </h3>
            <span className="text-xs text-muted-foreground tabular-nums">{scores.length} judges</span>
          </div>
          <div className="space-y-3">
            {scores.map((s, i) => {
              const total = s.technique + s.expression + s.presence;
              const initials = s.judge.split(" ").map((n) => n[0]).slice(0, 2).join("");
              return (
                <div key={i} className="rounded-xl border border-hairline bg-surface overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-hairline">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-semibold">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.judge}</div>
                        <div className="text-[11px] text-muted-foreground">Judge</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
                      <div className="text-xl font-semibold tabular-nums">{total}<span className="text-xs text-muted-foreground font-normal"> / 30</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-hairline">
                    {[
                      { name: rigaCriteria[0].name, val: s.technique, max: rigaCriteria[0].max },
                      { name: rigaCriteria[1].name, val: s.expression, max: rigaCriteria[1].max },
                      { name: rigaCriteria[2].name, val: s.presence, max: rigaCriteria[2].max },
                    ].map((c) => (
                      <div key={c.name} className="px-5 py-3 text-center">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{c.name}</div>
                        <div className="text-lg font-semibold tabular-nums">
                          {c.val}<span className="text-xs text-muted-foreground font-normal">/{c.max}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {s.comment && (
                    <div className="px-5 py-3 border-t border-hairline flex gap-2 text-sm">
                      <MessageSquareQuote className="size-4 shrink-0 text-brand mt-0.5" />
                      <p className="italic text-muted-foreground">"{s.comment}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {icon} {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
