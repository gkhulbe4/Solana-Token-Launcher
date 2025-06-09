import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleAlert } from "lucide-react";

function LowBalanceCard() {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <CircleAlert size={18} />
      </HoverCardTrigger>
      <HoverCardContent className=" border border-[#0e1728] bg-[#1e2836] text-gray-200 text-sm">
        You don't have enough SOL. Get free devnet SOL from the <br />
        <a
          href="https://solfaucet.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 text-sm underline"
        >
          Solana Faucet
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}

export default LowBalanceCard;
