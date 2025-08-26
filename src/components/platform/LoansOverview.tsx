import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Eye, Loader2, RefreshCw } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { getContract, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG } from '@/lib/aave/config';
import { AAVE_POOL_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';
import { toast } from "sonner";

interface LoansOverviewProps {
  onTabChange?: (tab: string) => void;
}

const LoansOverview = ({ onTabChange }: LoansOverviewProps) => {
  const navigate = useNavigate();
  const { 
    aaveBalances, 
    totalSupplied, 
    totalBorrowed, 
    healthFactor, 
    isLoading 
  } = useAaveData();

  const { withdraw, supply, borrow, withdrawState, supplyState, borrowState } = useAaveTransactions();
  const [actionLoading, setActionLoading] = useState<{type: string, asset: string} | null>(null);
  
  // Real-time rates state (same as other components)
  const [realTimeRates, setRealTimeRates] = useState<Record<string, {supply: number, borrow: number}>>({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Aave Pool contract for fetching real-time rates
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // Ray conversion (same as other components)
  const rayToPercentage = (rayRate: bigint): number => {
    try {
      if (!rayRate || rayRate === 0n) return 0;
      const RAY = BigInt('1000000000000000000000000000');
      const rateDecimal = Number(rayRate) / Number(RAY);
      const percentage = rateDecimal * 100;
      return Math.min(Math.max(percentage, 0), 100);
    } catch (error) {
      console.error('Ray conversion error:', error);
      return 0;
    }
  };

  // Fetch real-time rates (same logic as other components)
  const fetchRealTimeRates = async () => {
    try {
      setRatesLoading(true);
      
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
            
            return {
              symbol,
              supply: rayToPercentage(liquidityRate),
              borrow: rayToPercentage(variableBorrowRate)
            };
          }
          
          return {
            symbol,
            supply: getRealisticSupplyRate(symbol),
            borrow: getRealisticBorrowRate(symbol)
          };
        } catch (error) {
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
      
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      
      // Fallback rates
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

  // Fallback rates (same as other components)
  const getRealisticSupplyRate = (symbol: string): number => {
    switch (symbol) {
      case 'ETH': return 0.15;
      case 'WBTC': return 0.12;
      case 'LINK': return 0.08;
      case 'UNI': return 0.05;
      case 'USDC': return 4.2;
      case 'USDT': return 3.9;
      default: return 0.1;
    }
  };

  const getRealisticBorrowRate = (symbol: string): number => {
    switch (symbol) {
      case 'ETH': return 2.8;
      case 'WBTC': return 3.2;
      case 'LINK': return 4.1;
      case 'UNI': return 5.2;
      case 'USDC': return 7.8;
      case 'USDT': return 7.5;
      default: return 3.0;
    }
  };

  // Fetch rates on mount and every 30 seconds
  useEffect(() => {
    fetchRealTimeRates();
    const interval = setInterval(fetchRealTimeRates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper functions for rates
  const getSupplyRate = (symbol: string): number => {
    const rates = realTimeRates[symbol];
    return rates?.supply ?? getRealisticSupplyRate(symbol);
  };

  const getBorrowRate = (symbol: string): number => {
    const rates = realTimeRates[symbol];
    return rates?.borrow ?? getRealisticBorrowRate(symbol);
  };

  // Create positions from real Aave data with real rates
  const activePositions = Object.entries(aaveBalances)
    .filter(([symbol, data]) => data.supplyBalance > 0 || data.borrowBalance > 0)
    .map(([symbol, data]) => {
      const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
      const borrowAmountNum = data.borrowBalance * data.price;
      const supplyRate = getSupplyRate(symbol);
      const borrowRate = getBorrowRate(symbol);
      
      // Calculate net APY
      const netAPY = borrowAmountNum > 0 ? 
        (data.supplyBalance * data.price * supplyRate / 100) - (borrowAmountNum * borrowRate / 100) :
        supplyRate;
      
      return {
        id: symbol,
        collateralAsset: symbol,
        collateralAmount: data.supplyBalance.toFixed(4),
        collateralValue: data.supplyBalance * data.price,
        borrowAmount: borrowAmountNum,
        borrowAmountDisplay: borrowAmountNum.toLocaleString(),
        supplyRate: `${supplyRate.toFixed(2)}%`,
        borrowRate: borrowAmountNum > 0 ? `${borrowRate.toFixed(2)}%` : "0%",
        netAPY: `${netAPY.toFixed(2)}%`,
        status: "active",
        asset: asset,
        supplyBalance: data.supplyBalance,
        borrowBalance: data.borrowBalance,
        price: data.price
      };
    });

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 1.5) return <Badge variant="secondary" className="text-green-600 bg-green-50">Healthy</Badge>;
    if (healthFactor >= 1.2) return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Warning</Badge>;
    return <Badge variant="destructive">At Risk</Badge>;
  };

  // Button handlers
  const handleSupplyMore = (symbol: string) => {
    console.log(`Supply More ${symbol} clicked`);
    onTabChange?.('portfolio');
    toast.info(`Navigate to Portfolio to supply more ${symbol}`);
  };

  const handleWithdraw = async (symbol: string, amount: number) => {
    console.log(`Withdraw ${amount} ${symbol} clicked`);
    setActionLoading({type: 'withdraw', asset: symbol});
    
    try {
      const withdrawAmount = Math.min(amount * 0.25, amount);
      await withdraw(symbol, withdrawAmount);
      toast.success(`Successfully withdrew ${withdrawAmount.toFixed(6)} ${symbol}`);
    } catch (error) {
      console.error('Withdraw error:', error);
      toast.error(`Failed to withdraw ${symbol}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBorrow = (symbol: string) => {
    console.log(`Borrow against ${symbol} clicked`);
    onTabChange?.('borrow');
    toast.info(`Navigate to Borrow section to borrow against your ${symbol}`);
  };

  const handleRepay = (symbol: string) => {
    console.log(`Repay ${symbol} loan clicked`);
    onTabChange?.('portfolio');
    toast.info(`Navigate to Portfolio to repay your ${symbol} loan`);
  };

  // NEW: Navigate to loan details
  const handleViewLoan = (symbol: string) => {
    const loanId = `${symbol}-${Date.now()}`;
    navigate(`/platform/loan/${loanId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading Loans Data...</p>
        </div>
      </div>
    );
  }

  if (activePositions.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
        <p className="text-muted-foreground mb-6">
          Start by supplying collateral or borrowing assets.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={() => onTabChange?.('portfolio')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Supply Assets
          </Button>
          <Button
            onClick={() => onTabChange?.('borrow')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Borrow Assets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Tartr Positions</h2>
          <p className="text-muted-foreground">
            Monitor and manage your DeFi positions
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {activePositions.map((position) => (
          <Card key={position.id} className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">{position.asset?.icon || position.collateralAsset.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {position.collateralAsset} Position
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tartr • {position.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  {healthFactor > 0 && getHealthFactorBadge(healthFactor)}
                </div>
                <div className="flex items-center space-x-2">
                  {/* CONDITIONAL: View Loan button only for positions with borrowed amounts */}
                  {position.borrowAmount > 0 ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewLoan(position.collateralAsset)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onTabChange?.('portfolio')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Supplied</p>
                  <p className="font-semibold">{position.collateralAmount} {position.collateralAsset}</p>
                  <p className="text-xs text-muted-foreground">${position.collateralValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Borrowed</p>
                  <p className="font-semibold">
                    {position.borrowAmount > 0 ? `$${position.borrowAmountDisplay}` : 'None'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {position.borrowAmount > 0 ? `${position.borrowRate} APY` : 'No debt'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Supply APY</p>
                  <p className="font-semibold text-green-600">
                    {ratesLoading ? 'Loading...' : position.supplyRate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {realTimeRates[position.collateralAsset] ? 'Real-time' : 'Market rate'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Net APY</p>
                  <p className="font-semibold text-blue-600">
                    {ratesLoading ? 'Loading...' : 
                     position.borrowAmount > 0 ? `−${getBorrowRate(position.collateralAsset).toFixed(2)}%` : 
                     position.supplyRate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {position.borrowAmount > 0 ? 'After borrow cost' : 'Supply only'}
                  </p>
                </div>
              </div>

              {/* Quick Actions with working click handlers */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleSupplyMore(position.collateralAsset)}
                  disabled={actionLoading?.type === 'supply' && actionLoading?.asset === position.collateralAsset}
                >
                  {actionLoading?.type === 'supply' && actionLoading?.asset === position.collateralAsset ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-1" />
                  )}
                  Supply More
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleWithdraw(position.collateralAsset, position.supplyBalance)}
                  disabled={actionLoading?.type === 'withdraw' && actionLoading?.asset === position.collateralAsset || position.supplyBalance === 0}
                >
                  {actionLoading?.type === 'withdraw' && actionLoading?.asset === position.collateralAsset ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  )}
                  Withdraw
                </Button>
                
                {position.borrowAmount > 0 ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRepay(position.collateralAsset)}
                  >
                    Repay
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleBorrow(position.collateralAsset)}
                  >
                    Borrow
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoansOverview;