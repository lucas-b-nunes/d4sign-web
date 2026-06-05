"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateMappingEditor } from "@/components/features/templates/template-mapping-editor";
import { SyncRobotButton } from "@/components/features/templates/sync-robot-button";
import { useI18n } from "@/lib/i18n/provider";
import { formatMessage } from "@/lib/i18n/messages";
import { FileText, Layers, CheckCircle2, AlertCircle } from "lucide-react";

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

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bitrix-primary)]/10">
          <Icon className="h-7 w-7 text-[var(--bitrix-primary-dark)]" />
        </div>
        <div className="max-w-md space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TemplatesPageContent({
  memberId,
  d4signConfigured,
  templates,
  mappingsByTemplateId,
  dealFields,
}: {
  memberId: string;
  d4signConfigured: boolean;
  templates: D4SignTemplate[];
  mappingsByTemplateId: Record<string, SavedMapping>;
  dealFields: DealField[];
}) {
  const { t } = useI18n();
  const tp = t.templates;

  if (!d4signConfigured) {
    return (
      <EmptyState
        icon={AlertCircle}
        title={tp.cardTitle}
        description={tp.needCredentials}
      />
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState icon={FileText} title={tp.cardTitle} description={tp.empty} />
    );
  }

  const mappedCount = templates.filter((tpl) => mappingsByTemplateId[tpl.id]).length;
  const pendingCount = templates.length - mappedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border bg-gradient-to-br from-[var(--bitrix-primary)]/8 via-card to-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[var(--bitrix-primary-dark)]" />
              <h2 className="text-base font-semibold">{tp.cardTitle}</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">{tp.pageHint}</p>
          </div>
          <SyncRobotButton memberId={memberId} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-card/80 px-3 py-2 text-sm shadow-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{templates.length}</span>
            <span className="text-muted-foreground">{tp.totalLabel}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-card/80 px-3 py-2 text-sm shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-medium text-emerald-700">
              {formatMessage(tp.statsMapped, { mapped: mappedCount, total: templates.length })}
            </span>
          </div>
          {pendingCount > 0 && (
            <Badge variant="warning" className="px-3 py-1.5 text-sm">
              {pendingCount} {tp.pending.toLowerCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Lista de templates */}
      <div className="space-y-3">
        {templates.map((template, index) => (
          <TemplateMappingEditor
            key={template.id}
            memberId={memberId}
            template={template}
            saved={mappingsByTemplateId[template.id]}
            dealFields={dealFields}
            defaultOpen={index === 0 && mappedCount === 0}
          />
        ))}
      </div>
    </div>
  );
}
