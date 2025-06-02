import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
// import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import { Toaster } from "sonner";

function App() {
  return (
    <ConnectionProvider
      endpoint={clusterApiUrl("devnet")}
      // endpoint={
      //   "https://solana-devnet.core.chainstack.com/ad2a28a4c8f63ba4ca64abaffbdd5b75"
      // }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Toaster richColors />
          <div className="flex p-3 justify-between">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <TokenLaunchpad />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
