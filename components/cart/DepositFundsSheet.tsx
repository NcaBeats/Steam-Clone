"use client";

import { useState } from "react";
import { PlusCircle, Wallet as WalletIcon } from "lucide-react";
import { depositToWalletAction } from "@/actions/wallet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/components/feedback";
import { formatPrice } from "@/lib";
import { WALLET_UPDATE_EVENT } from "@/components/layout/WalletBalance";

type Props = Readonly<{
  currentBalance: number | null;
  onSuccess?: () => void;
}>;

export function DepositFundsSheet({ currentBalance, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [depositing, setDepositing] = useState(false);
  const { showAlert } = useAlert();

  const handleDeposit = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      showAlert({
        variant: "destructive",
        title: "Invalid amount",
        description: "Enter an amount greater than 0.",
      });
      return;
    }
    setDepositing(true);
    try {
      const updated = await depositToWalletAction(value);
      if (!updated) {
        showAlert({
          variant: "destructive",
          title: "Deposit failed",
          description: "Could not add funds. Please try again.",
        });
        return;
      }
      showAlert({
        variant: "default",
        title: "Funds added",
        description: `${formatPrice(value)} added to your wallet.`,
      });
      setAmount("");
      setOpen(false);
      window.dispatchEvent(new Event(WALLET_UPDATE_EVENT));
      onSuccess?.();
    } finally {
      setDepositing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <PlusCircle />
            Add funds
          </Button>
        }
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <WalletIcon size={18} className="text-[#007AFF]" />
            Add funds
          </SheetTitle>
          <SheetDescription>
            Current balance:{" "}
            {currentBalance !== null
              ? formatPrice(currentBalance, { zeroAsFree: false })
              : "—"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <Label htmlFor="deposit-amount">Amount (USD)</Label>
          <Input
            id="deposit-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="10.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-0"
          />
        </div>
        <SheetFooter>
          <Button onClick={handleDeposit} disabled={depositing}>
            {depositing ? "Adding..." : "Confirm deposit"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
