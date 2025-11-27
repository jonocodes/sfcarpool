import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getWeekStartStr } from "~/components/Scheduler/helpers";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/scheduler",
      search: { location: "l5PQRRCiuSah4NFM_r6Ln", week: getWeekStartStr() },
    });
  }, [navigate]);

  return null;
}
