"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  FileText,
  Users,
  Link2,
  CheckCircle2,
  Circle,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n/provider";
import { formatMessage } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import {
  initSignerRows,
  serializeSignerSpec,
  type SignerMode,
  type SignerRow,
} from "@/lib/signer-spec";

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

const selectClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[var(--bitrix-primary)]/40";

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

function SectionBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-[var(--bitrix-primary-dark)]" />
        {title}
      </div>
      {children}
    </div>
  );
}

export function TemplateMappingEditor({
  memberId,
  template,
  saved,
  dealFields,
  defaultOpen = false,
}: {
  memberId: string;
  template: D4SignTemplate;
  saved: SavedMapping | undefined;
  dealFields: DealField[];
  defaultOpen?: boolean;
}) {
  const { t } = useI18n();
  const tp = t.templates;
  const variables = extractVariables(template.variables);
  const [mappings, setMappings] = useState<Record<string, string>>(saved?.mappings ?? {});
  const [documentName, setDocumentName] = useState(saved?.documentName ?? "");
  const [docNameMode, setDocNameMode] = useState<"text" | "field">("text");
  const [signerRows, setSignerRows] = useState<SignerRow[]>(
    initSignerRows(saved?.signersEmails),
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(defaultOpen);

  const mappedVarCount = useMemo(
    () => variables.filter((v) => Boolean(mappings[v])).length,
    [variables, mappings],
  );

  function setMapping(variable: string, value: string) {
    setMappings((prev) => ({ ...prev, [variable]: value }));
  }

  function addSigner() {
    setSignerRows((prev) => [...prev, { mode: "free", freeEmail: "", fieldToken: "" }]);
  }

  function removeSigner(index: number) {
    setSignerRows((prev) => prev.filter((_, i) => i !== index));
  }

  function setSignerMode(index: number, mode: SignerMode) {
    setSignerRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              mode,
              freeEmail: mode === "free" ? row.freeEmail : "",
              fieldToken: mode === "field" ? row.fieldToken : "",
            }
          : row,
      ),
    );
  }

  function updateSignerFreeEmail(index: number, value: string) {
    setSignerRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, freeEmail: value } : row)),
    );
  }

  function updateSignerFieldToken(index: number, value: string) {
    setSignerRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, fieldToken: value } : row)),
    );
  }

  async function save() {
    const validSigners = signerRows
      .map((row) => serializeSignerSpec(row))
      .map((s) => s.trim())
      .filter(Boolean);

    if (validSigners.length === 0) {
      toast.error(tp.signerRequired);
      return;
    }

    if (signerRows.some((row) => row.mode === "field" && !row.fieldToken.trim())) {
      toast.error(tp.signerFieldRequired);
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
  const typeLabel = template.type?.toUpperCase() ?? "WORD";

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isMapped
          ? "border-l-4 border-l-emerald-500"
          : "border-l-4 border-l-amber-400",
        open && "ring-1 ring-[var(--bitrix-primary)]/20",
      )}
    >
      <CardHeader
        className="cursor-pointer select-none pb-4 hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 min-w-0">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                isMapped ? "bg-emerald-100" : "bg-amber-50",
              )}
            >
              <FileText
                className={cn(
                  "h-5 w-5",
                  isMapped ? "text-emerald-700" : "text-amber-600",
                )}
              />
            </div>
            <div className="min-w-0 space-y-1.5">
              <CardTitle className="text-base truncate">{template.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2">
                <Badge variant="muted" className="font-mono text-[10px]">
                  {template.id.slice(0, 12)}…
                </Badge>
                <Badge variant="default">{typeLabel}</Badge>
                <span className="text-xs">
                  {formatMessage(tp.variables, { count: variables.length })}
                </span>
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isMapped ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {tp.mapped}
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1">
                <Circle className="h-3 w-3" />
                {tp.pending}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </div>
        {!open && (
          <p className="text-xs text-muted-foreground mt-2 pl-[52px]">{tp.expandHint}</p>
        )}
      </CardHeader>

      {open && (
        <CardContent className="space-y-4 pt-0 pb-6">
          <SectionBlock icon={FileText} title={tp.sectionDocument}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{tp.docName}</span>
              <div className="inline-flex rounded-lg border bg-card p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDocNameMode("text")}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition-colors",
                    docNameMode === "text"
                      ? "bg-[var(--bitrix-primary-dark)] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tp.freeText}
                </button>
                <button
                  type="button"
                  onClick={() => setDocNameMode("field")}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition-colors",
                    docNameMode === "field"
                      ? "bg-[var(--bitrix-primary-dark)] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
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
                className={selectClass}
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
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                    {"Contrato {=Document:TITLE}"}
                  </code>
                </>
              ) : (
                tp.docNameHintField
              )}
            </p>
          </SectionBlock>

          <SectionBlock icon={Users} title={tp.sectionSigners}>
            <div className="space-y-3">
              {signerRows.map((row, index) => (
                <div key={index} className="space-y-2 rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatMessage(tp.signerNumber, { n: index + 1 })}
                    </span>
                    {signerRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSigner(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        aria-label="Remove signer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="inline-flex flex-wrap rounded-lg border bg-background p-0.5 text-xs">
                    {(
                      [
                        ["free", tp.signerModeFree],
                        ["contacts", tp.signerModeContacts],
                        ["field", tp.signerModeDealField],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSignerMode(index, mode)}
                        className={cn(
                          "rounded-md px-2.5 py-1.5 transition-colors",
                          row.mode === mode
                            ? "bg-[var(--bitrix-primary-dark)] text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {row.mode === "free" ? (
                    <Input
                      type="email"
                      placeholder="email@empresa.com"
                      value={row.freeEmail}
                      onChange={(e) => updateSignerFreeEmail(index, e.target.value)}
                      className="bg-card"
                    />
                  ) : null}
                  {row.mode === "contacts" ? (
                    <p className="text-xs text-muted-foreground">{tp.signerContactsHint}</p>
                  ) : null}
                  {row.mode === "field" ? (
                    <>
                      <select
                        value={row.fieldToken}
                        onChange={(e) => updateSignerFieldToken(index, e.target.value)}
                        className={selectClass}
                      >
                        <option value="">{tp.selectField}</option>
                        {dealFields.map((f) => (
                          <option key={f.code} value={`{=Document:${f.code}}`}>
                            {f.title} ({f.code})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">{tp.signerFieldHint}</p>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSigner}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--bitrix-primary-dark)] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              {tp.addSigner}
            </button>
          </SectionBlock>

          {variables.length > 0 && (
            <SectionBlock icon={Link2} title={tp.sectionVariables}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">{tp.mappingHint}</p>
                <Badge variant={mappedVarCount === variables.length ? "success" : "muted"}>
                  {formatMessage(tp.varsMapped, {
                    mapped: mappedVarCount,
                    total: variables.length,
                  })}
                </Badge>
              </div>
              <div className="rounded-lg border bg-card overflow-hidden divide-y">
                {variables.map((variable, idx) => {
                  const mapped = Boolean(mappings[variable]);
                  return (
                    <div
                      key={variable}
                      className={cn(
                        "grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 items-center px-3 py-2.5",
                        idx % 2 === 0 && "bg-muted/20",
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {mapped ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        )}
                        <code className="text-xs font-mono truncate">{variable}</code>
                      </div>
                      <select
                        value={mappings[variable] ?? ""}
                        onChange={(e) => setMapping(variable, e.target.value)}
                        className={selectClass}
                      >
                        <option value="">{tp.selectField}</option>
                        {dealFields.map((f) => (
                          <option key={f.code} value={f.code}>
                            {f.title} ({f.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </SectionBlock>
          )}

          <div className="flex justify-end pt-2 border-t">
            <Button
              type="button"
              variant="accent"
              onClick={() => void save()}
              disabled={loading}
              className="min-w-[160px]"
            >
              {tp.saveMapping}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
