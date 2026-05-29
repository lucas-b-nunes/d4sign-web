import type { NextResponse } from "next/server";

/** Evita a página de aviso do ngrok free em iframe / Bitrix (valor arbitrário). */
export function withNgrokSkipWarning<T extends NextResponse>(response: T): T {
  response.headers.set("ngrok-skip-browser-warning", "true");
  return response;
}
