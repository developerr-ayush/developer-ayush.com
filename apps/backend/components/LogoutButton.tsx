"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function LogoutButton({
  className,
  children,
  onClick,
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (onClick) onClick();
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
