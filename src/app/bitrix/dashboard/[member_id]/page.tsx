import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant } from "@/lib/tenant-api";
import { FileSignature, Settings, Activity } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
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
      title="Dashboard"
      breadcrumbs={["Início"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Configuração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Credenciais D4Sign e parâmetros do portal.
            </p>
            <Link
              href={`/bitrix/settings/${encodeURIComponent(member_id)}/credentials`}
              className="text-sm text-[var(--bitrix-primary-dark)] underline"
            >
              Abrir configurações
            </Link>
          </CardContent>
        </Card>
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSignature className="h-4 w-4" />
              Operação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Templates, mapeamento e envio — em breve.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Monitoramento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/bitrix/monitoring/${encodeURIComponent(member_id)}`}
              className="text-sm text-[var(--bitrix-primary-dark)] underline"
            >
              Ver documentos
            </Link>
          </CardContent>
        </Card>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Domínio: {tenant.domain} · member_id: {tenant.memberId}
      </p>
    </AppShell>
  );
}
