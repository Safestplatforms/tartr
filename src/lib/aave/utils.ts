import { SUPPORTED_ASSETS } from './config';

/**
 * Format token amount with proper decimals
 */
export const formatTokenAmount = (amount: bigint, decimals: number): string => {
  const divisor = BigInt(10 ** decimals);
  const wholePart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return trimmedFractional.length > 0 
    ? `${wholePart}.${trimmedFractional}`
    : wholePart.toString();
};

/**
 * Parse user input amount to BigInt with proper decimals
 */
export const parseTokenAmount = (amount: string, decimals: number): bigint => {
  if (!amount || amount === '0') return 0n;
  
  const [whole, fractional = ''] = amount.split('.');
  const wholeBigInt = BigInt(whole || '0');
  
  if (fractional.length === 0) {
    return wholeBigInt * BigInt(10 ** decimals);
  }
  
  const paddedFractional = fractional.padEnd(decimals, '0').slice(0, decimals);
  const fractionalBigInt = BigInt(paddedFractional);
  
  return wholeBigInt * BigInt(10 ** decimals) + fractionalBigInt;
};

/**
 * Calculate health factor from user account data
 */
export const calculateHealthFactor = (
  totalCollateralETH: bigint,
  totalDebtETH: bigint,
  liquidationThreshold: bigint
): number => {
  if (totalDebtETH === 0n) {
    return Number.POSITIVE_INFINITY;
  }
  
  const collateralValue = Number(totalCollateralETH) / 1e18;
  const debtValue = Number(totalDebtETH) / 1e18;
  const threshold = Number(liquidationThreshold) / 10000; // Liquidation threshold is in basis points
  
  return (collateralValue * threshold) / debtValue;
};

/**
 * Calculate maximum borrowable amount in USD
 */
export const calculateMaxBorrowable = (
  totalCollateralETH: bigint,
  totalDebtETH: bigint,
  ltv: bigint,
  ethPriceUSD: number = 2800
): number => {
  const collateralValueETH = Number(totalCollateralETH) / 1e18;
  const debtValueETH = Number(totalDebtETH) / 1e18;
  const ltvRatio = Number(ltv) / 10000; // LTV is in basis points
  
  const maxBorrowableETH = (collateralValueETH * ltvRatio) - debtValueETH;
  const maxBorrowableUSD = Math.max(0, maxBorrowableETH * ethPriceUSD);
  
  return Math.floor(maxBorrowableUSD);
};

/**
 * Get asset configuration by address
 */
export const getAssetByAddress = (address: string) => {
  return Object.values(SUPPORTED_ASSETS).find(
    asset => asset.address.toLowerCase() === address.toLowerCase()
  );
};

/**
 * Get asset symbol by address
 */
export const getSymbolByAddress = (address: string): string => {
  const asset = getAssetByAddress(address);
  return asset?.symbol || 'UNKNOWN';
};

/**
 * Format USD amount for display
 */
export const formatUSDAmount = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

/**
 * Format percentage for display
 */
export const formatPercentage = (rate: bigint, decimals: number = 27): string => {
  const percentage = (Number(rate) / Math.pow(10, decimals)) * 100;
  return `${percentage.toFixed(2)}%`;
};

/**
 * Calculate liquidation price for a given asset
 */
export const calculateLiquidationPrice = (
  collateralAmount: number,
  borrowAmountUSD: number,
  liquidationThreshold: number = 0.85 // 85%
): number => {
  if (collateralAmount === 0) return 0;
  return borrowAmountUSD / (collateralAmount * liquidationThreshold);
};

/**
 * Validate transaction parameters
 */
export const validateTransaction = {
  supply: (amount: string, asset: string, balance: number) => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }
    if (amountNum > balance) {
      return { valid: false, error: 'Insufficient balance' };
    }
    if (!SUPPORTED_ASSETS[asset as keyof typeof SUPPORTED_ASSETS]) {
      return { valid: false, error: 'Unsupported asset' };
    }
    return { valid: true, error: null };
  },

  borrow: (amount: string, asset: string, maxBorrowable: number) => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }
    if (amountNum > maxBorrowable) {
      return { valid: false, error: 'Exceeds borrowing capacity' };
    }
    const assetConfig = SUPPORTED_ASSETS[asset as keyof typeof SUPPORTED_ASSETS];
    if (!assetConfig || !assetConfig.canBorrow) {
      return { valid: false, error: 'Cannot borrow this asset' };
    }
    return { valid: true, error: null };
  },

  repay: (amount: string, asset: string, debtAmount: number) => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }
    if (debtAmount === 0) {
      return { valid: false, error: 'No debt to repay' };
    }
    return { valid: true, error: null };
  },

  withdraw: (amount: string, asset: string, supplyBalance: number) => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }
    if (amountNum > supplyBalance) {
      return { valid: false, error: 'Insufficient supply balance' };
    }
    return { valid: true, error: null };
  },
};

/**
 * Get health factor status and color
 */
export const getHealthFactorStatus = (healthFactor: number) => {
  if (healthFactor >= 1.5) {
    return {
      status: 'Healthy',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅'
    };
  }
  if (healthFactor >= 1.2) {
    return {
      status: 'Warning',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '⚠️'
    };
  }
  return {
    status: 'At Risk',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '❌'
  };
};

/**
 * Convert BigInt to number safely (for display purposes)
 */
export const bigIntToNumber = (value: bigint, decimals: number = 18): number => {
  return Number(value) / Math.pow(10, decimals);
};

/**
 * Convert number to BigInt safely (for contract calls)
 */
export const numberToBigInt = (value: number, decimals: number = 18): bigint => {
  // Convert to string first to avoid floating point precision issues
  const valueStr = value.toFixed(decimals);
  const [whole, fractional = ''] = valueStr.split('.');
  
  const wholeBigInt = BigInt(whole || '0');
  const fractionalPadded = fractional.padEnd(decimals, '0').slice(0, decimals);
  const fractionalBigInt = BigInt(fractionalPadded || '0');
  
  return wholeBigInt * BigInt(10 ** decimals) + fractionalBigInt;
};

/**
 * Constants for common calculations
 */
export const AAVE_CONSTANTS = {
  SECONDS_PER_YEAR: 365.25 * 24 * 60 * 60,
  RAY: BigInt('1000000000000000000000000000'), // 10^27
  WAD: BigInt('1000000000000000000'), // 10^18
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD: 1.0,
  DEFAULT_LIQUIDATION_THRESHOLD: 0.85,
  MAX_UINT256: BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'),
} as const;