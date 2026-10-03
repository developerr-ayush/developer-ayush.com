"use client";

import { useRouter } from "next/navigation";
import UserRegistrationForm from "@/components/UserRegistrationForm";

export default function NewUserForm({ canPickRole }: { canPickRole: boolean }) {
  const router = useRouter();
  return (
    <UserRegistrationForm
      isAdmin
      showRoleSelector={canPickRole}
      submitLabel="Create user"
      onSuccess={() => {
        router.push("/admin/users");
        router.refresh();
      }}
    />
  );
}
