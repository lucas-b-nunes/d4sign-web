import { redirect } from "next/navigation";

export default async function BitrixHomeRedirect({
  params,
}: {
  params: Promise<{ member_id: string }>;
}) {
  const { member_id } = await params;
  redirect(`/bitrix/dashboard/${encodeURIComponent(member_id)}`);
}
