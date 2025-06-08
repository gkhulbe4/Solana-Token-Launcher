import { useEffect, useState } from "react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { toast } from "sonner";
import { sendMetadata } from "../lib/sendMetadata";
import { createImageUrl } from "../lib/createImageUrl";
import { getAta } from "../lib/getAta";

export function TokenLaunchpad() {
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    image: "",
    description: "",
    decimals: null,
  });
  const [img, setImg] = useState(null);
  const [balance, setBalance] = useState(null);
  const [creatingToken, setCreatingToken] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  async function createMint() {
    setCreatingToken(true);
    if (
      tokenInfo.decimals === null ||
      tokenInfo.name.length === 0 ||
      tokenInfo.symbol.length === 0 ||
      tokenInfo.description.length === 0 ||
      img === null
    ) {
      toast.error("Please fill all required fields");
      setCreatingToken(false);
      return;
    }
    const imgUrl = await createImageUrl(img);
    const metaDataUrl = await sendMetadata(tokenInfo, imgUrl);

    const mintKeypair = Keypair.generate();
    const metadata = {
      mint: mintKeypair.publicKey,
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      uri: metaDataUrl,
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const tx1 = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        tokenInfo.decimals,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    tx1.feePayer = wallet.publicKey;
    tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx1.partialSign(mintKeypair);

    try {
      await wallet.sendTransaction(tx1, connection);
      toast.success(
        `Token mint created at ${mintKeypair.publicKey.toBase58()}`
      );
      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
      setCreatingToken(false);
    } catch (error) {
      toast.error("Error minting token");
      console.log(error.message);
      setCreatingToken(false);
    }

    // ATA Creation :-
    const ata = await getAta(mintKeypair.publicKey, wallet.publicKey);
    // console.log(associatedToken.toBase58());

    const tx2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        ata,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    try {
      await wallet.sendTransaction(tx2, connection);
      toast.success(`User Associated Token Account at ${ata.toBase58()}`);
      console.log(`User Associated Token Account at ${ata.toBase58()}`);
    } catch (error) {
      toast.error("Error minting token");
      console.log(error.message);
    }
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet.publicKey) return; // 👈 important check to avoid errors

      try {
        const lamports = await connection.getBalance(wallet.publicKey);
        const sol = lamports / LAMPORTS_PER_SOL;
        setBalance(sol);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();
  }, [connection, wallet.publicKey]);

  return wallet.connected ? (
    <div className="flex items-center justify-center min-h-screen bg-[#0e1728] w-screen">
      <div className="w-full max-w-4xl bg-[#1e2836] rounded-lg shadow-lg p-6 space-y-6 py-10 px-5 m-10">
        <div className="flex justify-between bg-[#364151] text-gray-300 p-4 rounded">
          <p>
            <span className="font-semibold text-white">Creation Fee</span>
            <br />
            <p className="text-sm">
              Creation fee varies based on network conditions
            </p>
          </p>
          <p className="text-right">
            <span className="text-sm text-white font-semibold">
              Your Balance
            </span>
            <br />
            <p className="text-sm">
              {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-1">Token Name</p>
          <input
            type="text"
            placeholder="Enter token name"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            value={tokenInfo.name}
            onChange={(e) =>
              setTokenInfo({ ...tokenInfo, name: e.target.value })
            }
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-1">Token Symbol</p>
          <input
            type="text"
            placeholder="Enter token symbol"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            value={tokenInfo.symbol}
            onChange={(e) =>
              setTokenInfo({ ...tokenInfo, symbol: e.target.value })
            }
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-1">Description</p>
          <textarea
            rows="3"
            placeholder="Enter token description"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none resize-none border border-gray-500"
            value={tokenInfo.description}
            onChange={(e) =>
              setTokenInfo({ ...tokenInfo, description: e.target.value })
            }
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-1">Decimals</p>
          <input
            type="number"
            min={1}
            placeholder="Enter token decimals"
            className="w-full px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            value={tokenInfo.decimals}
            onChange={(e) =>
              setTokenInfo({ ...tokenInfo, decimals: e.target.value })
            }
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-1">Token Image</p>
          <input
            type="file"
            accept="image/*"
            placeholder="Upload image"
            className="w-max px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file) {
                  if (file.size >= 100 * 1024) {
                    toast.info("Image size must be less than 100 KB.");
                    e.target.value = "";
                    return;
                  }
                  setImg(file);
                }
              }
            }}
          />
        </div>

        <button
          disabled={creatingToken}
          onClick={createMint}
          className={`w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 ${
            creatingToken ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {creatingToken ? "Creating Token..." : "Create Token"}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-[#0e1728] w-screen">
      <div className="w-full max-w-4xl bg-[#1e2836] rounded-lg shadow-lg p-6">
        <h1 className=" flex justify-center items-start text-md font-light text-yellow-500">
          ⚠︎ Please connect your wallet to create a token
        </h1>
      </div>
    </div>
  );
}

export default TokenLaunchpad;
