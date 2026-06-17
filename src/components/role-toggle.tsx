import { useApp } from "@/lib/app-context";
import { useNavigate } from "@tanstack/react-router";

export function RoleToggle() {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  const switchTo = (r: "superadmin" | "organizer") => {
    setRole(r);
    navigate({ to: r === "superadmin" ? "/projects" : "/dashboard" });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 group">
      <div className="absolute -top-7 right-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground opacity-70">
        Demo · Role
      </div>
      <div className="flex items-center gap-1 rounded-full border border-hairline bg-surface p-1 shadow-lift">
        <button
          onClick={() => switchTo("superadmin")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            role === "superadmin"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Superadmin
        </button>
        <button
          onClick={() => switchTo("organizer")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            role === "organizer"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Organizer
        </button>
      </div>
    </div>
  );
}
