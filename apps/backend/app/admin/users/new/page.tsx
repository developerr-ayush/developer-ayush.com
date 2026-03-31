"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserRegistrationForm from "../../../../components/UserRegistrationForm";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NewUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Show nothing while session is loading to avoid flash of access denied
  if (status === "loading") {
    return null;
  }

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
        <p className="text-sm text-slate-400">You do not have permission to create users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Back link */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Users
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Create New User</h1>
        <p className="text-sm text-slate-400">Add a new admin or author account to the system.</p>
      </div>

      {/* Form card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7">
        <UserRegistrationForm
          onSuccess={() => {
            toast.success("User created successfully");
            router.push("/admin/users");
          }}
          showRoleSelector={session.user.role === "SUPER_ADMIN"}
          isAdmin={true}
        />
      </div>
    </div>
  );
}
