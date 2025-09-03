import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Loader2, 
  Wallet, 
  X, 
  DollarSign,
  Send,
  Download,
  Eye,
  EyeOff,
  Activity,
  MoreVertical
} from "lucide-react";
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
  const [showBalance, setShowBalance] = useState(true);
  
  // Custom amount input state
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
    if (healthFactor >= 1.5) return "Healthy";
    if (healthFactor >= 1.2) return "Warning";
    return "At Risk";
  };

  // Asset icon and color mapping
  const getAssetConfig = (symbol: string) => {
    const configs = {
      'BTC': { 
        icon: '₿', 
        gradient: 'from-orange-400 to-orange-600',
        bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600'
      },
      'ETH': { 
        icon: 'Ξ', 
        gradient: 'from-blue-400 to-purple-600',
        bgColor: 'bg-gradient-to-br from-blue-400 to-purple-600'
      },
      'WBTC': { 
        icon: '₿', 
        gradient: 'from-orange-400 to-orange-600',
        bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600'
      },
      'USDC': { 
        icon: 'U', 
        gradient: 'from-blue-400 to-blue-600',
        bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600'
      },
      'USDT': { 
        icon: 'T', 
        gradient: 'from-green-400 to-green-600',
        bgColor: 'bg-gradient-to-br from-green-400 to-green-600'
      },
      'LINK': { 
        icon: 'L', 
        gradient: 'from-blue-400 to-blue-600',
        bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600'
      },
      'UNI': { 
        icon: '🦄', 
        gradient: 'from-purple-400 to-pink-600',
        bgColor: 'bg-gradient-to-br from-purple-400 to-pink-600'
      },
      'SOL': { 
        icon: '◎', 
        gradient: 'from-purple-400 to-pink-600',
        bgColor: 'bg-gradient-to-br from-purple-400 to-pink-600'
      }
    };
    return configs[symbol as keyof typeof configs] || { 
      icon: symbol.charAt(0), 
      gradient: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gradient-to-br from-gray-400 to-gray-600'
    };
  };

  // Custom amount handlers
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

  const dailyChangePercent = 0.00;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full">
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
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {customAmountInput.type === 'supply' ? 'Wallet Balance' : 
                   customAmountInput.type === 'withdraw' ? 'Supplied Balance' : 'Borrowed Amount'}
                </span>
                <span className="font-medium">{customAmountInput.maxAmount.toFixed(6)} {customAmountInput.asset}</span>
              </div>

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

              {customAmount && !isNaN(parseFloat(customAmount)) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>≈ ${(parseFloat(customAmount) * customAmountInput.currentPrice).toFixed(2)} USD</span>
                </div>
              )}

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

      {/* Wallet Balance Card */}
      <div className="w-full max-w-sm mx-auto mt-2 px-2 sm:px-0">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden relative p-4 md:p-6 glass-shimmer-slow w-full">
          {/* Starry Night Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950"></div>
          {/* Twinkling Stars Layer 1 */}
          <div className="absolute inset-0">
            <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-blue-200 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-14 left-12 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-4 right-12 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-16 left-6 w-1 h-1 bg-blue-100 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-8 right-4 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute top-6 left-20 w-1 h-1 bg-purple-200 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute bottom-12 right-16 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
          </div>
          {/* Twinkling Stars Layer 2 - Slower */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-8 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '3s', animationDuration: '3s'}}></div>
            <div className="absolute top-16 right-10 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '4s', animationDuration: '4s'}}></div>
            <div className="absolute bottom-20 left-16 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '2.2s', animationDuration: '2.5s'}}></div>
            <div className="absolute bottom-6 right-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '3.5s', animationDuration: '3.2s'}}></div>
            <div className="absolute top-12 left-24 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '1.2s', animationDuration: '2.8s'}}></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-8 md:translate-x-12 -translate-y-8 md:-translate-y-12"></div>
          
          {/* Content */}
          <div className="relative z-10 space-y-4 md:space-y-6">
            {/* Header with Eye Toggle */}
            <div className="flex items-center justify-between">
              <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wider">Portfolio Value</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full flex-shrink-0"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* Balance Display */}
            <div className="space-y-2 md:space-y-3">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold break-words">
                {showBalance ? `$${totalValue.toLocaleString()}` : '••••••••'}
              </div>
              <div className="flex items-center space-x-2 flex-wrap">
                {dailyChangePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 flex-shrink-0" />
                )}
                <span className={`text-sm ${dailyChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {showBalance ? `+$0.00 (${dailyChangePercent}%)` : '•••• (••••%)'}
                </span>
                <span className="text-sm text-slate-300">24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto px-2 sm:px-0 w-full">
        <div className="flex flex-col items-center space-y-2">
          <Button className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0 flex-shrink-0 bg-indigo-500 hover:bg-indigo-600">
            <Send className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-foreground text-center">Send</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Button className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0 flex-shrink-0 bg-green-500 hover:bg-green-600">
            <Download className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-foreground text-center">Receive</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Button className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0 flex-shrink-0 bg-orange-500 hover:bg-orange-600">
            <Plus className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-foreground text-center">Buy</span>
        </div>
      </div>

      {/* Data Points Section */}
      <div className="max-w-sm mx-auto px-2 sm:px-0 w-full">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 space-y-3">
          {/* Health Factor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Health Factor</span>
            </div>
            <div className="relative w-20 h-12 flex-shrink-0 ml-4">
              {/* Half-circle gauge */}
              <svg viewBox="0 0 80 48" className="w-20 h-12">
                {/* Background arc */}
                <path
                  d="M 10 40 A 30 30 0 0 1 70 40"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                />
                {/* Health factor progress arc - Dynamic based on health factor */}
                <path
                  d={healthFactor >= 1.5 ? "M 10 40 A 30 30 0 0 1 61.21 18.79" : 
                     healthFactor >= 1.2 ? "M 10 40 A 30 30 0 0 1 50 10" : 
                     "M 10 40 A 30 30 0 0 1 40 15"}
                  fill="none"
                  stroke={healthFactor >= 1.5 ? "hsl(var(--primary))" : 
                         healthFactor >= 1.2 ? "#eab308" : "#ef4444"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Needle indicator */}
                <circle 
                  cx={healthFactor >= 1.5 ? "61.21" : healthFactor >= 1.2 ? "50" : "40"} 
                  cy={healthFactor >= 1.5 ? "18.79" : healthFactor >= 1.2 ? "10" : "15"} 
                  r="2" 
                  fill={healthFactor >= 1.5 ? "hsl(var(--primary))" : 
                        healthFactor >= 1.2 ? "#eab308" : "#ef4444"} 
                />
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
                <div className="text-sm font-bold text-foreground">
                  {healthFactor > 0 ? healthFactor.toFixed(1) : '∞'}
                </div>
                <div className={`text-xs font-medium ${
                  healthFactor >= 1.5 ? 'text-green-500' : 
                  healthFactor >= 1.2 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {getHealthFactorBadge(healthFactor)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Supplied and Borrowed */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Supplied</div>
              <div className="text-sm font-semibold text-foreground">${totalSupplied.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Borrowed</div>
              <div className="text-sm font-semibold text-foreground">${totalBorrowed.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Portfolio Table */}
      <Card className="rounded-2xl glass-shimmer-slow">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center justify-between text-lg md:text-xl text-card-foreground">
            <span>My Portfolio</span>
            <span className="text-sm font-normal text-muted-foreground">${totalValue.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs text-muted-foreground font-medium border-b border-border pb-2">
            <span className="col-span-3">Asset</span>
            <span className="col-span-2 text-center">Wallet</span>
            <span className="col-span-2 text-center">Supplied</span>
            <span className="col-span-2 text-center">Borrowed</span>
            <span className="col-span-3 text-right">Total Value</span>
          </div>

          {/* Mobile Table Header */}
          <div className="md:hidden grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium border-b border-border pb-2">
            <span>Asset</span>
            <span className="text-center">Position</span>
            <span className="text-right">Value</span>
          </div>

          {Object.entries(aaveBalances).map(([symbol, data]) => {
            const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
            const walletValue = data.balance * data.price;
            const supplyValue = data.supplyBalance * data.price;
            const borrowValue = data.borrowBalance * data.price;
            const totalAssetValue = walletValue + supplyValue;
            const totalAssetAmount = data.balance + data.supplyBalance;
            
            if (totalAssetValue < 0.01 && borrowValue < 0.1) return null;

            const portfolioPercentage = totalValue > 0 ? (totalAssetValue / totalValue) * 100 : 0;
            const mockChange = Math.random() > 0.5 ? 
              (Math.random() * 10) : 
              -(Math.random() * 5);
            
            const assetConfig = getAssetConfig(symbol);
            const isActionLoading = selectedAction?.asset === symbol;

            return (
              <div key={symbol} className="space-y-2">
                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-12 gap-2 items-center p-3 rounded-xl bg-gradient-to-r from-card/50 via-card to-card/50 border border-border/50 hover:from-card/80 hover:via-card hover:to-card/80 transition-all duration-300 group">
                  {/* Asset Info */}
                  <div className="col-span-3 flex items-center space-x-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg md:text-xl font-bold ${assetConfig.bgColor} text-white shadow-lg`}>
                      {assetConfig.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base text-card-foreground group-hover:text-foreground transition-colors">{symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset?.name || symbol}</p>
                    </div>
                  </div>

                  {/* Wallet Balance */}
                  <div className="col-span-2 text-center">
                    <p className="text-sm font-medium text-card-foreground group-hover:text-foreground transition-colors">
                      {data.balance > 0 ? data.balance.toFixed(symbol === 'USDC' || symbol === 'USDT' ? 2 : 6) : '0.00'}
                    </p>
                    <p className="text-xs text-muted-foreground">${walletValue.toFixed(2)}</p>
                  </div>

                  {/* Supplied Amount */}
                  <div className="col-span-2 text-center">
                    {data.supplyBalance > 0 ? (
                      <>
                        <p className="text-sm font-medium text-green-600">
                          {data.supplyBalance.toFixed(symbol === 'USDC' || symbol === 'USDT' ? 2 : 6)}
                        </p>
                        <p className="text-xs text-green-600">${supplyValue.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>

                  {/* Borrowed Amount */}
                  <div className="col-span-2 text-center">
                    {data.borrowBalance > 0 ? (
                      <>
                        <p className="text-sm font-medium text-red-600">
                          {data.borrowBalance.toFixed(symbol === 'USDC' || symbol === 'USDT' ? 2 : 6)}
                        </p>
                        <p className="text-xs text-red-600">${borrowValue.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>

                  {/* Total Value */}
                  <div className="col-span-3 text-right">
                    <p className="font-medium text-sm md:text-base text-card-foreground group-hover:text-foreground transition-colors">
                      ${(totalAssetValue).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end space-x-2">
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-card/50 via-card to-card/50 border border-border/50 hover:from-card/80 hover:via-card hover:to-card/80 transition-all duration-300 group">
                  <div className="flex items-center space-x-3 flex-1 mr-4 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${assetConfig.bgColor} text-white shadow-lg`}>
                      {assetConfig.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-card-foreground group-hover:text-foreground transition-colors">{symbol}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {data.balance > 0 && <div>Wallet: {data.balance.toFixed(4)}</div>}
                        {data.supplyBalance > 0 && <div className="text-green-600">Supplied: {data.supplyBalance.toFixed(4)}</div>}
                        {data.borrowBalance > 0 && <div className="text-red-600">Borrowed: {data.borrowBalance.toFixed(4)}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center flex-shrink-0 mr-4">
                    <p className="text-xs font-medium text-card-foreground">
                      {data.supplyBalance > 0 && data.borrowBalance > 0 ? '' :
                       data.supplyBalance > 0 ? '' :
                       data.borrowBalance > 0 ? '' : ''}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm text-card-foreground group-hover:text-foreground transition-colors">
                      ${(totalAssetValue).toFixed(2)}
                    </p>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Action Buttons Row - Same for both layouts */}
                <div className="ml-3 md:ml-13 flex gap-2">
                  {asset?.isCollateral && data.balance > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openCustomAmountInput('supply', symbol, data.balance, data.price)}
                      disabled={isActionLoading}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Supply
                    </Button>
                  )}
                  
                  {data.supplyBalance > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openCustomAmountInput('withdraw', symbol, data.supplyBalance, data.price)}
                      disabled={isActionLoading}
                    >
                      <Minus className="w-3 h-3 mr-1" />
                      Withdraw
                    </Button>
                  )}

                  {data.borrowBalance > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openCustomAmountInput('repay', symbol, data.borrowBalance, data.price)}
                      disabled={isActionLoading}
                      className="text-orange-600 border-orange-200"
                    >
                      <Minus className="w-3 h-3 mr-1" />
                      Repay
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;