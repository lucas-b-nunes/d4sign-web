import { AppShell } from "@/components/layout/app-shell";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { ConnectionContent } from "@/components/features/setup/connection-content";
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
      page="connection"
      breadcrumbKeys={["settings", "connection"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />
      <ConnectionContent
        domain={tenant.domain}
        memberId={tenant.memberId}
        status={tenant.status}
      />
    </AppShell>
  );
}
