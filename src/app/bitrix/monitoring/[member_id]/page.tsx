import { AppShell } from "@/components/layout/app-shell";
import { MonitoringContent } from "@/components/features/monitoring/monitoring-content";
import { fetchTenant, fetchTenantDocuments } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MonitoringPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const [tenant, documents] = await Promise.all([
    fetchTenant(member_id),
    fetchTenantDocuments(member_id),
  ]);
  if (!tenant) notFound();

  return (
    <AppShell
      memberId={member_id}
      page="monitoring"
      breadcrumbKeys={["monitoring"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <MonitoringContent documents={documents} />
    </AppShell>
  );
}
