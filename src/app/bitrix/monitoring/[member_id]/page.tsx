import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTenant, fetchTenantDocuments } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const statusVariant = (name: string | null | undefined) => {
  if (!name) return "muted" as const;
  if (/assinado|conclu/i.test(name)) return "success" as const;
  if (/pendente|aguard/i.test(name)) return "warning" as const;
  return "default" as const;
};

export default async function MonitoringPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  const documents = await fetchTenantDocuments(member_id);

  return (
    <AppShell
      memberId={member_id}
      title="Monitoramento"
      breadcrumbs={["Monitoramento"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <Card>
        <CardHeader>
          <CardTitle>Documentos recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum documento sincronizado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">UUID</th>
                    <th className="pb-2 pr-4">Entidade</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Atualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr key={d.id} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono text-xs">{d.uuidDoc}</td>
                      <td className="py-2 pr-4">
                        {d.entityType} #{d.entityId}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge variant={statusVariant(d.statusName)}>
                          {d.statusName ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {new Date(d.updatedAt).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
