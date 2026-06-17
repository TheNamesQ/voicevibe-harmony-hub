import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { rigaRanking, rigaGroups } from "@/lib/demo-data";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  component: () => (
    <RequireProject>
      <Ranking />
    </RequireProject>
  ),
});

function Ranking() {
  const [group, setGroup] = useState<string>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    let r = rigaRanking;
    if (group !== "all") r = r.filter((x) => x.group === group);
    if (q) r = r.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()));
    return [...r].sort((a, b) => b.total - a.total);
  }, [group, q]);

  return (
    <div>
      <PageHeader
        breadcrumb="Workspace · Scoring · Ranking"
        title="Live ranking"
        description="Real-time leaderboard across all judges and criteria."
        action={
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-foreground/90">
            <Download className="size-4" /> Export
          </button>
        }
      />
      <div className="px-8 py-7 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search participants…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-hairline bg-surface">
            <ToggleChip active={group === "all"} onClick={() => setGroup("all")}>All groups</ToggleChip>
            {rigaGroups.map((g) => (
              <ToggleChip key={g.id} active={group === g.name} onClick={() => setGroup(g.name)}>{g.name}</ToggleChip>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/60 border-b border-hairline">
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="text-left font-semibold px-5 py-3 w-16">Rank</th>
                <th className="text-left font-semibold px-5 py-3">Participant</th>
                <th className="text-left font-semibold px-5 py-3">Group</th>
                <th className="text-right font-semibold px-5 py-3">Technique</th>
                <th className="text-right font-semibold px-5 py-3">Expression</th>
                <th className="text-right font-semibold px-5 py-3">Stage presence</th>
                <th className="text-right font-semibold px-5 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((r, i) => {
                const podium = i < 3;
                const podiumTints = [
                  "bg-gradient-to-r from-gold/10 to-transparent border-l-2 border-l-gold",
                  "bg-gradient-to-r from-silver/15 to-transparent border-l-2 border-l-silver",
                  "bg-gradient-to-r from-bronze/10 to-transparent border-l-2 border-l-bronze",
                ];
                const medalCls = i === 0 ? "bg-gold/20 text-gold" : i === 1 ? "bg-silver/30 text-foreground" : i === 2 ? "bg-bronze/20 text-bronze" : "bg-surface-2 text-muted-foreground";
                return (
                  <tr key={r.participantId} className={`hover:bg-surface-2/50 transition ${podium ? podiumTints[i] : ""}`}>
                    <td className="px-5 py-3.5">
                      <div className={`size-8 rounded-full grid place-items-center text-xs font-bold tabular-nums ${medalCls}`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link to="/participants/$id" params={{ id: r.participantId }} className="font-medium hover:text-brand">
                        {r.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{r.studio}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.group}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{r.technique.toFixed(1)}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{r.expression.toFixed(1)}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{r.presence.toFixed(1)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-base font-semibold tabular-nums">{r.total.toFixed(1)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
        active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
