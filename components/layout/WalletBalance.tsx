"use client";

import { useEffect, useState } from "react";
import { getMyWalletAction } from "@/actions/wallet";
import { formatPrice } from "@/lib/format";

export const WALLET_UPDATE_EVENT = "wallet:updated";

export function WalletBalance({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance);

  useEffect(() => {
    const refresh = async () => {
      try {
        const wallet = await getMyWalletAction();
        if (wallet) setBalance(wallet.balance);
      } catch {
        // El saldo del nav es decorativo: si la API falla seguimos mostrando
        // el ultimo valor conocido en vez de dejar el saldo en cero.
      }
    };
    window.addEventListener(WALLET_UPDATE_EVENT, refresh);
    return () => window.removeEventListener(WALLET_UPDATE_EVENT, refresh);
  }, []);

  return (
    <span className="text-[#C0C0C0] text-sm font-bold">
      {formatPrice(balance, { zeroAsFree: false })}
    </span>
  );
}
