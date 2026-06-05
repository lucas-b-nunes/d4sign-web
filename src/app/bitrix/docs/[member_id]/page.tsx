import { AppShell } from "@/components/layout/app-shell";
import { DocumentationContent } from "@/components/features/docs/documentation-content";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DocumentationPage({
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
      page="docs"
      breadcrumbKeys={["docs"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <DocumentationContent />
    </AppShell>
  );
}
