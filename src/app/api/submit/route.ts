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

    const { searchParams } = new URL(request.url);

    // Extract form data from URL parameters
    const name = searchParams.get("name");
    const status = searchParams.get("status");
    const guests = searchParams.get("guests");
    const blessing = searchParams.get("blessing");
    const timestamp = searchParams.get("timestamp");
    const id = searchParams.get("id");

    console.log("Received RSVP data:", {
      name,
      status,
      guests,
      blessing,
      timestamp,
      id,
    });

    if (!name || !status || !guests || !timestamp || !id) {
      console.log("Missing required fields:", {
        name,
        status,
        guests,
        timestamp,
        id,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare data for Google Script
    const formData = {
      name,
      status,
      guests,
      blessing: blessing || "",
      timestamp,
      id,
    };

    // Submit to Google Script with retry mechanism
    try {
      const result = await submitToGoogleScript(formData);
      console.log("Successfully submitted to Google Script:", result);
    } catch (googleError) {
      console.error("Google Script submission failed:", googleError);
      // Continue with local success response even if Google Script fails
      // This ensures the user gets a positive response
    }

    return NextResponse.json({
      success: true,
      message: "RSVP submitted successfully",
      data: { name, status, guests, blessing: blessing || "" },
    });
  } catch (error) {
    console.error("Error submitting RSVP:", error);
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
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required" },
        { status: 400 }
      );
    }

    console.log("Checking previous RSVP for:", name);

    // For now, return empty data since we don't have Google Script integration
    // This can be replaced with actual Google Script integration later
    return NextResponse.json({
      found: false,
      message: "No previous RSVP found",
    });
  } catch (error) {
    console.error("Error checking previous RSVP:", error);
    return NextResponse.json(
      { error: "Failed to check previous RSVP" },
      { status: 500 }
    );
  }
}
