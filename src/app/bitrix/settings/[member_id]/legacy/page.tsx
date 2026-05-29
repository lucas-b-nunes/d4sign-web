import { AppShell } from "@/components/layout/app-shell";
import { LegacyBridgeForm } from "@/components/features/setup/legacy-bridge-form";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegacyBridgePage({
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
      title="Bridge legado (Prismatic)"
      breadcrumbs={["Configurações", "Legado"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <p className="mb-4 text-sm text-muted-foreground">
        URLs de encaminhamento estilo ClickSign/Prismatic. Ativo no robô apenas se{" "}
        <code className="rounded bg-muted px-1">USE_PRISMATIC_BRIDGE=true</code>{" "}
        no backend.
      </p>
      <LegacyBridgeForm
        domainId={tenant.id}
        memberId={member_id}
        instance={tenant.instance}
        settings={tenant.setting}
      />
    </AppShell>
  );
}
