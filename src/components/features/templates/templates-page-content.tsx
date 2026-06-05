"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateMappingEditor } from "@/components/features/templates/template-mapping-editor";
import { SyncRobotButton } from "@/components/features/templates/sync-robot-button";
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
      <Card>
        <CardHeader>
          <CardTitle>{tp.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{tp.needCredentials}</CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{tp.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{tp.empty}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          {formatMessage(tp.found, { count: templates.length })}
        </h2>
        <SyncRobotButton memberId={memberId} />
      </div>
      {templates.map((template) => (
        <TemplateMappingEditor
          key={template.id}
          memberId={memberId}
          template={template}
          saved={mappingsByTemplateId[template.id]}
          dealFields={dealFields}
        />
      ))}
    </div>
  );
}
