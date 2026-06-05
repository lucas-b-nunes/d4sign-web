"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
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
  const { t } = useI18n();
  const s = t.safe;
  const [selected, setSelected] = useState(initialSafeUuid ?? "");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!selected) {
      toast.error(s.selectRequired);
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
      toast.success(s.saved);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : s.saveError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{s.title}</CardTitle>
        <CardDescription>{s.desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-w-lg">
        {safes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{s.empty}</p>
        ) : (
          <div className="space-y-2">
            <label htmlFor="safe-select" className="text-sm font-medium">
              {s.label}
            </label>
            <select
              id="safe-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{s.select}</option>
              {safes.map((safe) => (
                <option key={safe.uuid_safe} value={safe.uuid_safe}>
                  {safe["name-safe"]} ({safe.uuid_safe.slice(0, 8)}…)
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
          {s.save}
        </Button>
      </CardContent>
    </Card>
  );
}
