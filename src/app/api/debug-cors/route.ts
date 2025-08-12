export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const origin = request.headers.get("Origin") || "NO_ORIGIN";
  const allowed = process.env.ALLOWED_ORIGIN || "NOT_SET";
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || "NO_SHA";
  const now = new Date().toISOString();

  const json = {
    now,
    originReceived: origin,
    allowedOriginEnv: allowed,
    vercelCommit: commit,
  };

  return new Response(JSON.stringify(json, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": allowed,
      "Vary": "Origin",
      "Cache-Control": "no-store",
      "X-Debug-Build": commit,
    },
  });
}
