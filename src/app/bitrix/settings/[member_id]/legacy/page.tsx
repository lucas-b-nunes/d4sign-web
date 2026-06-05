import { AppShell } from "@/components/layout/app-shell";
import { LegacyBridgeForm } from "@/components/features/setup/legacy-bridge-form";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { LegacyBridgeIntro } from "@/components/features/setup/legacy-bridge-intro";
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
      page="legacy"
      breadcrumbKeys={["settings", "legacy"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <LegacyBridgeIntro />
      <LegacyBridgeForm
        domainId={tenant.id}
        memberId={member_id}
        instance={tenant.instance}
        settings={tenant.setting}
      />
    </AppShell>
  );
}
