import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PublicKey, Transaction } from "@solana/web3.js";
// import { set } from "@metaplex-foundation/umi/serializers";
import TokenAuthorityInfo from "./TokenAuthorityInfo";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { getAta } from "../lib/getAta";
import FreezeAccount from "./FreezeAccount";
import AllFreezeAccounts from "./AllFreezeAccounts";

function MintToken() {
  const [tokenMintInfo, setTokenMintInfo] = useState({
    tokenAddress: "",
    recipientAddress: "",
    mintAmount: null,
  });

  const [tokenAuthorityInfo, setTokenAuthorityInfo] = useState({
    mintAuthority: "",
    freezeAuthority: "",
    decimals: null,
    supply: null,
  });

  const [fetchingAuthorityInfo, setFetchingAuthorityInfo] = useState(false);
  const [transacting, setTransacting] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();
  // console.log(tokenMintInfo);

  async function MintTokenToATA() {
    setTransacting(true);
    try {
      const mintData = await getMint(
        connection,
        new PublicKey(tokenMintInfo.tokenAddress),
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      if (
        !tokenMintInfo.tokenAddress ||
        !tokenMintInfo.recipientAddress ||
        !tokenMintInfo.mintAmount
      ) {
        toast.info("Please fill in all fields.");
        setTransacting(false);
        return;
      }

      if (wallet.publicKey.toBase58() !== mintData.mintAuthority.toBase58()) {
        toast.error("You are not the mint authority");
        setTransacting(false);
        return;
      }

      const ata = await getAta(
        tokenMintInfo.tokenAddress,
        tokenMintInfo.recipientAddress
      );
      const ataAccount = await connection.getAccountInfo(ata);
      // console.log(ataAccount);

      if (ataAccount == null) {
        const transaction1 = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            ata,
            new PublicKey(tokenMintInfo.recipientAddress),
            new PublicKey(tokenMintInfo.tokenAddress),
            TOKEN_2022_PROGRAM_ID
          )
        );
        await wallet.sendTransaction(transaction1, connection);
      }
      const transaction2 = new Transaction().add(
        createMintToInstruction(
          new PublicKey(tokenMintInfo.tokenAddress),
          ata,
          wallet.publicKey,
          tokenMintInfo.mintAmount * 10 ** mintData.decimals,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      await wallet.sendTransaction(transaction2, connection);
      toast.success("Token minted to ATA: " + ata.toBase58());
      setTransacting(false);
    } catch (error) {
      setTransacting(false);
      toast.error(error.message);
      console.error(error);
    }
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#0e1728] w-screen">
      <div className="w-full max-w-4xl bg-[#1e2836] rounded-lg shadow-lg p-6 space-y-6 py-10 px-5 m-10">
        <h1 className="text-3xl font-bold text-white mb-8">
          Token Authority Management
        </h1>
        <div className="mb-9">
          <p className="text-sm font-semibold text-white mb-1">
            Token Mint Address
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter token mint address"
              className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
              value={tokenMintInfo.tokenAddress}
              onChange={(e) =>
                setTokenMintInfo({
                  ...tokenMintInfo,
                  tokenAddress: e.target.value,
                })
              }
            />
            <button
              disabled={fetchingAuthorityInfo}
              onClick={async () => {
                if (!tokenMintInfo.tokenAddress) {
                  toast.info("Please fill token mint address");
                  return;
                }
                setFetchingAuthorityInfo(true);
                const mintData = await getMint(
                  connection,
                  new PublicKey(tokenMintInfo.tokenAddress),
                  undefined,
                  TOKEN_2022_PROGRAM_ID
                );
                setTokenAuthorityInfo({
                  mintAuthority: mintData.mintAuthority?.toBase58(),
                  freezeAuthority:
                    mintData.freezeAuthority?.toBase58() || "None",
                  decimals: mintData.decimals,
                  supply: mintData.supply,
                });
                setFetchingAuthorityInfo(false);
                // console.log(tokenAuthorityInfo);
              }}
              className={`w-20 text-xs font-medium bg-[#512da9] text-white py-2 rounded hover:opacity-80 transition-all duration-300 ease-in-out ${
                fetchingAuthorityInfo
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
            >
              Fetch Info
            </button>
          </div>
          {fetchingAuthorityInfo ? (
            <div className="flex justify-center items-center mt-1">
              <Loader className="animate-spin " size={40} color="gray" />
            </div>
          ) : (
            tokenAuthorityInfo.mintAuthority?.length > 0 &&
            // tokenAuthorityInfo.freezeAuthority?.length > 0 &&
            tokenAuthorityInfo.decimals != null && (
              <TokenAuthorityInfo tokenAuthorityInfo={tokenAuthorityInfo} />
            )
          )}
        </div>
        <Separator className="my-4 bg-gray-600" />
        <h1 className="text-xl font-bold text-white mb-5 mt-8">Mint Tokens</h1>

        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Recipient Address
          </p>
          <input
            type="text"
            placeholder="Enter recipient address"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            value={tokenMintInfo.recipientAddress}
            onChange={(e) =>
              setTokenMintInfo({
                ...tokenMintInfo,
                recipientAddress: e.target.value,
              })
            }
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">Mint Amount</p>
          <input
            type="number"
            min={0}
            placeholder="Enter mint amount"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            value={tokenMintInfo.mintAmount}
            onChange={(e) =>
              setTokenMintInfo({ ...tokenMintInfo, mintAmount: e.target.value })
            }
          />
        </div>
        <button
          disabled={transacting}
          onClick={MintTokenToATA}
          className={`w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 cursor-pointer transition-all duration-300 ease-in-out${
            transacting ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {transacting ? "Minting Token..." : "Mint Token"}
        </button>

        <Separator className="my-4 bg-gray-600" />

        <FreezeAccount
          mintAddress={tokenMintInfo.tokenAddress}
          transacting={transacting}
          setTransacting={setTransacting}
        />

        {/* <Separator className="my-4 bg-gray-600" />
        <AllFreezeAccounts tokenAddress={tokenMintInfo.tokenAddress} /> */}
      </div>
    </div>
  );
}

export default MintToken;
