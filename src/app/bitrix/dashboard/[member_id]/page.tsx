import { AppShell } from "@/components/layout/app-shell";
import { DashboardContent } from "@/components/features/dashboard/dashboard-content";
import { fetchTenant, fetchTenantDocuments } from "@/lib/tenant-api";
import { apiUrl } from "@/lib/api-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function fetchTemplateMappingCount(memberId: string): Promise<number> {
  try {
    const res = await fetch(
      apiUrl(`/api/d4sign/template-mappings?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return 0;
    const data = (await res.json()) as { mappings: unknown[] };
    return data.mappings?.length ?? 0;
  } catch {
    return 0;
  }
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const [tenant, documents, mappingCount] = await Promise.all([
    fetchTenant(member_id),
    fetchTenantDocuments(member_id),
    fetchTemplateMappingCount(member_id),
  ]);
  if (!tenant) notFound();

  return (
    <AppShell
      memberId={member_id}
      page="dashboard"
      breadcrumbKeys={["home"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <DashboardContent
        memberId={member_id}
        documents={documents}
        mappingCount={mappingCount}
        hasCredentials={tenant.d4signConfigured}
        hasSafe={Boolean(tenant.defaultSafeUuid)}
        hasTemplates={mappingCount > 0}
      />
    </AppShell>
  );
}
