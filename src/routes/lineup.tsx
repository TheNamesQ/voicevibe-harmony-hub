import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { rigaGroups as initialGroups, type Group, type Participant } from "@/lib/demo-data";
import { useMemo, useState } from "react";
import { Plus, Search, ArrowUpDown, CheckCircle2, Filter, MoreHorizontal, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/lineup")({
  component: () => (
    <RequireProject>
      <Lineup />
    </RequireProject>
  ),
});

type StatusFilter = "all" | "scored" | "pending";

function Lineup() {
  const [groups, setGroups] = useState<Group[]>(() => initialGroups.map((g) => ({ ...g, participants: [...g.participants] })));
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0].id);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [pName, setPName] = useState("");
  const [pSong, setPSong] = useState("");
  const [pStudio, setPStudio] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) ?? groups[0],
    [groups, activeGroupId],
  );

  const canReorderParticipants = !query.trim() && statusFilter === "all";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeGroup.participants.filter((p) => {
      if (statusFilter === "scored" && !p.scored) return false;
      if (statusFilter === "pending" && p.scored) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.song.toLowerCase().includes(q) ||
        p.studio.toLowerCase().includes(q)
      );
    });
  }, [activeGroup, query, statusFilter]);

  const totalParticipants = groups.reduce((s, g) => s + g.participants.length, 0);

  function resetParticipantForm() {
    setAddingParticipant(false);
    setPName(""); setPSong(""); setPStudio("");
  }

  function handleGroupDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setGroups((gs) => {
      const oldIdx = gs.findIndex((g) => g.id === active.id);
      const newIdx = gs.findIndex((g) => g.id === over.id);
      if (oldIdx < 0 || newIdx < 0) return gs;
      return arrayMove(gs, oldIdx, newIdx);
    });
  }

  function handleParticipantDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setGroups((gs) =>
      gs.map((g) => {
        if (g.id !== activeGroupId) return g;
        const oldIdx = g.participants.findIndex((p) => p.id === active.id);
        const newIdx = g.participants.findIndex((p) => p.id === over.id);
        if (oldIdx < 0 || newIdx < 0) return g;
        return { ...g, participants: arrayMove(g.participants, oldIdx, newIdx) };
      }),
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Workspace · Lineup"
        title="Lineup"
        description={`${groups.length} groups · ${totalParticipants} participants. Drag rows to reorder performance order.`}
      />

      <div className="px-8 py-7">
        <div className="rounded-xl border border-hairline bg-surface overflow-hidden flex min-h-[640px]">
          {/* Left: groups rail */}
          <aside className="w-72 border-r border-hairline flex flex-col bg-muted/30">
            <div className="px-4 py-3 border-b border-hairline bg-surface flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Groups
              </h2>
              <span className="text-[11px] text-muted-foreground tabular-nums">{groups.length}</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGroupDragEnd}>
                <SortableContext items={groups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
                  {groups.map((g) => (
                    <SortableGroupItem
                      key={g.id}
                      group={g}
                      active={g.id === activeGroupId}
                      onSelect={() => setActiveGroupId(g.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </nav>

            <div className="p-3 border-t border-hairline bg-surface">
              {creatingGroup ? (
                <div className="space-y-2">
                  <input
                    autoFocus
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group name"
                    className="w-full px-2.5 py-1.5 rounded-md border border-hairline text-sm focus:border-brand outline-none"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { setCreatingGroup(false); setNewGroupName(""); }}
                      className="flex-1 px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-dark"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => { setCreatingGroup(false); setNewGroupName(""); }}
                      className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCreatingGroup(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-hairline text-sm font-medium text-foreground hover:border-brand/40 hover:text-brand transition-colors"
                >
                  <Plus className="size-4" /> Add group
                </button>
              )}
            </div>
          </aside>

          {/* Right: participant queue */}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="px-5 py-3.5 border-b border-hairline flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-base font-semibold tracking-tight truncate">{activeGroup.name}</h1>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {filtered.length} of {activeGroup.participants.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search performer, song, studio…"
                    className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-hairline bg-surface w-64 focus:border-brand outline-none"
                  />
                </div>
                <div className="inline-flex items-center rounded-md border border-hairline overflow-hidden text-xs font-medium">
                  {(["all", "scored", "pending"] as StatusFilter[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-1.5 capitalize transition-colors ${
                        statusFilter === s
                          ? "bg-brand-soft/60 text-brand-dark"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
                <button
                  onClick={() => setAddingParticipant(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-brand-foreground text-sm font-semibold rounded-md hover:bg-brand-dark"
                >
                  <Plus className="size-4" /> Participant
                </button>
              </div>
            </header>

            {!canReorderParticipants && (
              <div className="px-5 py-2 border-b border-hairline bg-amber-50/60 text-[11px] text-amber-800">
                Drag reordering is disabled while a search or filter is active. Clear filters to reorder.
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 && !addingParticipant ? (
                <div className="py-16 text-center">
                  <Filter className="size-6 mx-auto text-muted-foreground/50 mb-2" />
                  <div className="text-sm text-muted-foreground">No participants match your filters.</div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-surface border-b border-hairline text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      <th className="w-8 py-2.5 px-2"></th>
                      <th className="w-14 py-2.5 px-2">#</th>
                      <th className="py-2.5 px-4">Performer &amp; Song</th>
                      <th className="py-2.5 px-4">Studio</th>
                      <th className="py-2.5 px-4 w-32">Status</th>
                      <th className="w-12 py-2.5 px-4"></th>
                    </tr>
                  </thead>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleParticipantDragEnd}
                  >
                    <SortableContext items={filtered.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                      <tbody className="divide-y divide-hairline">
                        {filtered.map((p, i) => (
                          <SortableRow key={p.id} p={p} order={i + 1} disabled={!canReorderParticipants} />
                        ))}
                        {addingParticipant && (
                          <tr className="bg-brand-soft/30">
                            <td></td>
                            <td className="py-2 px-2 text-xs font-semibold text-brand-dark tabular-nums">
                              {String(activeGroup.participants.length + 1).padStart(3, "0")}
                            </td>
                            <td className="py-2 px-4">
                              <input
                                autoFocus
                                value={pName}
                                onChange={(e) => setPName(e.target.value)}
                                placeholder="Name"
                                className="w-full px-2 py-1 rounded border border-hairline bg-surface text-sm focus:border-brand outline-none mb-1"
                              />
                              <input
                                value={pSong}
                                onChange={(e) => setPSong(e.target.value)}
                                placeholder="Song / piece"
                                className="w-full px-2 py-1 rounded border border-hairline bg-surface text-xs focus:border-brand outline-none"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                value={pStudio}
                                onChange={(e) => setPStudio(e.target.value)}
                                placeholder="Studio"
                                className="w-full px-2 py-1 rounded border border-hairline bg-surface text-sm focus:border-brand outline-none"
                              />
                            </td>
                            <td className="py-2 px-4" colSpan={2}>
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={resetParticipantForm}
                                  className="px-2.5 py-1 rounded-md bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-dark"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={resetParticipantForm}
                                  className="px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </SortableContext>
                  </DndContext>
                </table>
              )}

              {!addingParticipant && (
                <div className="border-t border-hairline flex justify-center">
                  <button
                    onClick={() => setAddingParticipant(true)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand py-3"
                  >
                    <Plus className="size-4" /> Insert participant
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SortableGroupItem({
  group,
  active,
  onSelect,
}: {
  group: Group;
  active: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id });
  const scored = group.participants.filter((p) => p.scored).length;
  const total = group.participants.length;
  const pct = total ? Math.round((scored / total) * 100) : 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-stretch rounded-lg border transition-colors ${
        active
          ? "bg-brand-soft/60 border-brand/30"
          : "border-transparent hover:bg-surface hover:border-hairline"
      } ${isDragging ? "shadow-card" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="px-1.5 py-3 text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder group"
      >
        <GripVertical className="size-3.5" />
      </button>
      <button onClick={onSelect} className="flex-1 text-left py-2.5 pr-3 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-medium truncate ${active ? "text-brand-dark" : "text-foreground"}`}>
            {group.name}
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${
              active ? "bg-brand/15 text-brand-dark" : "bg-muted text-muted-foreground"
            }`}
          >
            {total}
          </span>
        </div>
        {group.ageRange && (
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{group.ageRange}</div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground tabular-nums w-10 text-right">
            {scored}/{total}
          </span>
        </div>
      </button>
    </div>
  );
}

function SortableRow({ p, order, disabled }: { p: Participant; order: number; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: p.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group hover:bg-muted/40 transition-colors ${isDragging ? "bg-surface shadow-card" : ""}`}
    >
      <td className="py-2.5 px-2 align-middle">
        <button
          {...attributes}
          {...listeners}
          disabled={disabled}
          className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing disabled:opacity-30 disabled:cursor-not-allowed touch-none"
          aria-label="Drag to reorder participant"
        >
          <GripVertical className="size-4" />
        </button>
      </td>
      <td className="py-2.5 px-2 text-xs font-semibold text-muted-foreground tabular-nums">
        {String(order).padStart(3, "0")}
      </td>
      <td className="py-2.5 px-4 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
        <div className="text-xs text-muted-foreground truncate">♪ {p.song}</div>
      </td>
      <td className="py-2.5 px-4 text-sm text-foreground/80 truncate">{p.studio}</td>
      <td className="py-2.5 px-4">
        {p.scored ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success/10 text-success">
            <CheckCircle2 className="size-3" /> Scored
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground/50" />
            Pending
          </span>
        )}
      </td>
      <td className="py-2.5 px-4 text-right">
        <button className="text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="size-4" />
        </button>
      </td>
    </tr>
  );
}
