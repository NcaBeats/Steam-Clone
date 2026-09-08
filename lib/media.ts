const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:9090/api/v1";
const ORIGIN = new URL(API_BASE).origin;
const R2_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ?? "";

export function resolveVideoUrl(src: string | null | undefined): string {
  if (!src) return "";
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith("/uploads/games/")) {
    const key = src.slice("/uploads/games/".length);
    if (R2_PUBLIC_BASE_URL) {
      return `${R2_PUBLIC_BASE_URL.replace(/\/+$/, "")}/${key}`;
    }
  }
  return new URL(src, ORIGIN).href;
}
