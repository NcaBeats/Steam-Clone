const API_BASE = "http://localhost:8080/api/v1";
const TOKEN =
  "eyJraWQiOiI4RVhqOHFTdUhYTmczWjROVDg2SU5iUWJFQTFiRUVPZEhWMXpodXUyXzM0IiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIxIiwidmVyIjowLCJyb2xlIjoiQURNSU4iLCJpc3MiOiJwcm95ZWN0by1qdWVnb3MiLCJuYW1lIjoicGxheWVyMSIsImV4cCI6MTc4ODE5OTA2MiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc4ODE5NTQ2Mn0.0ZBZSBQY-DEj6UNWFzq3O2HEjceDxhg2LEaVs4QNIys";

async function fetchAPI<T>(
  endpoint: string,
  options: { revalidate?: number; auth?: boolean } = {},
): Promise<T> {
  const { revalidate = 60, auth = false } = options;

  const reqHeaders: Record<string, string> = {};
  if (auth) {
    reqHeaders.Authorization = `Bearer ${TOKEN}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: reqHeaders,
    next: { revalidate, tags: [endpoint] },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} en ${endpoint}`);
  }

  const data = await res.json();
  return data.content ?? data;
}

export { fetchAPI };
