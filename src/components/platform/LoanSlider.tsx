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
  
  const [loanAmount, setLoanAmount] = useState([Math.min(1000, maxBorrowable)]);
  const [selectedBorrowAsset, setSelectedBorrowAsset] = useState('USDC');
  const [isBorrowing, setIsBorrowing] = useState(false);

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

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toLocaleString();
  };

  const currentTier = getLoanTier(loanAmount[0]);
  const isPopular = currentTier.name === "Growth";
  
  // Real borrowing capacity checks
  const hasCollateral = totalSupplied > 0;
  const canBorrowAmount = loanAmount[0] <= maxBorrowable;
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
                  <li>1. Add ETH or WBTC to your wallet</li>
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Borrow from Tartr</h2>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-sm">
          <div>
            <p className="text-muted-foreground">Supplied</p>
            <p className="font-semibold text-blue-600">${totalSupplied.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Borrowed</p>
            <p className="font-semibold text-orange-600">${totalBorrowed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available</p>
            <p className="font-semibold text-green-600">${maxBorrowable.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Borrow Asset Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Borrow Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {['USDC', 'USDT'].map((asset) => (
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
                    <Badge variant="secondary" className="mt-2">8.5% APY</Badge>
                  </CardContent>
                </Card>
              ))}
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
                  {formatAmount(loanAmount[0])}
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
                max={Math.max(maxBorrowable, 1000)}
                min={100}
                step={100}
                className="w-full"
                disabled={maxBorrowable === 0}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>$100</span>
                <span>${maxBorrowable > 0 ? formatAmount(maxBorrowable) : '0'}</span>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[1000, 5000, 10000, 25000]
                .filter(amount => amount <= maxBorrowable)
                .map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setLoanAmount([amount])}
                    className={loanAmount[0] === amount ? "bg-primary text-primary-foreground" : ""}
                  >
                    {formatAmount(amount)}
                  </Button>
                ))}
              {maxBorrowable > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount([maxBorrowable])}
                  className={loanAmount[0] === maxBorrowable ? "bg-primary text-primary-foreground" : ""}
                >
                  Max ({formatAmount(maxBorrowable)})
                </Button>
              )}
            </div>

            {/* Health Factor Warning */}
            {healthFactor > 0 && healthFactor < 1.5 && (
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
                You're about to borrow <strong>{loanAmount[0].toLocaleString()} {selectedBorrowAsset}</strong> from Tartr
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
                  `Borrow ${formatAmount(loanAmount[0])} ${selectedBorrowAsset}`
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
      </div>

      <div className="text-center pt-4">
        <p className="text-muted-foreground text-sm">
          Powered by Tartr • Decentralized • Non-custodial • Transparent
        </p>
      </div>
    </div>
  );
};

export default LoanSlider;