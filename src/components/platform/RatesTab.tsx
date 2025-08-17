import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";

const RatesTab = () => {
  const { aaveBalances, isLoading } = useAaveData();

  if (isLoading) {
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
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Market Rates</span>
            <Badge variant="outline" className="text-xs">Real-time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SUPPORTED_ASSETS).map(([symbol, asset]) => {
              const assetData = aaveBalances[symbol];
              const supplyRate = assetData?.supplyAPY;
              const borrowRate = assetData?.borrowAPY;

              return (
                <div key={symbol} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-lg">{symbol}</span>
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
                          {/* 🔧 FIXED: Check if data exists, not if > 0 */}
                          {supplyRate !== undefined ? `${supplyRate.toFixed(2)}%` : 'Loading...'}
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
                          {/* 🔧 FIXED: Check if data exists, not if > 0 */}
                          {borrowRate !== undefined ? `${borrowRate.toFixed(2)}%` : 'Loading...'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* 🔧 NEW: Additional asset info */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Asset Type</span>
                      <span>{asset.isCollateral ? 'Collateral' : 'Borrowable'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 🔧 NEW: Additional market info card */}
      <Card>
        <CardHeader>
          <CardTitle>Market Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-green-600">Supply Assets (Collateral)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• ETH - Ethereum for collateral</li>
                <li>• WBTC - Wrapped Bitcoin for collateral</li>
                <li>• LINK - Chainlink for collateral</li>
                <li>• UNI - Uniswap for collateral</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-orange-600">Borrow Assets (Stablecoins)</h4>
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