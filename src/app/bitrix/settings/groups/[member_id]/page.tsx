import Link from "next/link";
import { fetchTenant } from "@/lib/tenant-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BitrixSubscriptionGroupsPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-4">
      <nav className="flex flex-wrap gap-3 text-sm text-blue-600">
        <Link href={`/bitrix/dashboard/${encodeURIComponent(member_id)}`}>
          Dashboard
        </Link>
        <Link
          href={`/bitrix/settings/${encodeURIComponent(member_id)}/credentials`}
        >
          Credenciais D4Sign
        </Link>
      </nav>
      <h1 className="text-xl font-medium">Grupos de assinatura</h1>
      <p className="text-sm text-gray-600">
        No Laravel original esta tela é grande (SubscriptionGroups.vue). Use a aba
        Bridge legado em Configurações ou evolua esta página depois. O endpoint{" "}
        <code className="text-xs bg-gray-100 px-1 rounded">
          POST /bitrix/save-settings/{tenant.id}
        </code>{" "}
        no backend notifica o Prismatic quando configurado.
      </p>
    </div>
  );
}
