import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Info, Wallet, ArrowRight, Loader2, FileText, RefreshCw } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { getContract, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG } from '@/lib/aave/config';
import { AAVE_POOL_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';
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
  
  // 🆕 Real-time rates state (same as RatesTab)
  const [realTimeRates, setRealTimeRates] = useState<Record<string, {supply: number, borrow: number}>>({});
  const [ratesLoading, setRatesLoading] = useState(true);
  
  // Aave Pool contract (same as RatesTab)
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // Dynamic loan amount based on available amount
  const getInitialLoanAmount = () => {
    if (maxBorrowable <= 0) return 100; // Default amount if no collateral
    if (maxBorrowable < 1) return maxBorrowable;
    return Math.min(Math.floor(maxBorrowable), 10000); // Cap at 10k for initial display
  };
  
  const [loanAmount, setLoanAmount] = useState([getInitialLoanAmount()]);
  const [selectedBorrowAsset, setSelectedBorrowAsset] = useState('USDC');

  // 🆕 EXACT SAME ray conversion as RatesTab
  const rayToPercentage = (rayRate: bigint): number => {
    try {
      if (!rayRate || rayRate === 0n) {
        return 0;
      }
      
      // ✅ CORRECT: Aave V3 rates are already annual rates stored in Ray format
      const RAY = BigInt('1000000000000000000000000000'); // 10^27
      const rateDecimal = Number(rayRate) / Number(RAY);
      const percentage = rateDecimal * 100;
      
      // Ensure reasonable bounds (0-100%)
      return Math.min(Math.max(percentage, 0), 100);
    } catch (error) {
      console.error('❌ Ray conversion error:', error);
      return 0;
    }
  };

  // 🆕 EXACT SAME rate fetching logic as RatesTab
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
            
            const supplyAPY = rayToPercentage(liquidityRate);
            const borrowAPY = rayToPercentage(variableBorrowRate);
            
            return {
              symbol,
              supply: supplyAPY,
              borrow: borrowAPY
            };
          }
          
          // EXACT SAME fallback as RatesTab
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
      
    } catch (error) {
      console.error('❌ Failed to fetch rates:', error);
      
      // EXACT SAME fallback logic as RatesTab
      const fallbackRates: Record<string, {supply: number, borrow: number}> = {};
      Object.keys(SUPPORTED_ASSETS).forEach(symbol => {
        fallbackRates[symbol] = {
          supply: getRealisticSupplyRate(symbol),
          borrow: getRealisticBorrowRate(symbol)
        };
      });
      setRealTimeRates(fallbackRates);
    } finally {
      setRatesLoading(false);
    }
  };

  // 🆕 EXACT SAME fallback rates as RatesTab
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
      case 'USDC': return 7.8;    // SAME as RatesTab
      case 'USDT': return 7.5;    // SAME as RatesTab
      default: return 3.0;
    }
  };

  // 🆕 Fetch rates on mount (same as RatesTab)
  useEffect(() => {
    fetchRealTimeRates();
  }, []);

  // 🔧 Get borrow rate using real-time rates (same logic as RatesTab)
  const getBorrowRate = (symbol: string): number => {
    const rates = realTimeRates[symbol];
    return rates?.borrow ?? getRealisticBorrowRate(symbol);
  };

  // 🔧 FIXED: Dynamic stepping function
  const applyDynamicSteps = (value: number) => {
    if (value < 100) {
      return Math.round(value); // Step 1: gives 1, 2, 3, 4... 99
    } else if (value < 1000) {
      return Math.round(value / 10) * 10; // Step 10: gives 100, 110, 120... 990
    } else {
      return Math.round(value / 100) * 100; // Step 100: gives 1000, 1100, 1200...
    }
  };

  // 🔧 FIXED: Dynamic slider config with smooth dragging
  const getSliderConfig = () => {
    const hasCollateral = totalSupplied > 0;
    const maxAmount = hasCollateral ? Math.max(maxBorrowable, 10000) : 200000;
    
    return { 
      min: 1, 
      step: 1, // Always use step=1 for smooth dragging, we handle stepping in onChange
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
          <div className="flex items-center justify-between">
            <CardTitle>Select Loan Asset</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowableAssets.map((asset) => {
              // 🔧 Use real-time rates (same as RatesTab)
              const borrowRate = getBorrowRate(asset);
              const isRealTimeRate = realTimeRates[asset]?.borrow > 0;
              
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
                      {ratesLoading ? 'Loading...' : `${borrowRate.toFixed(2)}% APY`}
                    </Badge>
                    {/* Show rate source indicator */}
                    <div className="text-xs mt-1">
                      {ratesLoading ? (
                        <span className="text-muted-foreground">Fetching rates...</span>
                      ) : isRealTimeRate ? (
                        <span className="text-green-600"></span>
                      ) : (
                        <span className="text-muted-foreground">Market rate</span>
                      )}
                    </div>
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
            {/* 🔧 FIXED: Slider with dynamic stepping */}
            <Slider
              value={loanAmount}
              onValueChange={(newValue) => {
                const steppedValue = applyDynamicSteps(newValue[0]);
                setLoanAmount([steppedValue]);
              }}
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
                      onClick={() => setLoanAmount([applyDynamicSteps(amount)])}
                      className={Math.abs(loanAmount[0] - applyDynamicSteps(amount)) < 1 ? "bg-primary text-primary-foreground" : ""}
                    >
                      {percentage === 1 ? 'Max' : `${(percentage * 100)}%`} ({formatDisplayAmount(applyDynamicSteps(amount))})
                    </Button>
                  );
                }
                return null;
              })
              :
              // Show fixed amounts if no collateral
              [10, 100, 500, 1000, 5000].map((amount) => (
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

          {/* 🔧 Loan Preview with real-time rates */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border">
            <div className="text-sm font-medium text-blue-900 mb-2">Loan Application Preview</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Loan Amount</p>
                <p className="font-bold">{formatDisplayAmount(loanAmount[0])} {selectedBorrowAsset}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interest Rate</p>
                <p className="font-bold">
                  {ratesLoading ? 'Loading...' : `${getBorrowRate(selectedBorrowAsset).toFixed(2)}% APY`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div>
                <p className="text-muted-foreground">Collateral Required</p>
                <p className="font-bold">{formatDisplayAmount(loanAmount[0] * 1.4)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Interest</p>
                <p className="font-bold">
                  ${ratesLoading ? '...' : (loanAmount[0] * getBorrowRate(selectedBorrowAsset) / 100 / 12).toFixed(2)}
                </p>
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