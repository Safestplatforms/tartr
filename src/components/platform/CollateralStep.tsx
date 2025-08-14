import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bitcoin, Coins, DollarSign, Loader2 } from "lucide-react";
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
  
  const { aaveBalances, collateralAssets, totalSupplied } = useAaveData();
  const { supply, supplyState } = useAaveTransactions();

  const requiredCollateralValue = applicationData.loanAmount * 1.4; // 140% ratio

  // Get available collateral assets with real balances
  const availableAssets = collateralAssets.map(asset => {
    const balance = aaveBalances[asset.symbol];
    const totalBalance = balance ? balance.balance + balance.supplyBalance : 0;
    
    return {
      symbol: asset.symbol,
      name: asset.name,
      balance: totalBalance,
      price: balance?.price || 0,
      icon: asset.symbol === 'ETH' ? Coins : asset.symbol === 'WBTC' ? Bitcoin : DollarSign,
      color: asset.symbol === 'ETH' ? 'text-blue-500' : asset.symbol === 'WBTC' ? 'text-orange-500' : 'text-green-500',
      canSupply: totalBalance > 0,
    };
  });

  const handleAssetSelect = (asset: any) => {
    if (!asset.canSupply) {
      toast.error(`You don't have any ${asset.symbol} to supply as collateral`);
      return;
    }
    
    setSelectedAsset(asset.symbol);
    const maxCollateral = Math.min(asset.balance, requiredCollateralValue / asset.price);
    
    onUpdate({
      collateral: {
        asset: asset.symbol,
        amount: maxCollateral,
        value: maxCollateral * asset.price
      }
    });
  };

  const handleSupplyCollateral = async () => {
    if (!selectedAsset || !applicationData.collateral) {
      toast.error('Please select collateral first');
      return;
    }

    setIsSupplying(true);
    
    try {
      await supply(selectedAsset, applicationData.collateral.amount);
      
      // Wait for transaction confirmation
      if (supplyState.txHash) {
        toast.success('Collateral supplied successfully! Proceeding to loan terms...');
        onNext();
      }
    } catch (error) {
      console.error('Supply failed:', error);
      toast.error('Failed to supply collateral');
    } finally {
      setIsSupplying(false);
    }
  };

  const selectedAssetData = availableAssets.find(a => a.symbol === selectedAsset);
  const canProceed = selectedAsset && selectedAssetData?.canSupply && applicationData.collateral;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Collateral</h2>
        <p className="text-muted-foreground">
          Choose the cryptocurrency you'd like to supply to Tartr as collateral for your ${applicationData.loanAmount.toLocaleString()} loan
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
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Current Tartr Supplies:</strong> ${totalSupplied.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                You already have collateral supplied to Tartr that can be used for borrowing
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="font-semibold">Available Assets</h3>
        {availableAssets.map((asset) => {
          const IconComponent = asset.icon;
          const totalValue = asset.balance * asset.price;
          const isSelected = selectedAsset === asset.symbol;
          
          return (
            <Card 
              key={asset.symbol} 
              className={`cursor-pointer transition-all hover:bg-muted/50 ${
                isSelected ? 'border-primary bg-primary/5' : ''
              } ${!asset.canSupply ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => asset.canSupply && handleAssetSelect(asset)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-muted ${asset.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {asset.balance.toFixed(asset.symbol === 'WBTC' ? 6 : 4)} {asset.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ≈ ${totalValue.toLocaleString()}
                    </div>
                    {!asset.canSupply && (
                      <div className="text-xs text-red-500 mt-1">
                        Insufficient balance
                      </div>
                    )}
                  </div>
                </div>
                
                {isSelected && applicationData.collateral && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collateral Amount</span>
                        <span className="font-medium">
                          {applicationData.collateral.amount.toFixed(4)} {asset.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collateral Value</span>
                        <span className="font-medium">${applicationData.collateral.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collateral Ratio</span>
                        <span className="font-medium">
                          {(((applicationData.collateral.value) / applicationData.loanAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {availableAssets.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="text-orange-700">
              <h3 className="font-semibold mb-2">No Collateral Assets Available</h3>
              <p className="text-sm">
                You need ETH or WBTC in your wallet to supply as collateral. 
                Please add some crypto assets to your wallet and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-6">
        <Button 
          onClick={handleSupplyCollateral}
          disabled={!canProceed || isSupplying || supplyState.isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isSupplying || supplyState.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Supplying Collateral...
            </>
          ) : (
            `Supply Collateral to Tartr`
          )}
        </Button>
      </div>

      {supplyState.error && (
        <div className="text-sm text-red-600 text-center">
          Error: {supplyState.error}
        </div>
      )}
    </div>
  );
};

export default CollateralStep;