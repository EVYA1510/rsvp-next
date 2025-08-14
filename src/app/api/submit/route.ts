import { NextResponse } from "next/server";
import { RsvpSchema } from "@/lib/validations";
import { logError, logInfo } from "@/lib/logger";

const ENDPOINT = process.env.NEXT_PUBLIC_GAS_ENDPOINT!;

// מיפוי קוד → תווית בעברית לעמודה "סטטוס" בגיליון
const statusLabelHe: Record<string, string> = {
  yes: "מגיע",
  maybe: "אולי",
  no: "לא מגיע",
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RsvpSchema.parse(json);

    const payload = {
      action: "submit_rsvp",
      id: parsed.id,
      name: parsed.name,
      status: statusLabelHe[parsed.status] ?? parsed.status,
      guests: parsed.status === "yes" ? Math.max(1, parsed.guests) : 0,
      blessing: parsed.blessing ?? "",
      timestamp: new Date().toISOString(),
    };

    logInfo("Submitting RSVP to GAS", { payload });

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // למנוע caching
      cache: "no-store",
    });

    const text = await res.text();
    let data: any = {};
    try { 
      data = JSON.parse(text); 
    } catch { 
      data = { raw: text }; 
    }

    if (!res.ok || data.success === false) {
      logError("RSVP submit failed", { status: res.status, data, payload });
      return NextResponse.json({ ok: false, error: data?.message || "GAS error" }, { status: 500 });
    }

    logInfo("RSVP submitted successfully", { data });
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    logError("RSVP submit exception", { error: err?.message, stack: err?.stack });
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}

// GET endpoint removed - we only need POST for RSVP submission
