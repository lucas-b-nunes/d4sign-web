import { AppShell } from "@/components/layout/app-shell";
import { TemplatesPageContent } from "@/components/features/templates/templates-page-content";
import { fetchTenant } from "@/lib/tenant-api";
import { apiUrl } from "@/lib/api-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type D4SignTemplate = {
  id: string;
  name: string;
  type: string;
  variables: string[] | Record<string, string[]>;
};

type SavedMapping = {
  templateId: string;
  templateName: string;
  documentName?: string | null;
  signersEmails?: string[];
  mappings: Record<string, string>;
};

type DealField = {
  code: string;
  title: string;
  type: string;
};

async function fetchTemplates(memberId: string): Promise<D4SignTemplate[]> {
  try {
    const res = await fetch(
      apiUrl(`/api/d4sign/templates?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { templates: D4SignTemplate[] };
    return data.templates ?? [];
  } catch {
    return [];
  }
}

async function fetchMappings(memberId: string): Promise<SavedMapping[]> {
  try {
    const res = await fetch(
      apiUrl(`/api/d4sign/template-mappings?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { mappings: SavedMapping[] };
    return data.mappings ?? [];
  } catch {
    return [];
  }
}

async function fetchDealFields(memberId: string): Promise<DealField[]> {
  try {
    const res = await fetch(
      apiUrl(`/api/bitrix/deal-fields?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { fields: DealField[] };
    return data.fields ?? [];
  } catch {
    return [];
  }
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  const [templates, mappings, dealFields] = tenant.d4signConfigured
    ? await Promise.all([
        fetchTemplates(member_id),
        fetchMappings(member_id),
        fetchDealFields(member_id),
      ])
    : [[], [], []];

  const mappingsByTemplateId = Object.fromEntries(
    mappings.map((m) => [m.templateId, m]),
  );

  return (
    <AppShell
      memberId={member_id}
      page="templates"
      breadcrumbKeys={["operation", "templates"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <TemplatesPageContent
        memberId={member_id}
        d4signConfigured={tenant.d4signConfigured}
        templates={templates}
        mappingsByTemplateId={mappingsByTemplateId}
        dealFields={dealFields}
      />
    </AppShell>
  );
}
