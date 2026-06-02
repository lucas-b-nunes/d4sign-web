"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  documentName?: string | null;
  signersEmails?: string[];
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
  const [documentName, setDocumentName] = useState(saved?.documentName ?? "");
  const [docNameMode, setDocNameMode] = useState<"text" | "field">("text");
  const [signers, setSigners] = useState<string[]>(
    saved?.signersEmails && saved.signersEmails.length > 0
      ? saved.signersEmails
      : [""],
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function setMapping(variable: string, value: string) {
    setMappings((prev) => ({ ...prev, [variable]: value }));
  }

  function addSigner() {
    setSigners((prev) => [...prev, ""]);
  }

  function removeSigner(index: number) {
    setSigners((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSigner(index: number, value: string) {
    setSigners((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  async function save() {
    const validSigners = signers.map((s) => s.trim()).filter(Boolean);
    if (validSigners.length === 0) {
      toast.error("Adicione pelo menos um e-mail de signatário");
      return;
    }

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
            documentName: documentName || null,
            signersEmails: validSigners,
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
        <CardContent className="space-y-6">

          {/* Nome do documento */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Nome do documento</label>
              <div className="flex rounded-md border text-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDocNameMode("text")}
                  className={`px-3 py-1 transition-colors ${docNameMode === "text" ? "bg-[var(--bitrix-primary-dark)] text-white" : "hover:bg-muted"}`}
                >
                  Texto livre
                </button>
                <button
                  type="button"
                  onClick={() => setDocNameMode("field")}
                  className={`px-3 py-1 transition-colors ${docNameMode === "field" ? "bg-[var(--bitrix-primary-dark)] text-white" : "hover:bg-muted"}`}
                >
                  Campo Bitrix
                </button>
              </div>
            </div>

            {docNameMode === "text" ? (
              <Input
                placeholder="Ex: Contrato {=Document:TITLE}"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            ) : (
              <select
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— selecione o campo —</option>
                {dealFields.map((f) => (
                  <option key={f.code} value={`{=Document:${f.code}}`}>
                    {f.title} ({f.code})
                  </option>
                ))}
              </select>
            )}

            <p className="text-xs text-muted-foreground">
              {docNameMode === "text"
                ? <>Texto livre. Você pode combinar texto fixo com variáveis Bitrix, ex: <code className="rounded bg-muted px-1">{"Contrato {=Document:TITLE}"}</code></>
                : "Selecione um campo do Deal — o valor real será usado como nome do documento."
              }
            </p>
          </div>

          {/* Signatários */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Signatários</label>
            <div className="space-y-2">
              {signers.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder="email@empresa.com"
                    value={email}
                    onChange={(e) => updateSigner(index, e.target.value)}
                    className="flex-1"
                  />
                  {signers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSigner(index)}
                      className="text-red-400 hover:text-red-600 text-sm px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSigner}
              className="text-sm text-[var(--bitrix-primary-dark)] hover:underline"
            >
              + Adicionar signatário
            </button>
          </div>

          {/* Mapeamento de variáveis */}
          {variables.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Mapeamento de variáveis</label>
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
            </div>
          )}

          <Button
            type="button"
            variant="accent"
            onClick={() => void save()}
            disabled={loading}
          >
            Salvar mapeamento
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
