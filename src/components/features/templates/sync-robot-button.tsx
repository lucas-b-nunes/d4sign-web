"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api-client";

export function SyncRobotButton({ memberId }: { memberId: string }) {
  const [loading, setLoading] = useState(false);

  async function sync() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/bitrix/sync-robot?memberId=${encodeURIComponent(memberId)}`),
        { method: "POST" },
      );
      const data = (await res.json()) as { ok?: boolean; syncedTemplates?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Erro ao sincronizar");
      toast.success(
        `Robô sincronizado! ${data.syncedTemplates ?? 0} template(s) disponível(is) no select do Bitrix.`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao sincronizar robô");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={() => void sync()}
    >
      {loading ? "Sincronizando..." : "Sincronizar robô no Bitrix"}
    </Button>
  );
}
