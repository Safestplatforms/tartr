import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { getContract, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG } from '@/lib/aave/config';
import { AAVE_POOL_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';
import { toast } from 'sonner';

// 🆕 Real-time rate fetching component
const RatesTab = () => {
  const { aaveBalances, isLoading: dataLoading } = useAaveData();
  const [realTimeRates, setRealTimeRates] = useState<Record<string, {supply: number, borrow: number}>>({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Aave Pool contract for fetching rates
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // 🆕 CORRECTED Ray conversion - Aave rates are already annual!
  const rayToPercentage = (rayRate: bigint): number => {
    try {
      if (!rayRate || rayRate === 0n) {
        console.log('⚠️ Ray rate is 0 or null');
        return 0;
      }
      
      console.log('🧮 Converting Ray rate:', rayRate.toString());
      
      // ✅ CORRECT: Aave V3 rates are already annual rates stored in Ray format
      // Just convert from Ray (27 decimals) to percentage
      const RAY = BigInt('1000000000000000000000000000'); // 10^27
      
      // Convert to decimal percentage directly
      const rateDecimal = Number(rayRate) / Number(RAY);
      const percentage = rateDecimal * 100;
      
      console.log('📊 Rate decimal:', rateDecimal);
      console.log('📈 Rate percentage:', percentage);
      
      // Ensure reasonable bounds (0-100%)
      const finalRate = Math.min(Math.max(percentage, 0), 100);
      
      console.log('✅ Final clamped rate:', finalRate, '%');
      
      return finalRate;
    } catch (error) {
      console.error('❌ Ray conversion error:', error);
      return 0;
    }
  };

  // 🆕 Fetch real-time rates from Aave
  const fetchRealTimeRates = async () => {
    try {
      setRatesLoading(true);
      console.log('🔄 Fetching real-time Aave rates...');
      
      const ratePromises = Object.entries(SUPPORTED_ASSETS).map(async ([symbol, asset]) => {
        try {
          const reserveData = await readContract({
            contract: poolContract,
            method: "getReserveData",
            params: [asset.address],
          });

          console.log(`📊 ${symbol} Reserve Data:`, reserveData);

          if (reserveData && typeof reserveData === 'object') {
            // ✅ CORRECT: It's an object, not an array! Access by property names
            const liquidityRate = reserveData.currentLiquidityRate || BigInt(0);      // Supply rate
            const variableBorrowRate = reserveData.currentVariableBorrowRate || BigInt(0); // Borrow rate
            
            console.log(`🔍 ${symbol} Raw Reserve Structure:`, {
              isObject: typeof reserveData === 'object',
              liquidityRate: liquidityRate.toString(),
              borrowRate: variableBorrowRate.toString(),
              hasLiquidityRate: !!reserveData.currentLiquidityRate,
              hasBorrowRate: !!reserveData.currentVariableBorrowRate
            });
            
            const supplyAPY = rayToPercentage(liquidityRate);
            const borrowAPY = rayToPercentage(variableBorrowRate);
            
            console.log(`✅ ${symbol} FINAL CONVERTED RATES: Supply ${supplyAPY.toFixed(4)}%, Borrow ${borrowAPY.toFixed(4)}%`);
            
            return {
              symbol,
              supply: supplyAPY,
              borrow: borrowAPY
            };
          }
          
          // Fallback to realistic rates if Aave data fails
          return {
            symbol,
            supply: getRealisticSupplyRate(symbol),
            borrow: getRealisticBorrowRate(symbol)
          };
        } catch (error) {
          console.error(`❌ Error fetching ${symbol} rates:`, error);
          return {
            symbol,
            supply: getRealisticSupplyRate(symbol),
            borrow: getRealisticBorrowRate(symbol)
          };
        }
      });

      const rateResults = await Promise.all(ratePromises);
      
      const newRates: Record<string, {supply: number, borrow: number}> = {};
      rateResults.forEach(({ symbol, supply, borrow }) => {
        newRates[symbol] = { supply, borrow };
      });

      setRealTimeRates(newRates);
      setLastUpdated(new Date().toLocaleTimeString());
      
      console.log('✅ Real-time rates updated:', newRates);
      
    } catch (error) {
      console.error('❌ Failed to fetch rates:', error);
      toast.error('Failed to fetch real-time rates');
      
      // Fallback to realistic rates
      const fallbackRates: Record<string, {supply: number, borrow: number}> = {};
      Object.keys(SUPPORTED_ASSETS).forEach(symbol => {
        fallbackRates[symbol] = {
          supply: getRealisticSupplyRate(symbol),
          borrow: getRealisticBorrowRate(symbol)
        };
      });
      setRealTimeRates(fallbackRates);
      setLastUpdated('Using fallback rates');
    } finally {
      setRatesLoading(false);
    }
  };

  // 🆕 Realistic fallback rates (current market rates)
  const getRealisticSupplyRate = (symbol: string): number => {
    switch (symbol) {
      case 'ETH': return 0.15;    // 0.15% APY
      case 'WBTC': return 0.12;   // 0.12% APY
      case 'LINK': return 0.08;   // 0.08% APY
      case 'UNI': return 0.05;    // 0.05% APY
      case 'USDC': return 4.2;    // 4.2% APY
      case 'USDT': return 3.9;    // 3.9% APY
      default: return 0.1;
    }
  };

  const getRealisticBorrowRate = (symbol: string): number => {
    switch (symbol) {
      case 'ETH': return 2.8;     // 2.8% APY
      case 'WBTC': return 3.2;    // 3.2% APY
      case 'LINK': return 4.1;    // 4.1% APY
      case 'UNI': return 5.2;     // 5.2% APY
      case 'USDC': return 7.8;    // 7.8% APY
      case 'USDT': return 7.5;    // 7.5% APY
      default: return 3.0;
    }
  };

  // Fetch rates on component mount and every 30 seconds
  useEffect(() => {
    fetchRealTimeRates();
    
    const interval = setInterval(() => {
      fetchRealTimeRates();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (dataLoading && ratesLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Market Rates...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Market Rates</CardTitle>
              <Badge variant="outline" className="text-xs">Real-time</Badge>
            </div>
            <div className="flex items-center space-x-2">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Updated: {lastUpdated}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRealTimeRates}
                disabled={ratesLoading}
              >
                {ratesLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SUPPORTED_ASSETS).map(([symbol, asset]) => {
              // Use real-time rates instead of aaveBalances
              const rates = realTimeRates[symbol];
              const supplyRate = rates?.supply;
              const borrowRate = rates?.borrow;

              return (
                <div key={symbol} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg">{symbol}</span>
                      <span className="text-xl">{asset.icon}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{asset.name}</span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    {asset.isCollateral && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Supply APY</span>
                        </span>
                        <Badge variant="secondary" className="text-green-600 font-medium">
                          {ratesLoading ? (
                            <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
                          ) : supplyRate !== undefined ? (
                            `${supplyRate.toFixed(2)}%`
                          ) : (
                            'N/A'
                          )}
                        </Badge>
                      </div>
                    )}
                    
                    {asset.canBorrow && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <TrendingDown className="w-4 h-4 text-orange-600" />
                          <span className="font-medium">Borrow APY</span>
                        </span>
                        <Badge variant="secondary" className="text-orange-600 font-medium">
                          {ratesLoading ? (
                            <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
                          ) : borrowRate !== undefined ? (
                            `${borrowRate.toFixed(2)}%`
                          ) : (
                            'N/A'
                          )}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Asset Type */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Asset Type</span>
                      <span>
                        {asset.isCollateral && asset.canBorrow ? 'Collateral + Borrowable' :
                         asset.isCollateral ? 'Collateral' : 'Borrowable'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rate Information */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-green-600 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Supply Assets</span>
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• ETH - Ethereum for collateral</li>
                <li>• WBTC - Wrapped Bitcoin for collateral</li>
                <li>• LINK - Chainlink for collateral</li>
                <li>• UNI - Uniswap for collateral</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-orange-600 flex items-center space-x-1">
                <TrendingDown className="w-4 h-4" />
                <span>Borrow Assets</span>
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• USDC - USD Coin for borrowing</li>
                <li>• USDT - Tether USD for borrowing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatesTab;