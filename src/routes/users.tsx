import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { platformUsers } from "@/lib/demo-data";
import { Search, UserPlus } from "lucide-react";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Platform · Users"
        title="Users"
        description="Everyone with access to the VoiceVibe platform."
        action={
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand text-brand-foreground text-sm font-semibold rounded-lg hover:bg-brand-dark">
            <UserPlus className="size-4" /> Invite user
          </button>
        }
      />
      <div className="px-8 py-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              placeholder="Search by email or name…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-md border border-hairline">All roles</span>
            <span className="px-2 py-1 rounded-md border border-hairline">Any activity</span>
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/60 border-b border-hairline">
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="text-left font-semibold px-5 py-3">User</th>
                <th className="text-left font-semibold px-5 py-3">Role</th>
                <th className="text-left font-semibold px-5 py-3">Projects</th>
                <th className="text-left font-semibold px-5 py-3">Last active</th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {platformUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-full grid place-items-center text-[11px] font-semibold ${
                        u.role === "Superadmin" ? "bg-foreground text-background" :
                        u.role === "Organizer" ? "bg-brand text-brand-foreground" :
                        "bg-warning/20 text-warning"
                      }`}>
                        {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                      u.role === "Superadmin" ? "bg-foreground/10 text-foreground" :
                      u.role === "Organizer" ? "bg-brand-soft text-brand" :
                      "bg-warning-soft text-warning"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.projects.length === 0 ? (
                      <span className="text-xs text-muted-foreground">All projects</span>
                    ) : (
                      <span className="text-xs">{u.projects.join(", ")}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{u.lastActive}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs font-semibold text-brand hover:underline">Manage</button>
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
