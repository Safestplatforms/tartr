import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Info, Wallet, ArrowRight, Loader2, FileText } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { toast } from "sonner";

const LoanSlider = () => {
  const navigate = useNavigate();
  const { 
    aaveBalances, 
    maxBorrowable, 
    totalValue, 
    isLoading, 
    totalSupplied, 
    totalBorrowed 
  } = useAaveData();
  
  // Dynamic loan amount based on available amount
  const getInitialLoanAmount = () => {
    if (maxBorrowable <= 0) return 1000; // Default amount if no collateral
    if (maxBorrowable < 1) return maxBorrowable;
    return Math.min(Math.floor(maxBorrowable), 10000); // Cap at 10k for initial display
  };
  
  const [loanAmount, setLoanAmount] = useState([getInitialLoanAmount()]);
  const [selectedBorrowAsset, setSelectedBorrowAsset] = useState('USDC');

  // Dynamic slider config
  const getSliderConfig = () => {
    const hasCollateral = totalSupplied > 0;
    const maxAmount = hasCollateral ? Math.max(maxBorrowable, 10000) : 200000;
    
    return { 
      min: 1, 
      step: loanAmount[0] < 100 ? 1 : 100, 
      max: maxAmount
    };
  };

  const sliderConfig = getSliderConfig();

  const formatDisplayAmount = (amount: number) => {
    if (amount < 1) return `$${amount.toFixed(2)}`;
    if (amount < 10) return `$${amount.toFixed(1)}`;
    return `$${Math.floor(amount).toLocaleString()}`;
  };

  // Handle application start - ONLY 3-step flow
  const handleStartApplication = () => {
    if (loanAmount[0] <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }
    
    // Navigate to 3-step loan application
    navigate(`/platform/apply?amount=${loanAmount[0]}&asset=${selectedBorrowAsset}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading Tartr data...</p>
        </div>
      </div>
    );
  }

  // Show different UI based on user's position
  const hasCollateral = totalSupplied > 0;

  if (!hasCollateral && maxBorrowable === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Apply for Your First Loan</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start your loan application. We'll guide you through supplying collateral in the first step.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Our 3-step process will help you:</h4>
                <ol className="text-sm text-blue-700 text-left space-y-1">
                  <li>1️⃣ Supply collateral (ETH, WBTC, LINK, or UNI)</li>
                  <li>2️⃣ Set loan terms and duration</li>
                  <li>3️⃣ Review and submit your application</li>
                </ol>
              </div>
              
              <Button 
                onClick={handleStartApplication}
                size="lg" 
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Loan Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
        <h1 className="text-4xl font-bold mb-4">Apply for a Loan</h1>
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

      {/* Loan Asset Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Loan Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowableAssets.map((asset) => {
              const assetData = aaveBalances[asset];
              const borrowRate = assetData?.borrowAPY || 7.0;
              
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
                      ~{borrowRate.toFixed(1)}% APY
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
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatDisplayAmount(sliderConfig.min)}</span>
              <span>{formatDisplayAmount(sliderConfig.max)}</span>
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {hasCollateral && maxBorrowable > 0 ? 
              // Show percentage-based options if user has collateral
              [0.25, 0.5, 0.75, 1].map((percentage) => {
                const amount = Math.min(maxBorrowable * percentage, sliderConfig.max);
                if (amount >= sliderConfig.min) {
                  return (
                    <Button
                      key={percentage}
                      variant="outline"
                      size="sm"
                      onClick={() => setLoanAmount([amount])}
                      className={Math.abs(loanAmount[0] - amount) < 1 ? "bg-primary text-primary-foreground" : ""}
                    >
                      {percentage === 1 ? 'Max' : `${(percentage * 100)}%`} ({formatDisplayAmount(amount)})
                    </Button>
                  );
                }
                return null;
              })
              :
              // Show fixed amounts if no collateral
              [1000, 5000, 10000, 25000, 50000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount([amount])}
                  className={loanAmount[0] === amount ? "bg-primary text-primary-foreground" : ""}
                >
                  {formatDisplayAmount(amount)}
                </Button>
              ))
            }
          </div>

          {/* Loan Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border">
            <div className="text-sm font-medium text-blue-900 mb-2">Loan Application Preview</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Loan Amount</p>
                <p className="font-bold">{formatDisplayAmount(loanAmount[0])} {selectedBorrowAsset}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Collateral Required</p>
                <p className="font-bold">{formatDisplayAmount(loanAmount[0] * 1.4)}</p>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Final terms will be set in step 2 of your application
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Application Action */}
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Ready to Apply?</h3>
            <p className="text-muted-foreground">
              Complete your {formatDisplayAmount(loanAmount[0])} {selectedBorrowAsset} loan application in 3 simple steps
            </p>
          </div>
          
          {/* 3-Step Preview */}
          <div className="flex justify-center space-x-6 text-xs text-muted-foreground py-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <span>Supply Collateral</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <span>Set Terms</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <span>Review & Submit</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full max-w-md" 
            onClick={handleStartApplication}
            disabled={loanAmount[0] <= 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            Start Loan Application
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-xs text-muted-foreground">
            ⚡ Quick approval • 🔒 Secure process • 💰 Instant funding
          </p>
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