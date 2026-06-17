import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { feedbackItems } from "@/lib/demo-data";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const groups = {
    new: feedbackItems.filter((f) => f.status === "new"),
    reviewing: feedbackItems.filter((f) => f.status === "reviewing"),
    resolved: feedbackItems.filter((f) => f.status === "resolved"),
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Platform · Feedback"
        title="Feedback"
        description="What users are telling you across projects."
      />
      <div className="px-8 py-7 grid grid-cols-3 gap-5">
        <Column title="New" tint="brand" items={groups.new} />
        <Column title="Reviewing" tint="warning" items={groups.reviewing} />
        <Column title="Resolved" tint="success" items={groups.resolved} />
      </div>
    </div>
  );
}

function Column({ title, tint, items }: { title: string; tint: "brand" | "warning" | "success"; items: typeof feedbackItems }) {
  const tintCls = { brand: "text-brand bg-brand-soft", warning: "text-warning bg-warning-soft", success: "text-success bg-success-soft" }[tint];
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest">{title}</h3>
          <span className={`px-1.5 rounded text-[10px] font-bold ${tintCls}`}>{items.length}</span>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="rounded-xl border border-hairline bg-surface p-4 hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${
                f.category === "Bug" ? "text-danger" : f.category === "Praise" ? "text-success" : "text-brand"
              }`}>{f.category}</span>
              <span className="text-[10px] text-muted-foreground">{f.ts}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{f.body}</p>
            <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between text-xs">
              <span className="text-muted-foreground"><span className="text-foreground font-medium">{f.user}</span> · {f.project}</span>
              <button className="text-brand font-semibold hover:underline">Open</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-hairline px-4 py-8 text-center text-xs text-muted-foreground">
            Nothing here.
          </div>
        )}
      </div>
    </div>
  );
}
