import "server-only";

const DEFAULT_API_BASE_URL = "https://heran.pythonanywhere.com/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiBaseUrl(): string {
  const configuredUrl =
    process.env.ROHOBOT_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL;

  return configuredUrl.replace(/\/+$/, "");
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  try {
    return await fetch(`${getApiBaseUrl()}${normalizedEndpoint}`, {
      ...options,
      headers,
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "The Rohobot API request timed out."
        : "Could not reach the Rohobot API.";
    throw new ApiError(message, 0, error);
  }
}

export async function readApiResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data !== "object" || data === null) return fallback;

  const record = data as Record<string, unknown>;
  for (const key of ["detail", "message", "error"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  for (const [field, value] of Object.entries(record)) {
    if (typeof value === "string" && value.trim()) return `${field}: ${value}`;
    if (Array.isArray(value)) {
      const firstMessage = value.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0
      );
      if (firstMessage) return `${field}: ${firstMessage}`;
    }
  }

  return fallback;
}

export function hasTokenPair(
  value: unknown
): value is { access: string; refresh: string } {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.access === "string" &&
    record.access.length > 0 &&
    typeof record.refresh === "string" &&
    record.refresh.length > 0
  );
}
