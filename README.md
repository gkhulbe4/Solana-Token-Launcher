# Solana Token Launcher

Solana Token Launcher is a powerful, user-friendly decentralized application (dApp) built using React that enables users to effortlessly create, mint, and manage SPL tokens on the Solana blockchain. It supports real-time wallet integration, authority info fetching, ATA (Associated Token Account) management, and metadata deployment through IPFS via Pinata.

---

## 🚀 Features

### ✅ Token Creation

- Create new tokens on the Solana blockchain.
- Supports the `TOKEN_2022_PROGRAM_ID`.
- Dynamically generates and displays mint authority, freeze authority, decimals, and total supply.

### ✅ Token Minting

- Mint newly created tokens to recipients' ATAs.
- Automatically checks for and creates ATAs if they don't exist.
- Ensures smooth minting through on-chain validation.

### ✅ Authority Information

- Fetch and display token details such as:

  - Mint Authority
  - Freeze Authority
  - Decimals
  - Total Supply

### ✅ ATA Management

- Uses Solana Web3 and SPL token instructions to verify and create ATAs.
- Ensures tokens are minted to valid associated accounts.

### ✅ Metadata Hosting via Pinata

- Uploads token images and metadata to IPFS using Pinata.
- Generates metadata URIs compatible with the Solana token metadata standard.
- Ensures decentralization and permanence of token info.

---

## 🌐 Tech Stack

| Technology             | Role                                |
| ---------------------- | ----------------------------------- |
| React.js               | Frontend framework                  |
| Tailwind CSS           | Styling solution                    |
| @solana/web3.js        | Solana blockchain interaction       |
| @solana/spl-token      | Token management and ATA operations |
| @solana/wallet-adapter | Wallet connectivity (Phantom, etc.) |
| Pinata API             | Metadata and image upload to IPFS   |
| React Toast (Sonner)   | Toast notifications for UX feedback |

---

## 🔑 Wallet Support

- Integrates seamlessly with Phantom and other wallets using `@solana/wallet-adapter`.
- Facilitates wallet connection, public key extraction, and transaction signing.

---

## 📎 Metadata via Pinata & IPFS

- Users upload token images and enter metadata fields.
- App uploads image and JSON to IPFS through Pinata's secure API.
- Metadata URI is used in the token creation process.

> Make sure to store your JWT from Pinata securely and do not expose it publicly.

---

## ⚠️ Notes

- **Creation fees may vary** depending on Solana's network conditions and rent requirements.
- Minting and ATA creation require the connected wallet to have the appropriate authorities.
- All token interactions follow SPL token 2022 standards.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gkhulbe4/Solana-Token-Launcher.git
cd Solana-Token-Launcher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file in the root:

```env
VITE_PINATA_JWT=your_pinata_jwt_token_here
VITE_PINATA_GATEWAY_URL=your_pinata_gateway_url
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_API_SECRET=your_pinata_api_secret
```

### 4. Start Development Server

```bash
npm run dev
```

---

## 🌟 Future Enhancements

- Add transfer and burn token functionality
- Display token balances and history
- Better error and edge case handling
- Support for multiple wallet types
