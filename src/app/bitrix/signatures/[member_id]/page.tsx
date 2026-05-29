import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignaturesPage({
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
      title="Assinaturas"
      breadcrumbs={["Operação", "Assinaturas"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <Card>
        <CardHeader>
          <CardTitle>Gestão de signatários</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Wizard de signatários, ordem de assinatura e métodos de autenticação
          (e-mail, SMS, WhatsApp) — integrado ao robô Bizproc e à API D4Sign.
        </CardContent>
      </Card>
    </AppShell>
  );
}
