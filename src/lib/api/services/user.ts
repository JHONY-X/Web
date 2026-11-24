export interface UserLoginRequest {
  email_address: string;
  password: string;
}

export interface UserRegistrationRequest {
  first_name: string;
  middle_name: string;
  last_name: string;
  email_address?: string;
  phone_number: string;
  password: string;
  password2: string;
  invitation_link?: string;
}

export interface UserProfileUpdateRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
}

async function request<T>(
  operation: string,
  method: "GET" | "POST" | "PUT" | "PATCH",
  body?: unknown
): Promise<T> {
  const response = await fetch(`/api/auth/user/${operation}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const result = await response.json().catch(() => null) as
    | { error?: string; message?: string }
    | T
    | null;

  if (!response.ok) {
    const message =
      result && typeof result === "object" && "error" in result
        ? result.error
        : result && typeof result === "object" && "message" in result
          ? result.message
          : "The account request failed.";
    throw new Error(typeof message === "string" ? message : "The account request failed.");
  }

  return result as T;
}

export const userService = {
  login: (credentials: UserLoginRequest, roleHint: "candidate" | "employer") =>
    request<{ success: true; role: "candidate" | "employer" }>(
      `login?role=${roleHint}`,
      "POST",
      credentials
    ),

  register: (registration: UserRegistrationRequest) =>
    request<{ success: true; message?: string }>("register", "POST", registration),

  logout: () => request<{ success: boolean }>("logout", "POST"),

  refresh: () => request<{ success: boolean }>("refresh", "POST"),

  updateProfile: (profile: UserProfileUpdateRequest) =>
    request<unknown>("profile", "PUT", profile),

  changePassword: (body: unknown) =>
    request<unknown>("password/change", "PATCH", body),

  requestPasswordReset: (emailAddress: string) =>
    request<unknown>("password/forgot", "POST", { email_address: emailAddress }),

  confirmPasswordResetLink: (uidb64: string, token: string) =>
    request<unknown>(
      `password/reset-confirm/${encodeURIComponent(uidb64)}/${encodeURIComponent(token)}`,
      "GET"
    ),

  resetPassword: (body: {
    password_1: string;
    password_2: string;
    uidb64: string;
    token: string;
  }) => request<unknown>("password/reset", "PUT", body),

  verifyEmail: (phone: string, code: string) =>
    request<unknown>("verify-email", "POST", { phone, code }),

  resendOtp: () => request<unknown>("resend-otp", "POST"),
};
