import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

// Create thirdweb client
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id", // Get from your thirdweb dashboard
});

// Configure supported wallets
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram", 
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

// Define the chains your app supports
export const chains = [
  {
    id: 1,
    name: "Ethereum",
    rpc: "https://ethereum-rpc.publicnode.com",
  },
  {
    id: 11155111,
    name: "Sepolia",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  // Add more chains as needed
];