import { ReactNode } from "react";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/Sidebar";
import { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Admin — BackendCore",
  description: "Admin dashboard for managing all products",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#080d1a] text-slate-200">
      <SessionProvider>
        <AdminSidebar />
        <main className="flex-1 w-full overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">{children}</div>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </SessionProvider>
    </div>
  );
}
