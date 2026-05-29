import { AppShell } from "@/components/layout/app-shell";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConnectionSettingsPage({
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
      title="Conexão Bitrix"
      breadcrumbs={["Configurações", "Conexão"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <Card>
        <CardHeader>
          <CardTitle>Portal Bitrix24</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <span className="text-muted-foreground">Domínio:</span>
            <span>{tenant.domain}</span>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <span className="text-muted-foreground">member_id:</span>
            <span className="font-mono text-xs">{tenant.memberId}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="success">{tenant.status}</Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            Token OAuth renovado automaticamente nos fluxos de robô e instalação.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
