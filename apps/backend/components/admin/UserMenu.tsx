"use client";

import * as React from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { Menu } from "@/components/ui/menu";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./user-context";
import { signOutAction } from "@/actions/signout";

export function UserMenu() {
  const user = useAdminUser();
  const display = user.name || user.email;
  const [, startTransition] = React.useTransition();

  return (
    <Menu
      label="Account menu"
      triggerClassName="flex h-9 items-center gap-2 rounded-lg border border-transparent pl-1 pr-2 hover:bg-surface-2 data-[open=true]:bg-surface-2"
      trigger={
        <>
          <span
            aria-hidden="true"
            className="mono flex size-7 items-center justify-center rounded-full border border-line bg-surface-2 text-[12px] font-medium uppercase"
          >
            {display.charAt(0)}
          </span>
          <span className="hidden max-w-[10rem] text-left leading-tight md:block">
            <span className="block truncate text-[13px] font-medium">{display}</span>
            <span className="mono block text-[10.5px] uppercase tracking-wide text-muted">{user.role.replace("_", " ").toLowerCase()}</span>
          </span>
          <ChevronDown className="hidden size-3.5 text-muted md:block" aria-hidden="true" />
        </>
      }
      header={
        <div className="space-y-1.5 py-0.5">
          <p className="truncate text-[13px] font-medium">{display}</p>
          <p className="mono truncate text-[11px] text-muted">{user.email}</p>
          <StatusBadge status={user.role} />
        </div>
      }
      items={[
        {
          label: "Sign out",
          icon: <LogOut />,
          onSelect: () => startTransition(() => void signOutAction()),
        },
      ]}
    />
  );
}
