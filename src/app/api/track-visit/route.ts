import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

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

    const visitData = await request.json();

    // Validate required fields
    if (!visitData.name || !visitData.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare data for Google Apps Script
    const trackingData = {
      action: "track_visit",
      name: visitData.name,
      timestamp: visitData.timestamp,
      deviceType: visitData.deviceType || "unknown",
      userAgent: visitData.userAgent || "",
      referrer: visitData.referrer || "",
      url: visitData.url || "",
    };

    // Send to Google Apps Script
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      console.error("Google Script URL not configured");
      return NextResponse.json(
        { error: "Tracking service not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "RSVP-Tracking/1.0",
      },
      body: new URLSearchParams(trackingData),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Visit tracked successfully:", result);
      return NextResponse.json({ success: true, data: result });
    } else {
      console.error("Google Script tracking failed:", response.status);
      // Don't fail the request - tracking should be non-blocking
      return NextResponse.json({
        success: false,
        message: "Tracking failed but continuing",
      });
    }
  } catch (error) {
    console.error("Error tracking visit:", error);
    // Don't fail the request - tracking should be non-blocking
    return NextResponse.json(
      { success: false, message: "Tracking error but continuing" },
      { status: 500 }
    );
  }
}

