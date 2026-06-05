"use client";

import { useI18n } from "@/lib/i18n/provider";

export function LegacyBridgeIntro() {
  const { t } = useI18n();
  return (
    <p className="mb-4 text-sm text-muted-foreground">
      {t.legacy.intro}{" "}
      <code className="rounded bg-muted px-1">USE_PRISMATIC_BRIDGE=true</code>{" "}
      {t.legacy.introSuffix}
    </p>
  );
}
