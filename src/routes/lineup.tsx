import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { rigaGroups, type Group, type Participant } from "@/lib/demo-data";
import { useState } from "react";
import { Plus, MoreHorizontal, GripVertical, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/lineup")({
  component: () => (
    <RequireProject>
      <Lineup />
    </RequireProject>
  ),
});

function Lineup() {
  const [adding, setAdding] = useState<string | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSong, setNewSong] = useState("");
  const [newStudio, setNewStudio] = useState("");

  return (
    <div>
      <PageHeader
        breadcrumb="Workspace · Lineup"
        title="Lineup"
        description="Build out your competition in one place — groups, participants, performance order."
        action={
          <button
            onClick={() => setCreatingGroup(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand text-brand-foreground text-sm font-semibold rounded-lg hover:bg-brand-dark"
          >
            <Plus className="size-4" /> Add group
          </button>
        }
      />

      <div className="px-8 py-7">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-5 min-w-min">
            {rigaGroups.map((g) => (
              <GroupColumn
                key={g.id}
                group={g}
                addOpen={adding === g.id}
                onAdd={() => setAdding(g.id)}
                onCancel={() => { setAdding(null); setNewName(""); setNewSong(""); setNewStudio(""); }}
                newName={newName} setNewName={setNewName}
                newSong={newSong} setNewSong={setNewSong}
                newStudio={newStudio} setNewStudio={setNewStudio}
              />
            ))}

            <div className="flex-none w-72">
              <div className="rounded-xl border-2 border-dashed border-hairline h-full min-h-[200px] grid place-items-center p-6 text-center">
                {creatingGroup ? (
                  <div className="w-full space-y-2">
                    <input
                      autoFocus
                      placeholder="Group name"
                      className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
                    />
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setCreatingGroup(false)}
                        className="flex-1 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-semibold"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setCreatingGroup(false)}
                        className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCreatingGroup(true)} className="text-sm text-muted-foreground hover:text-brand">
                    <Plus className="size-5 mx-auto mb-1" /> Add group
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unassigned */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Unassigned</h3>
          <div className="rounded-xl border border-dashed border-hairline px-5 py-6 text-center text-sm text-muted-foreground">
            No unassigned participants. Drag a participant card here to remove them from a group.
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupColumn({
  group, addOpen, onAdd, onCancel,
  newName, setNewName, newSong, setNewSong, newStudio, setNewStudio,
}: {
  group: Group;
  addOpen: boolean;
  onAdd: () => void;
  onCancel: () => void;
  newName: string; setNewName: (v: string) => void;
  newSong: string; setNewSong: (v: string) => void;
  newStudio: string; setNewStudio: (v: string) => void;
}) {
  return (
    <div className="flex-none w-72">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2">
            {group.name}
            <span className="text-xs font-normal text-muted-foreground">({group.participants.length})</span>
          </h3>
          {group.ageRange && <div className="text-[11px] text-muted-foreground">{group.ageRange}</div>}
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="space-y-2.5">
        {group.participants.map((p, i) => (
          <ParticipantCard key={p.id} p={p} order={i + 1} />
        ))}

        {addOpen ? (
          <div className="rounded-xl border border-brand/40 bg-brand-soft/40 p-3 space-y-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              placeholder="Participant name"
              className="w-full px-2.5 py-1.5 rounded-md border border-hairline bg-surface text-sm focus:border-brand outline-none"
            />
            <input
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
              placeholder="Song / piece"
              className="w-full px-2.5 py-1.5 rounded-md border border-hairline bg-surface text-sm focus:border-brand outline-none"
            />
            <input
              value={newStudio}
              onChange={(e) => setNewStudio(e.target.value)}
              placeholder="Studio"
              className="w-full px-2.5 py-1.5 rounded-md border border-hairline bg-surface text-sm focus:border-brand outline-none"
            />
            <div className="flex gap-1.5">
              <button
                onClick={onCancel}
                className="flex-1 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-dark"
              >
                Add to {group.name}
              </button>
              <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="w-full rounded-xl border border-dashed border-hairline px-3 py-3 text-xs font-medium text-muted-foreground hover:border-brand/40 hover:text-brand hover:bg-brand-soft/30 transition"
          >
            + Add participant
          </button>
        )}
      </div>
    </div>
  );
}

function ParticipantCard({ p, order }: { p: Participant; order: number }) {
  return (
    <div className="group rounded-xl border border-hairline bg-surface p-3.5 hover:shadow-card hover:border-brand/30 transition-all cursor-grab active:cursor-grabbing">
      <div className="flex items-start gap-2.5">
        <GripVertical className="size-4 text-muted-foreground/40 mt-0.5 shrink-0 group-hover:text-brand transition-colors" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold tabular-nums text-muted-foreground tracking-tight">#{order.toString().padStart(2, "0")}</span>
            {p.scored ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success uppercase">
                <CheckCircle2 className="size-2.5" /> Scored
              </span>
            ) : (
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Pending</span>
            )}
          </div>
          <div className="text-sm font-semibold leading-snug truncate">{p.name}</div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">♪ {p.song}</div>
          <div className="mt-2.5 pt-2.5 border-t border-hairline text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {p.studio}
          </div>
        </div>
      </div>
    </div>
  );
}
