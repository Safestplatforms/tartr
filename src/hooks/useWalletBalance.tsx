// Legacy hook that now uses real Aave data for backward compatibility
import { useAaveData } from './useAaveData';

export const useWalletBalance = () => {
  const aaveData = useAaveData();
  
  return {
    // Legacy interface - now powered by real Aave data
    balances: aaveData.balances,
    cryptoPrices: aaveData.cryptoPrices,
    isLoading: aaveData.isLoading,
    totalValue: aaveData.totalValue,
    maxBorrowable: aaveData.maxBorrowable,
    getAssetValue: aaveData.getAssetValue,
    
    // Pass through additional Aave data for enhanced components
    healthFactor: aaveData.healthFactor,
    totalSupplied: aaveData.totalSupplied,
    totalBorrowed: aaveData.totalBorrowed,
    aaveBalances: aaveData.aaveBalances,
  };
};