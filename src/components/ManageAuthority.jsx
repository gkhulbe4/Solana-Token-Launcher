import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import {
  AuthorityType,
  createSetAuthorityInstruction,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

function ManageAuthority() {
  const [transferInfo, setTransferInfo] = useState({
    tokenAddress: "",
    authorityType: "",
    newAuthority: "",
  });

  const [transferring, setTransferring] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  async function transfer() {
    try {
      if (!wallet.publicKey) return;
      if (
        transferInfo.authorityType.length == 0 ||
        transferInfo.tokenAddress.length == 0 ||
        transferInfo.newAuthority.length == 0
      ) {
        toast.info("Please fill all required fields");
        return;
      }
      setTransferring(true);

      const mintData = await getMint(
        connection,
        new PublicKey(transferInfo.tokenAddress),
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      let auth;

      if (transferInfo.authorityType == "Mint") {
        // console.log("first");
        if (wallet.publicKey.toBase58() != mintData.mintAuthority.toBase58()) {
          toast.error("You don't have the mint authority");
          return;
        }
        auth = new Transaction().add(
          createSetAuthorityInstruction(
            new PublicKey(transferInfo.tokenAddress),
            wallet.publicKey,
            AuthorityType.MintTokens,
            new PublicKey(transferInfo.newAuthority),
            undefined,
            TOKEN_2022_PROGRAM_ID
          )
        );
      } else {
        if (
          wallet.publicKey.toBase58() != mintData.freezeAuthority.toBase58()
        ) {
          toast.error("You don't have the freeze authority");
          return;
        }
        auth = new Transaction().add(
          createSetAuthorityInstruction(
            new PublicKey(transferInfo.tokenAddress),
            wallet.publicKey,
            AuthorityType.FreezeAccount,
            new PublicKey(transferInfo.newAuthority),
            undefined,
            TOKEN_2022_PROGRAM_ID
          )
        );
      }
      //   console.log(auth);
      await wallet.sendTransaction(auth, connection);
      toast.success(
        `${transferInfo.authorityType} authority transferred successfully to ${transferInfo.newAuthority}`
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setTransferring(false);
    }
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#0e1728] w-screen">
      <div className="w-full max-w-4xl bg-[#1e2836] rounded-lg shadow-lg p-6 space-y-6 py-10 px-5 m-10">
        <h1 className="text-3xl font-bold text-white mb-8">
          Transfer Authority
        </h1>

        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Token Mint Address
          </p>
          <input
            type="text"
            placeholder="Enter token mint address"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            onChange={(e) =>
              setTransferInfo({ ...transferInfo, tokenAddress: e.target.value })
            }
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Authority Type
          </p>
          <Select
            onValueChange={(value) =>
              setTransferInfo({
                ...transferInfo,
                authorityType: value,
              })
            }
          >
            <SelectTrigger className="w-[180px] outline-none border border-gray-500 text-gray-300">
              <SelectValue placeholder="Select authority" />
            </SelectTrigger>
            <SelectContent className=" bg-[#1e2836] border border-[#0e1728] text-gray-300">
              <SelectGroup>
                <SelectItem
                  className="cursor-pointer hover:bg-[#364151]"
                  value="Mint"
                >
                  Mint Authority
                </SelectItem>
                <SelectItem
                  className="cursor-pointer hover:bg-[#364151]"
                  value="Freeze"
                >
                  Freeze Authority
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            New Authority Address
          </p>
          <input
            type="text"
            placeholder="Enter new authority address"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            onChange={(e) =>
              setTransferInfo({ ...transferInfo, newAuthority: e.target.value })
            }
          />
        </div>
        <button
          disabled={transferring}
          onClick={transfer}
          className={`w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 ${
            transferring ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {transferring ? "Transferring Authority..." : "Transfer Authority"}
        </button>
        <Separator className="my-4 bg-gray-600" />
        <h1 className="text-white text-xl font-semibold">
          Authority Information
        </h1>
        <p className="flex justify-start items-center gap-2 text-sm font-semibold text-white mb-2">
          <p>Mint Authority :</p>
          <p className="text-gray-300 font-normal">
            {" "}
            Controls the authority to create new tokens
          </p>
        </p>
        <p className="flex  justify-start items-center gap-2  text-sm font-semibold text-white mb-1">
          <p>Freeze Authority :</p>
          <p className="text-gray-300 font-normal">
            Controls the authority to create new tokens
          </p>
        </p>

        <p className="text-xs text-gray-400 mt-6">
          Note: Once your transfer an authority, you won't be able to perform
          those actions unless you're given the authority back. Make sure you're
          transferring the correct address.
        </p>
      </div>
    </div>
  );
}

export default ManageAuthority;
