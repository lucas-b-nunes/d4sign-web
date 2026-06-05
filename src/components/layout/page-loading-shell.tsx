import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton exibido enquanto a rota Bitrix carrega (loading.tsx). */
export function PageLoadingShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--shell-border)] bg-[var(--shell-bg)]">
        <div className="border-b border-[var(--shell-border)] p-4">
          <Skeleton className="h-4 w-16 bg-neutral-800" />
          <Skeleton className="mt-2 h-3 w-28 bg-neutral-800" />
        </div>
        <nav className="flex flex-col gap-2 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg bg-neutral-800" />
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[var(--shell-border)] bg-[var(--shell-bg)] px-6 py-4">
          <Skeleton className="h-6 w-48 bg-neutral-800" />
          <Skeleton className="mt-2 h-4 w-32 bg-neutral-800" />
        </header>
        <main className="flex-1 space-y-4 p-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}
