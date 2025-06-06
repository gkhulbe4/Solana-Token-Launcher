import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NavLink } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

function Header() {
  return (
    <div className="h-16 w-full bg-[#1e2836] border border-gray-600 px-6 flex items-center justify-between">
      <h1 className="text-lg font-bold text-[#512da9]">Token Dashboard</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Navigate</Button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#1e2836] border border-gray-600">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-between">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/create-token"
              >
                💎 Create Token
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/mint-token"
              >
                ⛏ Mint Tokens
              </NavLink>
            </div>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                  : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
              }
              to="/send-token"
            >
              Send Token
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                  : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
              }
              to="/my-tokens"
            >
              My Tokens
            </NavLink>
          </div>
        </PopoverContent>
      </Popover>
      <WalletMultiButton />
    </div>
  );
}

export default Header;
