import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateMappingEditor } from "@/components/features/templates/template-mapping-editor";
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
    ? await Promise.all([fetchTemplates(member_id), fetchMappings(member_id), fetchDealFields(member_id)])
    : [[], [], []];

  const mappingsByTemplateId = Object.fromEntries(
    mappings.map((m) => [m.templateId, m]),
  );

  return (
    <AppShell
      memberId={member_id}
      title="Templates"
      breadcrumbs={["Operação", "Templates"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      {!tenant.d4signConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle>Templates Word (D4Sign)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure as credenciais D4Sign em Configurações → Credenciais para listar os templates.
          </CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Templates Word (D4Sign)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nenhum template encontrado na conta D4Sign. Crie templates no portal D4Sign e recarregue esta página.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              {templates.length} template(s) encontrado(s) — clique para configurar o mapeamento de campos
            </h2>
          </div>
          {templates.map((template) => (
            <TemplateMappingEditor
              key={template.id}
              memberId={member_id}
              template={template}
              saved={mappingsByTemplateId[template.id]}
              dealFields={dealFields}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
