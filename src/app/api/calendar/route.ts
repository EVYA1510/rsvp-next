import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Read the ICS file
    const icsPath = path.join(process.cwd(), "public", "wedding.ics");
    const icsContent = fs.readFileSync(icsPath, "utf-8");

    // Return with proper headers for calendar integration
    return new Response(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Access-Control-Allow-Origin":
          process.env.ALLOWED_ORIGIN || "https://rsvp-next.vercel.app",
        Vary: "Origin",
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": "attachment; filename=wedding.ics",
      },
    });
  } catch (error) {
    console.error("Error serving ICS file:", error);
    return new Response("Error serving calendar file", { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.ALLOWED_ORIGIN || "https://rsvp-next.vercel.app",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
