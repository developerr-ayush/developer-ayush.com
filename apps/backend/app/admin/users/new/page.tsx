"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import UserRegistrationForm from "../../../../components/UserRegistrationForm";

export default function NewUserPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-6 rounded-lg overflow-hidden">
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
