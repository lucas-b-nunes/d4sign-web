import { AppShell } from "@/components/layout/app-shell";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PreferencesPage({
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
      title="Preferências"
      breadcrumbs={["Configurações", "Preferências"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <Card>
        <CardHeader>
          <CardTitle>Preferências por perfil</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Em breve: idioma, notificações e padrões de envio por usuário Bitrix.
        </CardContent>
      </Card>
    </AppShell>
  );
}
