import { NextRequest, NextResponse } from "next/server";
import { getDemoSessionIdentity } from "@/lib/demo/invitations";
import { isLocalDemoRequest } from "@/lib/demo/request-guards";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isLocalDemoRequest(request)) {
    return NextResponse.json({ error: "Demo sessions are unavailable." }, { status: 404 });
  }

  const sessionId = request.cookies.get("rohobot_session")?.value;
  const role = request.cookies.get("rohobot_role")?.value;
  if (!sessionId || (role !== "candidate" && role !== "employer")) {
    return NextResponse.json({ error: "Sign-in is required." }, { status: 401 });
  }

  const account = getDemoSessionIdentity(sessionId);
  if (!account || account.role !== role) {
    return NextResponse.json({ error: "Demo session has expired or was lost." }, { status: 401 });
  }

  return NextResponse.json({ account });
}
