import { CartList } from "@/components/cart";

export default function CartPage() {
  return (
    <div className="flex flex-col p-4 gap-6 min-h-screen w-full bg-[#18181C]">
      <h1 className="text-2xl font-bold text-[#FAFAFA]">Shopping Cart</h1>
      <CartList />
    </div>
  );
}
