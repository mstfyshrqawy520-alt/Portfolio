import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "gedo_admin_session";

function getExpectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "admin123";
  return crypto.createHash("sha256").update(`admin-session-${secret}`).digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === getExpectedToken();
}

export function getAdminCookieHeader(maxAgeSeconds: number = 60 * 60 * 24 * 7): string {
  const token = getExpectedToken();
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${isProd ? "; Secure" : ""}`;
}

export function getAdminClearCookieHeader(): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? "; Secure" : ""}`;
}

// In-memory rate limiting map for login attempts
interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { attempts: 1, blockedUntil: 0 });
    return { allowed: true };
  }

  if (record.blockedUntil > now) {
    const waitSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Reset if block expired
  if (record.blockedUntil > 0 && record.blockedUntil <= now) {
    rateLimitMap.set(ip, { attempts: 1, blockedUntil: 0 });
    return { allowed: true };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    record.blockedUntil = now + 60 * 1000; // Block for 1 minute
    return { allowed: false, waitSeconds: 60 };
  }

  return { allowed: true };
}

export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}
