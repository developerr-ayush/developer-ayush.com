import { db } from "../../../../lib/db";
import { cors, issueTokens, json, pkceMatches, readClient, readCode, readRefresh, type SessionUser } from "../../../../lib/oauth";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

const toUser = (u: { id: string; email: string; role: string; name: string | null }): SessionUser => ({
  id: u.id,
  email: u.email,
  role: u.role as SessionUser["role"],
  name: u.name,
});

export async function POST(req: Request) {
  const form = new URLSearchParams(await req.text());
  const grant = form.get("grant_type");
  const clientId = form.get("client_id");
  const client = readClient(clientId);
  if (!client || !clientId) return json({ error: "invalid_client" }, 401);

  if (grant === "authorization_code") {
    const code = readCode(form.get("code") ?? "");
    const verifier = form.get("code_verifier") ?? "";
    if (!code || code.clientId !== clientId || code.redirectUri !== form.get("redirect_uri")) {
      return json({ error: "invalid_grant", error_description: "Code is invalid, expired or for another client." }, 400);
    }
    if (!pkceMatches(verifier, code.challenge)) return json({ error: "invalid_grant", error_description: "PKCE verification failed." }, 400);
    const user = await db.user.findUnique({ where: { id: code.userId } });
    if (!user) return json({ error: "invalid_grant" }, 400);
    return json(issueTokens(toUser(user), clientId));
  }

  if (grant === "refresh_token") {
    const r = readRefresh(form.get("refresh_token") ?? "");
    if (!r || r.clientId !== clientId) return json({ error: "invalid_grant" }, 400);
    // Re-read the user so deleted accounts and role changes take effect on refresh.
    const user = await db.user.findUnique({ where: { id: r.userId } });
    if (!user) return json({ error: "invalid_grant", error_description: "Account no longer exists." }, 400);
    return json(issueTokens(toUser(user), clientId));
  }

  return json({ error: "unsupported_grant_type" }, 400);
}
