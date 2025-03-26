"use client";

import { ThemeProvider } from "@/components/theme-provider";

import type { ReactNode } from "react";

// We need to import it here because this is the first
// client component
// if (isDesktopApp()) {
//   require("@/desktop/main");
// }

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ locale, children }: ProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
