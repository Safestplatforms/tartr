import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { toast } from "sonner";

const BorrowTab = () => {
  const [borrowAmount, setBorrowAmount] = useState("");
  const [borrowAsset, setBorrowAsset] = useState("");
  
  const { 
    aaveBalances, 
    totalSupplied, 
    totalBorrowed, 
    maxBorrowable, 
    healthFactor, 
    isLoading 
  } = useAaveData();
  
  const { borrow, borrowState } = useAaveTransactions();

  // Get collateral and borrow assets with real data
  const collateralOptions = Object.entries(aaveBalances)
    .filter(([symbol, data]) => {
      const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
      return asset?.isCollateral && (data.balance > 0 || data.supplyBalance > 0);
    })
    .map(([symbol, data]) => {
      const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
      return {
        symbol,
        name: asset?.name || symbol,
        price: `$${data.price.toLocaleString()}`,
        balance: (data.balance + data.supplyBalance).toFixed(4),
        supplied: data.supplyBalance.toFixed(4),
        totalValue: (data.balance + data.supplyBalance) * data.price,
      };
    });

  const borrowOptions = Object.entries(SUPPORTED_ASSETS)
    .filter(([symbol, asset]) => asset.canBorrow)
    .map(([symbol, asset]) => ({
      symbol,
      name: asset.name,
      price: "$1.00",
      apy: symbol === 'USDC' ? "8.5%" : "8.2%",
    }));

  const selectedBorrowAsset = borrowOptions.find(opt => opt.symbol === borrowAsset);
  const borrowAmountNum = parseFloat(borrowAmount) || 0;
  const canBorrow = borrowAmountNum > 0 && borrowAmountNum <= maxBorrowable && totalSupplied > 0;

  // Calculate estimated health factor after borrowing
  const estimatedHealthFactor = healthFactor > 0 ? 
    Math.max(0.1, healthFactor - (borrowAmountNum / totalSupplied) * 0.5) : 0;

  const handleBorrow = async () => {
    if (!borrowAsset || !borrowAmountNum) {
      toast.error('Please select asset and enter amount');
      return;
    }

    if (borrowAmountNum > maxBorrowable) {
      toast.error('Amount exceeds borrowing capacity');
      return;
    }

    if (totalSupplied === 0) {
      toast.error('Please supply collateral first');
      return;
    }

    try {
      await borrow(borrowAsset, borrowAmountNum);
      
      if (borrowState.txHash) {
        setBorrowAmount("");
        setBorrowAsset("");
        toast.success(`Successfully borrowed ${borrowAmountNum} ${borrowAsset}`);
      }
    } catch (error) {
      console.error('Borrow failed:', error);
      toast.error('Borrow transaction failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading Aave data...</p>
        </div>
      </div>
    );
  }

  // Show different UI if no collateral
  if (totalSupplied === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-4">No Collateral Supplied</h3>
          <p className="text-muted-foreground mb-6">
            To borrow assets from Aave, you first need to supply collateral. 
            Go to the Portfolio tab to supply your crypto assets.
          </p>
          <Button variant="outline">
            Go to Portfolio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Borrow Form */}
      <Card>
        <CardHeader>
          <CardTitle>Borrow from Aave</CardTitle>
          <CardDescription>
            Borrow stablecoins against your supplied collateral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Position Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Your Aave Position</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Total Supplied</p>
                <p className="font-semibold text-blue-900">${totalSupplied.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-600">Available to Borrow</p>
                <p className="font-semibold text-green-700">${maxBorrowable.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Borrow Asset Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Borrow Asset</Label>
            <Select onValueChange={setBorrowAsset} value={borrowAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset to borrow" />
              </SelectTrigger>
              <SelectContent>
                {borrowOptions.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center space-x-2">
                      <span>{asset.symbol}</span>
                      <Badge variant="secondary" className="text-xs">{asset.apy}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Borrow Amount */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Amount</Label>
            <div className="relative">
              <Input
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                type="number"
                min="0"
                max={maxBorrowable}
              />
              <div className="absolute right-3 top-3 text-sm text-muted-foreground">
                {borrowAsset || 'USD'}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Available: ${maxBorrowable.toLocaleString()}</span>
              <button
                type="button"
                onClick={() => setBorrowAmount(maxBorrowable.toString())}
                className="text-primary hover:underline"
              >
                Max
              </button>
            </div>
          </div>

          {/* Health Factor Warning */}
          {borrowAmountNum > 0 && estimatedHealthFactor < 1.5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Health Factor Warning</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Estimated health factor after borrowing: {estimatedHealthFactor.toFixed(2)}
              </p>
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleBorrow}
            disabled={!canBorrow || borrowState.isLoading}
          >
            {borrowState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Borrowing...
              </>
            ) : !totalSupplied ? (
              "Supply Collateral First"
            ) : !borrowAmountNum ? (
              "Enter Amount"
            ) : borrowAmountNum > maxBorrowable ? (
              "Amount Too High"
            ) : (
              `Borrow ${borrowAsset || 'Asset'}`
            )}
          </Button>

          {borrowState.error && (
            <div className="text-sm text-red-600">
              Error: {borrowState.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrow Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Review your borrow details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Borrow Amount</span>
              <span className="text-sm font-medium">
                {borrowAmountNum > 0 && borrowAsset ? 
                  `${borrowAmountNum.toLocaleString()} ${borrowAsset}` : 
                  '$0.00'
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Interest Rate (Variable)</span>
              <span className="text-sm font-medium">
                {selectedBorrowAsset?.apy || '-%'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Health Factor</span>
              <span className={`text-sm font-medium ${
                healthFactor >= 1.5 ? 'text-green-600' : 
                healthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {healthFactor > 0 ? healthFactor.toFixed(2) : '∞'}
              </span>
            </div>

            {borrowAmountNum > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated Health Factor</span>
                <span className={`text-sm font-medium ${
                  estimatedHealthFactor >= 1.5 ? 'text-green-600' : 
                  estimatedHealthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {estimatedHealthFactor.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Collateral Info */}
          <div>
            <h4 className="font-medium mb-3">Your Collateral</h4>
            <div className="space-y-2">
              {collateralOptions.map((collateral) => (
                <div key={collateral.symbol} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{collateral.symbol}:</span>
                  <span className="font-medium">
                    {collateral.supplied} (${collateral.totalValue.toFixed(0)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Safety Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium mb-2 text-sm">Safety Information</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Interest accrues continuously</li>
              <li>• You can repay anytime without penalties</li>
              <li>• Monitor your health factor to avoid liquidation</li>
              <li>• Add more collateral if health factor drops</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowTab;