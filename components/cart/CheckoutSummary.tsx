"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet as WalletIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  getCartTotal,
  removeFromCart,
  subscribeCart,
} from "@/lib/cart";
import { getMyWalletAction } from "@/actions/wallet";
import { createPurchaseAction } from "@/actions/purchase";
import { WALLET_UPDATE_EVENT } from "@/components/layout/WalletBalance";
import type { Wallet } from "@/types";
import { useAlert } from "@/components/ui";
import { formatPrice } from "@/lib";

type Status = "loading" | "ready" | "submitting" | "success" | "error";

export const CheckoutSummary = () => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const total = getCartTotal(items);
  const insufficient = wallet !== null && wallet.balance < total;

  const refreshWallet = async () => {
    try {
      const w = await getMyWalletAction();
      if (w) {
        setWallet(w);
      }
    } catch {
      // Wallet fetch failed, leave wallet as null
    }
  };

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setStatus("ready");
    refreshWallet();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleConfirm = async () => {
    if (items.length === 0) return;
    setStatus("submitting");
    setErrorMsg(null);
    const result = await createPurchaseAction(
      items.map((item) => ({ gameId: item.id, quantity: 1 })),
    );
    if (result.ok) {
      clearCart();
      setStatus("success");
      window.dispatchEvent(new Event(WALLET_UPDATE_EVENT));
      showAlert({
        variant: "default",
        title: "Purchase completed",
        description: "Your games have been added to your library.",
      });
      setTimeout(() => {
        router.push("/library");
      }, 800);
    } else {
      setStatus("error");
      setErrorMsg(result.message);
      showAlert({
        variant: "destructive",
        title: "Purchase failed",
        description: result.message,
      });
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <CheckCircle2 size={56} className="text-[#A1CD44]" />
        <h2 className="text-xl font-bold text-[#FAFAFA]">
          Purchase successful
        </h2>
        <p className="text-sm text-[#8A8A8A]">Redirecting to your library...</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-[#8A8A8A]">
        <Loader2 className="animate-spin" size={20} />
        <span>Loading checkout...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-[#8A8A8A] text-lg">Your cart is empty</p>
        <Link
          href="/"
          className="text-[#007AFF] hover:underline text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-center gap-3 w-fit">
        <WalletIcon size={20} className="text-[#007AFF]" />
        <div className="flex-1">
          <p className="text-xs text-[#8A8A8A]">Wallet balance</p>
          <p className="text-lg font-bold text-[#FAFAFA]">
            {wallet ? formatPrice(wallet.balance, { zeroAsFree: false }) : "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#FAFAFA]">Order Summary</h2>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-[#1A1A1A] rounded-lg p-2"
            >
              <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#FAFAFA] truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[#8A8A8A]">
                  {formatPrice(item.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-[#8A8A8A] hover:text-red-500 transition-colors p-1 cursor-pointer"
                aria-label="Remove"
              >
                <XCircle size={18} />
              </button>
            </div>
          ))}
        </div>
        <hr className="border-[#2A2A2A]" />
        <div className="flex justify-between text-sm text-[#C0C0C0]">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#FAFAFA]">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {insufficient && (
        <div className="bg-[#2A1A1A] border border-[#5C2A2A] rounded-lg p-3 text-sm text-[#FF6B6B]">
          Insufficient balance. Deposit funds to complete your purchase.
        </div>
      )}

      {errorMsg && status === "error" && (
        <div className="bg-[#2A1A1A] border border-[#5C2A2A] rounded-lg p-3 text-sm text-[#FF6B6B]">
          {errorMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "submitting" || insufficient || items.length === 0}
        className="bg-[#007AFF] hover:bg-[#1ea4ff] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Processing...
          </>
        ) : (
          "Confirm purchase"
        )}
      </button>
    </div>
  );
};
