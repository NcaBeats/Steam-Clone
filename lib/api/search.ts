import type { Game } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:9090/api/v1";

export async function searchGamesClient(name: string): Promise<Game[]> {
  const res = await fetch(
    `${API_BASE}/games?name=${encodeURIComponent(name)}&size=10`,
  );
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`);
  }
  const data = await res.json();
  // Same contract as fetchAPI's responseShape: "list". /games returns
  // Page<GameResponse>; failing loudly beats coercing whatever arrived.
  if (
    typeof data !== "object" ||
    data === null ||
    !Array.isArray((data as { content?: unknown }).content)
  ) {
    throw new Error(
      "Search expected a paginated response from /games but got an unexpected shape.",
    );
  }
  return (data as { content: Game[] }).content;
}
