import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { submitToGoogleScript } from "@/lib/googleScriptClient";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "יותר מדי בקשות, נסה שוב בעוד דקה." },
        { status: 429 }
      );
    }

    // Try to get JSON body first, fallback to URL parameters
    let formData: any = {};

    try {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        formData = await request.json();
      } else {
        // Fallback to URL parameters
        const { searchParams } = new URL(request.url);
        formData = {
          name: searchParams.get("name"),
          status: searchParams.get("status"),
          guests: searchParams.get("guests"),
          blessing: searchParams.get("blessing") || "",
          timestamp: searchParams.get("timestamp"),
          id: searchParams.get("id"),
        };
      }
    } catch (error) {
      // If JSON parsing fails, try URL parameters
      const { searchParams } = new URL(request.url);
      formData = {
        name: searchParams.get("name"),
        status: searchParams.get("status"),
        guests: searchParams.get("guests"),
        blessing: searchParams.get("blessing") || "",
        timestamp: searchParams.get("timestamp"),
        id: searchParams.get("id"),
      };
    }

    // Validate required fields
    if (!formData.name || !formData.status) {
      return NextResponse.json(
        { error: "Missing required fields: name and status" },
        { status: 400 }
      );
    }

    // Set defaults if missing
    if (!formData.guests) formData.guests = "1";
    if (!formData.timestamp) formData.timestamp = new Date().toISOString();
    if (!formData.id)
      formData.id = `rsvp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    // Submit to Google Script with retry mechanism
    const result = await submitToGoogleScript(formData);

    return NextResponse.json({
      success: true,
      message: "RSVP submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Proxy error:", error);

    // Return user-friendly error message
    return NextResponse.json(
      {
        error: "שגיאה בשליחת האישור. אנא נסה שוב.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "יותר מדי בקשות, נסה שוב בעוד דקה." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const health = searchParams.get("health");
    const name = searchParams.get("name");

    // Health check
    if (health === "1" || health === "true") {
      const url = process.env.GOOGLE_SCRIPT_URL;
      if (!url) {
        return NextResponse.json(
          { ok: false, message: "Google Script URL not configured" },
          { status: 500 }
        );
      }

      try {
        const response = await fetch(`${url}?action=health`, {
          cache: "no-store",
          redirect: "follow",
        });
        const data = await response.json().catch(() => ({}));
        const ok = data?.ok === true || data?.success === true;

        return NextResponse.json({ ok, gas: data }, { status: ok ? 200 : 502 });
      } catch (error) {
        return NextResponse.json(
          { ok: false, message: "Health check failed" },
          { status: 502 }
        );
      }
    }

    // Check previous RSVP
    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required for RSVP lookup" },
        { status: 400 }
      );
    }

    // For now, return empty data since we don't have GET integration
    return NextResponse.json({
      found: false,
      message: "No previous RSVP found",
    });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
