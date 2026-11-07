import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeDemoSession } from "@/lib/demo/invitations";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("rohobot_session")?.value;
  if (sessionId?.startsWith("demo-")) {
    revokeDemoSession(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("rohobot_session");
  response.cookies.delete("rohobot_role");
  response.cookies.delete("rohobot_access");
  return response;
}
