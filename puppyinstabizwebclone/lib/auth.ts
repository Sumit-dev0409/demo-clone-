import { timingSafeEqual } from "node:crypto";

/**
 * Validates whether the incoming HTTP request has administrative privileges.
 * Supports:
 * - `Authorization: Bearer <ADMIN_API_KEY>`
 * - `x-admin-key: <ADMIN_API_KEY>`
 * - `Cookie: teddy_admin_token=<ADMIN_API_KEY>`
 */
export function isAuthorized(request: Request): boolean {
  const configuredKey = process.env.ADMIN_API_KEY || "teddy_secret_dev_key_2026";
  if (!configuredKey) return false;

  const authHeader = request.headers.get("authorization");
  let bearerToken: string | null = null;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    bearerToken = authHeader.slice(7).trim();
  }

  const headerKey = request.headers.get("x-admin-key")?.trim();

  // Check cookie
  const cookieHeader = request.headers.get("cookie") || "";
  let cookieKey: string | null = null;
  const match = cookieHeader.match(/teddy_admin_token=([^;]+)/);
  if (match) {
    cookieKey = decodeURIComponent(match[1]).trim();
  }

  const candidate = bearerToken || headerKey || cookieKey;
  if (!candidate) return false;

  const targetBuf = Buffer.from(configuredKey, "utf8");
  const candidateBuf = Buffer.from(candidate, "utf8");

  if (targetBuf.length !== candidateBuf.length) {
    return false;
  }

  return timingSafeEqual(targetBuf, candidateBuf);
}
