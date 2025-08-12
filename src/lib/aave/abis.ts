// Minimal Aave V3 ABIs for MVP functionality

export const AAVE_POOL_ABI = [
  // Supply function
  {
    "inputs": [
      {"internalType": "address", "name": "asset", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "address", "name": "onBehalfOf", "type": "address"},
      {"internalType": "uint16", "name": "referralCode", "type": "uint16"}
    ],
    "name": "supply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Borrow function
  {
    "inputs": [
      {"internalType": "address", "name": "asset", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "interestRateMode", "type": "uint256"},
      {"internalType": "uint16", "name": "referralCode", "type": "uint16"},
      {"internalType": "address", "name": "onBehalfOf", "type": "address"}
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Repay function
  {
    "inputs": [
      {"internalType": "address", "name": "asset", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "interestRateMode", "type": "uint256"},
      {"internalType": "address", "name": "onBehalfOf", "type": "address"}
    ],
    "name": "repay",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Withdraw function
  {
    "inputs": [
      {"internalType": "address", "name": "asset", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"}
    ],
    "name": "withdraw",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get user account data
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserAccountData",
    "outputs": [
      {"internalType": "uint256", "name": "totalCollateralBase", "type": "uint256"},
      {"internalType": "uint256", "name": "totalDebtBase", "type": "uint256"},
      {"internalType": "uint256", "name": "availableBorrowsBase", "type": "uint256"},
      {"internalType": "uint256", "name": "currentLiquidationThreshold", "type": "uint256"},
      {"internalType": "uint256", "name": "ltv", "type": "uint256"},
      {"internalType": "uint256", "name": "healthFactor", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const AAVE_UI_POOL_DATA_PROVIDER_ABI = [
  // Get user reserves data
  {
    "inputs": [
      {"internalType": "contract IPoolAddressesProvider", "name": "provider", "type": "address"},
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserReservesData",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "underlyingAsset", "type": "address"},
          {"internalType": "uint256", "name": "scaledATokenBalance", "type": "uint256"},
          {"internalType": "bool", "name": "usageAsCollateralEnabledOnUser", "type": "bool"},
          {"internalType": "uint256", "name": "stableBorrowRate", "type": "uint256"},
          {"internalType": "uint256", "name": "scaledVariableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "principalStableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "stableBorrowLastUpdateTimestamp", "type": "uint256"}
        ],
        "internalType": "struct IUiPoolDataProvider.UserReserveData[]",
        "name": "",
        "type": "tuple[]"
      },
      {"internalType": "uint8", "name": "", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get reserves data
  {
    "inputs": [
      {"internalType": "contract IPoolAddressesProvider", "name": "provider", "type": "address"}
    ],
    "name": "getReservesData",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "underlyingAsset", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "symbol", "type": "string"},
          {"internalType": "uint256", "name": "decimals", "type": "uint256"},
          {"internalType": "uint256", "name": "baseLTVasCollateral", "type": "uint256"},
          {"internalType": "uint256", "name": "reserveLiquidationThreshold", "type": "uint256"},
          {"internalType": "uint256", "name": "reserveLiquidationBonus", "type": "uint256"},
          {"internalType": "uint256", "name": "reserveFactor", "type": "uint256"},
          {"internalType": "bool", "name": "usageAsCollateralEnabled", "type": "bool"},
          {"internalType": "bool", "name": "borrowingEnabled", "type": "bool"},
          {"internalType": "bool", "name": "stableBorrowRateEnabled", "type": "bool"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "bool", "name": "isFrozen", "type": "bool"},
          {"internalType": "uint128", "name": "liquidityIndex", "type": "uint128"},
          {"internalType": "uint128", "name": "variableBorrowIndex", "type": "uint128"},
          {"internalType": "uint128", "name": "liquidityRate", "type": "uint128"},
          {"internalType": "uint128", "name": "variableBorrowRate", "type": "uint128"},
          {"internalType": "uint128", "name": "stableBorrowRate", "type": "uint128"},
          {"internalType": "uint40", "name": "lastUpdateTimestamp", "type": "uint40"},
          {"internalType": "address", "name": "aTokenAddress", "type": "address"},
          {"internalType": "address", "name": "stableDebtTokenAddress", "type": "address"},
          {"internalType": "address", "name": "variableDebtTokenAddress", "type": "address"}
        ],
        "internalType": "struct IUiPoolDataProvider.AggregatedReserveData[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "components": [
          {"internalType": "uint256", "name": "marketReferenceCurrencyUnit", "type": "uint256"},
          {"internalType": "int256", "name": "marketReferenceCurrencyPriceInUsd", "type": "int256"},
          {"internalType": "int256", "name": "networkBaseTokenPriceInUsd", "type": "int256"},
          {"internalType": "uint8", "name": "networkBaseTokenPriceDecimals", "type": "uint8"}
        ],
        "internalType": "struct IUiPoolDataProvider.BaseCurrencyInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ERC20_ABI = [
  // Balance of
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Allowance
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Approve
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Decimals
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;