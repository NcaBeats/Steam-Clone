import { cookies } from "next/headers";
import { ApiError } from "./errors";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:9090/api/v1";

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

/**
 * How the caller expects the endpoint to be wrapped.
 *
 * - `raw` — body as-is. Default. Single objects, `void`, and anything that is
 *   not a Spring page.
 * - `page` — keep the whole `PagedModel` envelope (`{ content, page }`), for
 *   callers that render pagination controls.
 * - `list` — keep only `content`, for callers that render one list and do not
 *   care about the totals.
 *
 * Every paginated backend endpoint returns `Page<T>`, which Spring Boot
 * serializes as `PagedModel`. Naming that at each call site keeps the two ends
 * honest: `page` and `list` throw when the body is not paginated instead of
 * coercing whatever happens to arrive.
 */
export type ResponseShape = "raw" | "page" | "list";

type PageEnvelope = { content: unknown[] };

function isPageEnvelope(data: unknown): data is PageEnvelope {
  return (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    Array.isArray((data as PageEnvelope).content)
  );
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
    responseShape?: ResponseShape;
  } = {},
): Promise<T> {
  const {
    revalidate = 60,
    auth = false,
    method = "GET",
    body,
    headers: customHeaders,
    noStore = false,
    responseShape = "raw",
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

  if (responseShape === "raw") {
    return data as T;
  }

  if (!isPageEnvelope(data)) {
    throw new ApiError(
      res.status,
      `${endpoint} was requested as "${responseShape}" but the response is not a ` +
        `paginated page. Either the endpoint stopped returning Page<T>, or this ` +
        `call should use responseShape: "raw".`,
    );
  }

  return (responseShape === "page" ? data : data.content) as T;
}
