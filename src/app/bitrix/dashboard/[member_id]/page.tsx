import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant, fetchTenantDocuments } from "@/lib/tenant-api";
import { apiUrl } from "@/lib/api-client";
import { CheckCircle2, XCircle, Clock, FileText, Settings, Activity } from "lucide-react";
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

const STATUS_COLORS: Record<string, string> = {
  "Aguardando Assinaturas": "bg-yellow-100 text-yellow-800",
  "Assinado": "bg-green-100 text-green-800",
  "Cancelado": "bg-red-100 text-red-800",
  "Finalizado": "bg-green-100 text-green-800",
  "Rascunho": "bg-gray-100 text-gray-700",
};

function statusBadge(status: string | null) {
  const label = status ?? "—";
  const cls = STATUS_COLORS[label] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function SetupItem({ ok, label, href, memberId }: { ok: boolean; label: string; href: string; memberId: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-sm hover:underline">
      {ok
        ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
        : <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </Link>
  );
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

  const recentDocs = documents.slice(0, 5);
  const totalDocs = documents.length;
  const waitingDocs = documents.filter((d) => d.statusName === "Aguardando Assinaturas").length;
  const signedDocs = documents.filter((d) =>
    d.statusName === "Assinado" || d.statusName === "Finalizado"
  ).length;

  const hasCredentials = tenant.d4signConfigured;
  const hasSafe = Boolean(tenant.defaultSafeUuid);
  const hasTemplates = mappingCount > 0;
  const setupComplete = hasCredentials && hasSafe && hasTemplates;

  return (
    <AppShell
      memberId={member_id}
      title="Dashboard"
      breadcrumbs={["Início"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <div className="space-y-6">

        {/* Setup checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Status da configuração
              {setupComplete && (
                <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Pronto para uso
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SetupItem
              ok={hasCredentials}
              label={hasCredentials ? "Credenciais D4Sign configuradas" : "Credenciais D4Sign não configuradas"}
              href={`/bitrix/settings/${encodeURIComponent(member_id)}/credentials`}
              memberId={member_id}
            />
            <SetupItem
              ok={hasSafe}
              label={hasSafe ? `Cofre padrão selecionado` : "Cofre padrão não selecionado"}
              href={`/bitrix/settings/${encodeURIComponent(member_id)}/globals`}
              memberId={member_id}
            />
            <SetupItem
              ok={hasTemplates}
              label={hasTemplates ? `${mappingCount} template(s) mapeado(s)` : "Nenhum template mapeado"}
              href={`/bitrix/templates/${encodeURIComponent(member_id)}`}
              memberId={member_id}
            />
          </CardContent>
        </Card>

        {/* Contadores */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-3xl font-bold">{totalDocs}</p>
              <p className="text-xs text-muted-foreground mt-1">Total de documentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-3xl font-bold text-yellow-600">{waitingDocs}</p>
              <p className="text-xs text-muted-foreground mt-1">Aguardando assinatura</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-3xl font-bold text-green-600">{signedDocs}</p>
              <p className="text-xs text-muted-foreground mt-1">Assinados</p>
            </CardContent>
          </Card>
        </div>

        {/* Últimos documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Últimos documentos
              </span>
              <Link
                href={`/bitrix/monitoring/${encodeURIComponent(member_id)}`}
                className="text-xs text-[var(--bitrix-primary-dark)] underline font-normal"
              >
                Ver todos
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Nenhum documento enviado ainda.</p>
                {!setupComplete && (
                  <p className="text-xs text-muted-foreground">Complete a configuração acima para começar.</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-2.5 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        {doc.entityType} #{doc.entityId}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.uuidDoc.slice(0, 18)}…
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {statusBadge(doc.statusName)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
