import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, AlertTriangle, Plus, Minus, Loader2, Wallet } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { toast } from "sonner";
import { useState } from "react";

const PortfolioTab = () => {
  const { 
    aaveBalances, 
    totalValue, 
    totalSupplied, 
    totalBorrowed, 
    healthFactor, 
    maxBorrowable, 
    isLoading 
  } = useAaveData();

  const { 
    supply, 
    withdraw, 
    repay, 
    supplyState, 
    withdrawState, 
    repayState 
  } = useAaveTransactions();

  const [selectedAction, setSelectedAction] = useState<{type: string, asset: string} | null>(null);

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 1.5) return "text-green-600";
    if (healthFactor >= 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 1.5) return <Badge variant="secondary" className="text-green-600 bg-green-50">Healthy</Badge>;
    if (healthFactor >= 1.2) return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Warning</Badge>;
    return <Badge variant="destructive">At Risk</Badge>;
  };

  const handleQuickSupply = async (asset: string, amount: number) => {
    setSelectedAction({ type: 'supply', asset });
    try {
      await supply(asset, amount);
      toast.success(`Supplied ${amount} ${asset} to Tartr`);
    } catch (error) {
      toast.error('Supply failed');
    } finally {
      setSelectedAction(null);
    }
  };

  const handleQuickWithdraw = async (asset: string, amount: number) => {
    setSelectedAction({ type: 'withdraw', asset });
    try {
      await withdraw(asset, amount);
      toast.success(`Withdrew ${amount} ${asset} from Tartr`);
    } catch (error) {
      toast.error('Withdrawal failed');
    } finally {
      setSelectedAction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your Tartr portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>Tartr</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supplied to Tartr</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">${totalSupplied.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Earning yield</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">${totalBorrowed.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Outstanding debt</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getHealthFactorColor(healthFactor)}`}>
              {healthFactor > 0 ? healthFactor.toFixed(2) : '∞'}
            </p>
            {healthFactor > 0 && getHealthFactorBadge(healthFactor)}
          </CardContent>
        </Card>
      </div>

      {/* Asset Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Positions</CardTitle>
          <CardDescription>
            Manage your crypto assets and Tartr positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(aaveBalances).map(([symbol, data]) => {
              const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
              const walletValue = data.balance * data.price;
              const supplyValue = data.supplyBalance * data.price;
              const borrowValue = data.borrowBalance * data.price;
              const totalAssetValue = walletValue + supplyValue;
              
              if (!asset?.isCollateral && totalAssetValue < 0.1 && borrowValue < 0.1) return null;

              const isActionLoading = selectedAction?.asset === symbol;

              return (
                <div key={symbol} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary text-lg">{asset?.icon || symbol[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{symbol}</h3>
                        <p className="text-sm text-muted-foreground">{asset?.name}</p>
                        {asset?.isCollateral && (
                          <Badge variant="outline" className="text-xs">Can be used as collateral</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {totalAssetValue > 0 ? `$${totalAssetValue.toLocaleString()}` : '$0'}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Wallet</p>
                      <p className="font-medium">{data.balance.toFixed(6)} {symbol}</p>
                      <p className="text-xs text-muted-foreground">${walletValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supplied</p>
                      <p className="font-medium text-blue-600">{data.supplyBalance.toFixed(6)} {symbol}</p>
                      <p className="text-xs text-muted-foreground">${supplyValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Borrowed</p>
                      <p className="font-medium text-orange-600">
                        {data.borrowBalance > 0 ? `${data.borrowBalance.toFixed(4)} ${symbol}` : 'None'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {borrowValue > 0 ? `$${borrowValue.toFixed(2)}` : '$0'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions - NO MINIMUMS */}
                  <div className="flex gap-2">
                    {/* Supply button - works for any amount > 0, including very small amounts */}
                    {asset?.isCollateral && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (data.balance > 0) {
                            // Supply 50% of balance or the full amount if small
                            const supplyAmount = data.balance < 0.1 ? data.balance : Math.min(data.balance * 0.5, 1);
                            handleQuickSupply(symbol, supplyAmount);
                          } else {
                            toast.error(`You need ${symbol} in your wallet to supply as collateral. Add ${symbol} to your wallet first.`);
                          }
                        }}
                        disabled={isActionLoading && selectedAction?.type === 'supply'}
                      >
                        {isActionLoading && selectedAction?.type === 'supply' ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3 mr-1" />
                        )}
                        {data.balance > 0 ? `Supply ${symbol}` : 'Need to Add to Wallet'}
                      </Button>
                    )}
                    
                    {/* Withdraw button - any amount > 0 */}
                    {data.supplyBalance > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Withdraw 10% or the full amount if very small
                          const withdrawAmount = data.supplyBalance < 0.1 ? data.supplyBalance : Math.min(data.supplyBalance * 0.1, 0.1);
                          handleQuickWithdraw(symbol, withdrawAmount);
                        }}
                        disabled={isActionLoading && selectedAction?.type === 'withdraw'}
                      >
                        {isActionLoading && selectedAction?.type === 'withdraw' ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Minus className="w-3 h-3 mr-1" />
                        )}
                        Withdraw
                      </Button>
                    )}

                    {data.borrowBalance > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-orange-600 border-orange-200"
                      >
                        <Minus className="w-3 h-3 mr-1" />
                        Repay
                      </Button>
                    )}

                    {data.supplyBalance > 0 && asset?.canBorrow && maxBorrowable > 1 && (
                      <Button variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-1" />
                        Borrow
                      </Button>
                    )}
                  </div>

                  {/* Enhanced help text for collateral assets */}
                  {asset?.isCollateral && data.balance === 0 && data.supplyBalance === 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Wallet className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">No {symbol} detected</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Add any amount of {symbol} to your wallet to use as collateral.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special message for very small amounts */}
                  {asset?.isCollateral && data.balance > 0 && data.balance < 0.001 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Small Amount Detected: {data.balance.toFixed(6)} {symbol}</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          You can deposit this amount, but gas fees might exceed the value. Consider the cost before proceeding.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span>Risk Management</span>
          </CardTitle>
          <CardDescription>
            Monitor and manage your portfolio risk on Tartr
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Health Factor</span>
              <span className={`font-medium ${getHealthFactorColor(healthFactor)}`}>
                {healthFactor > 0 ? healthFactor.toFixed(2) : '∞'}
              </span>
            </div>
            
            <Separator />
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Your health factor indicates the safety of your Tartr positions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Above 1.5: Healthy position ✅</li>
                <li>1.2-1.5: Monitor closely ⚠️</li>
                <li>Below 1.2: Risk of liquidation ❌</li>
              </ul>
            </div>

            {maxBorrowable > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Available to borrow:</strong> ${maxBorrowable.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  You can safely borrow up to this amount based on your current collateral
                </p>
              </div>
            )}

            {healthFactor > 0 && healthFactor < 1.5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Health Factor Warning:</strong> Your health factor is below 1.5
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Consider adding more collateral or reducing your borrowed amount
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;