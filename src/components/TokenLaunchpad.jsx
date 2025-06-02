import { useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { toast } from "sonner";

export function TokenLaunchpad() {
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    // image: "",
  });
  const wallet = useWallet();
  const { connection } = useConnection();

  async function createMint() {
    const mintKeypair = Keypair.generate();
    const metadata = {
      mint: mintKeypair.publicKey,
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      uri: "https://cdn.100xdevs.com/metadata.json",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
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
        9,
        wallet.publicKey,
        null,
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

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeypair);

    try {
      await wallet.sendTransaction(transaction, connection);
      toast.success(
        `Token mint created at ${mintKeypair.publicKey.toBase58()}`
      );
      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
    } catch (error) {
      toast.error("Error minting token");
      console.log(error.message);
    }

    // ATA
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(associatedToken.toBase58());

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction2, connection);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey,
        1000000000,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    try {
      await wallet.sendTransaction(transaction3, connection);
      toast.success(
        `User Associated Token Account at ${associatedToken.toBase58()}`
      );
      console.log(
        `User Associated Token Account at ${associatedToken.toBase58()}`
      );
    } catch (error) {
      toast.error("Error minting token");
      console.log(error.message);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Solana Token Launchpad
      </h1>

      <input
        type="text"
        placeholder="Name"
        className="w-full max-w-sm mb-3 px-4 py-2 border border-gray-300 rounded text-black"
        value={tokenInfo.name}
        onChange={(e) => setTokenInfo({ ...tokenInfo, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Symbol"
        className="w-full max-w-sm mb-3 px-4 py-2 border border-gray-300 rounded text-black"
        value={tokenInfo.symbol}
        onChange={(e) => setTokenInfo({ ...tokenInfo, symbol: e.target.value })}
      />
      {/* <input
        type="text"
        placeholder="Image URL"
        className="w-full max-w-sm mb-3 px-4 py-2 border border-gray-300 rounded text-black"
        value={tokenInfo.image}
        onChange={(e) => setTokenInfo({ ...tokenInfo, image: e.target.value })}
      />
      <input
        type="number"
        min="0"
        placeholder="Initial Supply"
        className="w-full max-w-sm mb-5 px-4 py-2 border border-gray-300 rounded text-black"
        value={tokenInfo.supply}
        onChange={(e) => setTokenInfo({ ...tokenInfo, supply: e.target.value })}
      /> */}

      <button
        onClick={createMint}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition"
      >
        Create Token
      </button>
    </div>
  );
}

export default TokenLaunchpad;
