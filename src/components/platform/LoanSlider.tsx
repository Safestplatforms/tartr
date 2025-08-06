
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const LoanSlider = () => {
  const [loanAmount, setLoanAmount] = useState([10000]);

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
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const currentTier = getLoanTier(loanAmount[0]);
  const isPopular = currentTier.name === "Growth";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Loan Amount</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Slide to select your desired loan amount and see how your plan changes in real-time.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Loan Amount Slider */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">
                {formatAmount(loanAmount[0])}
              </div>
              <div className="text-muted-foreground">Loan Amount</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="px-4">
              <Slider
                value={loanAmount}
                onValueChange={setLoanAmount}
                max={1000000}
                min={1000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>$1K</span>
                <span>$1M+</span>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[5000, 15000, 50000, 100000, 500000].map((amount) => (
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
            </div>
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
              <Button size="lg" className="w-full">
                Get ${formatAmount(loanAmount[0])} Loan
              </Button>
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
