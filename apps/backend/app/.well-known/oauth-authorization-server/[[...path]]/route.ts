import { authorizationServerMetadata, baseUrlFrom, cors, json } from "../../../../lib/oauth";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export function GET(req: Request) {
  return json(authorizationServerMetadata(baseUrlFrom(req.headers, req.url)));
}
