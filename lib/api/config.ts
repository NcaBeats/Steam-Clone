const isServer = typeof window === "undefined";

export const API_BASE = isServer
  ? (process.env.API_BASE_URL ?? "http://127.0.0.1:9090/api/v1")
  : "/api/v1";
