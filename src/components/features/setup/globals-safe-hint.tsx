"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";

export function GlobalsSafeHint() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.globals.defaultSafe}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {t.globals.defaultSafeNeedCreds}
      </CardContent>
    </Card>
  );
}
