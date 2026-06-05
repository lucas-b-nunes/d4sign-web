const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const INTERNAL_API_BASE =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ?? PUBLIC_API_BASE;

/** Proxy same-origin no Next.js — evita CORS no iframe Bitrix e ngrok desatualizado. */
const BROWSER_API_PROXY = "/api/backend";

export function getApiBase(): string {
  const isServer = typeof window === "undefined";

  if (isServer) {
    if (!INTERNAL_API_BASE && !PUBLIC_API_BASE) {
      throw new Error("NEXT_PUBLIC_API_URL não está definido");
    }
    return INTERNAL_API_BASE ?? PUBLIC_API_BASE!;
  }

  return BROWSER_API_PROXY;
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
