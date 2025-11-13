import { JazzReactProvider } from "jazz-tools/react";
import { CarpoolAccount } from "~/jazzSchema";
import { JazzInspector } from "jazz-tools/inspector";

// const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

export function JazzWrapper({ children }: { children: React.ReactNode }) {
  return (
    <JazzReactProvider
      sync={{
        peer: `wss://cloud.jazz.tools/?key=${"yY29femJuMWJZRHV3cU1EWUFCMlk4aHZlcVp4Z3N2fGNvX3pkelVnb3VnWktEVXpSREJoc3lna0tIaEV4N3xjb196aTZCMkhzZUQ3d1h2RFJMVWNKaHkzR1NBdGI"}`,
      }}
      AccountSchema={CarpoolAccount}
    >
      {children}

      <JazzInspector />
    </JazzReactProvider>
  );
}
