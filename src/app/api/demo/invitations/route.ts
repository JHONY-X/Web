import { NextRequest, NextResponse } from "next/server";
import {
  createDemoInvitation,
  listDemoInvitations,
  revokeDemoInvitation,
  adminPreRegisterCandidate,
} from "@/lib/demo/invitations";
import { isLocalDemoAdmin } from "@/lib/demo/request-guards";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isLocalDemoAdmin(request)) {
    return NextResponse.json({ error: "Admin demo access is required." }, { status: 403 });
  }
  return NextResponse.json({ invitations: listDemoInvitations() });
}

export async function POST(request: NextRequest) {
  if (!isLocalDemoAdmin(request)) {
    return NextResponse.json({ error: "Admin demo access is required." }, { status: 403 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is okay for standard link generation
  }

  // If candidate details are provided, pre-register the candidate!
  if (body.action === "pre-register-candidate" || (body.firstName && body.email)) {
    const { firstName, middleName, lastName, email, phone, gender } = body;
    if (
      typeof firstName !== "string" ||
      typeof middleName !== "string" ||
      typeof lastName !== "string" ||
      (gender !== "Male" && gender !== "Female") ||
      typeof email !== "string" ||
      typeof phone !== "string"
    ) {
      return NextResponse.json(
        { error: "Provide first name, middle name, last name, mandatory gender (Male or Female), email, and phone number." },
        { status: 400 }
      );
    }

    const result = adminPreRegisterCandidate({
      firstName,
      middleName,
      lastName,
      gender,
      email,
      phone,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  }

  try {
    const { invitation, token } = createDemoInvitation();
    const registrationUrl = new URL(`/invite/${token}`, request.nextUrl.origin).toString();
    return NextResponse.json({ invitation, registrationUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create the invitation." },
      { status: 409 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isLocalDemoAdmin(request)) {
    return NextResponse.json({ error: "Admin demo access is required." }, { status: 403 });
  }

  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: "Choose an invitation to revoke." }, { status: 400 });
  }
  if (typeof id !== "string" || !revokeDemoInvitation(id)) {
    return NextResponse.json({ error: "This pending invitation could not be revoked." }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}
