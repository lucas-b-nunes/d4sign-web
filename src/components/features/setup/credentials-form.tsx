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
  const c = t.credentials;
  const [tokenApi, setTokenApi] = useState("");
  const [cryptKey, setCryptKey] = useState("");
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
          }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success(c.saved);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : c.saveError);
    } finally {
      setLoading(false);
    }
  }

  async function testConnection() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/settings/d4sign/test?member_id=${encodeURIComponent(memberId)}`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenApi, cryptKey }),
        },
      );
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) toast.success(c.connectionOk);
      else toast.error(data.message ?? c.connectionFail);
    } catch {
      toast.error(c.testError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{c.title}</CardTitle>
        <CardDescription>
          {initialConfigured ? c.configured : c.notConfigured}{" "}
          {c.afterSave} <strong>{t.settingsNav.globals}</strong> {c.afterSaveSuffix}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="tokenApi">{c.tokenLabel}</Label>
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
          <Label htmlFor="cryptKey">{c.cryptLabel}</Label>
          <Input
            id="cryptKey"
            type="password"
            value={cryptKey}
            onChange={(e) => setCryptKey(e.target.value)}
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
