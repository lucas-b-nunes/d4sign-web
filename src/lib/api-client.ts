const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export function getApiBase(): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL não está definido");
  }
  return API_BASE;
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
