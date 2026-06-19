import { useState } from "react";
import { Check, Sparkles, Zap, Crown, Gem, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp, type Tier } from "@/lib/app-context";

type TierDef = {
  id: Tier;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
};

const TIERS: TierDef[] = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    cadence: "forever",
    tagline: "Trial a single event end-to-end.",
    icon: Sparkles,
    features: [
      "Up to 25 participants",
      "1 group",
      "2 judges",
      "3 scoring criteria",
      "Community support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "€49",
    cadence: "per event",
    tagline: "Right-sized for local competitions.",
    icon: Zap,
    features: [
      "Up to 100 participants",
      "Up to 5 groups",
      "5 judges",
      "5 scoring criteria",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "€99",
    cadence: "per event",
    tagline: "Most chosen — built for serious organizers.",
    icon: Crown,
    features: [
      "Up to 400 participants",
      "Up to 20 groups",
      "12 judges",
      "10 scoring criteria",
      "Live ranking & vote log",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "from €199",
    cadence: "per event",
    tagline: "For festivals & multi-day championships.",
    icon: Gem,
    features: [
      "Unlimited participants",
      "Unlimited groups",
      "Unlimited judges",
      "Custom scoring criteria",
      "White-label branding",
      "Dedicated success manager",
    ],
  },
];

const TIER_META: Record<Tier, { label: string; dot: string; chip: string }> = {
  free:    { label: "Free",    dot: "bg-muted-foreground", chip: "text-muted-foreground bg-surface-2 border-hairline" },
  basic:   { label: "Basic",   dot: "bg-sky-500",          chip: "text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20" },
  pro:     { label: "Pro",     dot: "bg-brand",            chip: "text-brand bg-brand-soft border-brand/20" },
  premium: { label: "Premium", dot: "bg-amber-500",        chip: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30" },
};

export function TierBadge({ compact = false }: { compact?: boolean }) {
  const { tier, setTier } = useApp();
  const [open, setOpen] = useState(false);
  const meta = TIER_META[tier];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-1.5 rounded-md border ${meta.chip} px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition hover:brightness-110`}
        title="View plans"
      >
        <span className={`size-1.5 rounded-full ${meta.dot}`} />
        {compact ? meta.label : <>Plan · {meta.label}</>}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-hairline bg-background p-0 overflow-hidden">
          <div className="px-7 pt-7 pb-4 border-b border-hairline">
            <DialogHeader>
              <DialogTitle className="text-xl tracking-tight">Choose your plan</DialogTitle>
              <DialogDescription>
                Pricing scales with event size. Upgrade or downgrade between events at any time.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
            {TIERS.map((t) => {
              const Icon = t.icon;
              const active = t.id === tier;
              const recommended = t.id === "pro";
              return (
                <div
                  key={t.id}
                  className={`relative flex flex-col bg-background p-5 ${active ? "ring-2 ring-inset ring-brand" : ""}`}
                >
                  {recommended && !active && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest text-brand bg-brand-soft px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                  {active && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest text-brand-foreground bg-brand px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`size-8 rounded-lg grid place-items-center ${TIER_META[t.id].chip} border`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="text-sm font-semibold">{t.name}</div>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-bold tracking-tight">{t.price}</span>
                    <span className="text-[11px] text-muted-foreground">{t.cadence}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 min-h-[2.5rem]">{t.tagline}</p>

                  <ul className="space-y-2 mb-5 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs">
                        <Check className="size-3.5 mt-0.5 text-brand shrink-0" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => { setTier(t.id); setOpen(false); }}
                    disabled={active}
                    className={`w-full inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-surface-2 text-muted-foreground cursor-default"
                        : recommended
                          ? "bg-brand text-brand-foreground hover:bg-brand-dark"
                          : "border border-hairline hover:bg-surface-2"
                    }`}
                  >
                    {active ? "Current plan" : <>Switch to {t.name} <ArrowRight className="size-3" /></>}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="px-7 py-3 border-t border-hairline bg-surface-2/40 text-[11px] text-muted-foreground">
            Need a multi-event package or custom invoicing? Contact sales — billing@voicevibe.app
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
