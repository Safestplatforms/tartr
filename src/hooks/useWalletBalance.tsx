import { useState, useEffect } from 'react';

// Mock wallet balance hook - in real app this would connect to actual wallet
export const useWalletBalance = () => {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching wallet balances
    const fetchBalances = async () => {
      setIsLoading(true);
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet balances
      setBalances({
        BTC: 0.5,    // 0.5 BTC
        ETH: 12.3,   // 12.3 ETH
        USDC: 5000,  // 5,000 USDC
        USDT: 2000,  // 2,000 USDT
      });
      setIsLoading(false);
    };

    fetchBalances();
  }, []);

  const cryptoPrices = {
    BTC: 45000,
    ETH: 2800,
    USDC: 1,
    USDT: 1,
  };

  const calculateTotalValue = () => {
    return Object.entries(balances).reduce((total, [crypto, amount]) => {
      const price = cryptoPrices[crypto as keyof typeof cryptoPrices] || 0;
      return total + (amount * price);
    }, 0);
  };

  const calculateMaxBorrowable = (ltv: number = 0.8) => {
    const totalValue = calculateTotalValue();
    return Math.floor(totalValue * ltv);
  };

  return {
    balances,
    cryptoPrices,
    isLoading,
    totalValue: calculateTotalValue(),
    maxBorrowable: calculateMaxBorrowable(),
    getAssetValue: (crypto: string, amount: number) => {
      const price = cryptoPrices[crypto as keyof typeof cryptoPrices] || 0;
      return amount * price;
    }
  };
};