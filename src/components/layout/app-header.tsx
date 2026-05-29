"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { Globe } from "lucide-react";

export function AppHeader({
  title,
  breadcrumbs,
  bitrixConnected = true,
  d4signConnected = false,
}: {
  title: string;
  breadcrumbs?: string[];
  bitrixConnected?: boolean;
  d4signConnected?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div>
        {breadcrumbs?.length ? (
          <p className="text-xs text-muted-foreground">
            {breadcrumbs.join(" / ")}
          </p>
        ) : null}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={bitrixConnected ? "success" : "warning"}>
          Bitrix {bitrixConnected ? t.connected : t.disconnected}
        </Badge>
        <Badge variant={d4signConnected ? "success" : "muted"}>
          D4Sign {d4signConnected ? t.connected : t.disconnected}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "pt-BR" ? "en" : "pt-BR")}
        >
          <Globe className="h-4 w-4" />
          {locale === "pt-BR" ? "EN" : "PT"}
        </Button>
      </div>
    </header>
  );
}
