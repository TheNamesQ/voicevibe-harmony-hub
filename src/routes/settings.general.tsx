import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { RequireProject } from "@/components/require-project";
import { useApp } from "@/lib/app-context";
import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/settings/general")({
  component: () => (
    <RequireProject>
      <SettingsGeneral />
    </RequireProject>
  ),
});

export function SettingsTabs({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div>
      <PageHeader breadcrumb="Workspace · Settings" title="Settings" description="Project branding and scoring configuration." />
      <div className="px-8 pt-5 border-b border-hairline -mt-px">
        <div className="flex gap-1">
          <TabLink to="/settings/general" active={pathname === "/settings/general"}>General</TabLink>
          <TabLink to="/settings/criteria" active={pathname === "/settings/criteria"}>Scoring criteria</TabLink>
        </div>
      </div>
      <div className="px-8 py-7">{children}</div>
    </div>
  );
}

function TabLink({ to, children, active }: { to: string; children: ReactNode; active: boolean }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
        active ? "border-brand text-brand font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function SettingsGeneral() {
  const { activeProject } = useApp();
  if (!activeProject) return null;
  return (
    <SettingsTabs>
      <div className="max-w-2xl space-y-7">
        <Section title="Project details" description="Name and information shown to judges and participants.">
          <Field label="Project name">
            <input
              defaultValue={activeProject.name}
              className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
            />
          </Field>
          <Field label="Description">
            <textarea
              defaultValue={activeProject.description}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none resize-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Competition date">
              <input
                defaultValue={activeProject.date}
                className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
              />
            </Field>
            <Field label="Location">
              <input
                defaultValue={activeProject.location}
                className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
              />
            </Field>
          </div>
        </Section>

        <Section title="Branding" description="Upload your logo and event banner.">
          <div className="grid grid-cols-2 gap-3">
            <UploadZone label="Logo" hint="PNG · 512×512" />
            <UploadZone label="Hero banner" hint="JPG · 1920×600" />
          </div>
        </Section>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-dark">
            Save changes
          </button>
          <button className="px-3.5 py-2 rounded-lg border border-hairline text-sm font-medium hover:bg-surface-2">
            Discard
          </button>
        </div>
      </div>
    </SettingsTabs>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

function UploadZone({ label, hint }: { label: string; hint: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-foreground/80 mb-1.5">{label}</div>
      <button className="w-full aspect-[3/2] rounded-xl border-2 border-dashed border-hairline hover:border-brand/40 hover:bg-brand-soft/30 transition grid place-items-center text-center px-4">
        <div>
          <ImageIcon className="size-6 text-muted-foreground mx-auto" />
          <div className="text-xs font-medium mt-2">Upload {label.toLowerCase()}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
        </div>
      </button>
    </div>
  );
}
