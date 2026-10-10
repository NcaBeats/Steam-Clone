import { cookies } from "next/headers";
import { CartList } from "@/components/cart";

export default async function CartPage() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;

  return (
    <div className="flex flex-col px-4 py-2 sm:px-6 gap-6 min-h-screen w-full max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#FAFAFA] ml-1 mt-8">
        Shopping Cart
      </h1>
      <CartList isLoggedIn={isLoggedIn} />
    </div>
  );
}
