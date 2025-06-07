import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import { Toaster } from "sonner";
import MintToken from "./components/MintToken";
import Hero from "./components/Hero";
import SendToken from "./components/SendToken";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MyTokens from "./components/MyTokens";
import TransactionHistory from "./components/TransactionHistory";

function App() {
  return (
    <Router>
      <ConnectionProvider endpoint={import.meta.env.VITE_SOLANA_DEVNET_RPC_URL}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <Toaster richColors />
            <Header />
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/create-token" element={<TokenLaunchpad />} />
              <Route path="/token-authority" element={<MintToken />} />
              <Route path="/send-token" element={<SendToken />} />
              <Route path="/my-tokens" element={<MyTokens />} />
              <Route
                path="/transaction-history"
                element={<TransactionHistory />}
              />
            </Routes>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
}

export default App;
