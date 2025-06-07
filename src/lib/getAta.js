import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
export async function getAta(mintAddress, walletAddress) {
  // console.log(mintAddress);
  // console.log(walletAddress);
  const ata = await getAssociatedTokenAddress(
    new PublicKey(mintAddress),
    new PublicKey(walletAddress),
    false,
    TOKEN_2022_PROGRAM_ID
  );
  return ata;
}
