import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing reportId parameter" 
        },
        { status: 400 }
      );
    }

    const gasUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!gasUrl) {
      return NextResponse.json(
        { 
          success: false,
          error: "Google Script URL not configured" 
        },
        { status: 500 }
      );
    }

    const url = `${gasUrl}?action=getById&reportId=${encodeURIComponent(id)}`;

    console.log(`Fetching RSVP data from GAS: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "RSVP-Form/1.0",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(`GAS responded with status: ${response.status}`);
      return NextResponse.json(
        { 
          success: false,
          error: `GAS request failed with status ${response.status}` 
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse GAS response:", parseError);
      return NextResponse.json({
        success: false,
        error: "Invalid response from GAS"
      }, { status: 500 });
    }
    
    console.log("RSVP data retrieved from GAS:", data);

    // Check if GAS returned an error
    if (data.error) {
      return NextResponse.json({
        success: false,
        error: data.error
      }, { status: 400 });
    }

    // Ensure we return a consistent format
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Error fetching RSVP data:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
