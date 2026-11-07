import { NextRequest, NextResponse } from "next/server";
import {
  getDemoEmployerActivation,
  selectDemoEmployerPackage,
} from "@/lib/demo/invitations";
import { isLocalDemoRequest } from "@/lib/demo/request-guards";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isLocalDemoRequest(request)) {
    return NextResponse.json({ error: "Demo account status is unavailable." }, { status: 404 });
  }
  const sessionId = request.cookies.get("rohobot_session")?.value;
  if (!sessionId || request.cookies.get("rohobot_role")?.value !== "employer") {
    return NextResponse.json({ error: "Employer sign-in is required." }, { status: 401 });
  }
  const account = getDemoEmployerActivation(sessionId);
  if (!account) return NextResponse.json({ error: "Employer demo session was lost." }, { status: 401 });
  return NextResponse.json({ account });
}

export async function POST(request: NextRequest) {
  if (!isLocalDemoRequest(request)) {
    return NextResponse.json({ error: "Demo package selection is unavailable." }, { status: 404 });
  }
  const sessionId = request.cookies.get("rohobot_session")?.value;
  if (
    !sessionId ||
    request.cookies.get("rohobot_role")?.value !== "employer"
  ) {
    return NextResponse.json({ error: "Employer sign-in is required." }, { status: 401 });
  }

  let packageName: unknown;
  try {
    ({ packageName } = await request.json());
  } catch {
    return NextResponse.json({ error: "Choose an employer package." }, { status: 400 });
  }
  if (
    packageName !== "Basic" &&
    packageName !== "Silver" &&
    packageName !== "Gold" &&
    packageName !== "Premium"
  ) {
    return NextResponse.json({ error: "Choose one of the available packages." }, { status: 400 });
  }
  const result = selectDemoEmployerPackage(sessionId, packageName);
  return NextResponse.json(result, { status: result.success ? 200 : 409 });
}
