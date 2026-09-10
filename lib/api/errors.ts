export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, detail: string, code?: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function fetchOrNull<T>(
  request: () => Promise<T>,
): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    console.error("[fetchAPI]", error);
    return null;
  }
}
