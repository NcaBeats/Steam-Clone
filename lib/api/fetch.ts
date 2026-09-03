import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:9090/api/v1";

export async function fetchAPI<T>(
  endpoint: string,
  options: {
    revalidate?: number;
    auth?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
  } = {},
): Promise<T> {
  const { revalidate = 60, auth = false, method = "GET", body } = options;

  const reqHeaders: Record<string, string> = {};

  if (auth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      reqHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (body) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate, tags: [endpoint] },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status} en ${endpoint}: ${text}`);
  }

  const data = await res.json();
  return data.content ?? data;
}
