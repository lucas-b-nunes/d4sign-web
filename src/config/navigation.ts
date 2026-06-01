import type { LucideIcon } from "lucide-react";
import {
  Activity,
  FileText,
  FileSignature,
  LayoutDashboard,
  Link2,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: (memberId: string) => string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
};

export const mainNav: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: (m) => `/bitrix/dashboard/${encodeURIComponent(m)}`,
    icon: LayoutDashboard,
  },
  {
    id: "integrations",
    label: "Integrações",
    href: (m) => `/bitrix/settings/${encodeURIComponent(m)}/connection`,
    icon: Link2,
  },
  {
    id: "templates",
    label: "Templates",
    href: (m) => `/bitrix/templates/${encodeURIComponent(m)}`,
    icon: FileText,
    badge: "Beta",
  },
  {
    id: "signatures",
    label: "Assinaturas",
    href: (m) => `/bitrix/signatures/${encodeURIComponent(m)}`,
    icon: FileSignature,
    badge: "Beta",
  },
  {
    id: "monitoring",
    label: "Monitoramento",
    href: (m) => `/bitrix/monitoring/${encodeURIComponent(m)}`,
    icon: Activity,
  },
  {
    id: "settings",
    label: "Configurações",
    href: (m) => `/bitrix/settings/${encodeURIComponent(m)}/credentials`,
    icon: Settings,
  },
  {
    id: "docs",
    label: "Documentação",
    href: () => "https://docapi.d4sign.com.br/docs",
    icon: BookOpen,
  },
  {
    id: "support",
    label: "Suporte",
    href: () => "#",
    icon: HelpCircle,
    disabled: true,
  },
];

export const settingsNav = [
  { slug: "connection", label: "Conexão Bitrix" },
  { slug: "credentials", label: "Credenciais D4Sign" },
  { slug: "globals", label: "Parâmetros globais" },
  { slug: "preferences", label: "Preferências" },
] as const;
