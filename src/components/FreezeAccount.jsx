import {
  createFreezeAccountInstruction,
  createThawAccountInstruction,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "sonner";

function FreezeAccount({ mintAddress, transacting, setTransacting }) {
  const [tokenAta, setTokenAta] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  async function freezeAccount() {
    setTransacting(true);
    if (mintAddress.length === 0) {
      toast.info("Please fill in the mint address");
      setTransacting(false);
      return;
    }
    if (tokenAta.length === 0) {
      toast.info("Please fill in the ATA");
      setTransacting(false);
      return;
    }

    const mintData = await getMint(
      connection,
      new PublicKey(mintAddress),
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    // console.log(mintData.freezeAuthority.toBase58());

    if (wallet.publicKey.toBase58() !== mintData.freezeAuthority.toBase58()) {
      toast.error("You are not the freeze authority");
      setTransacting(false);
      return;
    }

    try {
      const tx = new Transaction().add(
        createFreezeAccountInstruction(
          new PublicKey(tokenAta),
          new PublicKey(mintAddress),
          mintData.freezeAuthority,
          undefined,
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(tx, connection);
      toast.success("Account frozen successfully");
      setTransacting(false);
    } catch (error) {
      setTransacting(false);
      toast.error("Failed to freeze account");
      console.log(error);
    }
  }

  async function thawAccount() {
    setTransacting(true);
    if (mintAddress.length === 0) {
      toast.info("Please fill in the mint address");
      setTransacting(false);
      return;
    }
    if (tokenAta.length === 0) {
      toast.info("Please fill in the ATA");
      setTransacting(false);
      return;
    }

    const mintData = await getMint(
      connection,
      new PublicKey(mintAddress),
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    // console.log(mintData.freezeAuthority.toBase58());

    if (wallet.publicKey.toBase58() !== mintData.freezeAuthority.toBase58()) {
      toast.error("You are not the freeze authority");
      setTransacting(false);
      return;
    }

    try {
      const tx = new Transaction().add(
        createThawAccountInstruction(
          new PublicKey(tokenAta),
          new PublicKey(mintAddress),
          mintData.freezeAuthority,
          undefined,
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(tx, connection);
      toast.success("Account thawn successfully");
      setTransacting(false);
    } catch (error) {
      setTransacting(false);
      toast.error("Failed to thawn account");
      console.log(error);
    }
  }

  return (
    <div>
      <p className="text-xl font-bold text-white mb-5 mt-8">
        FreezeAccount/Thaw Account
      </p>
      <div>
        <p className="text-sm font-semibold text-white mb-1">
          Token Account Address (ATA)
        </p>
        <input
          type="text"
          placeholder="Enter token account address (ATA) to freeze/thaw"
          className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
          value={tokenAta}
          onChange={(e) => setTokenAta(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-5">
        <button
          disabled={transacting}
          onClick={freezeAccount}
          className={`w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 ${
            transacting ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Freeze Account
        </button>
        <button
          disabled={transacting}
          onClick={thawAccount}
          className={`w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 ${
            transacting ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Thaw Account
        </button>
      </div>
    </div>
  );
}

export default FreezeAccount;
