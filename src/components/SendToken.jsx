import React, { useState } from "react";
import { toast } from "sonner";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
  transfer,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAta } from "../lib/getAta";

function SendToken() {
  const [transactionInfo, setTransactionInfo] = useState({
    tokenAddress: "",
    receiverAddress: "",
    tokenAmount: null,
  });

  const wallet = useWallet();
  const { connection } = useConnection();

  async function SendTokenToATA() {
    try {
      //   const ata = await getAssociatedTokenAddressSync(
      //     new PublicKey(transactionInfo.tokenAddress),
      //     wallet.publicKey,
      //     false,
      //     TOKEN_2022_PROGRAM_ID
      //   );
      //   console.log(console.log(ata.toBase58()));

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.publicKey,
        new PublicKey(transactionInfo.tokenAddress),
        wallet.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      console.log("sender ata", fromTokenAccount.address.toBase58());

      const toTokenAccount = getAssociatedTokenAddressSync(
        new PublicKey(transactionInfo.tokenAddress),
        new PublicKey(transactionInfo.receiverAddress),
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const createToTokenAccount = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          toTokenAccount,
          new PublicKey(transactionInfo.receiverAddress),
          new PublicKey(transactionInfo.tokenAddress),
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(createToTokenAccount, connection);
      console.log("receiver ata", toTokenAccount.toBase58());

      //   const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      //     connection,
      //     wallet.publicKey,
      //     new PublicKey(transactionInfo.tokenAddress),
      //     new PublicKey(transactionInfo.receiverAddress),
      //     false,
      //     false,
      //     undefined,
      //     TOKEN_2022_PROGRAM_ID
      //   );

      await transfer(
        connection,
        wallet.publicKey,
        new PublicKey(fromTokenAccount.address),
        new PublicKey(toTokenAccount.address),
        wallet.publicKey,
        parseFloat(transactionInfo.tokenAmount) * 10 ** 9
      );

      toast.success("Transaction successful");
      console.log("Transaction successful");
    } catch (error) {
      toast.error("Error occurred in transaction: " + error.message);
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Send Token
      </h1>
      <input
        type="text"
        placeholder="Token Address"
        className="w-full max-w-sm mb-3 px-4 py-2 border border-gray-300 rounded text-black outline-none"
        value={transactionInfo.tokenAddress}
        onChange={(e) =>
          setTransactionInfo({
            ...transactionInfo,
            tokenAddress: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Receiver's ATA Address"
        className="w-full max-w-sm mb-3 px-4 py-2 border border-gray-300 rounded text-black outline-none"
        value={transactionInfo.receiverAddress}
        onChange={(e) =>
          setTransactionInfo({
            ...transactionInfo,
            receiverAddress: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Token Amount"
        className="w-full max-w-sm mb-3 px-4 py-2 border border-gray-300 rounded text-black outline-none"
        value={transactionInfo.tokenAmount}
        onChange={(e) =>
          setTransactionInfo({
            ...transactionInfo,
            tokenAmount: e.target.value,
          })
        }
      />

      <button
        onClick={SendTokenToATA}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition"
      >
        Send Token
      </button>

      <button
        className="w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 cursor-pointer"
        onClick={async () => {
          const a = await getAta(
            "9L6a3NuZTtiMR2Kij287PWaKbqbVAsyZk45CWs9NdyxY",
            "3EjTrA5BUE5nKLSeRkcrMT66aY15LN2Nf2R5XKGNkpVN"
          );
          console.log(a.toBase58());
        }}
      >
        get ata
      </button>
    </div>
  );
}

export default SendToken;
