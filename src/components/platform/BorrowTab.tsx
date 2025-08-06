
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BorrowTab = () => {
  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [collateralAsset, setCollateralAsset] = useState("");
  const [borrowAsset, setBorrowAsset] = useState("");

  const collateralOptions = [
    { symbol: "BTC", name: "Bitcoin", price: "$98,450", balance: "0.15" },
    { symbol: "ETH", name: "Ethereum", price: "$3,420", balance: "2.45" },
  ];

  const borrowOptions = [
    { symbol: "USDC", name: "USD Coin", price: "$1.00", apy: "8.5%" },
    { symbol: "USDT", name: "Tether", price: "$1.00", apy: "8.2%" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Borrow Form */}
      <Card>
        <CardHeader>
          <CardTitle>Borrow Against Your Crypto</CardTitle>
          <CardDescription>
            Deposit crypto as collateral to borrow stablecoins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Collateral Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Collateral</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select onValueChange={setCollateralAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Asset" />
                </SelectTrigger>
                <SelectContent>
                  {collateralOptions.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{asset.symbol}</span>
                        <span className="text-muted-foreground text-xs">{asset.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="0.00"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
              />
            </div>
            {collateralAsset && (
              <p className="text-xs text-muted-foreground">
                Balance: {collateralOptions.find(a => a.symbol === collateralAsset)?.balance} {collateralAsset}
              </p>
            )}
          </div>

          <Separator />

          {/* Borrow Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Borrow</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select onValueChange={setBorrowAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Asset" />
                </SelectTrigger>
                <SelectContent>
                  {borrowOptions.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{asset.symbol}</span>
                        <Badge variant="secondary" className="text-xs">{asset.apy}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full" size="lg">
            Create Loan
          </Button>
        </CardContent>
      </Card>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Summary</CardTitle>
          <CardDescription>Review your loan details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Collateral Value</span>
              <span className="text-sm font-medium">
                {collateralAmount && collateralAsset ? 
                  `$${(parseFloat(collateralAmount) * parseFloat(collateralOptions.find(a => a.symbol === collateralAsset)?.price.replace('$', '').replace(',', '') || '0')).toLocaleString()}` 
                  : '$0.00'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Loan Amount</span>
              <span className="text-sm font-medium">
                {borrowAmount && borrowAsset ? `$${parseFloat(borrowAmount).toLocaleString()} ${borrowAsset}` : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Collateral Ratio</span>
              <span className="text-sm font-medium">
                {collateralAmount && borrowAmount ? 
                  `${Math.round((parseFloat(collateralAmount) * 100) / parseFloat(borrowAmount))}%` 
                  : '-%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Interest Rate</span>
              <span className="text-sm font-medium">
                {borrowAsset ? borrowOptions.find(a => a.symbol === borrowAsset)?.apy : '-%'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowTab;
