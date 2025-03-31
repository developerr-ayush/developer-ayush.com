import { ReactNode } from "react";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 w-full overflow-auto">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
