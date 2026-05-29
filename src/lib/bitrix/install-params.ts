import type { NextRequest } from "next/server";

async function collectFields(req: NextRequest): Promise<Map<string, string>> {
  const out = new Map<string, string>();

  req.nextUrl.searchParams.forEach((v, k) => {
    out.set(k, v);
  });

  const ct = req.headers.get("content-type") ?? "";

  if (req.method === "POST" || req.method === "PUT") {
    if (ct.includes("application/json")) {
      try {
        const body = (await req.json()) as Record<string, unknown>;
        for (const [k, v] of Object.entries(body)) {
          if (v != null) out.set(k, String(v));
        }
      } catch {
        /* ignore */
      }
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const fd = await req.formData();
      fd.forEach((v, k) => {
        if (typeof v === "string") out.set(k, v);
      });
    }
  }

  return out;
}

export async function getRequestFields(
  req: NextRequest,
): Promise<Map<string, string>> {
  return collectFields(req);
}
