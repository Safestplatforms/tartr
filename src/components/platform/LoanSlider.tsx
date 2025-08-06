
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Info, Wallet, AlertCircle } from "lucide-react";
import { useWalletBalance } from "@/hooks/useWalletBalance";

const LoanSlider = () => {
  const { balances, cryptoPrices, isLoading, totalValue, maxBorrowable, getAssetValue } = useWalletBalance();
  const [loanAmount, setLoanAmount] = useState([Math.min(10000, maxBorrowable)]);

  // Define loan tiers based on amount
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
  
  // Calculate collateral requirements
  const collateralRatioNum = parseInt(currentTier.collateralRatio) / 100;
  const requiredCollateralValue = loanAmount[0] * collateralRatioNum;

  // Check if user has enough collateral for requested amount
  const hasEnoughCollateral = totalValue >= requiredCollateralValue;
  const utilizationRate = totalValue > 0 ? (requiredCollateralValue / totalValue * 100) : 0;

  const getCollateralAmount = (crypto: string, price: number) => {
    const amount = requiredCollateralValue / price;
    if (amount < 1) return amount.toFixed(4);
    if (amount < 1000) return amount.toFixed(2);
    return amount.toFixed(0);
  };

  const handleGetLoan = () => {
    const params = new URLSearchParams({
      amount: loanAmount[0].toString(),
      plan: currentTier.name
    });
    window.location.href = `/platform/apply?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wallet balance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Loan Amount</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Based on your wallet balance, you can borrow up to ${maxBorrowable.toLocaleString()} USDC.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
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
              <div className="text-muted-foreground">USDC Loan Amount</div>
              <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Loans are disbursed in USDC stablecoin</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="px-4">
              <Slider
                value={loanAmount}
                onValueChange={setLoanAmount}
                max={Math.max(maxBorrowable, 1000)}
                min={1000}
                step={1000}
                className="w-full"
                disabled={maxBorrowable === 0}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>$1K</span>
                <span>${maxBorrowable > 0 ? formatAmount(maxBorrowable) : '0'}</span>
              </div>
              {maxBorrowable > 0 && (
                <div className="text-center mt-2">
                  <div className="text-xs text-muted-foreground">
                    Wallet utilization: {utilizationRate.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[5000, 15000, 50000, 100000, 500000]
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

            {/* Collateral Requirements Preview */}
            <Card className={`${hasEnoughCollateral ? 'bg-muted/30' : 'bg-red-50 border-red-200'}`}>
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Collateral Required ({currentTier.collateralRatio} ratio)
                  </div>
                  <div className={`text-2xl font-bold ${hasEnoughCollateral ? 'text-primary' : 'text-red-600'}`}>
                    ${requiredCollateralValue.toLocaleString()}
                  </div>
                  {!hasEnoughCollateral && (
                    <div className="flex items-center justify-center space-x-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Insufficient collateral</span>
                    </div>
                  )}
                </div>
                <Separator className="mb-3" />
                <div className="text-xs text-muted-foreground mb-2 text-center">
                  Equivalent amounts in popular cryptocurrencies:
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <div className="font-medium text-orange-600">BTC</div>
                    <div>{getCollateralAmount('BTC', cryptoPrices.BTC)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-600">ETH</div>
                    <div>{getCollateralAmount('ETH', cryptoPrices.ETH)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-green-600">USDC</div>
                    <div>{getCollateralAmount('USDC', cryptoPrices.USDC)}</div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Your current portfolio</div>
                  <div className="text-sm font-medium">
                    ${totalValue.toLocaleString()} available as collateral
                  </div>
                  {hasEnoughCollateral && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Sufficient collateral available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Dynamic Plan Display */}
        <Card className={`relative ${isPopular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          {isPopular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{currentTier.name} Plan</CardTitle>
            <p className="text-muted-foreground">Perfect for your loan amount</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{currentTier.apr}</div>
                <div className="text-sm text-muted-foreground">APR from</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{currentTier.term}</div>
                <div className="text-sm text-muted-foreground">Loan term</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{currentTier.collateralRatio}</div>
                <div className="text-sm text-muted-foreground">Min. collateral ratio</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-medium">Features included:</div>
              <div className="grid md:grid-cols-2 gap-2">
                {currentTier.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleGetLoan}
                disabled={!hasEnoughCollateral || maxBorrowable === 0}
              >
                {maxBorrowable === 0 
                  ? "Add Crypto Assets to Borrow"
                  : !hasEnoughCollateral 
                    ? "Insufficient Collateral" 
                    : `Get $${formatAmount(loanAmount[0])} USDC Loan`
                }
              </Button>
              {!hasEnoughCollateral && maxBorrowable > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Reduce loan amount or add more crypto assets to your wallet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-4">
        <p className="text-muted-foreground text-sm">
          All plans include: Multi-asset collateral support • Real-time liquidation protection • Insurance coverage up to $250k
        </p>
      </div>
    </div>
  );
};

export default LoanSlider;
