"use server";

import { fetchAPI } from "@/lib/api/fetch";
import { fetchOrNull } from "@/lib/api/errors";
import type { Wallet } from "@/types";

export async function getMyWalletAction(): Promise<Wallet | null> {
  return fetchOrNull(() =>
    fetchAPI<Wallet>("/wallet", { auth: true, revalidate: 0 }),
  );
}

export async function depositToWalletAction(
  amount: number,
): Promise<Wallet | null> {
  return fetchOrNull(() =>
    fetchAPI<Wallet>("/wallet/deposit", {
      method: "POST",
      body: { amount },
      auth: true,
    }),
  );
}
