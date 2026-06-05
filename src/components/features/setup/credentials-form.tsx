"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n/provider";
import { apiUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";

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
  const [showCryptKey, setShowCryptKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          apiUrl(`/api/settings/d4sign?member_id=${encodeURIComponent(memberId)}`),
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          tokenApi?: string | null;
          cryptKey?: string | null;
        };
        if (cancelled) return;
        if (data.tokenApi) setTokenApi(data.tokenApi);
        if (data.cryptKey) setCryptKey(data.cryptKey);
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [memberId]);

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
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={tokenApi}
            onChange={(e) => setTokenApi(e.target.value)}
            placeholder="tokenAPI"
            disabled={loadingData}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cryptKey">{c.cryptLabel}</Label>
          <div className="relative">
            <Input
              id="cryptKey"
              type={showCryptKey ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              value={cryptKey}
              onChange={(e) => setCryptKey(e.target.value)}
              placeholder={initialConfigured && !cryptKey ? "••••••••" : ""}
              disabled={loadingData}
              className={cn("pr-10 font-mono text-sm", !showCryptKey && cryptKey && "tracking-widest")}
            />
            <button
              type="button"
              onClick={() => setShowCryptKey((v) => !v)}
              disabled={loadingData || !cryptKey}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
              aria-label={showCryptKey ? c.hideSecret : c.showSecret}
            >
              {showCryptKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => void testConnection()}
            disabled={loading || loadingData || !tokenApi.trim()}
          >
            {t.testConnection}
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={() => void save()}
            disabled={loading || loadingData || !tokenApi.trim()}
          >
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
