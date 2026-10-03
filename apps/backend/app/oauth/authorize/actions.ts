"use server";

import bcrypt from "bcryptjs";
import { auth } from "../../../auth";
import { getUserByEmail } from "../../../data/user";
import { isAllowedRedirect, issueCode, readClient, type SessionUser } from "../../../lib/oauth";

export interface AuthorizeParams {
  client_id: string;
  redirect_uri: string;
  state?: string;
  code_challenge: string;
  code_challenge_method: string;
  response_type: string;
}

/** Validates the OAuth request. Returns an error string if it must NOT be redirected back. */
export async function validateAuthorizeParams(p: Partial<AuthorizeParams>) {
  const client = readClient(p.client_id);
  if (!client || !p.client_id) return { error: "Unknown or invalid client." as const };
  if (!p.redirect_uri || !isAllowedRedirect(p.redirect_uri) || !client.redirectUris.includes(p.redirect_uri)) {
    return { error: "The redirect address doesn't match what this app registered." as const };
  }
  if (p.response_type !== "code") return { error: "Only response_type=code is supported." as const };
  if (!p.code_challenge || p.code_challenge_method !== "S256") return { error: "PKCE with code_challenge_method=S256 is required." as const };
  return { client, params: p as AuthorizeParams };
}

// Small in-memory throttle against password guessing (per instance, best effort).
const attempts = new Map<string, { n: number; reset: number }>();
function throttled(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.reset < now) {
    attempts.set(key, { n: 1, reset: now + 60_000 });
    return false;
  }
  a.n += 1;
  return a.n > 5;
}

// External redirects from server actions don't navigate the browser, so the client does it.
function back(params: AuthorizeParams, extra: Record<string, string>): { redirectTo: string } {
  const url = new URL(params.redirect_uri);
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);
  if (params.state) url.searchParams.set("state", params.state);
  return { redirectTo: url.toString() };
}

export async function decideAuthorization(_prev: { error?: string; redirectTo?: string; email?: string } | undefined, formData: FormData): Promise<{ error?: string; redirectTo?: string; email?: string }> {
  let params: Partial<AuthorizeParams>;
  try {
    params = JSON.parse(String(formData.get("params") ?? "{}"));
  } catch {
    return { error: "Invalid request." };
  }
  const valid = await validateAuthorizeParams(params);
  if ("error" in valid) return { error: valid.error };

  if (formData.get("decision") === "deny") return back(valid.params, { error: "access_denied" });

  let user: SessionUser | null = null;
  const session = await auth();
  if (session?.user?.email) {
    const u = await getUserByEmail(session.user.email);
    if (u) user = { id: u.id, email: u.email, role: u.role, name: u.name };
  }
  if (!user) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) return { error: "Enter your email and password.", email };
    if (throttled(email)) return { error: "Too many attempts. Wait a minute and try again.", email };
    const u = await getUserByEmail(email);
    const ok = u?.password ? await bcrypt.compare(password, u.password) : false;
    if (!u || !ok) return { error: "That email and password don't match.", email };
    user = { id: u.id, email: u.email, role: u.role, name: u.name };
  }

  const code = issueCode({ user, clientId: valid.params.client_id, redirectUri: valid.params.redirect_uri, challenge: valid.params.code_challenge });
  return back(valid.params, { code });
}
