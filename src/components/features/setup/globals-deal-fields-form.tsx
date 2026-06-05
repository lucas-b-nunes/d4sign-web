"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n/provider";
import {
  SearchableDealFieldSelect,
  type DealFieldOption,
} from "@/components/features/setup/searchable-deal-field-select";

export function GlobalsDealFieldsForm({
  memberId,
  dealFields,
  initialStatusField,
  initialAttachField,
}: {
  memberId: string;
  dealFields: DealFieldOption[];
  initialStatusField: string | null;
  initialAttachField: string | null;
}) {
  const { t } = useI18n();
  const g = t.globals;
  const [statusField, setStatusField] = useState(initialStatusField ?? "");
  const [attachField, setAttachField] = useState(initialAttachField ?? "");
  const [loading, setLoading] = useState(false);

  const fileFields = dealFields.filter((f) => f.type === "file");
  const attachOptions = fileFields.length > 0 ? fileFields : dealFields;

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/settings/globals?memberId=${encodeURIComponent(memberId)}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            d4signDocumentStatusField: statusField || null,
            d4signDocumentAttachField: attachField || null,
          }),
        },
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? g.saveError);
      }
      toast.success(g.saved);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : g.saveError);
    } finally {
      setLoading(false);
    }
  }

  if (dealFields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{g.dealFieldsError}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{g.dealFieldsLoadError}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{g.returnTitle}</CardTitle>
        <CardDescription>{g.returnDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-w-lg">
        <SearchableDealFieldSelect
          id="status-document-field"
          label={g.statusField}
          hint={g.statusHint}
          value={statusField}
          onChange={setStatusField}
          fields={dealFields}
        />

        <SearchableDealFieldSelect
          id="attach-document-field"
          label={g.attachField}
          hint={g.attachHint}
          value={attachField}
          onChange={setAttachField}
          fields={attachOptions}
          placeholder={g.attachSearch}
        />

        <Button type="button" variant="accent" onClick={() => void save()} disabled={loading}>
          {g.saveParams}
        </Button>
      </CardContent>
    </Card>
  );
}
