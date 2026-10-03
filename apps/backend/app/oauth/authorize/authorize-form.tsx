"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, fieldA11y } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { decideAuthorization } from "./actions";

export function AuthorizeForm({ params, signedInAs }: { params: string; signedInAs: string | null }) {
  const [state, action, pending] = React.useActionState(decideAuthorization, undefined);
  React.useEffect(() => {
    if (state?.redirectTo) window.location.assign(state.redirectTo);
  }, [state?.redirectTo]);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="params" value={params} />
      {state?.error ? (
        <div role="alert" className="flex items-start gap-2 rounded-[var(--radius-ctl)] border border-[color-mix(in_srgb,var(--danger)_40%,var(--line))] bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))] px-3 py-2.5 text-[13px] text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.error}</p>
        </div>
      ) : null}
      {signedInAs ? (
        <p className="text-[13px] text-muted">
          Signed in as <span className="mono text-ink">{signedInAs}</span>
        </p>
      ) : (
        <>
          <Field id="oauth-email" label="Email">
            <Input {...fieldA11y("oauth-email")} name="email" type="email" defaultValue={state?.email} autoComplete="username" required autoFocus />
          </Field>
          <Field id="oauth-password" label="Password">
            <PasswordInput {...fieldA11y("oauth-password")} name="password" autoComplete="current-password" required />
          </Field>
        </>
      )}
      <div className="flex gap-2 pt-1">
        <Button type="submit" name="decision" value="deny" formNoValidate disabled={pending} className="flex-1">
          Deny
        </Button>
        <Button type="submit" name="decision" value="allow" variant="default" loading={pending || !!state?.redirectTo} className="flex-1">
          {signedInAs ? "Allow" : "Sign in & allow"}
        </Button>
      </div>
    </form>
  );
}
