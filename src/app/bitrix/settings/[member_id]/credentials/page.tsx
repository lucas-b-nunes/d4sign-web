import { AppShell } from "@/components/layout/app-shell";
import { CredentialsForm } from "@/components/features/setup/credentials-form";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { fetchD4SignSettings, fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CredentialsSettingsPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const [tenant, settings] = await Promise.all([
    fetchTenant(member_id),
    fetchD4SignSettings(member_id),
  ]);
  if (!tenant) notFound();

  return (
    <AppShell
      memberId={member_id}
      page="credentials"
      breadcrumbKeys={["settings", "credentials"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <CredentialsForm
        memberId={member_id}
        initialConfigured={tenant.d4signConfigured}
        initialTokenApi={settings?.tokenApi ?? ""}
        initialCryptKey={settings?.cryptKey ?? ""}
      />
    </AppShell>
  );
}
