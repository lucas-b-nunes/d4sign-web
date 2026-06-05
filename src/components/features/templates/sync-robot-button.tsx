"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { formatMessage } from "@/lib/i18n/messages";
import { apiUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function SyncRobotButton({ memberId }: { memberId: string }) {
  const { t } = useI18n();
  const tp = t.templates;
  const [loading, setLoading] = useState(false);

  async function sync() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/bitrix/sync-robot?memberId=${encodeURIComponent(memberId)}`),
        { method: "POST" },
      );
      const data = (await res.json()) as { ok?: boolean; syncedTemplates?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? tp.syncError);
      toast.success(formatMessage(tp.syncOk, { count: data.syncedTemplates ?? 0 }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : tp.syncError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="accent"
      size="sm"
      disabled={loading}
      onClick={() => void sync()}
      className="shrink-0 gap-2"
    >
      <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
      {loading ? tp.syncing : tp.syncRobot}
    </Button>
  );
}
