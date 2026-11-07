import { NextRequest, NextResponse } from "next/server";
import {
  inspectDemoInvitation,
  completeDemoCandidateRegistration,
  type CandidateCompletionInput,
} from "@/lib/demo/invitations";
import { isLocalDemoRequest } from "@/lib/demo/request-guards";

export const runtime = "nodejs";

function isCandidateCompletionInput(value: unknown): value is CandidateCompletionInput {
  return (
    typeof value === "object" &&
    value !== null &&
    "gender" in value && (value.gender === "Male" || value.gender === "Female") &&
    "criminalClearance" in value && typeof value.criminalClearance === "string" &&
    "password" in value && typeof value.password === "string" &&
    (!("policeClearanceFileName" in value) || typeof value.policeClearanceFileName === "string") &&
    (!("policeClearanceDataUrl" in value) || typeof value.policeClearanceDataUrl === "string")
  );
}

export async function POST(request: NextRequest) {
  if (!isLocalDemoRequest(request)) {
    return NextResponse.json({ error: "Demo registration is unavailable." }, { status: 404 });
  }

  let action: unknown;
  let token: unknown;
  let registration: unknown;
  try {
    ({ action, token, registration } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid invitation request." }, { status: 400 });
  }

  if (typeof token !== "string" || token.length > 200) {
    return NextResponse.json({ error: "This invitation link is invalid." }, { status: 400 });
  }

  if (action === "inspect") {
    return NextResponse.json(inspectDemoInvitation(token));
  }

  if (action === "register" || action === "complete") {
    if (!isCandidateCompletionInput(registration)) {
      return NextResponse.json({ error: "Provide gender (Male or Female), password, and criminal clearance details." }, { status: 400 });
    }

    const result = completeDemoCandidateRegistration(token, registration);
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  }

  return NextResponse.json({ error: "Invalid invitation action." }, { status: 400 });
}
