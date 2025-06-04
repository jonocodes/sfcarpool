import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DateTime } from "luxon";

export const Route = createFileRoute("/")({
  component: Home,
  ssr: false,
});

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/scheduler", search: { location: 1, week: DateTime.now().toISODate() } });
  }, [navigate]);

  return null;
}
