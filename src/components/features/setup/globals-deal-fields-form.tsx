"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-client";
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
        throw new Error(data.error ?? "Erro ao salvar");
      }
      toast.success("Parâmetros globais salvos");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  if (dealFields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campos do Deal Bitrix</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Não foi possível carregar os campos do Deal. Verifique a conexão com o Bitrix.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retorno D4Sign no Deal</CardTitle>
        <CardDescription>
          Escolha quais campos do Deal receberão o status e o PDF assinado do documento D4Sign.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-w-lg">
        <SearchableDealFieldSelect
          id="status-document-field"
          label="Status Documento D4Sign"
          hint="Campo do Deal onde o status do documento será gravado (ex.: Aguardando assinatura, Finalizado)."
          value={statusField}
          onChange={setStatusField}
          fields={dealFields}
        />

        <SearchableDealFieldSelect
          id="attach-document-field"
          label="Anexo Documento D4Sign"
          hint="Campo do Deal (tipo arquivo) onde o PDF assinado será anexado após a conclusão."
          value={attachField}
          onChange={setAttachField}
          fields={attachOptions}
          placeholder="Buscar campo de arquivo…"
        />

        <Button type="button" variant="accent" onClick={() => void save()} disabled={loading}>
          Salvar parâmetros
        </Button>
      </CardContent>
    </Card>
  );
}
