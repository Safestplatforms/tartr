import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getContract, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG } from '@/lib/aave/config';
import { AAVE_POOL_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';

// Your project's supported assets with proper typing
const SUPPORTED_ASSETS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    bgColor: "bg-blue-500",
    isCollateral: true,
    canBorrow: false
  },
  WBTC: {
    symbol: "WBTC", 
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    bgColor: "bg-orange-500",
    isCollateral: true,
    canBorrow: false
  },
  LINK: {
    symbol: "LINK",
    name: "Chainlink", 
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    bgColor: "bg-blue-600",
    isCollateral: true,
    canBorrow: false
  },
  UNI: {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 
    bgColor: "bg-purple-500",
    isCollateral: true,
    canBorrow: false
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    bgColor: "bg-blue-400",
    isCollateral: false,
    canBorrow: true
  },
  USDT: {
    symbol: "USDT", 
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    bgColor: "bg-green-500",
    isCollateral: false,
    canBorrow: true
  }
} as const;

const RatesTab = () => {
  const [rates, setRates] = useState<Record<string, {supply: number, borrow: number}>>({});

  // Aave Pool contract for fetching real-time rates
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // Convert Aave Ray format to percentage
  const rayToPercentage = (rayRate: bigint): number => {
    try {
      if (!rayRate || rayRate === 0n) return 0;
      
      const RAY = BigInt('1000000000000000000000000000'); // 10^27
      const rateDecimal = Number(rayRate) / Number(RAY);
      const percentage = rateDecimal * 100;
      
      return Math.min(Math.max(percentage, 0), 100);
    } catch (error) {
      console.error('Ray conversion error:', error);
      return 0;
    }
  };

  // Fallback rates for when Aave data is unavailable
  const getFallbackRates = (symbol: string) => {
    const fallbackData: Record<string, {supply: number, borrow: number}> = {
      ETH: { supply: 0.15, borrow: 2.8 },
      WBTC: { supply: 0.12, borrow: 3.2 },
      LINK: { supply: 0.08, borrow: 4.1 },
      UNI: { supply: 0.05, borrow: 5.2 },
      USDC: { supply: 4.2, borrow: 7.8 },
      USDT: { supply: 3.9, borrow: 7.5 }
    };
    return fallbackData[symbol] || { supply: 0, borrow: 0 };
  };

  // Fetch real-time rates from Aave
  const fetchRates = async () => {
    try {
      const ratePromises = Object.entries(SUPPORTED_ASSETS).map(async ([symbol, asset]) => {
        try {
          const reserveData = await readContract({
            contract: poolContract,
            method: "getReserveData",
            params: [asset.address],
          });

          if (reserveData && typeof reserveData === 'object') {
            const liquidityRate = reserveData.currentLiquidityRate || BigInt(0);
            const variableBorrowRate = reserveData.currentVariableBorrowRate || BigInt(0);
            
            const supplyAPY = rayToPercentage(liquidityRate);
            const borrowAPY = rayToPercentage(variableBorrowRate);
            
            return {
              symbol,
              supply: supplyAPY,
              borrow: borrowAPY
            };
          }
          
          return {
            symbol,
            ...getFallbackRates(symbol)
          };
        } catch (error) {
          console.error(`Failed to fetch ${symbol} rates:`, error);
          return {
            symbol,
            ...getFallbackRates(symbol)
          };
        }
      });

      const rateResults = await Promise.all(ratePromises);
      
      const newRates: Record<string, {supply: number, borrow: number}> = {};
      rateResults.forEach(({ symbol, supply, borrow }) => {
        newRates[symbol] = { supply, borrow };
      });

      setRates(newRates);
      
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      // Set fallback rates
      const fallbackRates: Record<string, {supply: number, borrow: number}> = {};
      Object.keys(SUPPORTED_ASSETS).forEach(symbol => {
        fallbackRates[symbol] = getFallbackRates(symbol);
      });
      setRates(fallbackRates);
    }
  };

  // Fetch rates on component mount
  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="text-lg md:text-xl text-card-foreground">Markets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {Object.entries(SUPPORTED_ASSETS).map(([symbol, asset]) => {
          const assetRates = rates[symbol] || { supply: 0, borrow: 0 };
          
          return (
            <div key={symbol} className="border border-border rounded-2xl p-3 md:p-4 hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 ${asset.bgColor} rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm`}>
                    {symbol.substring(0, 4)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base text-card-foreground">{symbol}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {asset.isCollateral && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Supply APY</p>
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-xs md:text-sm border border-border rounded-xl px-2 font-medium text-Black-600">
                          {assetRates.supply.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                  {asset.canBorrow && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Borrow APY</p>
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-xs md:text-sm border border-border rounded-xl px-2 font-medium text-Black-600">
                          {assetRates.borrow.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RatesTab;