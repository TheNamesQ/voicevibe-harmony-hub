import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { useState } from "react";
import { Check, ArrowLeft, ArrowRight, Sparkles, Crown, Layers, Rocket } from "lucide-react";

export const Route = createFileRoute("/projects/new")({
  component: NewProjectWizard,
});

const TIERS = [
  { id: "Free", icon: Sparkles, judges: "1 judge", criteria: "2 criteria", branding: "VoiceVibe branding", price: "Free" },
  { id: "Starter", icon: Layers, judges: "Up to 4 judges", criteria: "4 criteria", branding: "Light branding", price: "€49 / event" },
  { id: "Professional", icon: Rocket, judges: "Up to 10 judges", criteria: "Unlimited criteria", branding: "Full branding & domain", price: "€149 / event", popular: true },
  { id: "Enterprise", icon: Crown, judges: "Unlimited judges", criteria: "Custom rubrics & weighting", branding: "White-label & SSO", price: "Custom" },
] as const;

const STEPS = ["Basics", "Tier", "Groups", "Invite organizer"] as const;

function NewProjectWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [tier, setTier] = useState<string>("Professional");
  const [groups, setGroups] = useState<string[]>(["Junior Soloists", "Senior Soloists"]);
  const [organizerEmail, setOrganizerEmail] = useState("");

  if (done) {
    return (
      <div>
        <PageHeader breadcrumb="Platform · Projects · New" title="Project created" description="" />
        <div className="px-8 py-12 max-w-2xl">
          <div className="rounded-xl border border-hairline bg-surface p-8 text-center">
            <div className="size-12 rounded-full bg-success/15 grid place-items-center mx-auto">
              <Check className="size-6 text-success" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{name || "New project"} is live</h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
              You can start adding participants, inviting judges, and configuring scoring criteria right away.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-dark"
              >
                Open project dashboard
              </button>
              <button
                onClick={() => navigate({ to: "/projects" })}
                className="px-3.5 py-2 rounded-lg border border-hairline text-sm font-medium hover:bg-surface-2"
              >
                Back to all projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumb={<span className="text-muted-foreground">Platform · Projects · New</span>}
        title="Create a project"
        description="Set up a new competition in four short steps."
      />
      <div className="px-8 py-8">
        <div className="grid grid-cols-[220px_1fr] gap-10 max-w-5xl">
          {/* Stepper */}
          <ol className="space-y-1">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition ${
                    i === step
                      ? "bg-brand-soft text-brand font-semibold"
                      : i < step
                      ? "text-foreground hover:bg-surface-2"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`size-6 rounded-full grid place-items-center text-[11px] font-semibold ${
                      i < step
                        ? "bg-brand text-brand-foreground"
                        : i === step
                        ? "bg-brand/15 text-brand border border-brand/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  {s}
                </button>
              </li>
            ))}
          </ol>

          {/* Pane */}
          <div className="rounded-xl border border-hairline bg-surface p-7">
            {step === 0 && (
              <div className="space-y-5 max-w-lg">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Basics</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Give your competition a name and date.</p>
                </div>
                <Field label="Project name" required>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Riga Spring Festival 2025"
                    className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
                  />
                </Field>
                <Field label="Short description">
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Two lines that explain what this competition is about."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm resize-none"
                  />
                </Field>
                <Field label="Competition date" required>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Choose a tier</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Pick the plan that fits this competition's scale.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {TIERS.map((t) => {
                    const Icon = t.icon;
                    const sel = tier === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTier(t.id)}
                        className={`relative text-left p-5 rounded-xl border transition-all ${
                          sel
                            ? "border-brand bg-brand-soft/40 shadow-sm"
                            : "border-hairline hover:border-brand/40 bg-surface"
                        }`}
                      >
                        {"popular" in t && t.popular && (
                          <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand text-brand-foreground">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <div className={`size-9 rounded-lg grid place-items-center ${sel ? "bg-brand text-brand-foreground" : "bg-surface-2 text-foreground"}`}>
                            <Icon className="size-4" />
                          </div>
                          <span className={`size-5 rounded-full border ${sel ? "bg-brand border-brand" : "border-hairline"} grid place-items-center`}>
                            {sel && <Check className="size-3 text-brand-foreground" />}
                          </span>
                        </div>
                        <div className="mt-3 text-base font-semibold">{t.id}</div>
                        <div className="text-sm text-muted-foreground">{t.price}</div>
                        <ul className="mt-3 space-y-1 text-xs text-foreground/80">
                          <li>· {t.judges}</li>
                          <li>· {t.criteria}</li>
                          <li>· {t.branding}</li>
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 max-w-xl">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Initial groups</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Pre-create the categories you'll use. You can edit these later from the Lineup page.
                  </p>
                </div>
                <div className="space-y-2">
                  {groups.map((g, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={g}
                        onChange={(e) =>
                          setGroups(groups.map((x, idx) => (idx === i ? e.target.value : x)))
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
                      />
                      <button
                        onClick={() => setGroups(groups.filter((_, idx) => idx !== i))}
                        className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-danger rounded-lg hover:bg-danger-soft"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setGroups([...groups, ""])}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    + Add group
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">Or skip this step and add groups later.</div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 max-w-lg">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Invite the organizer</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    They'll receive an email with access to this project.
                  </p>
                </div>
                <Field label="Organizer email">
                  <input
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="anna.berzina@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-hairline bg-surface text-sm focus:border-brand outline-none"
                  />
                </Field>
                <div className="text-xs text-muted-foreground">You can skip and invite later from the Team page.</div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-5 border-t border-hairline flex items-center justify-between">
              <button
                onClick={() => (step === 0 ? navigate({ to: "/projects" }) : setStep(step - 1))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> {step === 0 ? "Cancel" : "Back"}
              </button>
              <button
                onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : setDone(true))}
                disabled={step === 0 && !name}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step < STEPS.length - 1 ? "Continue" : "Create project"} <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-foreground/80">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
