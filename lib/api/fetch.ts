import { cookies } from "next/headers";
import { ApiError } from "./errors";
import { API_BASE } from "./config";

function parseError(status: number, raw: string): ApiError {
  if (raw) {
    try {
      const body = JSON.parse(raw);
      if (body && typeof body === "object") {
        let detail: string;
        const b: any = body;
        if (typeof b.detail === "string") detail = b.detail;
        else if (typeof b.message === "string") detail = b.message;
        else detail = "Request failed with status " + status;
        const code = typeof b.code === "string" ? b.code : undefined;
        return new ApiError(status, detail, code);
      }
    } catch {
      // Response body was not JSON; fall back to raw text below.
    }
  }
  return new ApiError(status, raw || ("Request failed with status " + status));
}

/**
 * Fetch helper: devuelve el JSON tal cual llega del backend.
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: {
    auth?: boolean;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const {
    auth = false,
    method = "GET",
    body,
    headers: customHeaders,
  } = options;
  const reqHeaders: Record<string, string> = { ...customHeaders };

  if (auth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      reqHeaders.Authorization = "Bearer " + token;
    }
  }

  if (body instanceof FormData) {
    // El navegador agrega el boundary automáticamente
  } else if (body) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(API_BASE + endpoint, {
    method,
    headers: reqHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw parseError(res.status, text);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
