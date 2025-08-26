import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Wallet,
  Calendar,
  DollarSign,
  Info,
  Loader2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { getContract, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG } from '@/lib/aave/config';
import { AAVE_POOL_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';
import { toast } from 'sonner';

const LoanDetails = () => {
  const { loanId } = useParams();
  const [realTimeRates, setRealTimeRates] = useState<Record<string, {supply: number, borrow: number}>>({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Get real Aave data
  const { 
    aaveBalances, 
    totalSupplied, 
    totalBorrowed, 
    maxBorrowable, 
    healthFactor, 
    isLoading 
  } = useAaveData();

  const { repay, repayState } = useAaveTransactions();

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
      console.error('❌ Ray conversion error:', error);
      return 0;
    }
  };

  // Fetch real-time rates (same logic as LoanSlider)
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
      console.error('❌ Failed to fetch rates:', error);
      
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

  // Fetch rates on mount
  useEffect(() => {
    fetchRealTimeRates();
    const interval = setInterval(fetchRealTimeRates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate real loan data from Aave balances
  const calculateLoanData = () => {
    if (!aaveBalances || Object.keys(aaveBalances).length === 0) {
      return null;
    }

    // Find the largest borrow position as the "main loan"
    let mainBorrowAsset = '';
    let maxBorrowAmount = 0;
    
    Object.entries(aaveBalances).forEach(([symbol, balance]) => {
      if (balance.borrowBalance > maxBorrowAmount) {
        maxBorrowAmount = balance.borrowBalance;
        mainBorrowAsset = symbol;
      }
    });

    if (!mainBorrowAsset || maxBorrowAmount === 0) {
      return null; // No active loans
    }

    const borrowBalance = aaveBalances[mainBorrowAsset];
    const currentBorrowRate = realTimeRates[mainBorrowAsset]?.borrow || getRealisticBorrowRate(mainBorrowAsset);

    // Calculate liquidation price for collateral
    // Assuming 85% liquidation threshold (115% collateral ratio)
    const liquidationThreshold = 0.85;
    const totalDebtUSD = totalBorrowed;
    const requiredCollateralValue = totalDebtUSD / liquidationThreshold;
    
    // Find main collateral asset
    let mainCollateralAsset = '';
    let maxCollateralValue = 0;
    
    Object.entries(aaveBalances).forEach(([symbol, balance]) => {
      const collateralValue = balance.supplyBalance * balance.price;
      if (collateralValue > maxCollateralValue) {
        maxCollateralValue = collateralValue;
        mainCollateralAsset = symbol;
      }
    });

    const collateralBalance = aaveBalances[mainCollateralAsset];
    const liquidationPrice = collateralBalance ? 
      requiredCollateralValue / collateralBalance.supplyBalance : 0;

    return {
      id: loanId || `Tartr-${Date.now()}`,
      amount: maxBorrowAmount * borrowBalance.price,
      asset: mainBorrowAsset,
      borrowBalance: maxBorrowAmount,
      collateral: {
        asset: mainCollateralAsset,
        amount: collateralBalance?.supplyBalance || 0,
        value: maxCollateralValue,
        price: collateralBalance?.price || 0
      },
      apr: `${currentBorrowRate.toFixed(2)}%`,
      healthFactor: healthFactor,
      status: healthFactor >= 1.2 ? "Healthy" : healthFactor >= 1.0 ? "At Risk" : "Critical",
      liquidationPrice: liquidationPrice,
      currentBorrowRate: currentBorrowRate,
      totalSupplied,
      totalBorrowed,
      maxBorrowable
    };
  };

  const loanData = calculateLoanData();

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 1.5) return "text-green-600";
    if (hf >= 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthFactorBadge = (hf: number) => {
    if (hf >= 1.5) return <Badge className="bg-green-100 text-green-700 border-green-200">Healthy</Badge>;
    if (hf >= 1.2) return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Warning</Badge>;
    return <Badge variant="destructive">At Risk</Badge>;
  };

  // Loading state
  if (isLoading || ratesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading loan data...</p>
        </div>
      </div>
    );
  }

  // No active loans
  if (!loanData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/platform">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Loan Details</h1>
          </div>
          
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Active Loans</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any active loans at the moment.
              </p>
              <Link to="/platform/new-loan">
                <Button>Apply for a Loan</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const collateralBuffer = loanData.collateral.value > 0 ? 
    ((loanData.collateral.value / loanData.amount) - 1) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/platform">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Loan Details</h1>
              <p className="text-muted-foreground">Real-time Tartr Position</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-lg px-3 py-1 ${
              loanData.status === 'Healthy' ? 'bg-green-100 text-green-700 border-green-200' :
              loanData.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
              'bg-red-100 text-red-700 border-red-200'
            }`}>
              {loanData.status}
            </Badge>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Loan Overview</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Updated: {lastUpdated}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Borrowed Amount</p>
                      <p className="text-2xl font-bold">
                        ${loanData.amount.toLocaleString(undefined, {maximumFractionDigits: 2})} {loanData.asset}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {loanData.borrowBalance.toFixed(4)} {loanData.asset}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Interest Rate</p>
                      <p className="text-xl font-semibold text-primary">{loanData.apr} APY</p>
                      <p className="text-xs text-muted-foreground">Variable rate</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supplied</p>
                      <p className="text-lg font-medium text-green-600">
                        ${totalSupplied.toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Borrowed</p>
                      <p className="text-lg font-medium text-orange-600">
                        ${totalBorrowed.toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available to Borrow</p>
                      <p className="text-lg font-medium text-blue-600">
                        ${maxBorrowable.toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Interest</p>
                      <p className="text-lg font-medium">
                        ${((loanData.amount * loanData.currentBorrowRate / 100) / 12).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collateral Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Collateral Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Main Collateral</p>
                    <p className="text-xl font-semibold">
                      {loanData.collateral.amount.toFixed(4)} {loanData.collateral.asset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                    <p className="text-xl font-semibold">
                      ${loanData.collateral.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-xl font-semibold">
                      ${loanData.collateral.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Collateral Ratio</span>
                    <span className={`text-sm font-medium ${collateralBuffer > 50 ? 'text-green-600' : collateralBuffer > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {collateralBuffer.toFixed(1)}% above minimum
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your collateral ratio is {((loanData.collateral.value / loanData.amount) * 100).toFixed(0)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interest and Repayment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Interest & Repayment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Accrual</p>
                      <p className="text-lg font-medium">Continuous</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Repayment Terms</p>
                      <p className="text-lg font-medium">Flexible - No penalties</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Interest</p>
                      <p className="text-lg font-medium">
                        ${((loanData.amount * loanData.currentBorrowRate / 100) / 365).toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Interest</p>
                      <p className="text-lg font-medium text-orange-600">
                        ${(loanData.amount * loanData.currentBorrowRate / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">Ready to repay?</p>
                    <p className="text-sm text-muted-foreground">Repay anytime without penalties</p>
                  </div>
                  <Button size="lg" disabled={repayState.isLoading}>
                    {repayState.isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Repay Loan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Factor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Health Factor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getHealthFactorColor(loanData.healthFactor)}`}>
                  {loanData.healthFactor === 0 || loanData.healthFactor > 100 ? '∞' : loanData.healthFactor.toFixed(2)}
                </div>
                {getHealthFactorBadge(loanData.healthFactor)}
                <p className="text-sm text-muted-foreground mt-3">
                  {loanData.healthFactor >= 1.5 ? 
                    'Your loan is in excellent health.' :
                    loanData.healthFactor >= 1.2 ?
                    'Monitor your position closely.' :
                    'Consider adding collateral immediately.'}
                </p>
              </CardContent>
            </Card>

            {/* Risk Information */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Risk Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Liquidation Price</span>
                    <span className="font-semibold text-red-600">
                      ${loanData.liquidationPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">
                    If {loanData.collateral.asset} falls below this price, liquidation may occur
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price Cushion</span>
                    <span className="font-semibold text-green-600">
                      ${(loanData.collateral.price - loanData.liquidationPrice).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Safety margin before liquidation risk
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/platform">
                  <Button className="w-full" variant="outline">
                    Add Collateral
                  </Button>
                </Link>
                <Button 
                  className="w-full" 
                  variant="outline"
                  disabled={repayState.isLoading}
                >
                  Partial Repayment
                </Button>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Etherscan
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Loan Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protocol</span>
                    <span className="font-medium">Tartr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-medium">Ethereum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate Type</span>
                    <span className="font-medium">Variable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;