import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected route prefixes and their required roles
const ROUTE_GUARDS = [
  { prefix: "/admin", requiredRole: "admin" },
  { prefix: "/employer", requiredRole: "employer" },
  { prefix: "/candidate", requiredRole: "candidate" },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/employer/register") return NextResponse.next();

  // 1. Find if the current path is protected
  const guard = ROUTE_GUARDS.find((g) => pathname.startsWith(g.prefix));
  if (!guard) return NextResponse.next();

  // 2. In production, read the session from secure HttpOnly cookies (NOT localStorage)
  // The backend sets this cookie after login. The frontend can read the role from it.
  const sessionCookie = request.cookies.get("rohobot_session")?.value;
  const authRole = request.cookies.get("rohobot_role")?.value; // Set by backend on login
  const access = request.cookies.get("rohobot_access")?.value;
  const isDemoSession = sessionCookie?.startsWith("demo-") ?? false;
  const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(
    request.nextUrl.hostname
  );

  // 3. If no session, redirect to login
  if (
    !sessionCookie ||
    (isDemoSession && (process.env.NODE_ENV === "production" || !isLocalHost))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If session exists but role doesn't match, send to unauthorized page
  if (authRole !== guard.requiredRole) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (guard.requiredRole === "candidate" && access !== "active" && pathname !== "/candidate/status") {
    return NextResponse.redirect(new URL("/candidate/status", request.url));
  }
  if (
    guard.requiredRole === "employer" &&
    access !== "active" &&
    pathname !== "/employer/activation" &&
    pathname !== "/employer/packages" &&
    pathname !== "/employer/payment" &&
    pathname !== "/employer/pending"
  ) {
    const destination =
      access === "payment-pending" ? "/employer/pending" : "/employer/activation";
    return NextResponse.redirect(new URL(destination, request.url));
  }
  if (guard.requiredRole === "employer" && access === "payment-pending" && pathname !== "/employer/pending") {
    return NextResponse.redirect(new URL("/employer/pending", request.url));
  }
  if (
    guard.requiredRole === "employer" &&
    access === "active" &&
    (pathname === "/employer/packages" || pathname === "/employer/payment" || pathname === "/employer/activation")
  ) {
    return NextResponse.redirect(new URL("/employer", request.url));
  }

  // 5. IMPORTANT: We also add security headers to every response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY"); // Prevent clickjacking
  response.headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME sniffing
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  // Apply middleware to all routes except static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};