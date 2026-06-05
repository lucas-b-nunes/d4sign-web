"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { Bx24Provider } from "@/lib/bx24/provider";
import { I18nProvider } from "@/lib/i18n/provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <Bx24Provider>
            {children}
            <Toaster position="top-right" richColors />
          </Bx24Provider>
        </I18nProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
