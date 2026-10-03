import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { auth } from "../../../../auth";
import { PageHeader } from "../../../../components/admin/PageHeader";
import { EmptyState } from "../../../../components/ui/empty-state";
import NewUserForm from "./new-user-form";

export const metadata: Metadata = { title: "New user" };

export default async function NewUserPage() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return (
      <EmptyState
        icon={<ShieldAlert className="size-6 text-danger" aria-hidden="true" />}
        title="Admins only"
        description="You don't have permission to create users."
        action={
          <Link href="/admin" className="btn">
            Back to dashboard
          </Link>
        }
      />
    );
  }
  return (
    <div className="max-w-xl space-y-6">
      <PageHeader eyebrow="People" title="New user" description="Create an account that can sign in to this admin." />
      <div className="card p-5">
        <NewUserForm canPickRole={role === "SUPER_ADMIN"} />
      </div>
    </div>
  );
}
