"use client";

import { createContext, useContext, useState } from "react";
import { messages, type Locale } from "./messages";

type Messages = (typeof messages)[Locale];

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt-BR");
  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: messages[locale] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n requer I18nProvider");
  return ctx;
}
