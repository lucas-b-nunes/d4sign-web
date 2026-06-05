"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { Messages } from "@/lib/i18n/messages";

export function SettingsNav({ memberId }: { memberId: string }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const base = `/bitrix/settings/${encodeURIComponent(memberId)}`;

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
      {settingsNav.map((item) => {
        const href = `${base}/${item.slug}`;
        const active = pathname.endsWith(`/${item.slug}`);
        const label = t.settingsNav[item.slug as keyof Messages["settingsNav"]];
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
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
