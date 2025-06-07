import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as PublicKey } from "@metaplex-foundation/umi";

export async function getMetadata(mintAddress) {
  const umi = createUmi("https://api.devnet.solana.com").use(
    mplTokenMetadata()
  );
  const mint = PublicKey(mintAddress);
  const asset = await fetchDigitalAsset(umi, mint);
  console.log(asset.metadata);
}
