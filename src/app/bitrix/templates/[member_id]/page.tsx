import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  return (
    <AppShell
      memberId={member_id}
      title="Templates"
      breadcrumbs={["Operação", "Templates"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <Card>
        <CardHeader>
          <CardTitle>Templates Word (D4Sign)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Fluxo planejado:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Listar templates via API D4Sign</li>
            <li>Detectar variáveis do template</li>
            <li>Mapear campos do Bitrix CRM</li>
            <li>Preview e envio para assinatura</li>
          </ol>
        </CardContent>
      </Card>
    </AppShell>
  );
}
