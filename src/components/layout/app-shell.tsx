import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AppShell({
  memberId,
  title,
  breadcrumbs,
  bitrixConnected,
  d4signConnected,
  children,
}: {
  memberId: string;
  title: string;
  breadcrumbs?: string[];
  bitrixConnected?: boolean;
  d4signConnected?: boolean;
  children: React.ReactNode;
}) {
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
