import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, resetRateLimit, getAdminCookieHeader } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed attempts. Please wait ${rateCheck.waitSeconds}s.`,
      },
      { status: 429 }
    );
  }

  try {
    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    resetRateLimit(ip);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
    });

    response.headers.set("Set-Cookie", getAdminCookieHeader());
    return response;
  } catch {
    return NextResponse.json(
      { error: "Malformed request payload." },
      { status: 400 }
    );
  }
}
