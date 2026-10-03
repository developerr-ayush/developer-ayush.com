"use client";

import * as React from "react";

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
}

interface Ctx extends AdminUser {
  isAdmin: boolean;
}

const UserContext = React.createContext<Ctx | null>(null);

export function AdminUserProvider({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const value = React.useMemo<Ctx>(
    () => ({ ...user, isAdmin: user.role === "ADMIN" || user.role === "SUPER_ADMIN" }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAdminUser(): Ctx {
  const ctx = React.useContext(UserContext);
  if (!ctx) throw new Error("useAdminUser must be used inside the admin layout");
  return ctx;
}
