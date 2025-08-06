
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bitcoin, Coins, DollarSign } from "lucide-react";

interface CollateralStepProps {
  applicationData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const CollateralStep = ({ applicationData, onUpdate, onNext }: CollateralStepProps) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [collateralAmount, setCollateralAmount] = useState(0);

  const availableAssets = [
    { 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      balance: 2.45, 
      price: 45000, 
      icon: Bitcoin,
      color: 'text-orange-500' 
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum', 
      balance: 15.8, 
      price: 2800, 
      icon: Coins,
      color: 'text-blue-500' 
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      balance: 25000, 
      price: 1, 
      icon: DollarSign,
      color: 'text-green-500' 
    }
  ];

  const requiredCollateralValue = applicationData.loanAmount * 1.4; // 140% ratio

  const handleAssetSelect = (asset: any) => {
    setSelectedAsset(asset.symbol);
    const maxCollateral = Math.min(asset.balance, requiredCollateralValue / asset.price);
    setCollateralAmount(maxCollateral);
    
    onUpdate({
      collateral: {
        asset: asset.symbol,
        amount: maxCollateral,
        value: maxCollateral * asset.price
      }
    });
  };

  const canProceed = selectedAsset && collateralAmount > 0 && 
    (collateralAmount * availableAssets.find(a => a.symbol === selectedAsset)?.price || 0) >= requiredCollateralValue;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Collateral</h2>
        <p className="text-muted-foreground">
          Choose the cryptocurrency you'd like to use as collateral for your ${applicationData.loanAmount.toLocaleString()} loan
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
              }`}
              onClick={() => handleAssetSelect(asset)}
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
                    <div className="font-semibold">{asset.balance} {asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      ≈ ${totalValue.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collateral Amount</span>
                        <span className="font-medium">{collateralAmount.toFixed(4)} {asset.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collateral Value</span>
                        <span className="font-medium">${(collateralAmount * asset.price).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collateral Ratio</span>
                        <span className="font-medium">
                          {(((collateralAmount * asset.price) / applicationData.loanAmount) * 100).toFixed(1)}%
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

      <div className="flex justify-end pt-6">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
        >
          Continue to Loan Terms
        </Button>
      </div>
    </div>
  );
};

export default CollateralStep;
