import { AppShell } from "@/components/layout/app-shell";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant } from "@/lib/tenant-api";
import { getApiBase } from "@/lib/api-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GlobalsPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  const apiBase = getApiBase();

  return (
    <AppShell
      memberId={member_id}
      title="Parâmetros globais"
      breadcrumbs={["Configurações", "Globais"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <Card>
        <CardHeader>
          <CardTitle>Assinatura e pastas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Cofre padrão: {tenant.defaultSafeUuid ?? "—"}</p>
          <p>
            Webhook público:{" "}
            <code className="rounded bg-muted px-1 text-xs">
              {apiBase}/api/webhooks/d4sign
            </code>
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
