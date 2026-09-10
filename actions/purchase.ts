"use server";

import { fetchAPI } from "@/lib/api/fetch";
import { ApiError } from "@/lib/api/errors";
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

function parseError(error: unknown): CreatePurchaseError {
  if (error instanceof ApiError) {
    if (error.code === "INSUFFICIENT_BALANCE") return "insufficient_balance";
    if (error.code === "DUPLICATE_PURCHASE") return "duplicate";
    if (error.status === 401) return "unauthorized";
    if (error.status === 404) return "not_found";
    if (error.status === 409) return "duplicate";
  }
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
    const error = parseError(e);
    return { ok: false, error, message: errorMessage(error) };
  }
}
