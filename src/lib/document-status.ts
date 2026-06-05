/** Categorias de status para contadores e badges do painel. */
export type DocumentStatusCategory = "waiting" | "signed" | "canceled" | "other";

const CANONICAL_STATUS_LABELS: Record<string, string> = {
  "Finished document": "Finalizado",
  "Cancelled document": "Cancelado",
  "Canceled document": "Cancelado",
  Signed: "Assinado",
  "E-mail not sent": "E-mail não entregue",
  "Waiting for Signatures": "Aguardando Assinaturas",
  "Waiting for signatures": "Aguardando Assinaturas",
};

/** Normaliza rótulos vindos do webhook D4Sign (inglês) para exibição consistente. */
export function normalizeDocStatusLabel(status: string | null | undefined): string {
  if (!status?.trim()) return "—";
  const trimmed = status.trim();
  return CANONICAL_STATUS_LABELS[trimmed] ?? trimmed;
}

function parsePartialSignedStatus(
  status: string,
): { signed: number; total: number } | null {
  const match = status.trim().match(/^Assinado\s*\((\d+)\/(\d+)\)$/i);
  if (!match) return null;

  const signed = Number.parseInt(match[1], 10);
  const total = Number.parseInt(match[2], 10);
  if (!Number.isFinite(signed) || !Number.isFinite(total) || total < 1) return null;

  return { signed, total };
}

export function categorizeDocumentStatus(
  statusName: string | null | undefined,
  statusId?: number | null,
): DocumentStatusCategory {
  if (statusId === 6) return "canceled";
  if (statusId === 4) return "signed";

  const normalized = normalizeDocStatusLabel(statusName);
  const s = normalized.toLowerCase();

  if (parsePartialSignedStatus(normalized)) return "waiting";

  if (/cancel/i.test(s)) return "canceled";
  if (/finaliz|finished|conclu|complet/i.test(s)) return "signed";
  if (s === "assinado" || s === "signed") return "waiting";
  if (/aguard|wait|pendente|pending|process|e-mail não entregue|email not sent/i.test(s)) {
    return "waiting";
  }
  if (statusId === 1 || statusId === 2 || statusId === 3) return "waiting";

  return "other";
}

export function isWaitingSignature(
  statusName: string | null | undefined,
  statusId?: number | null,
): boolean {
  return categorizeDocumentStatus(statusName, statusId) === "waiting";
}

export function isSignedDocument(
  statusName: string | null | undefined,
  statusId?: number | null,
): boolean {
  return categorizeDocumentStatus(statusName, statusId) === "signed";
}

export function badgeColorForCategory(category: DocumentStatusCategory): string {
  switch (category) {
    case "waiting":
      return "bg-yellow-100 text-yellow-800";
    case "signed":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
