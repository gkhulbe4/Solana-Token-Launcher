import React, { useEffect, useState } from "react";
import Token from "./Token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { Loader } from "lucide-react";

function MyTokens() {
  const [myTokens, setMyTokens] = useState([
    {
      mint: "",
      decimals: 0,
      amount: 0,
    },
  ]);
  const [fetchingTokens, setFetchingTokens] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!wallet.publicKey) return;

    async function fetchTokens() {
      setFetchingTokens(true);
      try {
        const res = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          {
            programId: TOKEN_2022_PROGRAM_ID,
          }
        );

        const tokens = res.value.map((accountInfo) => ({
          mint: accountInfo.account.data.parsed.info.mint,
          decimals: accountInfo.account.data.parsed.info.tokenAmount.decimals,
          amount: accountInfo.account.data.parsed.info.tokenAmount.amount,
        }));
        setFetchingTokens(false);
        setMyTokens(tokens);
      } catch (err) {
        console.error("Failed to fetch tokens", err);
      }
    }

    fetchTokens();
  }, [connection, wallet.publicKey]);

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#0e1728] w-screen">
      <div className="w-full max-w-4xl bg-[#1e2836] rounded-lg shadow-lg p-6 space-y-6 py-10 px-5 m-10">
        <h1 className="text-3xl font-bold text-white">Wallet Tokens</h1>
        {fetchingTokens ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin" size={40} color="gray" />
          </div>
        ) : myTokens.length === 0 ? (
          <h1 className="text-center  font-normal text-gray-400">
            No tokens found
          </h1>
        ) : (
          <Token myTokens={myTokens} />
        )}
      </div>
    </div>
  );
}

export default MyTokens;
