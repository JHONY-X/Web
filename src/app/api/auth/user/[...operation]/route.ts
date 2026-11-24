import { NextRequest, NextResponse } from "next/server";
import {
  apiClient,
  getApiErrorMessage,
  hasTokenPair,
  readApiResponse,
} from "@/lib/api/client";

type Operation = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH";
  auth?: boolean;
};

const OPERATIONS: Record<string, Operation> = {
  login: { path: "/user/login/", method: "POST" },
  register: { path: "/user/register/", method: "POST" },
  logout: { path: "/user/logout/", method: "POST", auth: true },
  refresh: { path: "/user/refresh/", method: "POST" },
  profile: { path: "/user/change-profile/", method: "PUT", auth: true },
  "password/change": { path: "/user/change-password/", method: "PATCH", auth: true },
  "password/forgot": { path: "/user/forget-password/", method: "POST" },
  "password/reset": { path: "/user/reset-password/", method: "PUT" },
  "verify-email": { path: "/user/verify-email/", method: "POST" },
  "resend-otp": { path: "/user/resend-otp/", method: "POST" },
};

type RouteContext = {
  params: Promise<{ operation: string[] }>;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete("rohobot_session");
  response.cookies.delete("rohobot_refresh");
  response.cookies.delete("rohobot_role");
  response.cookies.delete("rohobot_access");
}

function getOperation(operation: string[]): Operation | undefined {
  if (operation[0] === "password" && operation[1] === "reset-confirm" && operation.length === 4) {
    return {
      path: `/user/reset-password-confirm/${encodeURIComponent(operation[2])}/${encodeURIComponent(operation[3])}/`,
      method: "GET",
    };
  }
  return OPERATIONS[operation.join("/")];
}

async function handle(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { operation: segments } = await context.params;
  const operation = getOperation(segments);
  if (!operation) {
    return NextResponse.json({ error: "This account operation is not supported." }, { status: 404 });
  }

  if (request.method !== operation.method) {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }

  const accessToken = request.cookies.get("rohobot_session")?.value;
  const refreshToken = request.cookies.get("rohobot_refresh")?.value;
  const operationName = segments.join("/");
  let requestBody: unknown;

  if (
    request.method !== "GET" &&
    operationName !== "logout" &&
    operationName !== "refresh" &&
    operationName !== "resend-otp"
  ) {
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json({ error: "A valid JSON request body is required." }, { status: 400 });
    }
  }

  if (operationName === "login") {
    if (
      typeof requestBody !== "object" ||
      requestBody === null ||
      typeof (requestBody as Record<string, unknown>).email_address !== "string" ||
      typeof (requestBody as Record<string, unknown>).password !== "string"
    ) {
      return NextResponse.json(
        { error: "Enter your email address and password." },
        { status: 400 }
      );
    }
  }

  if (operation.auth && operationName !== "logout" && !accessToken) {
    return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  }

  if (operationName === "register") {
    if (typeof requestBody !== "object" || requestBody === null) {
      return NextResponse.json({ error: "Complete the required registration fields." }, { status: 400 });
    }
    const body = requestBody as Record<string, unknown>;
    const requiredStrings = [
      "first_name",
      "middle_name",
      "last_name",
      "phone_number",
      "password",
      "password2",
    ];
    if (
      requiredStrings.some((key) => typeof body[key] !== "string") ||
      (body.email_address !== undefined && typeof body.email_address !== "string") ||
      (body.invitation_link !== undefined && typeof body.invitation_link !== "string")
    ) {
      return NextResponse.json({ error: "Complete the required registration fields." }, { status: 400 });
    }
  }

  if (operationName === "logout") {
    if (!accessToken || !refreshToken) {
      const response = NextResponse.json({ success: true });
      clearAuthCookies(response);
      return response;
    }
    requestBody = { refresh_token: refreshToken };
  }

  if (operationName === "refresh") {
    if (!refreshToken) {
      const response = NextResponse.json({ error: "Your session has expired. Sign in again." }, { status: 401 });
      clearAuthCookies(response);
      return response;
    }
    requestBody = { refresh: refreshToken };
  }

  try {
    const upstream = await apiClient(
      operation.path,
      {
        method: operation.method,
        ...(requestBody === undefined
          ? {}
          : { body: JSON.stringify(requestBody) }),
      },
      operation.auth ? accessToken : undefined
    );
    const data = await readApiResponse(upstream);

    if (!upstream.ok) {
      const response = NextResponse.json(
        {
          error: getApiErrorMessage(data, "The Rohobot API rejected this request."),
          details: data,
        },
        { status: upstream.status }
      );
      if (upstream.status === 401 && operation.auth && operationName === "logout") {
        clearAuthCookies(response);
      } else if (upstream.status === 401 && operation.auth && refreshToken) {
        try {
          const refreshResponse = await apiClient("/user/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          const refreshedTokens = await readApiResponse(refreshResponse);
          if (refreshResponse.ok && hasTokenPair(refreshedTokens)) {
            const retryResponse = NextResponse.json(
              { error: "Your session was refreshed. Please retry the request." },
              { status: 401 }
            );
            retryResponse.cookies.set("rohobot_session", refreshedTokens.access, cookieOptions);
            retryResponse.cookies.set("rohobot_refresh", refreshedTokens.refresh, cookieOptions);
            return retryResponse;
          }
          clearAuthCookies(response);
          return NextResponse.json(
            { error: "Your session has expired. Sign in again." },
            { status: 401, headers: response.headers }
          );
        } catch (refreshError) {
          clearAuthCookies(response);
          const message = refreshError instanceof Error
            ? refreshError.message
            : "Your session has expired. Sign in again.";
          return NextResponse.json(
            { error: message },
            { status: 401, headers: response.headers }
          );
        }
      } else if (upstream.status === 401 && operation.auth) {
        clearAuthCookies(response);
      }
      return response;
    }

    if (operationName === "login" || operationName === "refresh") {
      if (!hasTokenPair(data)) {
        return NextResponse.json(
          {
            error:
              "The Rohobot API did not return the documented access and refresh tokens. No session was created.",
          },
          { status: 502 }
        );
      }

      const requestedRole = request.nextUrl.searchParams.get("role");
      const responseBody = operationName === "login"
        ? {
            success: true,
            role: requestedRole === "employer" ? "employer" : "candidate",
          }
        : { success: true };
      const response = NextResponse.json(responseBody);
      response.cookies.set("rohobot_session", data.access, cookieOptions);
      response.cookies.set("rohobot_refresh", data.refresh, cookieOptions);

      if (operationName === "login") {
        const role = requestedRole === "employer" ? "employer" : "candidate";
        response.cookies.set("rohobot_role", role, cookieOptions);
      }
      return response;
    }

    if (operationName === "register") {
      return NextResponse.json({
        success: true,
        message: "Registration submitted. Follow the backend's verification instructions.",
      });
    }

    if (operationName === "logout") {
      const response = NextResponse.json({ success: true });
      clearAuthCookies(response);
      return response;
    }

    if (upstream.status === 204 || data === null) {
      return new NextResponse(null, { status: upstream.status });
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The Rohobot API request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
