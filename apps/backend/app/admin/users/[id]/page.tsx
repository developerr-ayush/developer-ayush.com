import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { auth } from "../../../../auth";
import { getUserDetails } from "../../../../actions/users";
import { PageHeader } from "../../../../components/admin/PageHeader";
import { EmptyState } from "../../../../components/ui/empty-state";
import EditUserPage from "./EditUserPage";

export const metadata: Metadata = { title: "Edit user" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const user = await getUserDetails(id);
  if ("error" in user) {
    if (user.error === "User not found") notFound();
    return (
      <EmptyState
        icon={<ShieldAlert className="size-6 text-danger" aria-hidden="true" />}
        title="Can't open this user"
        description={user.error}
        action={
          <Link href="/admin/users" className="btn">
            Back to users
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="People" title={user.name ?? user.email} description={user.email} />
      <EditUserPage
        viewerRole={session.user.role ?? "USER"}
        viewerId={session.user.id ?? ""}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          blogs: user.blogs.map((b) => ({
            id: b.id,
            title: b.title,
            status: b.status,
            approved: b.approved,
            updatedAt: b.updatedAt.toISOString(),
          })),
        }}
      />
    </div>
  );
}
