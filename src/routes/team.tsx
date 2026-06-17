import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { rigaTeam } from "@/lib/demo-data";
import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, QrCode, X, Copy, UserPlus } from "lucide-react";

export const Route = createFileRoute("/team")({
  component: () => (
    <RequireProject>
      <TeamPage />
    </RequireProject>
  ),
});

function TeamPage() {
  const [qrOpen, setQrOpen] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const judges = rigaTeam.filter((t) => t.role === "Judge");
  const organizers = rigaTeam.filter((t) => t.role === "Organizer");
  const stuck = judges.find((j) => j.status === "not-started");
  const qrJudge = judges.find((j) => j.id === qrOpen);

  return (
    <div>
      <PageHeader
        breadcrumb="Workspace · Team"
        title="Team"
        description="Organizers and judges with access to this competition."
        action={
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand text-brand-foreground text-sm font-semibold rounded-lg hover:bg-brand-dark"
          >
            <UserPlus className="size-4" /> Invite judge
          </button>
        }
      />

      <div className="px-8 py-7 space-y-7">
        {stuck && (
          <div className="rounded-xl border border-warning/30 bg-warning-soft/40 px-5 py-3.5 flex items-center gap-3">
            <AlertTriangle className="size-5 text-warning shrink-0" />
            <div className="flex-1 text-sm">
              <span className="font-semibold">{stuck.name}</span> hasn't started voting yet.
              The event is in <span className="font-semibold">12 days</span>.
            </div>
            <button
              onClick={() => setQrOpen(stuck.id)}
              className="px-3 py-1.5 rounded-md bg-warning text-white text-xs font-semibold hover:opacity-90"
            >
              Resend magic link
            </button>
          </div>
        )}

        {/* Judges */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Judges</h2>
          <div className="rounded-xl border border-hairline bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-2/60 border-b border-hairline">
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="text-left font-semibold px-5 py-3">Judge</th>
                  <th className="text-left font-semibold px-5 py-3">Voting status</th>
                  <th className="text-left font-semibold px-5 py-3 w-[34%]">Progress</th>
                  <th className="text-right font-semibold px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {judges.map((j) => {
                  const pct = Math.round(((j.votesCast ?? 0) / (j.votesTotal ?? 1)) * 100);
                  return (
                    <tr key={j.id} className="hover:bg-surface-2/40 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-warning/20 text-warning grid place-items-center text-[11px] font-semibold">
                            {j.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium">{j.name}</div>
                            <div className="text-xs text-muted-foreground">{j.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {j.status === "complete" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-success-soft text-success">
                            <CheckCircle2 className="size-3" /> Complete
                          </span>
                        )}
                        {j.status === "in-progress" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-brand-soft text-brand">
                            <Clock className="size-3" /> In progress
                          </span>
                        )}
                        {j.status === "not-started" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-warning-soft text-warning">
                            Not started
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${j.status === "complete" ? "bg-success" : j.status === "not-started" ? "bg-muted-foreground/30" : "bg-brand"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground w-12 text-right">{j.votesCast}/{j.votesTotal}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setQrOpen(j.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-brand hover:bg-brand-soft transition"
                        >
                          <QrCode className="size-3.5" /> Magic link
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Organizers */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Organizers</h2>
          <div className="rounded-xl border border-hairline bg-surface divide-y divide-hairline">
            {organizers.map((o) => (
              <div key={o.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="size-8 rounded-full bg-brand text-brand-foreground grid place-items-center text-[11px] font-semibold">
                  {o.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{o.name}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Owner</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* QR modal */}
      {qrJudge && (
        <Modal onClose={() => setQrOpen(null)} title={`Magic link for ${qrJudge.name}`}>
          <div className="space-y-4">
            <div className="aspect-square w-56 mx-auto rounded-xl border border-hairline bg-surface-2 grid place-items-center">
              <div className="grid grid-cols-8 gap-px p-3">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`size-3 ${(i * 7 + 11) % 3 === 0 ? "bg-foreground" : "bg-transparent"} rounded-[1px]`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Scan to access the judge view. Link expires after the event.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-xs font-mono text-muted-foreground">
              <span className="flex-1 truncate">https://vote.voicevibe.app/j/{qrJudge.id}-x82h</span>
              <button className="text-brand hover:bg-brand-soft p-1 rounded">
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {inviteOpen && (
        <Modal onClose={() => setInviteOpen(false)} title="Invite a judge">
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-foreground/80">Name</span>
              <input className="mt-1 w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none" placeholder="Full name" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground/80">Email</span>
              <input className="mt-1 w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none" placeholder="judge@example.com" />
            </label>
            <button
              onClick={() => setInviteOpen(false)}
              className="w-full px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-dark"
            >
              Send invitation
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-hairline bg-surface shadow-lift p-6 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
