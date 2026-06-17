import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { rigaVoteLog } from "@/lib/demo-data";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/votes")({
  component: () => (
    <RequireProject>
      <VoteLog />
    </RequireProject>
  ),
});

function VoteLog() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    if (!q) return rigaVoteLog;
    const s = q.toLowerCase();
    return rigaVoteLog.filter(
      (r) => r.judge.toLowerCase().includes(s) || r.participant.toLowerCase().includes(s) || r.group.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        breadcrumb="Workspace · Scoring · Vote log"
        title="Vote log"
        description="Every score cast, with comments."
      />
      <div className="px-8 py-7 space-y-5">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search judge, participant, or group…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
          />
        </div>

        <div className="rounded-xl border border-hairline bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/60 border-b border-hairline">
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="text-left font-semibold px-5 py-3">Time</th>
                <th className="text-left font-semibold px-5 py-3">Judge</th>
                <th className="text-left font-semibold px-5 py-3">Participant</th>
                <th className="text-right font-semibold px-5 py-3">Tech</th>
                <th className="text-right font-semibold px-5 py-3">Expr</th>
                <th className="text-right font-semibold px-5 py-3">Pres</th>
                <th className="text-left font-semibold px-5 py-3 w-[26%]">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-surface-2/40 transition">
                  <td className="px-5 py-3 text-xs text-muted-foreground tabular-nums whitespace-nowrap">{r.ts}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-sm">{r.judge}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm">{r.participant}</div>
                    <div className="text-xs text-muted-foreground">{r.group}</div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-medium">{r.technique}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-medium">{r.expression}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-medium">{r.presence}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground italic">
                    {r.comment ?? <span className="text-muted-foreground/50 not-italic">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
