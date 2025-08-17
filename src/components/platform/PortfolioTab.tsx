import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, AlertTriangle, Plus, Minus, Loader2, Wallet, Edit3, X, DollarSign } from "lucide-react";
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
  
  // NEW: Custom amount input state
  const [customAmountInput, setCustomAmountInput] = useState<{
    type: 'supply' | 'withdraw' | 'repay';
    asset: string;
    maxAmount: number;
    currentPrice: number;
  } | null>(null);
  const [customAmount, setCustomAmount] = useState("");

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

  // EXISTING QUICK ACTIONS (keep these working as they are)
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

  // NEW: Custom amount handlers
  const openCustomAmountInput = (type: 'supply' | 'withdraw' | 'repay', asset: string, maxAmount: number, currentPrice: number) => {
    setCustomAmountInput({ type, asset, maxAmount, currentPrice });
    setCustomAmount("");
  };

  const closeCustomAmountInput = () => {
    setCustomAmountInput(null);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === '') {
      setCustomAmount(value);
    }
  };

  const validateCustomAmount = () => {
    const numAmount = parseFloat(customAmount);
    
    if (!customAmount || numAmount <= 0) {
      return { error: "Please enter a valid amount", isValid: false };
    }
    
    if (numAmount > customAmountInput!.maxAmount) {
      return { 
        error: `Maximum available: ${customAmountInput!.maxAmount.toFixed(6)} ${customAmountInput!.asset}`, 
        isValid: false 
      };
    }

    // Gas fee warning for small ETH amounts
    if (customAmountInput!.asset === 'ETH' && customAmountInput!.type === 'supply') {
      const usdValue = numAmount * customAmountInput!.currentPrice;
      if (usdValue < 5) {
        return { 
          error: `Note: Gas fees (~$2-5) may be significant for this $${usdValue.toFixed(2)} deposit.`, 
          isValid: true,
          isWarning: true
        };
      }
    }
    
    return { error: null, isValid: true };
  };

  const executeCustomAmount = async () => {
    if (!customAmountInput) return;
    
    const validation = validateCustomAmount();
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }
    const amount = parseFloat(customAmount);
    const { type, asset } = customAmountInput;

    setSelectedAction({ type, asset });
    
    try {
      if (type === 'supply') {
        await supply(asset, amount);
        toast.success(`Successfully supplied ${amount} ${asset} to Tartr`);
      } else if (type === 'withdraw') {
        await withdraw(asset, amount);
        toast.success(`Successfully withdrew ${amount} ${asset} from Tartr`);
      } else if (type === 'repay') {
        await repay(asset, amount);
        toast.success(`Successfully repaid ${amount} ${asset}`);
      }
      closeCustomAmountInput();
    } catch (error) {
      toast.error(`${type} failed`);
    } finally {
      setSelectedAction(null);
    }
  };

  const setQuickCustomAmount = (percentage: number) => {
    if (!customAmountInput) return;
    const targetAmount = (customAmountInput.maxAmount * percentage) / 100;
    setCustomAmount(targetAmount.toFixed(6));
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
      {/* Custom Amount Input Modal */}
      {customAmountInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">
                {customAmountInput.type === 'supply' ? 'Deposit' : 
                 customAmountInput.type === 'withdraw' ? 'Withdraw' : 'Repay'} {customAmountInput.asset}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeCustomAmountInput}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Balance Display */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {customAmountInput.type === 'supply' ? 'Wallet Balance' : 
                   customAmountInput.type === 'withdraw' ? 'Supplied Balance' : 'Borrowed Amount'}
                </span>
                <span className="font-medium">{customAmountInput.maxAmount.toFixed(6)} {customAmountInput.asset}</span>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="customAmount">Amount</Label>
                <div className="relative">
                  <Input
                    id="customAmount"
                    type="text"
                    placeholder="0.000000"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="text-right pr-16"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {customAmountInput.asset}
                  </span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickCustomAmount(percentage)}
                    className="text-xs"
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>

              {/* USD Value */}
              {customAmount && !isNaN(parseFloat(customAmount)) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>≈ ${(parseFloat(customAmount) * customAmountInput.currentPrice).toFixed(2)} USD</span>
                </div>
              )}

              {/* Validation Messages */}
              {customAmount && (() => {
                const validation = validateCustomAmount();
                if (validation.error) {
                  return (
                    <div className={`flex items-start space-x-2 p-3 rounded-lg ${
                      !validation.isValid ? "bg-red-50 text-red-700" :
                      validation.isWarning ? "bg-yellow-50 text-yellow-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{validation.error}</p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={closeCustomAmountInput}
                  className="flex-1"
                  disabled={selectedAction?.asset === customAmountInput.asset}
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeCustomAmount}
                  disabled={!validateCustomAmount().isValid || selectedAction?.asset === customAmountInput.asset}
                  className="flex-1"
                >
                  {selectedAction?.asset === customAmountInput.asset ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `${customAmountInput.type === 'supply' ? 'Deposit' : 
                      customAmountInput.type === 'withdraw' ? 'Withdraw' : 'Repay'} ${customAmountInput.asset}`
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalValue.toFixed(2).toLocaleString()}</p>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>Wallet + Tartr</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supplied to Tartr</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">${totalSupplied.toFixed(2).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Earning yield</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">${totalBorrowed.toFixed(2).toLocaleString()}</p>
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
                        {totalAssetValue > 0 ? `$${totalAssetValue.toFixed(2).toLocaleString()}` : '$0'}
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

                  {/* ENHANCED Quick Actions with Custom Amount Options */}
                  <div className="flex gap-2 flex-wrap">
                    {/* Supply buttons */}
                    {asset?.isCollateral && data.balance > 0 && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openCustomAmountInput('supply', symbol, data.balance, data.price)}
                          disabled={isActionLoading}
                        >
                          <Plus className="w-3 h-3 " />
                          Supply
                        </Button>
                      </>
                    )}

                    {/* No balance message */}
                    {asset?.isCollateral && data.balance === 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Need to Add to Wallet
                      </Button>
                    )}
                    
                    {/* Withdraw buttons */}
                    {data.supplyBalance > 0 && (
                      <>
                      <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openCustomAmountInput('withdraw', symbol, data.supplyBalance, data.price)}
                          disabled={isActionLoading}
                        >
                          <Minus className="w-3 h-3 " />
                          Withdraw
                        </Button>
                      </>
                    )}

                    {/* Repay button */}
                    {data.borrowBalance > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-orange-600 border-orange-200"
                        onClick={() => openCustomAmountInput('repay', symbol, data.borrowBalance, data.price)}
                        disabled={isActionLoading}
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