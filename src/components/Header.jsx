import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NavLink, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import AirdropDialog from "./AirdropDialog";

const routes = [
  {
    path: "/create-token",
    name: "📝 Create Token",
  },
  {
    path: "/token-authority",
    name: "🔑 Token Authority",
  },
  {
    path: "/manage-authority",
    name: "⚙️ Manage Authority",
  },
  {
    path: "/my-tokens",
    name: "💎 My Token",
  },
  {
    path: "/transaction-history",
    name: "📜 Transaction History",
  },
];

function Header() {
  const location = useLocation();
  const { pathname } = location;
  return (
    <div className="h-16 w-full bg-[#1e2836] border border-gray-600 px-5 flex items-center justify-between">
      <NavLink
        to="/"
        className="h-full flex justify-center items-center font-bold text-lg font-mono border-r-1 border-gray-500 pr-5"
      >
        <img
          className="h-full w-full"
          src="https://ibb.co/mCDrtJqM"
          alt="SolForge"
        />
      </NavLink>
      {pathname != "/" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={
                "bg-[#0e1728] border border-gray-600 text-white hover:opacity-70 hover:bg-[#0e1728] transition-all duration-300 ease-in-out cursor-pointer"
              }
              // variant="outline"
            >
              Navigate
            </Button>
            {/* <div className="h-full w-max object-contain cursor-pointer">
              <img className="h-full w-full" src="src/assets/logo.png" alt="" />
            </div> */}
          </PopoverTrigger>
          <PopoverContent className="bg-[#1e2836] border border-gray-600 lg:w-xl">
            <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
              {routes.map((route) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center transition-all duration-300 ease-in-out"
                      : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center transition-all duration-300 ease-in-out"
                  }
                  to={route.path}
                >
                  {route.name}
                </NavLink>
              ))}

              {/* <AirdropDialog /> */}

              {/* <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#0e1728] rounded-[4px] flex justify-center items-center"
                    : "p-2 text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center"
                }
                to="/send-token"
              >
                Send Token
              </NavLink> */}
            </div>
          </PopoverContent>
        </Popover>
      )}
      <WalletMultiButton />
    </div>
  );
}

export default Header;
