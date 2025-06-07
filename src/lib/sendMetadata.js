/* eslint-disable no-undef */
import { PinataSDK } from "pinata";

export async function sendMetadata(tokenInfo, imageUrl) {
  const metadata = {
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    description: tokenInfo.description,
    image: imageUrl,
  };

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
  });

  const upload = await pinata.upload.public.json(metadata);
  const cid = upload.cid;
  const url = `https://${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${cid}`;
  return url;
}
