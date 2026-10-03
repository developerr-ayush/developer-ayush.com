"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { signOutAction } from "../../../actions/signout";

/** Visiting /admin/logout ends the session and lands on /login. */
export default function LogoutPage() {
  const [pending, startTransition] = React.useTransition();
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    startTransition(() => void signOutAction());
  }, []);

  return (
    <div role="status" className="mx-auto flex max-w-sm flex-col items-center py-24 text-center">
      <Loader2 className="size-5 animate-spin text-muted" aria-hidden="true" />
      <h1 className="mt-4 font-serif text-[2rem] leading-tight">Signing you out…</h1>
      <p className="mt-2 text-sm text-muted">You&apos;ll land on the sign-in page in a moment.</p>
      {!pending && started.current ? (
        <button type="button" className="btn mt-5" onClick={() => startTransition(() => void signOutAction())}>
          Sign out now
        </button>
      ) : null}
    </div>
  );
}
