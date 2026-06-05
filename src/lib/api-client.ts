const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const INTERNAL_API_BASE =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ?? PUBLIC_API_BASE;

export function getApiBase(): string {
  if (!PUBLIC_API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL não está definido");
  }
  // SSR: preferir URL interna (localhost) para evitar round-trip via ngrok
  const isServer = typeof window === "undefined";
  const base = isServer && INTERNAL_API_BASE ? INTERNAL_API_BASE : PUBLIC_API_BASE;
  if (!base) {
    throw new Error("URL da API não configurada");
  }
  return base;
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(apiUrl(path), init);
}
