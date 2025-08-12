import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, AlertTriangle, Plus, Minus, Loader2 } from "lucide-react";
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
      toast.success(`Supplied ${amount} ${asset} to Aave`);
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
      toast.success(`Withdrew ${amount} ${asset} from Aave`);
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
          <p className="text-muted-foreground">Loading your Aave portfolio...</p>
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
              <span>Wallet + Aave</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supplied to Aave</CardTitle>
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
            Manage your crypto assets and Aave positions
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
              
              // Only show assets with meaningful balances
              if (totalAssetValue < 1 && borrowValue < 1) return null;

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
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${totalAssetValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Wallet</p>
                      <p className="font-medium">{data.balance.toFixed(4)} {symbol}</p>
                      <p className="text-xs text-muted-foreground">${walletValue.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supplied</p>
                      <p className="font-medium text-blue-600">{data.supplyBalance.toFixed(4)} {symbol}</p>
                      <p className="text-xs text-muted-foreground">${supplyValue.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Borrowed</p>
                      <p className="font-medium text-orange-600">
                        {data.borrowBalance > 0 ? `${data.borrowBalance.toFixed(2)} ${symbol}` : 'None'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {borrowValue > 0 ? `$${borrowValue.toFixed(0)}` : '$0'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    {data.balance > 0.001 && asset?.isCollateral && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleQuickSupply(symbol, Math.min(data.balance * 0.5, 1))}
                        disabled={isActionLoading && selectedAction?.type === 'supply'}
                      >
                        {isActionLoading && selectedAction?.type === 'supply' ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3 mr-1" />
                        )}
                        Supply
                      </Button>
                    )}
                    
                    {data.supplyBalance > 0.001 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickWithdraw(symbol, Math.min(data.supplyBalance * 0.1, 0.1))}
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

                    {data.borrowBalance > 0.001 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-orange-600 border-orange-200"
                      >
                        <Minus className="w-3 h-3 mr-1" />
                        Repay
                      </Button>
                    )}

                    {data.supplyBalance > 0 && asset?.canBorrow && maxBorrowable > 100 && (
                      <Button variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-1" />
                        Borrow
                      </Button>
                    )}
                  </div>
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
            Monitor and manage your portfolio risk on Aave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

      {/* No positions message */}
      {Object.values(aaveBalances).every(data => data.balance + data.supplyBalance + data.borrowBalance < 0.001) && (
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Portfolio Assets</h3>
            <p className="text-muted-foreground mb-4">
              Add cryptocurrency to your wallet to start using Aave for lending and borrowing.
            </p>
            <Button variant="outline">
              Learn How to Add Crypto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioTab;