import { NextRequest, NextResponse } from "next/server";
import { getWebOrigin } from "@/lib/env";
import { withNgrokSkipWarning } from "@/lib/ngrok-headers";

export async function middleware(request: NextRequest) {
  if (
    request.method === "POST" &&
    request.nextUrl.pathname === "/bitrix/login"
  ) {
    const origin = getWebOrigin(request);
    const url = new URL(request.nextUrl.pathname, origin);

    const ct = request.headers.get("content-type") ?? "";
    if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const fd = await request.formData();
      fd.forEach((value, key) => {
        if (typeof value === "string" && value) {
          url.searchParams.set(key, value);
        }
      });
    } else if (ct.includes("application/json")) {
      try {
        const body = (await request.json()) as Record<string, unknown>;
        for (const [k, v] of Object.entries(body)) {
          if (v != null) url.searchParams.set(k, String(v));
        }
      } catch {
        /* ignore */
      }
    }

    request.nextUrl.searchParams.forEach((v, k) => {
      if (v) url.searchParams.set(k, v);
    });

    return withNgrokSkipWarning(NextResponse.redirect(url, 303));
  }

  return withNgrokSkipWarning(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
