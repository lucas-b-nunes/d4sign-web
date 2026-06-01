import { AppShell } from "@/components/layout/app-shell";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { SafeSelectorForm } from "@/components/features/setup/safe-selector-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant } from "@/lib/tenant-api";
import { apiUrl } from "@/lib/api-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Safe = {
  uuid_safe: string;
  "name-safe": string;
};

async function fetchSafes(memberId: string): Promise<{
  safes: Safe[];
  currentSafeUuid: string | null;
}> {
  try {
    const res = await fetch(
      apiUrl(`/api/d4sign/safes?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return { safes: [], currentSafeUuid: null };
    return res.json() as Promise<{ safes: Safe[]; currentSafeUuid: string | null }>;
  } catch {
    return { safes: [], currentSafeUuid: null };
  }
}

export default async function GlobalsPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  const { safes, currentSafeUuid } = tenant.d4signConfigured
    ? await fetchSafes(member_id)
    : { safes: [], currentSafeUuid: null };

  return (
    <AppShell
      memberId={member_id}
      title="Parâmetros globais"
      breadcrumbs={["Configurações", "Globais"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />

      {tenant.d4signConfigured ? (
        <SafeSelectorForm
          memberId={member_id}
          initialSafeUuid={currentSafeUuid}
          safes={safes}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cofre padrão</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure as credenciais D4Sign primeiro para selecionar o cofre.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Webhook D4Sign</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>O webhook é configurado <strong>automaticamente</strong> em cada documento gerado pelo robô BizProc.</p>
          <p className="text-xs">Nenhuma configuração manual é necessária.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
