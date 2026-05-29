"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SettingsNav({ memberId }: { memberId: string }) {
  const pathname = usePathname();
  const base = `/bitrix/settings/${encodeURIComponent(memberId)}`;

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
      {settingsNav.map((item) => {
        const href = `${base}/${item.slug}`;
        const active = pathname.endsWith(`/${item.slug}`);
        return (
          <Link
            key={item.slug}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-[var(--bitrix-primary)]/15 font-medium text-[var(--bitrix-primary-dark)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
