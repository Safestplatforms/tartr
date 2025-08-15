// Enhanced ABIs for real Aave data fetching

// Complete Aave Pool ABI with all needed functions
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
  // Get user account data - critical for real data
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
  },
  // Get reserve data for real APYs
  {
    "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
    "name": "getReserveData",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "configuration", "type": "uint256"},
          {"internalType": "uint128", "name": "liquidityIndex", "type": "uint128"},
          {"internalType": "uint128", "name": "currentLiquidityRate", "type": "uint128"},
          {"internalType": "uint128", "name": "variableBorrowIndex", "type": "uint128"},
          {"internalType": "uint128", "name": "currentVariableBorrowRate", "type": "uint128"},
          {"internalType": "uint128", "name": "currentStableBorrowRate", "type": "uint128"},
          {"internalType": "uint40", "name": "lastUpdateTimestamp", "type": "uint40"},
          {"internalType": "uint16", "name": "id", "type": "uint16"},
          {"internalType": "address", "name": "aTokenAddress", "type": "address"},
          {"internalType": "address", "name": "stableDebtTokenAddress", "type": "address"},
          {"internalType": "address", "name": "variableDebtTokenAddress", "type": "address"},
          {"internalType": "address", "name": "interestRateStrategyAddress", "type": "address"},
          {"internalType": "uint128", "name": "accruedToTreasury", "type": "uint128"},
          {"internalType": "uint128", "name": "unbacked", "type": "uint128"},
          {"internalType": "uint128", "name": "isolationModeTotalDebt", "type": "uint128"}
        ],
        "internalType": "struct DataTypes.ReserveData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
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
  }
] as const;

// UI Pool Data Provider ABI for comprehensive market data
export const AAVE_UI_POOL_DATA_PROVIDER_ABI = [
  // Get reserves data - returns all market information
  {
    "inputs": [{"internalType": "contract IPoolAddressesProvider", "name": "provider", "type": "address"}],
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
          {"internalType": "address", "name": "variableDebtTokenAddress", "type": "address"},
          {"internalType": "address", "name": "interestRateStrategyAddress", "type": "address"},
          {"internalType": "uint256", "name": "availableLiquidity", "type": "uint256"},
          {"internalType": "uint256", "name": "totalPrincipalStableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "averageStableRate", "type": "uint256"},
          {"internalType": "uint256", "name": "stableDebtLastUpdateTimestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "totalScaledVariableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "priceInMarketReferenceCurrency", "type": "uint256"},
          {"internalType": "address", "name": "priceOracle", "type": "address"},
          {"internalType": "uint256", "name": "variableRateSlope1", "type": "uint256"},
          {"internalType": "uint256", "name": "variableRateSlope2", "type": "uint256"},
          {"internalType": "uint256", "name": "stableRateSlope1", "type": "uint256"},
          {"internalType": "uint256", "name": "stableRateSlope2", "type": "uint256"},
          {"internalType": "uint256", "name": "baseStableBorrowRate", "type": "uint256"},
          {"internalType": "uint256", "name": "baseVariableBorrowRate", "type": "uint256"},
          {"internalType": "uint256", "name": "optimalUsageRatio", "type": "uint256"},
          {"internalType": "bool", "name": "isPaused", "type": "bool"},
          {"internalType": "bool", "name": "isSiloedBorrowing", "type": "bool"},
          {"internalType": "uint128", "name": "accruedToTreasury", "type": "uint128"},
          {"internalType": "uint128", "name": "unbacked", "type": "uint128"},
          {"internalType": "uint128", "name": "isolationModeTotalDebt", "type": "uint128"},
          {"internalType": "uint256", "name": "debtCeiling", "type": "uint256"},
          {"internalType": "uint256", "name": "debtCeilingDecimals", "type": "uint256"},
          {"internalType": "uint8", "name": "eModeCategoryId", "type": "uint8"},
          {"internalType": "uint256", "name": "borrowCap", "type": "uint256"},
          {"internalType": "uint256", "name": "supplyCap", "type": "uint256"},
          {"internalType": "uint16", "name": "eModeLtv", "type": "uint16"},
          {"internalType": "uint16", "name": "eModeLiquidationThreshold", "type": "uint16"},
          {"internalType": "uint16", "name": "eModeLiquidationBonus", "type": "uint16"},
          {"internalType": "address", "name": "eModePriceSource", "type": "address"},
          {"internalType": "string", "name": "eModeLabel", "type": "string"},
          {"internalType": "bool", "name": "borrowableInIsolation", "type": "bool"},
          {"internalType": "uint256", "name": "totalDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "totalVariableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "totalStableDebt", "type": "uint256"}
        ],
        "internalType": "struct IUiPoolDataProviderV3.AggregatedReserveData[]",
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
        "internalType": "struct IUiPoolDataProviderV3.BaseCurrencyInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get user reserves data - returns user's positions
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
        "internalType": "struct IUiPoolDataProviderV3.UserReserveData[]",
        "name": "",
        "type": "tuple[]"
      },
      {"internalType": "uint8", "name": "", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Price Oracle ABI for real asset prices
export const AAVE_PRICE_ORACLE_ABI = [
  {
    "inputs": [{"internalType": "address[]", "name": "assets", "type": "address[]"}],
    "name": "getAssetsPrices",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
    "name": "getAssetPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BASE_CURRENCY",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BASE_CURRENCY_UNIT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Standard ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
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
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "from", "type": "address"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// WETH Gateway ABI for ETH deposits/withdrawals
export const WETH_GATEWAY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "pool", "type": "address"},
      {"internalType": "address", "name": "onBehalfOf", "type": "address"},
      {"internalType": "uint16", "name": "referralCode", "type": "uint16"}
    ],
    "name": "depositETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "pool", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"}
    ],
    "name": "withdrawETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "pool", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "interestRateMode", "type": "uint256"},
      {"internalType": "uint16", "name": "referralCode", "type": "uint16"}
    ],
    "name": "borrowETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "pool", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "interestRateMode", "type": "uint256"},
      {"internalType": "address", "name": "onBehalfOf", "type": "address"}
    ],
    "name": "repayETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;