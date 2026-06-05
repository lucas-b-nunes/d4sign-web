"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";

export function ConnectionContent({
  domain,
  memberId,
  status,
}: {
  domain: string;
  memberId: string;
  status: string;
}) {
  const { t } = useI18n();
  const c = t.connection;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{c.portalTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <span className="text-muted-foreground">{c.domain}</span>
          <span>{domain}</span>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <span className="text-muted-foreground">{c.memberId}</span>
          <span className="font-mono text-xs">{memberId}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">{c.status}</span>
          <Badge variant="success">{status}</Badge>
        </div>
        <p className="text-muted-foreground text-xs">{c.tokenNote}</p>
      </CardContent>
    </Card>
  );
}
