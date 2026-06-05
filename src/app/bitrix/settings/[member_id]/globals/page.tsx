import { AppShell } from "@/components/layout/app-shell";
import { SettingsNav } from "@/components/features/setup/settings-nav";
import { SafeSelectorForm } from "@/components/features/setup/safe-selector-form";
import { GlobalsDealFieldsForm } from "@/components/features/setup/globals-deal-fields-form";
import { GlobalsSafeHint } from "@/components/features/setup/globals-safe-hint";
import { fetchTenant } from "@/lib/tenant-api";
import { apiUrl } from "@/lib/api-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Safe = {
  uuid_safe: string;
  "name-safe": string;
};

type DealField = {
  code: string;
  title: string;
  type: string;
};

type GlobalsSettings = {
  d4signDocumentStatusField: string | null;
  d4signDocumentAttachField: string | null;
};

async function fetchSafes(memberId: string): Promise<{
  safes: Safe[];
  currentSafeUuid: string | null;
}> {
  try {
    const res = await fetch(
      apiUrl(`/api/d4sign/safes?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return { safes: [], currentSafeUuid: null };
    return res.json() as Promise<{ safes: Safe[]; currentSafeUuid: string | null }>;
  } catch {
    return { safes: [], currentSafeUuid: null };
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

async function fetchGlobalsSettings(memberId: string): Promise<GlobalsSettings> {
  try {
    const res = await fetch(
      apiUrl(`/api/settings/globals?memberId=${encodeURIComponent(memberId)}`),
      { cache: "no-store" },
    );
    if (!res.ok) {
      return { d4signDocumentStatusField: null, d4signDocumentAttachField: null };
    }
    return res.json() as Promise<GlobalsSettings>;
  } catch {
    return { d4signDocumentStatusField: null, d4signDocumentAttachField: null };
  }
}

export default async function GlobalsPage({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  const tenant = await fetchTenant(member_id);
  if (!tenant) notFound();

  const [safesData, dealFields, globalsSettings] = await Promise.all([
    tenant.d4signConfigured
      ? fetchSafes(member_id)
      : Promise.resolve({ safes: [], currentSafeUuid: null }),
    fetchDealFields(member_id),
    fetchGlobalsSettings(member_id),
  ]);

  const { safes, currentSafeUuid } = safesData;

  return (
    <AppShell
      memberId={member_id}
      page="globals"
      breadcrumbKeys={["settings", "globals"]}
      bitrixConnected
      d4signConnected={tenant.d4signConfigured}
    >
      <SettingsNav memberId={member_id} />

      <div className="space-y-4">
        {tenant.d4signConfigured ? (
          <SafeSelectorForm
            memberId={member_id}
            initialSafeUuid={currentSafeUuid}
            safes={safes}
          />
        ) : (
          <GlobalsSafeHint />
        )}

        <GlobalsDealFieldsForm
          memberId={member_id}
          dealFields={dealFields}
          initialStatusField={globalsSettings.d4signDocumentStatusField}
          initialAttachField={globalsSettings.d4signDocumentAttachField}
        />
      </div>
    </AppShell>
  );
}
