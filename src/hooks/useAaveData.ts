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
  supplyBalance: number; // aToken balance (supplied to Aave)
  borrowBalance: number; // debt token balance (borrowed from Aave)
  price: number;
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

  // Aave Pool contract
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // UI Pool Data Provider contract
  const uiDataProviderContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.UI_POOL_DATA_PROVIDER,
    abi: AAVE_UI_POOL_DATA_PROVIDER_ABI,
  });

  // Get user account data from Aave
  const { data: userAccountData, isLoading: accountDataLoading } = useReadContract({
    contract: poolContract,
    method: "getUserAccountData",
    params: account?.address ? [account.address] : undefined,
  });

  // Get user reserves data from Aave UI provider
  const { data: userReservesData, isLoading: reservesLoading } = useReadContract({
    contract: uiDataProviderContract,
    method: "getUserReservesData",
    params: account?.address ? [AAVE_CONFIG.POOL_DATA_PROVIDER, account.address] : undefined,
  });

  const mockPrices = {
    ETH: 2800,
    WBTC: 45000,
    USDC: 1,
    USDT: 1,
  };

  // FIXED: Real ETH balance reading using thirdweb
  const getETHBalance = async (address: string): Promise<bigint> => {
    try {
      // Use thirdweb's built-in balance reading
      const balance = await readContract({
        contract: {
          client,
          chain: ethereum,
          address: '0x0000000000000000000000000000000000000000', // Native ETH
        },
        method: 'function balanceOf(address) view returns (uint256)',
        params: [address],
      });
      return balance as bigint;
    } catch (error) {
      // Fallback: Use RPC call directly
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
      } catch (rpcError) {
        console.error('Error fetching ETH balance:', error, rpcError);
        return 0n;
      }
    }
  };

  // FIXED: Real ERC20 token balance reading using thirdweb
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

  // Process user data and calculate balances
  useEffect(() => {
    const processUserData = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const processedBalances: Record<string, AssetBalance> = {};

        // Process each supported asset
        for (const [symbol, assetConfig] of Object.entries(SUPPORTED_ASSETS)) {
          let walletBalance = 0n;
          let supplyBalance = 0n;
          let borrowBalance = 0n;

          // Get wallet balance - REAL IMPLEMENTATION
          if (symbol === 'ETH') {
            walletBalance = await getETHBalance(account.address);
            console.log(`Real ETH balance for ${account.address}:`, walletBalance.toString());
          } else {
            walletBalance = await getTokenBalance(assetConfig.address, account.address);
            console.log(`Real ${symbol} balance:`, walletBalance.toString());
          }

          // Process Aave positions from userReservesData
          if (userReservesData && userReservesData[0]) {
            const reserves = userReservesData[0] as any[];
            const userReserve = reserves.find(
              (reserve: any) => reserve.underlyingAsset.toLowerCase() === assetConfig.address.toLowerCase()
            );

            if (userReserve) {
              supplyBalance = userReserve.scaledATokenBalance || 0n;
              borrowBalance = userReserve.scaledVariableDebt || 0n;
            }
          }

          // Convert to numbers (handle decimals properly)
          const decimals = assetConfig.decimals;
          const divisor = BigInt(10 ** decimals);

          processedBalances[symbol] = {
            symbol,
            balance: Number(walletBalance) / Number(divisor),
            supplyBalance: Number(supplyBalance) / Number(divisor),
            borrowBalance: Number(borrowBalance) / Number(divisor),
            price: mockPrices[symbol as keyof typeof mockPrices] || 0,
          };
        }

        setBalances(processedBalances);

        // Process Aave user account data
        if (userAccountData) {
          setAaveUserData({
            totalCollateralETH: userAccountData[0] as bigint,
            totalDebtETH: userAccountData[1] as bigint,
            availableBorrowsETH: userAccountData[2] as bigint,
            currentLiquidationThreshold: userAccountData[3] as bigint,
            ltv: userAccountData[4] as bigint,
            healthFactor: userAccountData[5] as bigint,
          });
        }

      } catch (error) {
        console.error('Error processing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processUserData();
  }, [account?.address, userAccountData, userReservesData]);

  // Calculate derived values
  const calculateTotalValue = () => {
    return Object.values(balances).reduce((total, asset) => {
      const walletValue = asset.balance * asset.price;
      const supplyValue = asset.supplyBalance * asset.price;
      return total + walletValue + supplyValue;
    }, 0);
  };

  const calculateMaxBorrowable = () => {
    if (!aaveUserData) return 0;
    
    // Convert from ETH base units to USD (approximate)
    const ethPrice = mockPrices.ETH;
    const availableBorrowsUSD = (Number(aaveUserData.availableBorrowsETH) / 1e18) * ethPrice;
    
    return Math.floor(availableBorrowsUSD);
  };

  const calculateHealthFactor = () => {
    if (!aaveUserData || aaveUserData.healthFactor === 0n) return 0;
    
    // FIXED: Handle the giant health factor when no debt exists
    const healthFactorNumber = Number(aaveUserData.healthFactor) / 1e18;
    
    // If health factor is extremely large (no debt), return 0 for "no positions"
    if (healthFactorNumber > 1e10) return 0;
    
    return healthFactorNumber;
  };

  const getTotalSupplied = () => {
    return Object.values(balances).reduce((total, asset) => {
      return total + (asset.supplyBalance * asset.price);
    }, 0);
  };

  const getTotalBorrowed = () => {
    return Object.values(balances).reduce((total, asset) => {
      return total + (asset.borrowBalance * asset.price);
    }, 0);
  };

  return {
    // Legacy interface (same as useWalletBalance)
    balances: Object.fromEntries(
      Object.entries(balances).map(([symbol, data]) => [symbol, data.balance])
    ),
    cryptoPrices: mockPrices,
    isLoading: isLoading || accountDataLoading || reservesLoading,
    totalValue: calculateTotalValue(),
    maxBorrowable: calculateMaxBorrowable(),
    getAssetValue: (crypto: string, amount: number) => {
      const price = mockPrices[crypto as keyof typeof mockPrices] || 0;
      return amount * price;
    },
    
    // New Aave-specific data
    aaveBalances: balances,
    healthFactor: calculateHealthFactor(),
    totalSupplied: getTotalSupplied(),
    totalBorrowed: getTotalBorrowed(),
    aaveUserData,
    collateralAssets: getCollateralAssets(),
    borrowAssets: getBorrowAssets(),
  };
};