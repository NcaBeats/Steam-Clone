import { cookies } from "next/headers";
import { ApiError } from "./errors";

const API_BASE = process.env.API_BASE_URL ?? "http://127.0.0.1:9090/api/v1";

function parseError(status: number, raw: string): ApiError {
  if (raw) {
    try {
      const body = JSON.parse(raw);
      if (body && typeof body === "object") {
        const detail =
          typeof body.detail === "string"
            ? body.detail
            : typeof body.message === "string"
              ? body.message
              : `Request failed with status ${status}`;
        const code = typeof body.code === "string" ? body.code : undefined;
        return new ApiError(status, detail, code);
      }
    } catch {
      // Response body was not JSON; fall back to raw text below.
    }
  }
  return new ApiError(status, raw || `Request failed with status ${status}`);
}

export async function fetchAPI<T>(
  endpoint: string,
  options: {
    revalidate?: number;
    auth?: boolean;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    noStore?: boolean;
    paginated?: boolean;
  } = {},
): Promise<T> {
  const {
    revalidate = 60,
    auth = false,
    method = "GET",
    body,
    headers: customHeaders,
    noStore = false,
    paginated = false,
  } = options;
  const reqHeaders: Record<string, string> = { ...customHeaders };

  if (auth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      reqHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (body instanceof FormData) {
    // Do not set Content-Type: browser adds it with the multipart boundary
  } else if (body) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const isRead = method === "GET";
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: reqHeaders,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...(noStore
      ? { cache: "no-store" as const }
      : isRead
        ? { next: { revalidate, tags: [endpoint] } }
        : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw parseError(res.status, text);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json();
  if (
    paginated &&
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray(data.content)
  ) {
    return data as T;
  }
  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray(data.content)
  ) {
    return data.content as T;
  }
  return data as T;
}
