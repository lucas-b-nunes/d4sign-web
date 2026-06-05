import type { Locale } from "./messages";
import { normalizeDocStatusLabel } from "@/lib/document-status";

export function localeToIntl(locale: Locale): string {
  return locale === "en" ? "en-US" : "pt-BR";
}

/** Traduz status vindos da API/D4Sign para exibição na UI. */
export function translateDocStatus(
  status: string | null | undefined,
  labels: Record<string, string>,
): string {
  if (!status) return "—";
  const canonical = normalizeDocStatusLabel(status);
  return labels[canonical] ?? labels[status] ?? canonical;
}

export type { DocumentStatusCategory } from "@/lib/document-status";
export {
  categorizeDocumentStatus,
  isWaitingSignature,
  isSignedDocument,
  badgeColorForCategory,
  normalizeDocStatusLabel,
} from "@/lib/document-status";
