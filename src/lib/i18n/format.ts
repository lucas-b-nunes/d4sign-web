import type { Locale } from "./messages";

export function localeToIntl(locale: Locale): string {
  return locale === "en" ? "en-US" : "pt-BR";
}

/** Traduz status vindos da API/D4Sign para exibição na UI. */
export function translateDocStatus(
  status: string | null | undefined,
  labels: Record<string, string>,
): string {
  if (!status) return "—";
  return labels[status] ?? status;
}
