"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, FileText, Settings, Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { formatMessage } from "@/lib/i18n/messages";
import { localeToIntl, translateDocStatus } from "@/lib/i18n/format";

type DocumentRow = {
  id: string;
  uuidDoc: string;
  entityType: string;
  entityId: string;
  statusName: string | null;
  updatedAt: string;
};

function SetupItem({ ok, label, href }: { ok: boolean; label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-sm hover:underline">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
      )}
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </Link>
  );
}

function statusBadge(status: string | null, labels: Record<string, string>) {
  const label = translateDocStatus(status, labels);
  const colors: Record<string, string> = {
    "Aguardando Assinaturas": "bg-yellow-100 text-yellow-800",
    "Awaiting signatures": "bg-yellow-100 text-yellow-800",
    Assinado: "bg-green-100 text-green-800",
    Signed: "bg-green-100 text-green-800",
    Cancelado: "bg-red-100 text-red-800",
    Canceled: "bg-red-100 text-red-800",
    Finalizado: "bg-green-100 text-green-800",
    Completed: "bg-green-100 text-green-800",
    Rascunho: "bg-gray-100 text-gray-700",
    Draft: "bg-gray-100 text-gray-700",
  };
  const cls = colors[label] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
  );
}

export function DashboardContent({
  memberId,
  documents,
  mappingCount,
  hasCredentials,
  hasSafe,
  hasTemplates,
}: {
  memberId: string;
  documents: DocumentRow[];
  mappingCount: number;
  hasCredentials: boolean;
  hasSafe: boolean;
  hasTemplates: boolean;
}) {
  const { t, locale } = useI18n();
  const d = t.dashboard;
  const enc = encodeURIComponent(memberId);
  const setupComplete = hasCredentials && hasSafe && hasTemplates;

  const recentDocs = documents.slice(0, 5);
  const totalDocs = documents.length;
  const waitingDocs = documents.filter((doc) => doc.statusName === "Aguardando Assinaturas").length;
  const signedDocs = documents.filter(
    (doc) => doc.statusName === "Assinado" || doc.statusName === "Finalizado",
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            {d.setupTitle}
            {setupComplete && (
              <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {d.ready}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SetupItem
            ok={hasCredentials}
            label={hasCredentials ? d.credentialsOk : d.credentialsMissing}
            href={`/bitrix/settings/${enc}/credentials`}
          />
          <SetupItem
            ok={hasSafe}
            label={hasSafe ? d.safeOk : d.safeMissing}
            href={`/bitrix/settings/${enc}/globals`}
          />
          <SetupItem
            ok={hasTemplates}
            label={
              hasTemplates
                ? formatMessage(d.templatesOk, { count: mappingCount })
                : d.templatesMissing
            }
            href={`/bitrix/templates/${enc}`}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-3xl font-bold">{totalDocs}</p>
            <p className="text-xs text-muted-foreground mt-1">{d.totalDocs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-3xl font-bold text-yellow-600">{waitingDocs}</p>
            <p className="text-xs text-muted-foreground mt-1">{d.waitingSign}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-3xl font-bold text-green-600">{signedDocs}</p>
            <p className="text-xs text-muted-foreground mt-1">{d.signed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {d.recentDocs}
            </span>
            <Link
              href={`/bitrix/monitoring/${enc}`}
              className="text-xs text-[var(--bitrix-primary-dark)] underline font-normal"
            >
              {d.viewAll}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <FileText className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{d.noDocs}</p>
              {!setupComplete && (
                <p className="text-xs text-muted-foreground">{d.completeSetup}</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-2.5 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {doc.entityType} #{doc.entityId}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {doc.uuidDoc.slice(0, 18)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {statusBadge(doc.statusName, t.docStatus)}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(doc.updatedAt).toLocaleDateString(localeToIntl(locale))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
