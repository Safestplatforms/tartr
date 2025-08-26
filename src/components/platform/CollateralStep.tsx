import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bitcoin, Coins, DollarSign, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { toast } from "sonner";

interface CollateralStepProps {
  applicationData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const CollateralStep = ({ applicationData, onUpdate, onNext }: CollateralStepProps) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [isSupplying, setIsSupplying] = useState(false);
  
  const { aaveBalances, totalSupplied, isLoading } = useAaveData();
  const { supply, supplyState } = useAaveTransactions();

  const requiredCollateralValue = applicationData.loanAmount * 1.4; // 140% ratio

  // Get collateral assets from SUPPORTED_ASSETS config
  const getCollateralAssets = () => {
    return Object.entries(SUPPORTED_ASSETS)
      .filter(([symbol, asset]) => asset.isCollateral)
      .map(([symbol, asset]) => {
        const balance = aaveBalances[symbol];
        const walletBalance = balance?.balance || 0;
        const suppliedBalance = balance?.supplyBalance || 0;
        const totalBalance = walletBalance + suppliedBalance;
        const price = balance?.price || 0;
        
        return {
          symbol,
          name: asset.name,
          balance: walletBalance,
          suppliedBalance: suppliedBalance,
          totalBalance: totalBalance,
          price: price,
          icon: symbol === 'ETH' ? Coins : 
                symbol === 'WBTC' ? Bitcoin : 
                symbol === 'LINK' ? DollarSign :
                symbol === 'UNI' ? DollarSign : DollarSign,
          color: symbol === 'ETH' ? 'text-blue-500' : 
                 symbol === 'WBTC' ? 'text-orange-500' : 
                 symbol === 'LINK' ? 'text-blue-600' :
                 symbol === 'UNI' ? 'text-pink-500' : 'text-green-500',
          canSupply: walletBalance > 0, // Only wallet balance can be supplied
          hasExistingSupply: suppliedBalance > 0,
        };
      });
  };

  const availableAssets = getCollateralAssets();

  // Reset selection if asset becomes unavailable
  useEffect(() => {
    if (selectedAsset) {
      const selectedAssetData = availableAssets.find(a => a.symbol === selectedAsset);
      if (!selectedAssetData?.canSupply) {
        setSelectedAsset('');
        onUpdate({ collateral: null });
      }
    }
  }, [availableAssets, selectedAsset]);

  const handleAssetSelect = (asset: any) => {
    if (!asset.canSupply) {
      toast.error(`You don't have any ${asset.symbol} in your wallet to supply as collateral`);
      return;
    }
    
    setSelectedAsset(asset.symbol);
    
    // Calculate how much collateral is needed
    const collateralNeeded = requiredCollateralValue / asset.price;
    const availableAmount = asset.balance;
    const actualCollateralAmount = Math.min(collateralNeeded, availableAmount);
    
    if (actualCollateralAmount < collateralNeeded) {
      toast.warning(`Insufficient ${asset.symbol}. You have ${availableAmount.toFixed(4)} but need ${collateralNeeded.toFixed(4)}`);
    }
    
    onUpdate({
      collateral: {
        asset: asset.symbol,
        amount: actualCollateralAmount,
        value: actualCollateralAmount * asset.price,
        required: collateralNeeded,
        sufficient: actualCollateralAmount >= collateralNeeded
      }
    });
  };

  const handleSupplyCollateral = async () => {
    if (!selectedAsset || !applicationData.collateral) {
      toast.error('Please select collateral first');
      return;
    }

    if (!applicationData.collateral.sufficient) {
      toast.error('Insufficient collateral amount for this loan');
      return;
    }

    setIsSupplying(true);
    
    try {
      console.log('Supplying collateral:', {
        asset: selectedAsset,
        amount: applicationData.collateral.amount
      });

      await supply(selectedAsset, applicationData.collateral.amount);
      
      // Check if transaction completed successfully
      if (supplyState.txHash) {
        toast.success('Collateral supplied successfully!');
        console.log('Supply successful, proceeding to next step');
        setTimeout(() => {
          onNext();
        }, 1500); // Give time for user to see success message
      } else if (supplyState.error) {
        toast.error(`Failed to supply collateral: ${supplyState.error}`);
      }
    } catch (error) {
      console.error('Supply failed:', error);
      toast.error('Failed to supply collateral');
    } finally {
      setIsSupplying(false);
    }
  };

  // Monitor supply state changes
  useEffect(() => {
    if (supplyState.txHash && !isSupplying) {
      // Transaction completed successfully
      console.log('Transaction hash received:', supplyState.txHash);
      toast.success('Collateral supplied successfully!');
      setTimeout(() => {
        onNext();
      }, 1500);
    } else if (supplyState.error && !isSupplying) {
      console.error('Supply error:', supplyState.error);
      toast.error(`Supply failed: ${supplyState.error}`);
    }
  }, [supplyState.txHash, supplyState.error, isSupplying, onNext]);

  const selectedAssetData = availableAssets.find(a => a.symbol === selectedAsset);
  // Check if existing collateral is sufficient
  const existingCollateralSufficient = totalSupplied >= requiredCollateralValue;
  const canProceedWithExisting = existingCollateralSufficient;
  const canProceedWithNew = selectedAsset && selectedAssetData?.canSupply && applicationData.collateral?.sufficient;
  const needsMoreCollateral = totalSupplied > 0 && totalSupplied < requiredCollateralValue;

