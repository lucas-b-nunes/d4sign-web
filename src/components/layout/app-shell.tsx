"use client";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { useI18n } from "@/lib/i18n/provider";
import type { Messages } from "@/lib/i18n/messages";

export type AppPage = keyof Messages["pages"];
export type BreadcrumbKey = keyof Messages["breadcrumbs"];

export function AppShell({
  memberId,
  page,
  breadcrumbKeys,
  bitrixConnected,
  d4signConnected,
  children,
}: {
  memberId: string;
  page: AppPage;
  breadcrumbKeys: BreadcrumbKey[];
  bitrixConnected?: boolean;
  d4signConnected?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const title = t.pages[page].title;
  const breadcrumbs = breadcrumbKeys.map((key) => t.breadcrumbs[key]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar memberId={memberId} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title={title}
          breadcrumbs={breadcrumbs}
          bitrixConnected={bitrixConnected}
          d4signConnected={d4signConnected}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
