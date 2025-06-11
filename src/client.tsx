/// <reference types="vinxi/types/client" />
import { createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { createRouter } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createRouter();
const queryClient = new QueryClient();

const root = document.getElementById("root") || document.body;
createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <StartClient router={router} />
  </QueryClientProvider>
);
