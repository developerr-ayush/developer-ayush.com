import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, UserPlus } from "lucide-react";
import { auth } from "../../../auth";
import { GetUsers } from "../../../actions/users";
import { PageHeader } from "../../../components/admin/PageHeader";
import { DataTable, TableCard, Td, Th, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { EmptyState } from "../../../components/ui/empty-state";
import { UserRowActions } from "./row-actions";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function UsersAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return (
      <EmptyState
        icon={<ShieldAlert className="size-6 text-danger" aria-hidden="true" />}
        title="Admins only"
        description="You don't have permission to manage users."
        action={
          <Link href="/admin" className="btn">
            Back to dashboard
          </Link>
        }
      />
    );
  }

  const users = await GetUsers();
  if (!Array.isArray(users)) {
    return <EmptyState title="Couldn't load users" description={users.error} />;
  }
  const sorted = [...users].sort((a, b) => a.role.localeCompare(b.role) || (a.name ?? a.email).localeCompare(b.name ?? b.email));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Users"
        description="Everyone who can sign in to this admin."
        actions={
          <Link href="/admin/users/new" className="btn btn-primary">
            <UserPlus className="size-4" aria-hidden="true" /> New user
          </Link>
        }
      />
      <TableCard>
        {sorted.length === 0 ? (
          <EmptyState title="No users" description="Create the first account to get started." />
        ) : (
          <DataTable caption="Users">
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th className="text-right">Posts</Th>
                <Th srOnly>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((u) => {
                const me = u.id === session.user?.id;
                const canDelete = !me && (role === "SUPER_ADMIN" ? u.role !== "SUPER_ADMIN" : u.role === "USER");
                return (
                  <Tr key={u.id}>
                    <Td primary>
                      <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="mono flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-[12px] font-medium uppercase">
                          {(u.name ?? u.email).charAt(0)}
                        </span>
                        <Link href={`/admin/users/${u.id}`} className="truncate font-medium hover:text-accent">
                          {u.name ?? "Unnamed user"}
                        </Link>
                        {me ? <span className="chip">you</span> : null}
                      </div>
                    </Td>
                    <Td label="Email" className="mono text-[12.5px] text-muted">
                      {u.email}
                    </Td>
                    <Td label="Role">
                      <StatusBadge status={u.role} />
                    </Td>
                    <Td label="Posts" className="mono text-right text-muted">
                      {u.blogCount ?? 0}
                    </Td>
                    <Td actions className="md:w-12 md:text-right">
                      <UserRowActions id={u.id} name={u.name ?? u.email} canDelete={canDelete} />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </TableCard>
    </div>
  );
}
