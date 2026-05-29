"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function AppSidebar({ memberId }: { memberId: string }) {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-card"
      style={{ minHeight: "100vh" }}
    >
      <div className="border-b border-border p-4">
        <p className="text-sm font-semibold text-[var(--bitrix-primary-dark)]">
          D4Sign
        </p>
        <p className="text-xs text-muted-foreground">× Bitrix24 · D4Sign</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {mainNav.map((item) => {
          const href = item.href(memberId);
          const external = href.startsWith("http");
          const active = !external && pathname.startsWith(href.split("?")[0]);
          const className = cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            item.disabled && "pointer-events-none opacity-50",
            active
              ? "bg-[var(--bitrix-primary)]/15 text-[var(--bitrix-primary-dark)] font-medium"
              : "text-foreground hover:bg-muted",
          );
          const content = (
            <>
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <Badge variant="muted" className="text-[10px]">
                  {item.badge}
                </Badge>
              ) : null}
            </>
          );
          if (item.disabled) {
            return (
              <div key={item.id} className={className}>
                {content}
              </div>
            );
          }
          if (external) {
            return (
              <a
                key={item.id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {content}
              </a>
            );
          }
          return (
            <Link key={item.id} href={href} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
