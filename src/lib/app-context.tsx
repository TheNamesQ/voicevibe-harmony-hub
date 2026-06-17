import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { projects, type Project } from "./demo-data";

export type Role = "superadmin" | "organizer";

interface AppContextValue {
  role: Role;
  setRole: (r: Role) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeProject: Project | null;
  enterProject: (id: string) => void;
  exitProject: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const ORGANIZER_DEFAULT_PROJECT = "riga-2025";

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("superadmin");
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const r = (localStorage.getItem("vv:role") as Role | null) ?? "superadmin";
      const p = localStorage.getItem("vv:activeProject");
      setRoleState(r);
      if (r === "organizer") {
        setActiveProjectIdState(p ?? ORGANIZER_DEFAULT_PROJECT);
      } else {
        setActiveProjectIdState(p);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    try { localStorage.setItem("vv:role", r); } catch {}
    if (r === "organizer") {
      const target = activeProjectId ?? ORGANIZER_DEFAULT_PROJECT;
      setActiveProjectIdState(target);
      try { localStorage.setItem("vv:activeProject", target); } catch {}
    } else {
      setActiveProjectIdState(null);
      try { localStorage.removeItem("vv:activeProject"); } catch {}
    }
  };

  const setActiveProjectId = (id: string | null) => {
    setActiveProjectIdState(id);
    try {
      if (id) localStorage.setItem("vv:activeProject", id);
      else localStorage.removeItem("vv:activeProject");
    } catch {}
  };

  const enterProject = (id: string) => setActiveProjectId(id);
  const exitProject = () => {
    if (role === "superadmin") setActiveProjectId(null);
  };

  const activeProject = activeProjectId
    ? projects.find((p) => p.id === activeProjectId) ?? null
    : null;

  // Avoid showing pre-hydration mismatch: render children either way; UI subtly
  // adapts on hydration. (Acceptable for demo dashboard.)
  void hydrated;

  return (
    <AppContext.Provider
      value={{ role, setRole, activeProjectId, setActiveProjectId, activeProject, enterProject, exitProject }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
