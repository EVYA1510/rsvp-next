// src/app/api/submit/route.ts
export const dynamic = "force-dynamic";

function getEndpoint() {
  const a = process.env.NEXT_PUBLIC_GAS_ENDPOINT?.trim();
  const b = process.env.GOOGLE_SCRIPT_URL?.trim();
  return a || b || "";
}

function normalizeOk(data: any) {
  if (typeof data?.ok === "boolean") return data.ok;
  if (typeof data?.success === "boolean") return data.success;
  return false;
}

export async function GET(req: Request) {
  const ENDPOINT = getEndpoint();
  const urlObj = new URL(req.url);
  const health = urlObj.searchParams.get("health");
  if (!ENDPOINT) {
    return Response.json({ ok: false, message: "Missing GAS endpoint" }, { status: 500 });
  }
  if (health === "1" || health === "true") {
    const r = await fetch(`${ENDPOINT}?action=health`, { cache: "no-store", redirect: "follow" });
    const data = await r.json().catch(() => ({}));
    const ok = normalizeOk(data);
    return Response.json({ ok, gas: data }, { status: ok ? 200 : 502 });
  }
  return Response.json({ ok: true, message: "POST here to submit RSVP" });
}

export async function POST(req: Request) {
  try {
    const ENDPOINT = getEndpoint();
    if (!ENDPOINT) {
      return Response.json({ ok: false, message: "Missing GAS endpoint" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({} as any));
    const name = String(body.name ?? "").trim();
    const status = String(body.status ?? "").trim();
    const guests = Number.isFinite(Number(body.guests)) ? String(body.guests) : "1";
    const blessing = String(body.blessing ?? "");
    const reportId = body.reportId ? String(body.reportId).trim() : "";

    if (!name || !status) {
      return Response.json({ ok: false, message: "Missing name/status" }, { status: 400 });
    }

    const qs = new URLSearchParams();
    qs.set("action", "upsert");
    qs.set("name", name);
    qs.set("status", status);
    qs.set("guests", guests);
    if (blessing) qs.set("blessing", blessing);
    if (reportId) qs.set("reportId", reportId);

    const url = `${ENDPOINT}?${qs.toString()}`;
    const res = await fetch(url, { method: "GET", cache: "no-store", redirect: "follow" });
    const data = await res.json().catch(() => ({}));
    const ok = normalizeOk(data);

    return Response.json(
      {
        ok,
        action: data.action ?? (reportId ? "update" : "create"),
        reportId: data.reportId ?? reportId ?? null,
        gas: data,
      },
      { status: ok ? 200 : 502 }
    );
  } catch (err: any) {
    return Response.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
