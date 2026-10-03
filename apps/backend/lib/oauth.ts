import jwt from "jsonwebtoken";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Stateless OAuth 2.1 (authorization code + PKCE) for the MCP endpoint.
 * Clients, codes and tokens are all signed JWTs, so no database tables are needed.
 * Same secret as the MCP `login` tokens, so both kinds are accepted by /api/mcp.
 */
const SECRET = process.env.MCP_JWT_SECRET ?? process.env.AUTH_SECRET ?? "mcp-dev-secret";

export const ACCESS_TTL = 60 * 60; // 1 hour
export const REFRESH_TTL = 60 * 60 * 24 * 30; // 30 days
export const CODE_TTL = 120; // 2 minutes
export const SCOPE = "mcp";

export interface SessionUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  name: string | null;
}

export function baseUrlFrom(headers: Headers, fallbackUrl: string) {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  const proto = headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") || host?.startsWith("127.") ? "http" : "https");
  return host ? `${proto}://${host}` : new URL(fallbackUrl).origin;
}

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id",
  "Access-Control-Expose-Headers": "WWW-Authenticate",
};

export const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors, ...extra },
  });

export function authorizationServerMetadata(base: string) {
  return {
    issuer: base,
    authorization_endpoint: `${base}/oauth/authorize`,
    token_endpoint: `${base}/api/oauth/token`,
    registration_endpoint: `${base}/api/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: [SCOPE],
  };
}

// ── Clients (dynamic client registration, stateless) ─────────────────────────

export function isAllowedRedirect(uri: string) {
  try {
    const u = new URL(uri);
    if (u.hash) return false;
    if (u.protocol === "https:") return true;
    return u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]");
  } catch {
    return false;
  }
}

export function signClient(name: string, redirectUris: string[]) {
  return jwt.sign({ typ: "client", name, ru: redirectUris }, SECRET, { expiresIn: "3650d" });
}

export function readClient(clientId: string | null | undefined): { name: string; redirectUris: string[] } | null {
  if (!clientId) return null;
  try {
    const p = jwt.verify(clientId, SECRET) as { typ?: string; name?: string; ru?: string[] };
    if (p.typ !== "client" || !Array.isArray(p.ru)) return null;
    return { name: p.name || "MCP client", redirectUris: p.ru };
  } catch {
    return null;
  }
}

// ── Authorization codes + PKCE ───────────────────────────────────────────────

export function issueCode(args: { user: SessionUser; clientId: string; redirectUri: string; challenge: string }) {
  return jwt.sign(
    { typ: "code", sub: args.user.id, cid: args.clientId, ru: args.redirectUri, cc: args.challenge },
    SECRET,
    { expiresIn: CODE_TTL }
  );
}

export function readCode(code: string) {
  try {
    const p = jwt.verify(code, SECRET) as { typ?: string; sub?: string; cid?: string; ru?: string; cc?: string };
    return p.typ === "code" && p.sub && p.cid && p.ru && p.cc ? { userId: p.sub, clientId: p.cid, redirectUri: p.ru, challenge: p.cc } : null;
  } catch {
    return null;
  }
}

export function pkceMatches(verifier: string, challenge: string) {
  if (verifier.length < 43 || verifier.length > 128) return false;
  const computed = createHash("sha256").update(verifier).digest("base64url");
  const a = Buffer.from(computed);
  const b = Buffer.from(challenge);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ── Tokens ───────────────────────────────────────────────────────────────────

export function issueTokens(user: SessionUser, clientId: string) {
  // Access token payload matches the MCP `login` token (userId/email/role/name) plus typ.
  const access_token = jwt.sign({ typ: "access", userId: user.id, email: user.email, role: user.role, name: user.name }, SECRET, {
    expiresIn: ACCESS_TTL,
  });
  const refresh_token = jwt.sign({ typ: "refresh", sub: user.id, cid: clientId }, SECRET, { expiresIn: REFRESH_TTL });
  return { access_token, token_type: "Bearer", expires_in: ACCESS_TTL, refresh_token, scope: SCOPE };
}

export function readRefresh(token: string) {
  try {
    const p = jwt.verify(token, SECRET) as { typ?: string; sub?: string; cid?: string };
    return p.typ === "refresh" && p.sub && p.cid ? { userId: p.sub, clientId: p.cid } : null;
  } catch {
    return null;
  }
}

/** Cheap check used before touching the database: is this a currently valid access/login token? */
export function isValidAccessToken(token: string) {
  try {
    const p = jwt.verify(token, SECRET) as { typ?: string; userId?: string; email?: string };
    return (p.typ === undefined || p.typ === "access") && typeof p.userId === "string" && typeof p.email === "string";
  } catch {
    return false;
  }
}
