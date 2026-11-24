import { NextRequest, NextResponse } from "next/server";
import {
  apiClient,
  getApiErrorMessage,
  readApiResponse,
} from "@/lib/api/client";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("rohobot_session")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Sign in with an authorized account to send an invitation." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "A valid JSON request body is required." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Enter the candidate's name and email address." }, { status: 400 });
  }

  const { full_name, email_address } = body as Record<string, unknown>;
  if (
    typeof full_name !== "string" ||
    !full_name.trim() ||
    typeof email_address !== "string" ||
    !email_address.trim()
  ) {
    return NextResponse.json({ error: "Enter the candidate's name and email address." }, { status: 400 });
  }

  try {
    const upstream = await apiClient(
      "/invite/create/",
      {
        method: "POST",
        body: JSON.stringify({
          full_name: full_name.trim(),
          email_address: email_address.trim(),
        }),
      },
      accessToken
    );
    const data = await readApiResponse(upstream);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: getApiErrorMessage(data, "The Rohobot API could not send the invitation.") },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The invitation request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
