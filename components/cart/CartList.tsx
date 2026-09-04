"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCart,
  removeFromCart,
  getCartTotal,
  type CartItem as CartItemType,
} from "@/lib/cart";
import { formatPrice } from "@/lib";
import { CartItem } from "./CartItem";
import { AuthOverlay } from "./AuthOverlay";

type Props = Readonly<{ isLoggedIn: boolean }>;

export const CartList = ({ isLoggedIn }: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<CartItemType[]>([]);
  const [mounted, setMounted] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setItems(getCart());
    setMounted(true);
  }, []);

  const handleRemove = (id: number) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    router.push("/checkout");
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-[#8A8A8A] text-lg">Your cart is empty</p>
          <Link
            href="/"
            className="text-[#007AFF] hover:underline text-sm font-medium"
          >
            Continue shopping
          </Link>
        </div>
        <AuthOverlay open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-3 flex-1 max-w-3xl w-full">
          {items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
        <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3 w-full lg:w-80 xl:w-96 shrink-0 self-start">
          <h2 className="text-lg font-bold text-[#FAFAFA]">Order Summary</h2>
          <div className="flex justify-between text-sm text-[#C0C0C0]">
            <span>Subtotal ({items.length} items)</span>
            <span>{formatPrice(getCartTotal(items))}</span>
          </div>
          <hr className="border-[#2A2A2A]" />
          <div className="flex justify-between text-base font-bold text-[#FAFAFA]">
            <span>Total</span>
            <span>{formatPrice(getCartTotal(items))}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="bg-[#007AFF] hover:bg-[#1ea4ff] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer mt-2"
          >
            Checkout
          </button>
        </div>
      </div>
      <AuthOverlay open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};
