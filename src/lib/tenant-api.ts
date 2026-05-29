import { apiUrl } from "@/lib/api-client";

export type TenantDto = {
  id: string;
  domain: string;
  memberId: string;
  status: string;
  d4signConfigured: boolean;
  defaultSafeUuid: string | null;
  setting: {
    fields: string | null;
    groups: string | null;
    dealSettings: string | null;
    verifySettings: string | null;
    contactSettings: string | null;
  } | null;
  instance: {
    urlEnviarDocumento: string | null;
    urlEnviarDocumentoEnvelope: string | null;
    urlCancelarDocumento: string | null;
    urlUpdateSubscriptionGroups: string | null;
  } | null;
};

export async function fetchTenant(
  memberId: string,
): Promise<TenantDto | null> {
  const res = await fetch(
    apiUrl(`/api/tenants/${encodeURIComponent(memberId)}`),
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json() as Promise<TenantDto>;
}

export async function resolveMemberIdFromSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Promise<string | undefined> {
  const raw = sp.member_id;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw[0];

  const domainRaw = sp.DOMAIN ?? sp.domain;
  const domain =
    typeof domainRaw === "string"
      ? domainRaw
      : Array.isArray(domainRaw)
        ? domainRaw[0]
        : undefined;
  if (!domain) return undefined;

  const res = await fetch(
    apiUrl(`/api/tenants/by-domain?domain=${encodeURIComponent(domain)}`),
    { cache: "no-store" },
  );
  if (!res.ok) return undefined;
  const data = (await res.json()) as { memberId: string };
  return data.memberId;
}

export type DocumentDto = {
  id: string;
  uuidDoc: string;
  entityType: string;
  entityId: string;
  statusName: string | null;
  updatedAt: string;
};

export async function fetchTenantDocuments(memberId: string) {
  const res = await fetch(
    apiUrl(`/api/tenants/${encodeURIComponent(memberId)}/documents`),
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { documents: DocumentDto[] };
  return data.documents;
}
