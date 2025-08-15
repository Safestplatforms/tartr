import { useState, useEffect } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { getContract, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG, SUPPORTED_ASSETS, getCollateralAssets, getBorrowAssets } from '@/lib/aave/config';
import { AAVE_POOL_ABI, AAVE_UI_POOL_DATA_PROVIDER_ABI, ERC20_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';

interface AssetBalance {
  symbol: string;
  balance: number;
  supplyBalance: number;
  borrowBalance: number;
  price: number;
  supplyAPY?: number;
  borrowAPY?: number;
}

interface AaveUserData {
  totalCollateralETH: bigint;
  totalDebtETH: bigint;
  availableBorrowsETH: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

export const useAaveData = () => {
  const account = useActiveAccount();
  const [balances, setBalances] = useState<Record<string, AssetBalance>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [aaveUserData, setAaveUserData] = useState<AaveUserData | null>(null);
  
  // Real prices state
  const [realPrices, setRealPrices] = useState<Record<string, number>>({
    ETH: 2800,
    WBTC: 45000,
    USDC: 1,
    USDT: 1,
  });

  // Real APY rates state
  const [realRates, setRealRates] = useState<Record<string, {supply: number, borrow: number}>>({
    ETH: { supply: 2.1, borrow: 3.8 },
    WBTC: { supply: 1.8, borrow: 4.2 },
    USDC: { supply: 4.5, borrow: 6.8 },
    USDT: { supply: 4.2, borrow: 7.1 },
  });

  // Aave Pool contract
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // ✅ Get user account data from Aave Pool (this is working!)
  const { data: userAccountData, isLoading: accountDataLoading } = useReadContract({
    contract: poolContract,
    method: "getUserAccountData",
    params: account?.address ? [account.address] : undefined,
  });

  // Fetch real prices from CoinGecko
  useEffect(() => {
    const fetchRealPrices = async () => {
      try {
        console.log('💰 Fetching real prices...');
        
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,wrapped-bitcoin,usd-coin,tether&vs_currencies=usd',
          { headers: { 'Accept': 'application/json' } }
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        const newPrices = {
          ETH: data.ethereum?.usd || realPrices.ETH,
          WBTC: data['wrapped-bitcoin']?.usd || realPrices.WBTC,
          USDC: data['usd-coin']?.usd || realPrices.USDC,
          USDT: data.tether?.usd || realPrices.USDT,
        };
        
        setRealPrices(newPrices);
        console.log('✅ Real prices updated:', newPrices);
        
      } catch (error) {
        console.error('❌ Failed to fetch real prices:', error);
      }
    };

    fetchRealPrices();
    const priceInterval = setInterval(fetchRealPrices, 2 * 60 * 1000);
    return () => clearInterval(priceInterval);
  }, []);

  // Helper functions for balance fetching
  const getETHBalance = async (address: string): Promise<bigint> => {
    try {
      const response = await fetch('https://ethereum-rpc.publicnode.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1,
        }),
      });
      const data = await response.json();
      return BigInt(data.result || '0x0');
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return 0n;
    }
  };

  const getTokenBalance = async (tokenAddress: string, userAddress: string): Promise<bigint> => {
    try {
      const tokenContract = getContract({
        client,
        chain: ethereum,
        address: tokenAddress,
        abi: ERC20_ABI,
      });

      const balance = await readContract({
        contract: tokenContract,
        method: "balanceOf",
        params: [userAddress],
      });

      return balance as bigint;
    } catch (error) {
      console.error(`Error fetching ${tokenAddress} balance:`, error);
      return 0n;
    }
  };

  // ✅ NEW: Direct aToken balance fetching as fallback
  const getATokenBalance = async (aTokenAddress: string, userAddress: string): Promise<bigint> => {
    try {
      const aTokenContract = getContract({
        client,
        chain: ethereum,
        address: aTokenAddress,
        abi: ERC20_ABI,
      });

      const balance = await readContract({
        contract: aTokenContract,
        method: "balanceOf",
        params: [userAddress],
      });

      console.log(`🪙 Direct aToken balance for ${aTokenAddress}:`, balance.toString());
      return balance as bigint;
    } catch (error) {
      console.error(`Error fetching aToken balance ${aTokenAddress}:`, error);
      return 0n;
    }
  };

  // ✅ FALLBACK APPROACH: Direct balance fetching
  useEffect(() => {
    const processUserDataFallback = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log('🔄 Processing user data with fallback approach for:', account.address);

      try {
        const processedBalances: Record<string, AssetBalance> = {};

        // Process each supported asset
        for (const [symbol, assetConfig] of Object.entries(SUPPORTED_ASSETS)) {
          let walletBalance = 0n;
          let supplyBalance = 0n;
          let borrowBalance = 0n;

          // Get wallet balance
          if (symbol === 'ETH') {
            walletBalance = await getETHBalance(account.address);
            console.log(`💰 Real ETH balance:`, (Number(walletBalance) / 1e18).toFixed(6), 'ETH');
          } else {
            walletBalance = await getTokenBalance(assetConfig.address, account.address);
            console.log(`💰 Real ${symbol} balance:`, (Number(walletBalance) / Math.pow(10, assetConfig.decimals)).toFixed(6), symbol);
          }

          // ✅ NEW: Direct aToken balance fetching (fallback approach)
          try {
            const aTokenBalance = await getATokenBalance(assetConfig.aTokenAddress, account.address);
            if (aTokenBalance > 0n) {
              supplyBalance = aTokenBalance;
              console.log(`🪙 ${symbol} aToken balance found:`, (Number(aTokenBalance) / Math.pow(10, assetConfig.decimals)).toFixed(6), symbol);
            }
          } catch (error) {
            console.error(`❌ Error fetching ${symbol} aToken balance:`, error);
          }

          // Helper function to safely convert BigInt to number with decimals
          const formatTokenAmount = (amount: bigint, decimals: number): number => {
            return Number(amount) / Math.pow(10, decimals);
          };

          processedBalances[symbol] = {
            symbol,
            balance: formatTokenAmount(walletBalance, assetConfig.decimals),
            supplyBalance: formatTokenAmount(supplyBalance, assetConfig.decimals),
            borrowBalance: formatTokenAmount(borrowBalance, assetConfig.decimals),
            price: realPrices[symbol] || 0,
            supplyAPY: realRates[symbol]?.supply || 0,
            borrowAPY: realRates[symbol]?.borrow || 0,
          };

          console.log(`✅ ${symbol} FINAL PROCESSED (FALLBACK):`, processedBalances[symbol]);
          
          // ✅ IMPORTANT: Log the calculated USD value for debugging
          const supplyValueUSD = processedBalances[symbol].supplyBalance * processedBalances[symbol].price;
          if (supplyValueUSD > 0) {
            console.log(`💰 ${symbol} Supply Value: ${processedBalances[symbol].supplyBalance} × ${processedBalances[symbol].price} = ${supplyValueUSD.toFixed(2)}`);
          }
        }

        setBalances(processedBalances);

        // ✅ DEBUG: Test the total supplied calculation immediately
        const testTotalSupplied = Object.values(processedBalances).reduce((total, asset) => {
          return total + (asset.supplyBalance * asset.price);
        }, 0);
        console.log(`🎯 TOTAL SUPPLIED CALCULATED: ${testTotalSupplied.toFixed(2)}`);

        // Process Aave user account data (this is working!)
        if (userAccountData && Array.isArray(userAccountData)) {
          const aaveData = {
            totalCollateralETH: BigInt(userAccountData[0]?.toString() || '0'),
            totalDebtETH: BigInt(userAccountData[1]?.toString() || '0'),
            availableBorrowsETH: BigInt(userAccountData[2]?.toString() || '0'),
            currentLiquidationThreshold: BigInt(userAccountData[3]?.toString() || '0'),
            ltv: BigInt(userAccountData[4]?.toString() || '0'),
            healthFactor: BigInt(userAccountData[5]?.toString() || '0'),
          };
          
          setAaveUserData(aaveData);
          
          // ✅ Calculate your supplied amount in USD
          const ethPrice = realPrices.ETH;
          const totalCollateralUSD = (Number(aaveData.totalCollateralETH) / 1e18) * ethPrice;
          const availableBorrowsUSD = (Number(aaveData.availableBorrowsETH) / 1e18) * ethPrice;
          
          console.log('🎯 YOUR POSITION SUMMARY:');
          console.log(`   Total Collateral: ${(Number(aaveData.totalCollateralETH) / 1e18).toFixed(6)} ETH ($${totalCollateralUSD.toFixed(2)})`);
          console.log(`   Available to Borrow: ${(Number(aaveData.availableBorrowsETH) / 1e18).toFixed(6)} ETH ($${availableBorrowsUSD.toFixed(2)})`);
          console.log(`   Health Factor: ${aaveData.healthFactor > BigInt('1000000000000000000000000') ? '∞ (Healthy)' : (Number(aaveData.healthFactor) / 1e18).toFixed(2)}`);
        }

      } catch (error) {
        console.error('❌ Error processing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processUserDataFallback();
  }, [account?.address, userAccountData, realPrices, realRates]);

  // Calculate derived values using the working user account data
  const calculateTotalValue = () => {
    return Object.values(balances).reduce((total, asset) => {
      const walletValue = asset.balance * asset.price;
      const supplyValue = asset.supplyBalance * asset.price;
      return total + walletValue + supplyValue;
    }, 0);
  };

  const calculateMaxBorrowable = () => {
    if (!aaveUserData) {
      console.log('❌ No aaveUserData for maxBorrowable calculation');
      return 0;
    }
    
    const ethPrice = realPrices.ETH;
    const availableBorrowsETH = Number(aaveUserData.availableBorrowsETH) / 1e18;
    const availableBorrowsUSD = availableBorrowsETH * ethPrice;
    
    console.log('🎯 MAX BORROWABLE CALCULATION:');
    console.log(`   availableBorrowsETH (raw): ${aaveUserData.availableBorrowsETH.toString()}`);
    console.log(`   availableBorrowsETH (converted): ${availableBorrowsETH.toFixed(6)} ETH`);
    console.log(`   ETH Price: ${ethPrice}`);
    console.log(`   Available Borrows USD: ${availableBorrowsUSD.toFixed(2)}`);
    
    const result = Math.floor(availableBorrowsUSD);
    console.log(`   Final maxBorrowable: ${result}`);
    
    return result;
  };

  const calculateHealthFactor = () => {
    if (!aaveUserData || aaveUserData.healthFactor === 0n) return 0;
    
    const healthFactorNumber = Number(aaveUserData.healthFactor) / 1e18;
    
    // If extremely large (no debt), return infinity symbol
    if (healthFactorNumber > 1e10) return Infinity;
    
    return healthFactorNumber;
  };

  const getTotalSupplied = () => {
    // ✅ Calculate from individual balances first (more accurate for UI)
    const totalFromBalances = Object.values(balances).reduce((total, asset) => {
      const supplyValue = asset.supplyBalance * asset.price;
      console.log(`📊 ${asset.symbol} supply value: ${asset.supplyBalance} * ${asset.price} = ${supplyValue.toFixed(2)}`);
      return total + supplyValue;
    }, 0);
    
    console.log(`📊 Total supplied from balances: ${totalFromBalances.toFixed(2)}`);
    
    // Use individual balances if they have values, otherwise use account data
    if (totalFromBalances > 0) {
      return totalFromBalances;
    }
    
    // ✅ Fallback to user account data
    if (aaveUserData && aaveUserData.totalCollateralETH > 0n) {
      const ethPrice = realPrices.ETH;
      const totalFromAccountData = (Number(aaveUserData.totalCollateralETH) / 1e18) * ethPrice;
      console.log(`📊 Total supplied from account data: ${totalFromAccountData.toFixed(2)}`);
      return totalFromAccountData;
    }
    
    return 0;
  };

  const getTotalBorrowed = () => {
    if (aaveUserData && aaveUserData.totalDebtETH > 0n) {
      const ethPrice = realPrices.ETH;
      return (Number(aaveUserData.totalDebtETH) / 1e18) * ethPrice;
    }
    
    return Object.values(balances).reduce((total, asset) => {
      return total + (asset.borrowBalance * asset.price);
    }, 0);
  };

  return {
    // Legacy interface
    balances: Object.fromEntries(
      Object.entries(balances).map(([symbol, data]) => [symbol, data.balance])
    ),
    cryptoPrices: realPrices,
    isLoading: isLoading || accountDataLoading,
    totalValue: calculateTotalValue(),
    maxBorrowable: calculateMaxBorrowable(),
    getAssetValue: (crypto: string, amount: number) => {
      const price = realPrices[crypto as keyof typeof realPrices] || 0;
      return price * amount;
    },

    // Enhanced Aave-specific interface
    aaveBalances: balances,
    aaveUserData,
    totalSupplied: getTotalSupplied(),
    totalBorrowed: getTotalBorrowed(),
    healthFactor: calculateHealthFactor(),
    
    // Asset helpers
    collateralAssets: getCollateralAssets(),
    borrowAssets: getBorrowAssets(),
  };
};