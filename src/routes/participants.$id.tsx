import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { Button } from "@/components/ui/button";
import { findParticipant, getGroup, getParticipantScores, rigaCriteria, rigaRanking } from "@/lib/demo-data";
import { ArrowLeft, BarChart3, FileDown, Mail, MessageSquare } from "lucide-react";

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
  const criteriaKeys = ["technique", "expression", "presence"] as const;
  const maxCriterion = rigaCriteria[0].max;
  const totalMax = rigaCriteria.reduce((a, c) => a + c.max, 0);

  const judgeAverages = scores.map((s) => {
    const total = s.technique + s.expression + s.presence;
    return { total, avg: total / rigaCriteria.length };
  });
  const finalAvg =
    judgeAverages.reduce((a, j) => a + j.avg, 0) / judgeAverages.length;
  const ringPct = (finalAvg / maxCriterion) * 100;

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

      <div className="px-8 py-6 max-w-5xl mx-auto space-y-8">
        {/* Participant + Final result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Participant */}
          <section>
            <SectionLabel icon={<BarChart3 className="size-3.5" />}>Participant</SectionLabel>
            <div className="rounded-2xl border border-hairline bg-gradient-to-br from-brand-soft/60 via-surface to-surface p-6 space-y-5">
              <Field label="Participant Name" value={p.name} large />
              <Field label="Performed Song" value={`"${p.song}"`} />
              <Field label="Studio / School" value={p.studio} />
              <Field
                label="Competition Group"
                value={group?.name ? `${group.name}${group.ageRange ? " · " + group.ageRange : ""}` : "—"}
              />
            </div>
          </section>

          {/* Final result */}
          <section>
            <SectionLabel icon={<BarChart3 className="size-3.5" />}>Final Result</SectionLabel>
            <div className="rounded-2xl border border-hairline bg-gradient-to-br from-brand-soft/70 via-brand-soft/20 to-surface p-6 flex flex-col items-center justify-center min-h-[300px]">
              <ScoreRing pct={ringPct} value={finalAvg.toFixed(1)} max={maxCriterion} />
              <p className="mt-5 text-sm text-muted-foreground">
                Averaged across <span className="font-semibold text-foreground">{scores.length} judges</span>
                {rank >= 0 && (
                  <>
                    {" · "}Rank{" "}
                    <span className="font-semibold text-foreground">
                      #{rank + 1}
                      <span className="text-muted-foreground font-normal">/{rigaRanking.length}</span>
                    </span>
                  </>
                )}
              </p>
            </div>
          </section>
        </div>

        {/* Judges evaluation */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <SectionLabel icon={<BarChart3 className="size-3.5" />} noMargin>
              Judges Evaluation
            </SectionLabel>
            <span className="text-[11px] text-muted-foreground">
              {scores.length} judges · scored 1–{maxCriterion} per criterion
            </span>
          </div>

          <div className="space-y-4">
            {scores.map((s, i) => {
              const total = s.technique + s.expression + s.presence;
              const avg = total / rigaCriteria.length;
              const initials = s.judge.split(" ").map((n) => n[0]).slice(0, 2).join("");
              const items = [
                { name: rigaCriteria[0].name, val: s.technique },
                { name: rigaCriteria[1].name, val: s.expression },
                { name: rigaCriteria[2].name, val: s.presence },
              ];
              return (
                <article
                  key={i}
                  className="rounded-2xl border border-hairline bg-surface overflow-hidden"
                >
                  {/* Header */}
                  <header className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{s.judge}</div>
                        <div className="text-[11px] text-muted-foreground">Judge</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 shrink-0">
                      <Stat label="Total" value={<><span className="font-bold tabular-nums">{total}</span><span className="text-muted-foreground text-xs">/{totalMax}</span></>} />
                      <Stat label="Average" value={<span className="font-bold tabular-nums text-brand">{avg.toFixed(1)}</span>} />
                    </div>
                  </header>

                  {/* Criteria grid */}
                  <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {items.map((c) => (
                      <div key={c.name} className="flex items-center justify-between gap-3 py-1">
                        <span className="text-sm text-foreground/80">{c.name}</span>
                        <span className="px-2.5 py-1 rounded-md bg-brand-soft text-brand text-xs font-bold tabular-nums min-w-[44px] text-center">
                          {c.val.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  {s.comment && (
                    <div className="border-t border-hairline px-6 py-4 bg-muted/20">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        <MessageSquare className="size-3" /> Judge Feedback
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">{s.comment}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  icon,
  noMargin,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand ${noMargin ? "" : "mb-2"}`}
    >
      {icon}
      {children}
    </div>
  );
}

function Field({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <div className={large ? "text-xl font-bold tracking-tight" : "text-sm font-semibold"}>
        {value}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-right">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="text-base tabular-nums leading-tight mt-0.5">{value}</div>
    </div>
  );
}

function ScoreRing({ pct, value, max }: { pct: number; value: string; max: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative size-44">
      <svg viewBox="0 0 140 140" className="size-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="currentColor" strokeWidth="10" fill="none" className="text-brand/15" />
        <circle
          cx="70"
          cy="70"
          r={r}
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="text-brand transition-all"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold tabular-nums text-brand tracking-tight">{value}</span>
          <span className="text-base font-semibold text-muted-foreground">/{max}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
          Final Score
        </span>
      </div>
    </div>
  );
}
