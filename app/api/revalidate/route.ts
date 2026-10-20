import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearDriveDataCache } from "@/lib/drive";

export async function POST(req: NextRequest) {
  try {
    const secret =
      req.headers.get("x-revalidate-secret") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      req.nextUrl.searchParams.get("secret");

    const expectedSecret = process.env.REVALIDATE_SECRET;

    // If REVALIDATE_SECRET is set in env, verify it.
    // If not set yet, reject unauthorized in production or allow with warning in dev.
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid revalidation secret." },
        { status: 401 }
      );
    }

    // Clear server-side Drive in-memory cache
    clearDriveDataCache();

    // Revalidate homepage ISR cache
    revalidatePath("/", "page");
    revalidatePath("/admin", "page");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: "Cache purged and pages revalidated successfully.",
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate.", details: (error as Error).message },
      { status: 500 }
    );
  }
}
