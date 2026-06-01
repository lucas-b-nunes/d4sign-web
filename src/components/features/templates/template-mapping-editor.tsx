"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-client";

type D4SignTemplate = {
  id: string;
  name: string;
  type: string;
  variables: string[] | Record<string, string[]>;
};

type SavedMapping = {
  templateId: string;
  templateName: string;
  mappings: Record<string, string>;
};

type DealField = {
  code: string;
  title: string;
  type: string;
};

/** Extrai lista plana de variáveis do template (tanto HTML quanto Word) */
function extractVariables(variables: D4SignTemplate["variables"]): string[] {
  if (Array.isArray(variables)) return variables.filter(Boolean);
  const all: string[] = [];
  for (const [group, vars] of Object.entries(variables)) {
    if (group === "tokens_gerais") {
      all.push(...vars);
    } else {
      all.push(...vars.map((v) => `${group}.${v}`));
    }
  }
  return all;
}

export function TemplateMappingEditor({
  memberId,
  template,
  saved,
  dealFields,
}: {
  memberId: string;
  template: D4SignTemplate;
  saved: SavedMapping | undefined;
  dealFields: DealField[];
}) {
  const variables = extractVariables(template.variables);
  const [mappings, setMappings] = useState<Record<string, string>>(
    saved?.mappings ?? {},
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function setMapping(variable: string, value: string) {
    setMappings((prev) => ({ ...prev, [variable]: value }));
  }

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(
          `/api/d4sign/template-mappings/${encodeURIComponent(template.id)}?memberId=${encodeURIComponent(memberId)}`,
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: template.name,
            mappings,
          }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Mapeamento "${template.name}" salvo`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  const isMapped = saved !== undefined;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription>
              ID: <code className="text-xs">{template.id}</code> · Tipo: {template.type} ·{" "}
              {variables.length} variável(is)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isMapped && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                mapeado
              </span>
            )}
            <span className="text-muted-foreground text-sm">{open ? "▲" : "▼"}</span>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4">
          {variables.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Template sem variáveis.
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Para cada variável do template, selecione o campo do Deal Bitrix que contém o valor.
              </p>
              <div className="grid gap-3">
                {variables.map((variable) => (
                  <div key={variable} className="grid grid-cols-2 items-center gap-3">
                    <label className="text-sm font-mono">{variable}</label>
                    <select
                      value={mappings[variable] ?? ""}
                      onChange={(e) => setMapping(variable, e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">— selecione o campo —</option>
                      {dealFields.map((f) => (
                        <option key={f.code} value={f.code}>
                          {f.title} ({f.code})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="accent"
                onClick={() => void save()}
                disabled={loading}
              >
                Salvar mapeamento
              </Button>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
