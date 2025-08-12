import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { submitToGoogleScript } from "@/lib/googleScriptClient";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "יותר מדי בקשות, נסה שוב בעוד דקה." },
        { status: 429 }
      );
    }

    // Get form data from the original request
    const { searchParams } = new URL(request.url);
    const formData = {
      name: searchParams.get("name"),
      status: searchParams.get("status"),
      guests: searchParams.get("guests"),
      blessing: searchParams.get("blessing") || "",
      timestamp: searchParams.get("timestamp"),
      id: searchParams.get("id"),
    };

    // Validate required fields
    if (!formData.name || !formData.status || !formData.guests || !formData.timestamp || !formData.id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
    const ip = request.headers.get("x-forwarded-for") || 
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

    // For now, return empty data since we don't have GET integration
    return NextResponse.json({
      found: false,
      message: "No previous RSVP found",
    });

  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      { error: "Failed to check previous RSVP" },
      { status: 500 }
    );
  }
}