  const handleProceedWithExisting = () => {
    // Use existing collateral and proceed
    onUpdate({
      collateral: {
        asset: 'EXISTING',
        amount: totalSupplied,
        value: totalSupplied,
        sufficient: true,
        useExisting: true
      }
    });
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Supply Collateral</h2>
        <p className="text-muted-foreground">
          Choose the cryptocurrency you'd like to supply as collateral for your ${applicationData.loanAmount.toLocaleString()} {applicationData.asset || 'USDC'} loan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Collateral Requirements
            <Badge variant="outline">140% Minimum Ratio</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Loan Amount</div>
              <div className="font-semibold">${applicationData.loanAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Required Collateral Value</div>
              <div className="font-semibold">${requiredCollateralValue.toLocaleString()}</div>
            </div>
          </div>
          
          {totalSupplied > 0 && (
            <div className={`mt-4 mb-2 p-3 rounded-lg border ${
              existingCollateralSufficient ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className={`text-sm font-medium ${
                existingCollateralSufficient ? 'text-green-800' : 'text-orange-800'
              }`}>
                <strong>Current Tartr Supplies:</strong> ${totalSupplied.toLocaleString()}
              </div>
              <div className={`text-xs mt-1 ${
                existingCollateralSufficient ? 'text-green-700' : 'text-orange-700'
              }`}>
                {existingCollateralSufficient 
                  ? '✓ You have sufficient collateral! You can proceed with existing collateral.'
                  : `You need ${(requiredCollateralValue - totalSupplied).toFixed(2)} more collateral for this loan.`
                }
              </div>
            </div>
          )}

          {/* Existing Sufficient Collateral - Quick Proceed Option */}
          {canProceedWithExisting && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-800">Ready to Proceed</div>
                    <div className="text-sm text-green-700">
                      Your existing ${totalSupplied.toLocaleString()} collateral is sufficient for this ${applicationData.loanAmount.toLocaleString()} loan.
                    </div>
                  </div>
                  <Button 
                    onClick={handleProceedWithExisting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Continue with Existing Collateral
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {needsMoreCollateral ? 'Add More Collateral' : 'Available Assets'}
          </h3>
          {needsMoreCollateral && (
            <Badge variant="outline" className="text-red-600 border-red-300">
              Need ${(requiredCollateralValue - totalSupplied).toFixed(2)} more
            </Badge>
          )}
        </div>
        {availableAssets.length > 0 ? (
          availableAssets.map((asset) => {
            const IconComponent = asset.icon;
            const walletValue = asset.balance * asset.price;
            const totalValue = asset.totalBalance * asset.price;
            const isSelected = selectedAsset === asset.symbol;
            
            return (
              <Card 
                key={asset.symbol} 
                className={`cursor-pointer transition-all hover:bg-muted/50 ${
                  isSelected ? 'border-primary bg-primary/5' : ''
                } ${!asset.canSupply ? 'opacity-50' : ''}`}
                onClick={() => handleAssetSelect(asset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-8 h-8 ${asset.color}`} />
                      <div>
                        <div className="font-semibold text-lg">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                        {isSelected && (
                          <div className="flex items-center space-x-1 text-green-600 text-sm mt-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {asset.balance.toFixed(asset.symbol === 'WBTC' ? 6 : 6)} {asset.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ≈ ${walletValue.toLocaleString()}
                      </div>
                      {asset.hasExistingSupply && (
                        <div className="text-xs text-blue-600 mt-1">
                          +${(asset.suppliedBalance * asset.price).toLocaleString()} supplied
                        </div>
                      )}
                      {!asset.canSupply && (
                        <div className="text-xs text-red-500 mt-1">
                          No wallet balance
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && applicationData.collateral && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Wallet Balance</span>
                          <span className="font-medium">
                            {applicationData.collateral.amount.toFixed(6)} {asset.symbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Collateral Value</span>
                          <span className="font-medium">${applicationData.collateral.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Collateral Ratio</span>
                          <span className={`font-medium ${
                            applicationData.collateral.sufficient ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {(((applicationData.collateral.value) / applicationData.loanAmount) * 100).toFixed(1)}%
                            {applicationData.collateral.sufficient ? ' ✓' : ' ✗'}
                          </span>
                        </div>
                        {!applicationData.collateral.sufficient && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
                            Need {applicationData.collateral.required.toFixed(4)} {asset.symbol} total
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-orange-800 mb-2">No Collateral Assets Available</h3>
              <p className="text-sm text-orange-700">
                You need ETH, WBTC, LINK, or UNI in your wallet to supply as collateral. 
                Please add some crypto assets to your wallet and try again.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Supply Status */}
      {supplyState.isLoading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">Processing Transaction</div>
                <div className="text-sm text-blue-600">
                  {supplyState.step || 'Preparing to supply collateral...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {supplyState.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Transaction Failed</div>
                <div className="text-sm text-red-600">{supplyState.error}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-6">
        {canProceedWithExisting ? (
          // User already has sufficient collateral - button is shown above
          <div className="text-sm text-muted-foreground">
            You can proceed with existing collateral or add more collateral below.
          </div>
        ) : (
          <Button 
            onClick={handleSupplyCollateral}
            disabled={!canProceedWithNew || isSupplying || supplyState.isLoading}
            size="lg"
            className="min-w-[200px]"
          >
            {isSupplying || supplyState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Collateral...
              </>
            ) : !selectedAsset ? (
              needsMoreCollateral ? 'Select Asset to Add' : 'Select Collateral Asset'
            ) : !applicationData.collateral?.sufficient ? (
              'Insufficient Amount Selected'
            ) : (
              `${needsMoreCollateral ? 'Add' : 'Supply'} ${selectedAsset} to Tartr`
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CollateralStep;