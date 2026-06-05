"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";
import {
  localeToIntl,
  translateDocStatus,
  categorizeDocumentStatus,
} from "@/lib/i18n/format";

type DocumentRow = {
  id: string;
  uuidDoc: string;
  entityType: string;
  entityId: string;
  statusName: string | null;
  statusId?: number | null;
  updatedAt: string;
};

function statusVariant(statusName: string | null, statusId?: number | null) {
  const category = categorizeDocumentStatus(statusName, statusId);
  if (category === "signed") return "success" as const;
  if (category === "waiting") return "warning" as const;
  if (category === "canceled") return "default" as const;
  return "muted" as const;
}

export function MonitoringContent({ documents }: { documents: DocumentRow[] }) {
  const { t, locale } = useI18n();
  const m = t.monitoring;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.recentTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{m.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4">{m.colUuid}</th>
                  <th className="pb-2 pr-4">{m.colEntity}</th>
                  <th className="pb-2 pr-4">{m.colStatus}</th>
                  <th className="pb-2">{m.colUpdated}</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id} className="border-b border-border/60">
                    <td className="py-2 pr-4 font-mono text-xs">{d.uuidDoc}</td>
                    <td className="py-2 pr-4">
                      {d.entityType} #{d.entityId}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant={statusVariant(d.statusName, d.statusId)}>
                        {translateDocStatus(d.statusName, t.docStatus)}
                      </Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(d.updatedAt).toLocaleString(localeToIntl(locale))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
