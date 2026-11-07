import type { NextRequest } from "next/server";

export function isLocalDemoRequest(request: NextRequest): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(request.nextUrl.hostname)
  );
}

export function isLocalDemoAdmin(request: NextRequest): boolean {
  return (
    isLocalDemoRequest(request) &&
    request.cookies.get("rohobot_session")?.value?.startsWith("demo-") === true &&
    request.cookies.get("rohobot_role")?.value === "admin"
  );
}
