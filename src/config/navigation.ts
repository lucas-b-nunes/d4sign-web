import type { LucideIcon } from "lucide-react";
import {
  Activity,
  FileText,
  LayoutDashboard,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export type NavItem = {
  id: string;
  href: (memberId: string) => string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
};

export const mainNav: NavItem[] = [
  {
    id: "dashboard",
    href: (m) => `/bitrix/dashboard/${encodeURIComponent(m)}`,
    icon: LayoutDashboard,
  },
  {
    id: "templates",
    href: (m) => `/bitrix/templates/${encodeURIComponent(m)}`,
    icon: FileText,
  },
  {
    id: "monitoring",
    href: (m) => `/bitrix/monitoring/${encodeURIComponent(m)}`,
    icon: Activity,
  },
  {
    id: "settings",
    href: (m) => `/bitrix/settings/${encodeURIComponent(m)}/credentials`,
    icon: Settings,
  },
  {
    id: "docs",
    href: (m) => `/bitrix/docs/${encodeURIComponent(m)}`,
    icon: BookOpen,
  },
  {
    id: "support",
    href: () => "#",
    icon: HelpCircle,
    disabled: true,
  },
];

export const settingsNav = [
  { slug: "connection" },
  { slug: "credentials" },
  { slug: "globals" },
] as const;
