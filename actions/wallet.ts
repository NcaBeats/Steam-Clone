"use server";

import { fetchAPI } from "@/lib/api/fetch";
import type { Wallet } from "@/types";

export async function getMyWalletAction(): Promise<Wallet | null> {
  try {
    return await fetchAPI<Wallet>("/wallet", {
      auth: true,
      revalidate: 0,
    });
  } catch {
    return null;
  }
}

export async function depositToWalletAction(
  amount: number,
): Promise<Wallet | null> {
  try {
    return await fetchAPI<Wallet>("/wallet/deposit", {
      method: "POST",
      body: { amount },
      auth: true,
    });
  } catch {
    return null;
  }
}
