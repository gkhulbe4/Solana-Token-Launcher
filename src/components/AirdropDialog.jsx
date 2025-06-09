import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const airdropAmounts = [0.5, 1, 2.5, 5];

function AirdropDialog() {
  const [airdroping, setAirdroping] = useState(false);
  const [amount, setAmount] = useState(null);
  const wallet = useWallet();
  const { connection } = useConnection();

  async function airdropSol() {
    if (wallet.publicKey === null) {
      toast.info("Please connect your wallet");
      return;
    }
    if (amount === null) {
      toast.info("Please select the airdrop amount");
      return;
    }
    setAirdroping(true);
    try {
      const sig = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      console.log(
        `Tx Complete: https://explorer.solana.com/tx/${sig}?cluster=devnet`
      );
      toast.success(`Airdropped ${amount} SOL successfully`);
      setAirdroping(false);
      setAmount(null);
    } catch (error) {
      setAirdroping(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="p-2 w-full text-white text-xs font-medium border border-[#0e1728] bg-[#1e2836] hover:bg-[#1e2836] hover:border hover:border-gray-500 rounded-[4px] flex justify-center items-center">
            🪂 Airdrop Solana
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl bg-[#1e2836] border border-[#0e1728]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Request Airdrop
            </DialogTitle>
            <DialogDescription>
              Maximum of 2 requests every 8 hours
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex gap-3">
              {/* <Input
                className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
                id="name-1"
                name="name"
                placeholder="Enter your Wallet Address"
              /> */}
              <Popover>
                <PopoverTrigger>
                  <button className="w-max h-full bg-[#0e1728] cursor-pointer px-4 py-2 rounded text-white text-xs font-medium border border-gray-500 hover:opacity-80 transition-opacity duration-200 ease-in-out">
                    {amount === null ? "Amount" : `${amount} SOL`}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-max bg-[#1e2836] border border-gray-600 grid grid-cols-2 gap-2">
                  {airdropAmounts.map((amount, index) => {
                    return (
                      <h1
                        key={index}
                        className="flex justify-center items-center w-[40px] text-center py-2 rounded-sm text-white border-[1px] border-[#0e1728] text-sm hover:bg-[#0e1728] cursor-pointer transition-colors duration-300 ease-in-out"
                        onClick={() => setAmount(amount)}
                      >
                        {amount}
                      </h1>
                    );
                  })}
                </PopoverContent>
              </Popover>
              <button
                disabled={airdroping}
                onClick={airdropSol}
                className={`w-full bg-[#512da9] text-white text-sm font-semibold py-2 rounded hover:opacity-80 ${
                  airdroping
                    ? "opacity-80 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {airdroping ? "Airdroping..." : "Confirm Airdrop"}
              </button>
            </div>
          </div>
          {/* <DialogFooter>
      
            <button
              disabled={airdroping}
              onClick={airdropSol}
              className={`w-full bg-[#512da9] text-white text-sm font-semibold py-2 rounded hover:opacity-80 ${
                airdroping ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {airdroping ? "Airdroping..." : "Confirm Airdrop"}
            </button>{" "}
          </DialogFooter> */}
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AirdropDialog;
