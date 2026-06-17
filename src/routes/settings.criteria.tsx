import { createFileRoute } from "@tanstack/react-router";
import { RequireProject } from "@/components/require-project";
import { rigaCriteria } from "@/lib/demo-data";
import { SettingsTabs } from "./settings.general";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings/criteria")({
  component: () => (
    <RequireProject>
      <SettingsCriteria />
    </RequireProject>
  ),
});

function SettingsCriteria() {
  const [criteria, setCriteria] = useState(rigaCriteria);

  return (
    <SettingsTabs>
      <div className="max-w-3xl space-y-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Scoring criteria</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Each judge scores every participant on these criteria. Changes apply to all future votes.
          </p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface divide-y divide-hairline">
          {criteria.map((c, i) => (
            <div key={c.id} className="px-5 py-4 grid grid-cols-[1fr_120px_40px] gap-4 items-start">
              <div className="space-y-2">
                <input
                  defaultValue={c.name}
                  className="w-full px-3 py-1.5 rounded-md border border-hairline bg-surface text-sm font-semibold focus:border-brand outline-none"
                />
                <input
                  defaultValue={c.description}
                  placeholder="Optional description"
                  className="w-full px-3 py-1.5 rounded-md border border-hairline bg-surface text-xs text-muted-foreground focus:border-brand outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <NumberField label="Min" defaultValue={c.min} />
                <NumberField label="Max" defaultValue={c.max} />
              </div>
              <button
                onClick={() => setCriteria(criteria.filter((_, idx) => idx !== i))}
                className="size-9 grid place-items-center rounded-md text-muted-foreground hover:text-danger hover:bg-danger-soft transition"
                aria-label="Remove criterion"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCriteria([...criteria, { id: `c${Date.now()}`, name: "New criterion", description: "", min: 1, max: 10 }])}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-hairline text-sm font-medium text-muted-foreground hover:text-brand hover:border-brand/40"
        >
          <Plus className="size-4" /> Add criterion
        </button>

        <div className="pt-2 flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-dark">
            Save criteria
          </button>
          <button className="px-3.5 py-2 rounded-lg border border-hairline text-sm font-medium hover:bg-surface-2">
            Discard
          </button>
        </div>
      </div>
    </SettingsTabs>
  );
}

function NumberField({ label, defaultValue }: { label: string; defaultValue: number }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        defaultValue={defaultValue}
        className="mt-1 w-full px-2 py-1.5 rounded-md border border-hairline bg-surface text-sm tabular-nums focus:border-brand outline-none"
      />
    </label>
  );
}
