import { redirect } from "next/navigation";

export default async function BitrixSettingsRedirect({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  redirect(`/bitrix/settings/${encodeURIComponent(member_id)}/credentials`);
}
