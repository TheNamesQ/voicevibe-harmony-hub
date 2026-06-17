import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { role } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: role === "superadmin" ? "/projects" : "/dashboard", replace: true });
  }, [role, navigate]);
  return (
    <div className="grid place-items-center h-[60vh] text-sm text-muted-foreground">Loading…</div>
  );
}
