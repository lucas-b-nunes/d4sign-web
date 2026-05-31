"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-client";

type Safe = {
  uuid_safe: string;
  "name-safe": string;
};

export function SafeSelectorForm({
  memberId,
  initialSafeUuid,
  safes,
}: {
  memberId: string;
  initialSafeUuid: string | null;
  safes: Safe[];
}) {
  const [selected, setSelected] = useState(initialSafeUuid ?? "");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!selected) {
      toast.error("Selecione um cofre");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/d4sign/safes/default?memberId=${encodeURIComponent(memberId)}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ safeUuid: selected }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success("Cofre padrão salvo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cofre padrão</CardTitle>
        <CardDescription>
          Selecione o cofre D4Sign onde os documentos gerados serão armazenados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-w-lg">
        {safes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum cofre encontrado. Verifique as credenciais D4Sign.
          </p>
        ) : (
          <div className="space-y-2">
            <label htmlFor="safe-select" className="text-sm font-medium">
              Cofre
            </label>
            <select
              id="safe-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">— selecione —</option>
              {safes.map((s) => (
                <option key={s.uuid_safe} value={s.uuid_safe}>
                  {s["name-safe"]} ({s.uuid_safe.slice(0, 8)}…)
                </option>
              ))}
            </select>
          </div>
        )}
        <Button
          type="button"
          variant="accent"
          onClick={() => void save()}
          disabled={loading || safes.length === 0}
        >
          Salvar cofre
        </Button>
      </CardContent>
    </Card>
  );
}
