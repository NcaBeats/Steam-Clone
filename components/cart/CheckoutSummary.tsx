"use client";

import { useEffect, useState } from "react";
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
  getCart,
  getCartTotal,
  clearCart,
  removeFromCart,
  type CartItem as CartItemType,
} from "@/lib/cart";
import { formatPrice } from "@/lib";
import { getMyWalletAction, depositToWalletAction } from "@/actions/wallet";
import { createPurchaseAction } from "@/actions/purchase";
import type { Wallet } from "@/types";
import { useAlert } from "@/components/ui";

type Status = "loading" | "ready" | "submitting" | "success" | "error";

const DEPOSIT_AMOUNT = 50;

export const CheckoutSummary = () => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [items, setItems] = useState<CartItemType[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = getCartTotal(items);
  const insufficient = wallet !== null && wallet.balance < total;

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setItems(getCart());
    setStatus("ready");
  }, []);

  const handleRemove = (id: number) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const refreshWallet = async () => {
    setErrorMsg(null);
    const w = await getMyWalletAction();
    if (w) {
      setWallet(w);
    } else {
      setErrorMsg("Could not load your wallet. Try logging in again.");
    }
  };

  useEffect(() => {
    refreshWallet();
  }, []);

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

  const handleDeposit = async () => {
    setStatus("submitting");
    const w = await depositToWalletAction(DEPOSIT_AMOUNT);
    if (w) {
      setWallet(w);
      setStatus("ready");
      showAlert({
        variant: "default",
        title: "Deposit successful",
        description: `$${DEPOSIT_AMOUNT} added to your wallet.`,
      });
    } else {
      await refreshWallet();
      setStatus("ready");
      showAlert({
        variant: "destructive",
        title: "Deposit failed",
        description: "Could not deposit funds. Please try again.",
      });
    }
  };

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

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-center gap-3">
        <WalletIcon size={20} className="text-[#007AFF]" />
        <div className="flex-1">
          <p className="text-xs text-[#8A8A8A]">Wallet balance</p>
          <p className="text-lg font-bold text-[#FAFAFA]">
            {wallet ? formatPrice(wallet.balance) : "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeposit}
          disabled={status === "submitting"}
          className="bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E] hover:bg-[#2E2E2E] px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ease-out disabled:opacity-50"
        >
          + ${DEPOSIT_AMOUNT}
        </button>
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
