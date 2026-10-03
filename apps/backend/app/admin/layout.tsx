import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { db } from "../../lib/db";
import { AdminShell } from "../../components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [pendingSlang, needsReview] = await Promise.all([
    db.slangTerm.count({ where: { status: "pending" } }),
    db.blog.count({ where: { approved: false } }),
  ]);

  return (
    <AdminShell
      user={{
        id: session.user.id ?? "",
        name: session.user.name ?? null,
        email: session.user.email ?? "",
        role: session.user.role ?? "USER",
      }}
      counts={{ pendingSlang, needsReview }}
    >
      {children}
    </AdminShell>
  );
}
