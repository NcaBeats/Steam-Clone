import { cookies } from "next/headers";
import { CartList } from "@/components/cart";

export default async function CartPage() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;

  return (
    <div className="flex flex-col p-4 gap-6 min-h-screen w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#FAFAFA]">Shopping Cart</h1>
      <CartList isLoggedIn={isLoggedIn} />
    </div>
  );
}
