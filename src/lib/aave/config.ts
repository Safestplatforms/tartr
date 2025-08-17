// Aave V3 Ethereum Mainnet Configuration
export const AAVE_CONFIG = {
  // Core Aave V3 contracts on Ethereum Mainnet
  POOL: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  POOL_DATA_PROVIDER: "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3",
  UI_POOL_DATA_PROVIDER: "0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d",
  POOL_ADDRESSES_PROVIDER: "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
  PRICE_ORACLE: "0x54586bE62E3c3580375aE3723C145253060Ca0C2",
  WETH_GATEWAY: "0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9",
} as const;

export const SUPPORTED_ASSETS = {
  // Volatile collateral assets
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH address
    aTokenAddress: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8", // aWETH
    debtTokenAddress: "0xeA51d7853EEFb32b6ee06b1C12E6dcCA88Be0fFE", // variableDebtWETH
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
    debtTokenAddress: "0x40aAbEf1aa8f0eEc637E0E7d92fbfFB2F26A8b7B", // variableDebtWBTC  
    decimals: 8,
    icon: "₿",
    isCollateral: true,
    canBorrow: false,
  },
  LINK: {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    aTokenAddress: "0x5e8c8a7243651db1384c0ddfdbe39761e8e7e51a", // aLINK V3
    debtTokenAddress: "0x4228F8895C7dDA20227F6a5c6751b8Ebf19a6ba8", // variableDebtLINK
    decimals: 18,
    icon: "🔗",
    isCollateral: true,
    canBorrow: false,
  },
  UNI: {
    symbol: "UNI", 
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    aTokenAddress: "0xf6d2224916ddfbbab6e6bd0d1b7034f4ae0cab18", // aUNI V3
    debtTokenAddress: "0xF64178Ebd2E2719F2B1233bCb5Ef6DB4bCc4d09a", // variableDebtUNI
    decimals: 18,
    icon: "🦄",
    isCollateral: true,
    canBorrow: false,
  },
  // Stablecoin assets - only for borrowing
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // ✅ Fixed address
    aTokenAddress: "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c", // aUSDC
    debtTokenAddress: "0x72E95b8931767C79bA4EeE721354d6E99a61D004", // 🔧 NEW: variableDebtUSDC
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
    debtTokenAddress: "0x6df1C1E379bC5a00a7b4C6e67A203333772f45A8", // 🔧 NEW: variableDebtUSDT
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