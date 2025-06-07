import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NavLink, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

function Header() {
  const location = useLocation();
  const { pathname } = location;
  return (
    <div className="h-16 w-full bg-[#1e2836] border border-gray-600 px-6 flex items-center justify-between">
      <NavLink
        to="/"
        className="h-full flex justify-center items-center font-bold text-lg font-mono bg-gradient-to-br from-[#512da9] to-white text-transparent bg-clip-text border-r-1 border-gray-500 pr-5"
      >
        SolForge
      </NavLink>
      {pathname != "/" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={
                "bg-[#0e1728] border border-gray-600 text-white hover:opacity-70 hover:bg-[#0e1728] transition-all cursor-pointer"
              }
              // variant="outline"
            >
              Navigate
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#1e2836] border border-gray-600 lg:w-xl">
            <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/create-token"
              >
                📝 Create Token
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/token-authority"
              >
                🔑 Token Authority
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/my-tokens"
              >
                💎 My Tokens
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/transaction-history"
              >
                📜 Transaction History
              </NavLink>

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
            </div>
          </PopoverContent>
        </Popover>
      )}
      <WalletMultiButton />
    </div>
  );
}

export default Header;
