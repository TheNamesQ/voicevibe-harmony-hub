import { Check, Languages } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApp, type Lang } from "@/lib/app-context";

const OPTIONS: { id: Lang; label: string; native: string; flag: string }[] = [
  { id: "en", label: "English", native: "English", flag: "🇬🇧" },
  { id: "lv", label: "Latvian", native: "Latviešu", flag: "🇱🇻" },
];

export function LanguageSwitcher({ variant = "full" }: { variant?: "full" | "icon" }) {
  const { lang, setLang } = useApp();
  const current = OPTIONS.find((o) => o.id === lang) ?? OPTIONS[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={
            variant === "icon"
              ? "size-7 grid place-items-center rounded-md border border-hairline hover:bg-surface-2 transition"
              : "inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface-2/40 hover:bg-surface-2 px-2 py-1 text-[11px] font-medium transition"
          }
          title="Change language"
        >
          {variant === "icon" ? (
            <Languages className="size-3.5 text-muted-foreground" />
          ) : (
            <>
              <span className="text-sm leading-none">{current.flag}</span>
              <span className="uppercase tracking-wider text-[10px] font-semibold">{current.id}</span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Language
        </div>
        {OPTIONS.map((o) => {
          const active = o.id === lang;
          return (
            <button
              key={o.id}
              onClick={() => setLang(o.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition ${
                active ? "bg-brand-soft text-brand font-semibold" : "hover:bg-surface-2"
              }`}
            >
              <span className="text-base leading-none">{o.flag}</span>
              <span className="flex-1 text-left">
                <span className="block text-xs font-medium leading-tight">{o.native}</span>
                <span className="block text-[10px] text-muted-foreground leading-tight">{o.label}</span>
              </span>
              {active && <Check className="size-3.5 text-brand" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
