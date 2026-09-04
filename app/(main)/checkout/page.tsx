import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckoutSummary } from "@/components/cart";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;

  if (!isLoggedIn) {
    redirect("/log-in");
  }

  return (
    <div className="flex flex-col p-4 gap-6 min-h-screen w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#FAFAFA]">Checkout</h1>
      <CheckoutSummary />
    </div>
  );
}
