import { GetUsers } from "../../../actions/users";
import Link from "next/link";
import DeleteUserButton from "./delete-user-button";
import { auth } from "../../../auth";
import { PageHeader } from "../../../components/admin/PageHeader";
import { DataTable, Td, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Pencil, ShieldAlert, FileText } from "lucide-react";

export default async function UsersAdmin() {
  const users = await GetUsers();
  const session = await auth();

  // Access denied
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-5">
          <ShieldAlert className="w-7 h-7 text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-sm text-slate-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Error state
  if (users && "error" in users) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
        <p className="text-rose-400 font-medium">{users.error}</p>
      </div>
    );
  }

  const userList = Array.isArray(users) ? users : [];

  const columns = [
    { label: "Name" },
    { label: "Email" },
    { label: "Role" },
    { label: "Posts" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage admin and author accounts"
        ctaLabel="Add User"
        ctaHref="/admin/users/new"
      />

      <DataTable
        columns={columns}
        isEmpty={userList.length === 0}
        emptyState={<p className="text-slate-500 text-sm">No users found.</p>}
      >
        {userList.map((user) => (
          <Tr key={user.id}>
            {/* Name */}
            <Td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-slate-300">
                    {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-white text-sm">
                  {user.name ?? "Unnamed User"}
                </span>
              </div>
            </Td>

            {/* Email */}
            <Td>
              <span className="text-sm text-slate-400">{user.email}</span>
            </Td>

            {/* Role */}
            <Td>
              <StatusBadge status={user.role} />
            </Td>

            {/* Blog count */}
            <Td>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                {user.blogCount ?? 0}
              </div>
            </Td>

            {/* Actions */}
            <Td className="text-right">
              <div className="flex items-center justify-end gap-3">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
                {(session.user.role === "SUPER_ADMIN" ||
                  (session.user.role === "ADMIN" && user.role === "USER")) && (
                  <DeleteUserButton userId={user.id} />
                )}
              </div>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}
