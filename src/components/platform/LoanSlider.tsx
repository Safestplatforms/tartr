import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Info, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { toast } from "sonner";

const LoanSlider = () => {
  const { 
    aaveBalances, 
    maxBorrowable, 
    totalValue, 
    isLoading, 
    healthFactor, 
    totalSupplied, 
    totalBorrowed 
  } = useAaveData();
  
  const { borrow, borrowState } = useAaveTransactions();
  
  // 🔧 FIXED: Dynamic loan amount based on available amount
  const getInitialLoanAmount = () => {
    if (maxBorrowable <= 0) return 0;
    if (maxBorrowable < 1) return maxBorrowable; // For very small amounts
    return Math.min(Math.floor(maxBorrowable), maxBorrowable);
  };
  
  const [loanAmount, setLoanAmount] = useState([getInitialLoanAmount()]);
  const [selectedBorrowAsset, setSelectedBorrowAsset] = useState('USDC');
  const [isBorrowing, setIsBorrowing] = useState(false);

  // 🔧 FIXED: Dynamic minimum and step based on available amount
  const getSliderConfig = () => {
    if (maxBorrowable <= 0) return { min: 0, step: 0.01, max: 0 };
    
    if (maxBorrowable < 1) {
      // Very small amounts (under $1)
      return { 
        min: 0.01, 
        step: 0.01, 
        max: Math.max(maxBorrowable, 0.01)
      };
    } else if (maxBorrowable < 10) {
      // Small amounts ($1-$10)
      return { 
        min: 0.1, 
        step: 0.1, 
        max: Math.max(maxBorrowable, 1)
      };
    } else if (maxBorrowable < 100) {
      // Medium amounts ($10-$100)
      return { 
        min: 1, 
        step: 1, 
        max: Math.max(maxBorrowable, 10)
      };
    } else {
      // Large amounts ($100+)
      return { 
        min: 1, 
        step: 1, 
        max: Math.max(maxBorrowable, 1000)
      };
    }
  };

  const sliderConfig = getSliderConfig();

  // Define loan tiers based on amount (same as before but now with real data)
  const getLoanTier = (amount: number) => {
    if (amount <= 5000) return {
      name: "Starter",
      apr: "8.5%",
      term: "6-12 months",
      collateralRatio: "150%",
      features: ["Basic collateral support", "Standard processing", "Email support"]
    };
    if (amount <= 25000) return {
      name: "Growth",
      apr: "7.2%",
      term: "6-18 months",
      collateralRatio: "140%",
      features: ["Extended collateral support", "Priority processing", "24/7 chat support"]
    };
    if (amount <= 100000) return {
      name: "Professional",
      apr: "6.8%",
      term: "12-24 months",
      collateralRatio: "130%",
      features: ["All supported cryptocurrencies", "Instant processing", "Dedicated account manager"]
    };
    return {
      name: "Enterprise",
      apr: "5.5%",
      term: "12-36 months",
      collateralRatio: "120%",
      features: ["Unlimited collateral options", "White-glove service", "Custom API integration"]
    };
  };

  // 🔧 FIXED: Better amount formatting for small values
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    if (amount < 1) return amount.toFixed(2); // Show 2 decimals for amounts under $1
    if (amount < 10) return amount.toFixed(1); // Show 1 decimal for amounts under $10
    return Math.floor(amount).toLocaleString();
  };

  // 🔧 FIXED: Better display formatting
  const formatDisplayAmount = (amount: number) => {
    if (amount < 1) return `$${amount.toFixed(2)}`;
    if (amount < 10) return `$${amount.toFixed(1)}`;
    return `$${Math.floor(amount).toLocaleString()}`;
  };

  const currentTier = getLoanTier(loanAmount[0]);
  const isPopular = currentTier.name === "Growth";
  
  // Real borrowing capacity checks
  const hasCollateral = totalSupplied > 0;
  const canBorrowAmount = loanAmount[0] <= maxBorrowable && loanAmount[0] > 0;
  const borrowAsset = SUPPORTED_ASSETS[selectedBorrowAsset as keyof typeof SUPPORTED_ASSETS];

  const handleBorrow = async () => {
    if (!canBorrowAmount) {
      toast.error('Insufficient borrowing capacity');
      return;
    }

    if (!hasCollateral) {
      toast.error('Please supply collateral first');
      return;
    }

    setIsBorrowing(true);
    
    try {
      await borrow(selectedBorrowAsset, loanAmount[0]);
      
      if (borrowState.txHash) {
        toast.success(`Successfully borrowed ${loanAmount[0]} ${selectedBorrowAsset}`);
      }
    } catch (error) {
      console.error('Borrow failed:', error);
      toast.error('Failed to borrow');
    } finally {
      setIsBorrowing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Tartr data...</p>
        </div>
      </div>
    );
  }

  // Show different UI based on user's Aave position
  if (!hasCollateral && maxBorrowable === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your DeFi Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            To borrow from Tartr, you first need to supply collateral. Add crypto to your wallet and supply it to Tartr to start borrowing.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">No Collateral Detected</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p className="text-muted-foreground">Portfolio Value:</p>
                  <p className="font-semibold">${totalValue.toLocaleString()}</p>
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground">Borrowing Capacity:</p>
                  <p className="font-semibold">${maxBorrowable.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to get started:</h4>
                <ol className="text-sm text-blue-700 text-left space-y-1">
                  <li>1. Add ETH, WBTC, LINK, or UNI to your wallet</li>
                  <li>2. Go to the Portfolio tab</li>
                  <li>3. Supply your crypto as collateral to Tartr</li>
                  <li>4. Return here to borrow against your collateral</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const borrowableAssets = Object.keys(SUPPORTED_ASSETS).filter(
    asset => SUPPORTED_ASSETS[asset as keyof typeof SUPPORTED_ASSETS].canBorrow
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Borrow from Tartr</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">${totalSupplied.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Supplied</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">${totalBorrowed.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Borrowed</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">${maxBorrowable.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
        </div>
      </div>

      {/* Borrow Asset Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Borrow Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowableAssets.map((asset) => {
              // 🔧 FIXED: Get real borrowing rate from aaveBalances
              const assetData = aaveBalances[asset];
              const borrowRate = assetData?.borrowAPY || 0;
              
              return (
                <Card 
                  key={asset}
                  className={`cursor-pointer transition-all ${
                    selectedBorrowAsset === asset ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedBorrowAsset(asset)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">{asset}</div>
                    <div className="text-sm text-muted-foreground">
                      {SUPPORTED_ASSETS[asset as keyof typeof SUPPORTED_ASSETS]?.name}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {borrowRate > 0 ? `${borrowRate.toFixed(2)}%` : '~7.0%'} APY
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Loan Amount Slider */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <div className="text-5xl font-bold text-primary">
                {formatDisplayAmount(loanAmount[0])}
              </div>
            </div>
            <div className="text-muted-foreground">{selectedBorrowAsset} Loan Amount</div>
            <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Powered by Tartr</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="px-4">
            <Slider
              value={loanAmount}
              onValueChange={setLoanAmount}
              max={sliderConfig.max}
              min={sliderConfig.min}
              step={sliderConfig.step}
              className="w-full"
              disabled={maxBorrowable === 0}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatDisplayAmount(sliderConfig.min)}</span>
              <span>{formatDisplayAmount(maxBorrowable)}</span>
            </div>
          </div>
          
          {/* Quick Amount Buttons - Only show if amounts are achievable */}
          <div className="flex flex-wrap gap-2 justify-center">
            {/* Show percentage-based options for small amounts */}
            {maxBorrowable > 0 && [0.25, 0.5, 0.75, 1].map((percentage) => {
              const amount = maxBorrowable * percentage;
              if (amount >= sliderConfig.min) {
                return (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => setLoanAmount([amount])}
                    className={Math.abs(loanAmount[0] - amount) < 0.01 ? "bg-primary text-primary-foreground" : ""}
                  >
                    {percentage === 1 ? 'Max' : `${(percentage * 100)}%`} ({formatDisplayAmount(amount)})
                  </Button>
                );
              }
              return null;
            })}
          </div>

          {/* Health Factor Warning */}
          {healthFactor > 0 && healthFactor < 1.5 && healthFactor !== 999 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Health Factor: {healthFactor.toFixed(2)}</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Your health factor is low. Consider adding more collateral before borrowing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrow Action */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              You're about to borrow <strong>{formatDisplayAmount(loanAmount[0])} {selectedBorrowAsset}</strong> from Tartr
            </div>
            
            <Button 
              size="lg" 
              className="w-full max-w-md" 
              onClick={handleBorrow}
              disabled={!canBorrowAmount || !hasCollateral || isBorrowing || borrowState.isLoading}
            >
              {isBorrowing || borrowState.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Borrowing from Tartr...
                </>
              ) : !hasCollateral ? (
                "Supply Collateral First"
              ) : !canBorrowAmount ? (
                "Insufficient Borrowing Capacity"
              ) : (
                `Borrow ${formatDisplayAmount(loanAmount[0])} ${selectedBorrowAsset}`
              )}
            </Button>

            {borrowState.error && (
              <div className="text-sm text-red-600">
                Error: {borrowState.error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <p className="text-muted-foreground text-sm">
          Powered by Tartr • Decentralized • Non-custodial • Transparent
        </p>
      </div>
    </div>
  );
};

export default LoanSlider;