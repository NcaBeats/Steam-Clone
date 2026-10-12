import { TicketIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import type { GameState } from "@/types";

const STATE_CLASSES: Record<GameState, string> = {
  AVAILABLE: "bg-[#A1CD44]/15 text-[#A1CD44] border-transparent",
  COMING_SOON: "bg-[#FCAF17]/15 text-[#FCAF17] border-transparent",
  DISCONTINUED: "bg-[#FF6B6B]/15 text-[#FF6B6B] border-transparent",
};

export function GameStateBadge({
  state,
  className,
}: Readonly<{ state: GameState; className?: string }>) {
  return (
    <Badge className={cn(STATE_CLASSES[state], "whitespace-nowrap", className)}>
      <TicketIcon />
      {state}
    </Badge>
  );
}

export function DiscountBadge({
  percent,
  className,
}: Readonly<{ percent: number; className?: string }>) {
  return (
    <span
      className={cn(
        "bg-[#FCAF17] text-black font-semibold px-1.5 py-0.5 rounded-md text-xs whitespace-nowrap",
        className,
      )}
    >
      -{percent}%
    </span>
  );
}
