import type { Metadata } from "next";
import { auth } from "../../../auth";
import { LogoMark } from "../../../components/brand/Logo";
import { AuthorizeForm } from "./authorize-form";
import { validateAuthorizeParams, type AuthorizeParams } from "./actions";

export const metadata: Metadata = { title: "Authorize access" };
export const dynamic = "force-dynamic";

export default async function AuthorizePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const params: Partial<AuthorizeParams> = {
    client_id: sp.client_id,
    redirect_uri: sp.redirect_uri,
    state: sp.state,
    code_challenge: sp.code_challenge,
    code_challenge_method: sp.code_challenge_method,
    response_type: sp.response_type,
  };
  const valid = await validateAuthorizeParams(params);
  const session = await auth();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[24rem]">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark size="lg" />
          <p className="eyebrow mt-5">Ayush Shah · Admin</p>
          <h1 className="page-title mt-2">Authorize access</h1>
        </div>
        <div className="card p-5 sm:p-6">
          {"error" in valid ? (
            <div role="alert" className="space-y-2">
              <p className="text-[14px] font-medium text-danger">This request can&apos;t be completed</p>
              <p className="text-[13px] text-muted">{valid.error} Go back to the app and try connecting again.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2 text-[13.5px]">
                <p>
                  <strong>{valid.client.name}</strong> wants to use your content tools: read and write blog posts, products and slang, and upload images, as you.
                </p>
                <p className="mono break-all text-[11.5px] text-muted">Returns to {new URL(valid.params.redirect_uri).host}</p>
              </div>
              <AuthorizeForm params={JSON.stringify(valid.params)} signedInAs={session?.user?.email ?? null} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
