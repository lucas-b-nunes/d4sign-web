import { NextRequest, NextResponse } from "next/server";
import { getRequestFields } from "@/lib/bitrix/install-params";
import { bitrixLoginRedirectUrl } from "@/lib/bitrix/redirect-query";
import { getWebOrigin } from "@/lib/env";
import { withNgrokSkipWarning } from "@/lib/ngrok-headers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const fields = await getRequestFields(req);
  return withNgrokSkipWarning(
    NextResponse.redirect(
      bitrixLoginRedirectUrl(getWebOrigin(req), fields),
      302,
    ),
  );
}

export async function POST(req: NextRequest) {
  const fields = await getRequestFields(req);
  return withNgrokSkipWarning(
    NextResponse.redirect(
      bitrixLoginRedirectUrl(getWebOrigin(req), fields),
      303,
    ),
  );
}
