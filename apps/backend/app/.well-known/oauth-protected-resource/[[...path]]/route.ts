import { baseUrlFrom, cors, json } from "../../../../lib/oauth";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export function GET(req: Request) {
  const base = baseUrlFrom(req.headers, req.url);
  return json({
    resource: `${base}/api/mcp`,
    authorization_servers: [base],
    bearer_methods_supported: ["header"],
    scopes_supported: ["mcp"],
  });
}
