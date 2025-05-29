import { fn } from "@storybook/test";
// Import from our intermediate file, not directly from the aliased module
import * as actualElectricSqlReact from "./actual-electric-sql-react";

// Re-export all actual exports (from the intermediate file)
export * from "./actual-electric-sql-react";

// Mock useShape, now referencing the correctly imported actual function
export const useShape = fn(actualElectricSqlReact.useShape).mockName("useShape (mocked)");
