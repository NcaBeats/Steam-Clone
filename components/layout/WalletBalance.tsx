"use client";

import { useEffect, useState } from "react";
import { getMyWalletAction } from "@/actions/wallet";
import { formatPrice } from "@/lib/format";

export const WALLET_UPDATE_EVENT = "wallet:updated";

export function WalletBalance({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance);

  useEffect(() => {
    const refresh = async () => {
      const wallet = await getMyWalletAction();
      if (wallet) setBalance(wallet.balance);
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
