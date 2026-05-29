import { AppProviders } from "@/components/providers/app-providers";

export default function BitrixEmbeddedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders>{children}</AppProviders>;
}
