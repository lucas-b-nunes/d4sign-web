"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api-client";

type SettingPayload = {
  fields: string | null;
  groups: string | null;
  dealSettings: string | null;
  verifySettings: string | null;
  contactSettings: string | null;
};

type InstancePayload = {
  urlEnviarDocumento: string | null;
  urlEnviarDocumentoEnvelope: string | null;
  urlCancelarDocumento: string | null;
  urlUpdateSubscriptionGroups: string | null;
};

export function LegacyBridgeForm({
  domainId,
  memberId,
  settings,
  instance,
}: {
  domainId: string;
  memberId: string;
  settings: SettingPayload | null;
  instance: InstancePayload | null;
}) {
  const initial = useMemo(
    () => ({
      groups: settings?.groups ?? "[]",
      verify_settings: settings?.verifySettings ?? "{}",
      deal_settings: settings?.dealSettings ?? "{}",
      fields: settings?.fields ?? '{"tokens":[]}',
      contact_settings: settings?.contactSettings ?? "{}",
    }),
    [settings],
  );

  const [jsonState, setJsonState] = useState(initial);
  const [urls, setUrls] = useState({
    url_enviar_documento: instance?.urlEnviarDocumento ?? "",
    url_enviar_documento_envelope: instance?.urlEnviarDocumentoEnvelope ?? "",
    url_cancelar_documento: instance?.urlCancelarDocumento ?? "",
    url_update_subscription_groups: instance?.urlUpdateSubscriptionGroups ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/bitrix/save-settings/${domainId}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jsonState,
          url_enviar_documento: urls.url_enviar_documento || undefined,
          url_enviar_documento_envelope: urls.url_enviar_documento_envelope || undefined,
          url_cancelar_documento: urls.url_cancelar_documento || undefined,
          url_update_subscription_groups:
            urls.url_update_subscription_groups || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Configurações salvas");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>URLs Prismatic</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 max-w-2xl">
          {(
            [
              ["url_enviar_documento", "Enviar documento"],
              ["url_enviar_documento_envelope", "Enviar envelope"],
              ["url_cancelar_documento", "Cancelar"],
              ["url_update_subscription_groups", "Grupos"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Input
                value={urls[key]}
                onChange={(e) =>
                  setUrls((u) => ({ ...u, [key]: e.target.value }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>JSON settings (legado)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            Object.keys(jsonState) as Array<keyof typeof jsonState>
          ).map((key) => (
            <textarea
              key={key}
              className="w-full min-h-[80px] rounded-lg border border-border p-2 font-mono text-xs"
              value={jsonState[key]}
              onChange={(e) =>
                setJsonState((s) => ({ ...s, [key]: e.target.value }))
              }
            />
          ))}
          <Button type="button" onClick={() => void save()} disabled={loading}>
            Salvar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
