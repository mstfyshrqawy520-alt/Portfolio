import { NextResponse } from "next/server";
import { getAdminClearCookieHeader } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin logged out successfully.",
  });
  response.headers.set("Set-Cookie", getAdminClearCookieHeader());
  return response;
}
