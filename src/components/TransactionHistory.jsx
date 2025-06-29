import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import Transaction from "./Transaction"; // Make sure this exists and accepts props
import { Loader } from "lucide-react";

function TransactionHistory() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [transactions, setTransactions] = useState([]);
  const [lastFetchedSig, setLastFetchedSig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // console.log(connection.rpcEndpoint);

  const fetchTransactions = async () => {
    if (!wallet.publicKey || loading || !hasMore) return;
    setLoading(true);

    const limit = 10;
    const sigs = await connection.getSignaturesForAddress(wallet.publicKey, {
      limit,
      before: lastFetchedSig || undefined,
    });

    if (sigs.length < limit) {
      setHasMore(false); // No more transactions to fetch
    }

    const txs = await Promise.all(
      sigs.map(async (sig) => {
        const tx = await connection.getTransaction(sig.signature, {
          commitment: "finalized",
          maxSupportedTransactionVersion: 0,
        });
        return tx;
      })
    );

    const newTxs = txs
      .filter((tx) => tx && tx.blockTime)
      .map((tx) => ({
        time: new Date(tx.blockTime * 1000).toLocaleString(),
        signature: tx.transaction.signatures[0],
        explorerUrl: `https://explorer.solana.com/tx/${tx.transaction.signatures[0]}?cluster=devnet`,
        instructions: tx.transaction.message.instructions,
      }));

    setTransactions((prev) => [...prev, ...newTxs]);
    if (sigs.length > 0) {
      setLastFetchedSig(sigs[sigs.length - 1].signature);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.publicKey]);

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#0e1728] w-screen">
      <div className="w-full max-w-4xl bg-[#1e2836] rounded-lg shadow-lg p-6 space-y-6 py-10 px-5 m-10">
        <h1 className="text-3xl font-bold text-white">Transaction History</h1>

        {transactions.map((tx, index) => (
          <div>
            <Transaction key={index} tx={tx} />
          </div>
        ))}

        {hasMore ? (
          loading ? (
            <div className=" flex justify-center items-center">
              <Loader className="animate-spin" size={40} color="gray" />
            </div>
          ) : (
            <button
              onClick={fetchTransactions}
              className="mt-4 w-full bg-[#512da9] text-white font-semibold py-2 rounded hover:opacity-80 cursor-pointer"
            >
              Load More
            </button>
          )
        ) : (
          <p className="text-center text-gray-400 mt-4">
            No more transactions to load
          </p>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
