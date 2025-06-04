import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Home,
  ssr: false,
});

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/scheduler", search: { location: 1, week: new Date().toISOString() } });
  }, [navigate]);

  return null;
}
