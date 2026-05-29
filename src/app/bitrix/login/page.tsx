import { redirect } from "next/navigation";
import { resolveMemberIdFromSearchParams } from "@/lib/tenant-api";

export const dynamic = "force-dynamic";

export default async function BitrixLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const memberId = await resolveMemberIdFromSearchParams(sp);

  if (!memberId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-muted-foreground">
          Vendors — instale o aplicativo primeiro.
        </p>
      </div>
    );
  }

  redirect(`/bitrix/dashboard/${encodeURIComponent(memberId)}`);
}
