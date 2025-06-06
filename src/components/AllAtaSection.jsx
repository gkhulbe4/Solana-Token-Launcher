import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

function AllAtaSection() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [ataDetails, setAtaDetails] = useState([]);

  useEffect(() => {
    async function fetchATAs() {
      if (!wallet.publicKey) return;

      try {
        const response = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        const ataInfo = response.value.map((account) => ({
          ataAddress: account.pubkey.toBase58(),
          mint: account.account.data.parsed.info.mint,
          amount: account.account.data.parsed.info.tokenAmount.uiAmount,
        }));

        setAtaDetails(ataInfo);
      } catch (error) {
        console.error("Failed to fetch ATA details:", error);
      }
    }

    fetchATAs();
  }, [wallet.publicKey, connection]);

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">
        Your Associated Token Accounts
      </h2>
      {ataDetails.length === 0 ? (
        <p>No ATAs found or wallet not connected.</p>
      ) : (
        ataDetails.map((ata, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 rounded mb-3 w-full max-w-xl"
          >
            <p>
              <strong>ATA Address:</strong> {ata.ataAddress}
            </p>
            <p>
              <strong>Mint:</strong> {ata.mint}
            </p>
            <p>
              <strong>Amount:</strong> {ata.amount}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllAtaSection;
