import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTE_GUARDS = [
  { prefix: "/admin", requiredRole: "admin" },
  { prefix: "/employer", requiredRole: "employer" },
  { prefix: "/candidate", requiredRole: "candidate" },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/employer/register") return NextResponse.next();

  const guard = ROUTE_GUARDS.find((g) => pathname.startsWith(g.prefix));
  if (!guard) return NextResponse.next();

  const sessionCookie = request.cookies.get("rohobot_session")?.value;
  const authRole = request.cookies.get("rohobot_role")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // This cookie selects the matching UI only; backend API permissions remain authoritative.
  if (authRole !== guard.requiredRole) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

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