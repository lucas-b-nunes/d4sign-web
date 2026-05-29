"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n/provider";
import { apiUrl } from "@/lib/api-client";

export function CredentialsForm({
  memberId,
  initialConfigured,
}: {
  memberId: string;
  initialConfigured: boolean;
}) {
  const { t } = useI18n();
  const [tokenApi, setTokenApi] = useState("");
  const [cryptKey, setCryptKey] = useState("");
  const [hmacSecret, setHmacSecret] = useState("");
  const [defaultSafeUuid, setDefaultSafeUuid] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/settings/d4sign?member_id=${encodeURIComponent(memberId)}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tokenApi,
            cryptKey: cryptKey || undefined,
            hmacSecret: hmacSecret || undefined,
            defaultSafeUuid: defaultSafeUuid || undefined,
          }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success("Credenciais salvas");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  async function testConnection() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(
          `/api/settings/d4sign/test?member_id=${encodeURIComponent(memberId)}`,
        ),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenApi, cryptKey }),
        },
      );
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) toast.success("Conexão D4Sign OK");
      else toast.error(data.message ?? "Falha na conexão");
    } catch {
      toast.error("Erro ao testar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credenciais D4Sign</CardTitle>
        <CardDescription>
          {initialConfigured
            ? "Credenciais já configuradas. Informe novamente apenas para alterar."
            : "Informe o token da API D4Sign (sandbox ou produção)."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="tokenApi">API Token *</Label>
          <Input
            id="tokenApi"
            type="password"
            autoComplete="off"
            value={tokenApi}
            onChange={(e) => setTokenApi(e.target.value)}
            placeholder="tokenAPI"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cryptKey">Crypt Key</Label>
          <Input
            id="cryptKey"
            type="password"
            value={cryptKey}
            onChange={(e) => setCryptKey(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hmac">HMAC Secret (webhooks)</Label>
          <Input
            id="hmac"
            type="password"
            value={hmacSecret}
            onChange={(e) => setHmacSecret(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="safe">Cofre padrão (UUID)</Label>
          <Input
            id="safe"
            value={defaultSafeUuid}
            onChange={(e) => setDefaultSafeUuid(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={() => void testConnection()} disabled={loading}>
            {t.testConnection}
          </Button>
          <Button type="button" variant="accent" onClick={() => void save()} disabled={loading}>
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
