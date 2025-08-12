// Aave V3 Ethereum Mainnet Configuration
export const AAVE_CONFIG = {
  // Core Aave V3 contracts on Ethereum Mainnet
  POOL: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  POOL_DATA_PROVIDER: "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3",
  UI_POOL_DATA_PROVIDER: "0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d",
  PRICE_ORACLE: "0x54586bE62E3c3580375aE3723C145253060Ca0C2",
  WETH_GATEWAY: "0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9",
} as const;

// Supported assets for MVP
export const SUPPORTED_ASSETS = {
  // Collateral assets
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000", // ETH placeholder
    aTokenAddress: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8", // aWETH
    decimals: 18,
    icon: "Ξ",
    isCollateral: true,
    canBorrow: false,
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    aTokenAddress: "0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8", // aWBTC
    decimals: 8,
    icon: "₿",
    isCollateral: true,
    canBorrow: false,
  },
  // Borrow assets
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86a33E6441c8C23482b0CF67A0E5a8e3BC38b",
    aTokenAddress: "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c", // aUSDC
    decimals: 6,
    icon: "$",
    isCollateral: false,
    canBorrow: true,
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    aTokenAddress: "0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a", // aUSDT
    decimals: 6,
    icon: "$",
    isCollateral: false,
    canBorrow: true,
  },
} as const;

// Helper functions
export const getAssetBySymbol = (symbol: string) => {
  return SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
};

export const getCollateralAssets = () => {
  return Object.values(SUPPORTED_ASSETS).filter(asset => asset.isCollateral);
};

export const getBorrowAssets = () => {
  return Object.values(SUPPORTED_ASSETS).filter(asset => asset.canBorrow);
};

// Ethereum mainnet chain config
export const ETHEREUM_MAINNET = {
  id: 1,
  name: "Ethereum",
  rpc: "https://ethereum-rpc.publicnode.com",
  blockExplorer: "https://etherscan.io",
} as const;