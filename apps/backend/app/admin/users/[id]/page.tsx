import EditUserPage from "./EditUserPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUserPage params={{ id }} />;
}
