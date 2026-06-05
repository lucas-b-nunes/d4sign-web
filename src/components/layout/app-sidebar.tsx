"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";
import type { Messages } from "@/lib/i18n/messages";

export function AppSidebar({ memberId }: { memberId: string }) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside
      className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-card"
      style={{ minHeight: "100vh" }}
    >
      <div className="border-b border-border p-4">
        <Image
          src="/logo-d4sign.png"
          alt="D4Sign"
          width={132}
          height={36}
          priority
          className="h-9 w-auto invert"
        />
        <p className="mt-2 text-xs text-muted-foreground">{t.appName}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {mainNav.map((item) => {
          const href = item.href(memberId);
          const external = href.startsWith("http");
          const active = !external && pathname.startsWith(href.split("?")[0]);
          const label = t.nav[item.id as keyof Messages["nav"]];
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
              <span className="flex-1">{label}</span>
              {item.badge ? (
                <Badge variant="muted" className="text-[10px]">
                  {item.badge}
                </Badge>
              ) : null}
            </>
          );
          if (item.disabled) {
            return (
              <div key={item.id} className={className} title={t.comingSoon}>
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
