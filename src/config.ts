export const config = {
  // Electric SQL configuration
  electricUrl: import.meta.env.VITE_ELECTRIC_URL || "http://localhost:5133/v1/shape",

  // PostgREST configuration
  postgrestUrl: import.meta.env.VITE_POSTGREST_URL || "http://localhost:4000",
} as const;
