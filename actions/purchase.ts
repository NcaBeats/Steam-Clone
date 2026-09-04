"use server";

import { fetchAPI } from "@/lib/api/fetch";
import type { Purchase } from "@/types";

export type PurchaseItemInput = {
  gameId: number;
  quantity: number;
};

export type CreatePurchaseError =
  | "duplicate"
  | "insufficient_balance"
  | "unauthorized"
  | "not_found"
  | "unknown";

export type CreatePurchaseResult =
  | { ok: true; purchase: Purchase }
  | { ok: false; error: CreatePurchaseError; message: string };

function generateIdempotencyKey(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function parseError(status: number, text: string): CreatePurchaseError {
  if (status === 401) return "unauthorized";
  if (status === 404) return "not_found";
  const lower = text.toLowerCase();
  if (
    lower.includes("already in library") ||
    lower.includes("already in cart") ||
    lower.includes("duplicate") ||
    lower.includes("ya está") ||
    lower.includes("duplicado")
  )
    return "duplicate";
  if (lower.includes("insufficient") || lower.includes("balance"))
    return "insufficient_balance";
  return "unknown";
}

function errorMessage(error: CreatePurchaseError): string {
  switch (error) {
    case "duplicate":
      return "One or more games are already in your library.";
    case "insufficient_balance":
      return "Insufficient wallet balance. Please deposit funds.";
    case "unauthorized":
      return "Your session has expired. Please log in again.";
    case "not_found":
      return "One or more games are no longer available.";
    case "unknown":
    default:
      return "Purchase failed. Please try again.";
  }
}

export async function createPurchaseAction(
  items: PurchaseItemInput[],
): Promise<CreatePurchaseResult> {
  try {
    const idempotencyKey = generateIdempotencyKey();
    const purchase = await fetchAPI<Purchase>("/purchases", {
      method: "POST",
      body: { items },
      headers: { "Idempotency-Key": idempotencyKey },
      auth: true,
    });
    return { ok: true, purchase };
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    const statusMatch = message.match(/API error (\d+)/);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    const text = message.replace(/^API error \d+ en [^\s]+\s*/, "").trim();
    const error = parseError(status, text);
    return { ok: false, error, message: errorMessage(error) };
  }
}
