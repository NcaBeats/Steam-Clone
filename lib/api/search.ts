import type { Game } from "@/types";
import { ApiError } from "./errors";
import { API_BASE } from "./config";

export async function searchGamesClient(name: string): Promise<Game[]> {
  const res = await fetch(`${API_BASE}/games?name=${encodeURIComponent(name)}&size=10`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || `Search failed: ${res.status}`);
  }
  const data = await res.json();
  if (typeof data !== "object" || data === null || !("content" in data) || !Array.isArray((data as any).content)) {
    throw new ApiError(res.status, "Unexpected response shape from search endpoint");
  }
  return (data as { content: Game[] }).content;
}

