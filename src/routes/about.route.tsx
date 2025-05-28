import { Container } from "react-bootstrap";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { About } from "~/components/About";

export const Route = createFileRoute("/about")({
  component: About,
});

// export default Route;
