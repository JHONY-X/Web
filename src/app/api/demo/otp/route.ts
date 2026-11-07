import { NextRequest, NextResponse } from "next/server";
import {
  requestDemoEmailOtp,
  verifyDemoEmailOtp,
} from "@/lib/demo/invitations";
import { isLocalDemoRequest } from "@/lib/demo/request-guards";

export const runtime = "nodejs";

function isRole(value: unknown): value is "candidate" | "employer" {
  return value === "candidate" || value === "employer";
}

export async function POST(request: NextRequest) {
  if (!isLocalDemoRequest(request)) {
    return NextResponse.json({ error: "Demo OTP verification is unavailable." }, { status: 404 });
  }

  let role: unknown;
  let email: unknown;
  let action: unknown;
  let code: unknown;
  try {
    ({ role, email, action, code } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid email verification request." }, { status: 400 });
  }
  if (!isRole(role) || typeof email !== "string") {
    return NextResponse.json({ error: "Choose a valid role and email address." }, { status: 400 });
  }

  if (action === "request") {
    const requested = requestDemoEmailOtp(role, email);
    return requested
      ? NextResponse.json({
          success: true,
          message: "A demo OTP was created. Ask the Rohobot admin to share the code from the demo verification inbox.",
        })
      : NextResponse.json({ error: "No unverified account was found for this email." }, { status: 404 });
  }

  if (action === "verify") {
    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Enter the six-digit verification code." }, { status: 400 });
    }
    const result = verifyDemoEmailOtp(role, email, code);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  }

  return NextResponse.json({ error: "Choose a valid verification action." }, { status: 400 });
}
