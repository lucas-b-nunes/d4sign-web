"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n/provider";
import { formatMessage } from "@/lib/i18n/messages";

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
  const { t } = useI18n();
  const tp = t.templates;
  const variables = extractVariables(template.variables);
  const [mappings, setMappings] = useState<Record<string, string>>(saved?.mappings ?? {});
  const [documentName, setDocumentName] = useState(saved?.documentName ?? "");
  const [docNameMode, setDocNameMode] = useState<"text" | "field">("text");
  const [signers, setSigners] = useState<string[]>(
    saved?.signersEmails && saved.signersEmails.length > 0 ? saved.signersEmails : [""],
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
      toast.error(tp.signerRequired);
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
      toast.success(formatMessage(tp.mappingSaved, { name: template.name }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : tp.saveError);
    } finally {
      setLoading(false);
    }
  }

  const isMapped = saved !== undefined;

  return (
    <Card>
      <CardHeader className="cursor-pointer select-none" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription>
              {tp.id}: <code className="text-xs">{template.id}</code> · {tp.type}: {template.type} ·{" "}
              {formatMessage(tp.variables, { count: variables.length })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isMapped && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {tp.mapped}
              </span>
            )}
            <span className="text-muted-foreground text-sm">{open ? "▲" : "▼"}</span>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{tp.docName}</label>
              <div className="flex rounded-md border text-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDocNameMode("text")}
                  className={`px-3 py-1 transition-colors ${docNameMode === "text" ? "bg-[var(--bitrix-primary-dark)] text-white" : "hover:bg-muted"}`}
                >
                  {tp.freeText}
                </button>
                <button
                  type="button"
                  onClick={() => setDocNameMode("field")}
                  className={`px-3 py-1 transition-colors ${docNameMode === "field" ? "bg-[var(--bitrix-primary-dark)] text-white" : "hover:bg-muted"}`}
                >
                  {tp.bitrixField}
                </button>
              </div>
            </div>

            {docNameMode === "text" ? (
              <Input
                placeholder={tp.docNamePlaceholder}
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            ) : (
              <select
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{tp.selectField}</option>
                {dealFields.map((f) => (
                  <option key={f.code} value={`{=Document:${f.code}}`}>
                    {f.title} ({f.code})
                  </option>
                ))}
              </select>
            )}

            <p className="text-xs text-muted-foreground">
              {docNameMode === "text" ? (
                <>
                  {tp.docNameHintText}{" "}
                  <code className="rounded bg-muted px-1">{"Contrato {=Document:TITLE}"}</code>
                </>
              ) : (
                tp.docNameHintField
              )}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{tp.signers}</label>
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
              {tp.addSigner}
            </button>
          </div>

          {variables.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">{tp.mappingTitle}</label>
              <p className="text-xs text-muted-foreground">{tp.mappingHint}</p>
              <div className="grid gap-3">
                {variables.map((variable) => (
                  <div key={variable} className="grid grid-cols-2 items-center gap-3">
                    <label className="text-sm font-mono">{variable}</label>
                    <select
                      value={mappings[variable] ?? ""}
                      onChange={(e) => setMapping(variable, e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{tp.selectField}</option>
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

          <Button type="button" variant="accent" onClick={() => void save()} disabled={loading}>
            {tp.saveMapping}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
