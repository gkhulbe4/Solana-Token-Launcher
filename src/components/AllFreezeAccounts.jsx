import { getAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";

function AllFreezeAccounts({ tokenAddress }) {
  const [frozenAccounts, setFrozenAccounts] = useState([]);
  const { connection } = useConnection();
  const wallet = useWallet();
  console.log(frozenAccounts);

  async function accounts() {
    const res = await connection.getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_2022_PROGRAM_ID,
      }
    );
    console.log(res);
  }

  const fetchFrozenAccounts = async () => {
    try {
      const mintPubkey = new PublicKey(tokenAddress);

      const tokenAccounts = await connection.getProgramAccounts(
        TOKEN_2022_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 0,
                bytes: mintPubkey.toBase58(),
              },
            },
          ],
        }
      );

      const frozen = [];

      for (const acc of tokenAccounts) {
        const account = await getAccount(connection, acc.pubkey);
        if (account.state === "frozen") {
          frozen.push({
            pubkey: acc.pubkey.toBase58(),
            owner: account.owner.toBase58(),
          });
        }
      }

      setFrozenAccounts(frozen);
    } catch (err) {
      console.error("Failed to fetch frozen accounts:", err);
    }
  };

  return (
    <div>
      <button onClick={accounts}>refresh</button>
      <h2 className="text-lg font-bold">Frozen Accounts</h2>
      {frozenAccounts.length > 0 ? (
        <ul className="mt-2 list-disc pl-4">
          {frozenAccounts.map((account) => (
            <li key={account.pubkey}>
              {account.pubkey} (owner: {account.owner})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No frozen accounts found.</p>
      )}
    </div>
  );
}

export default AllFreezeAccounts;
