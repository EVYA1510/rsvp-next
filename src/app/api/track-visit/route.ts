export const dynamic = "force-dynamic";

function getEndpoint() {
  const a = process.env.NEXT_PUBLIC_GAS_ENDPOINT?.trim();
  const b = process.env.GOOGLE_SCRIPT_URL?.trim();
  return a || b || "";
}

export async function POST(req: Request) {
  try {
    const ENDPOINT = getEndpoint();
    if (!ENDPOINT) {
      return Response.json({ ok: false, message: "Missing GAS endpoint" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({} as any));
    const name = String(body.name ?? "").trim();
    const reportId = body.reportId ? String(body.reportId).trim() : "";
    const device = String(body.device ?? "unknown").trim();

    if (!name) {
      return Response.json({ ok: false, message: "Missing name" }, { status: 400 });
    }

    const qs = new URLSearchParams();
    qs.set("action", "track_visit");
    qs.set("name", name);
    if (reportId) qs.set("reportId", reportId);
    if (device) qs.set("device", device);

    const url = `${ENDPOINT}?${qs.toString()}`;
    const res = await fetch(url, { method: "GET", cache: "no-store", redirect: "follow" });
    const data = await res.json().catch(() => ({}));
    const ok = data?.ok === true || data?.success === true;

    return Response.json({ ok, gas: data }, { status: ok ? 200 : 502 });
  } catch (err: any) {
    return Response.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
