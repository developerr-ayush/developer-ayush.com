import { cors, isAllowedRedirect, json, signClient } from "../../../../lib/oauth";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

/** RFC 7591 dynamic client registration. Public clients only (PKCE protects the flow). */
export async function POST(req: Request) {
  let body: { client_name?: unknown; redirect_uris?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_client_metadata", error_description: "Body must be JSON" }, 400);
  }
  const uris = Array.isArray(body.redirect_uris) ? body.redirect_uris.filter((u): u is string => typeof u === "string") : [];
  if (uris.length === 0 || uris.length > 10 || !uris.every(isAllowedRedirect)) {
    return json(
      { error: "invalid_redirect_uri", error_description: "Provide 1-10 redirect_uris; each must be https (or http on localhost)." },
      400
    );
  }
  const name = (typeof body.client_name === "string" ? body.client_name : "MCP client").slice(0, 80);
  return json(
    {
      client_id: signClient(name, uris),
      client_name: name,
      redirect_uris: uris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    },
    201
  );
}
