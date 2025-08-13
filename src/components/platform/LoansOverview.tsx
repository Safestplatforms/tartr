// LoansOverview.tsx - Fixed version
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Eye, Loader2 } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";

interface LoansOverviewProps {
  onTabChange?: (tab: string) => void; // Add this prop
}

const LoansOverview = ({ onTabChange }: LoansOverviewProps) => {
  const { 
    aaveBalances, 
    totalSupplied, 
    totalBorrowed, 
    healthFactor, 
    isLoading 
  } = useAaveData();

  // Create positions from real Aave data
  const activePositions = Object.entries(aaveBalances)
    .filter(([symbol, data]) => data.supplyBalance > 0 || data.borrowBalance > 0)
    .map(([symbol, data]) => {
      const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
      const borrowAmountNum = data.borrowBalance * data.price;
      
      return {
        id: symbol,
        collateralAsset: symbol,
        collateralAmount: data.supplyBalance.toFixed(4),
        collateralValue: data.supplyBalance * data.price,
        borrowAmount: borrowAmountNum,
        borrowAmountDisplay: borrowAmountNum.toLocaleString(),
        supplyRate: symbol === 'ETH' ? "2.1%" : symbol === 'WBTC' ? "1.8%" : "3.2%",
        borrowRate: borrowAmountNum > 0 ? "5.2%" : "0%",
        status: "active",
        asset: asset
      };
    });

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 1.5) return <Badge variant="secondary" className="text-green-600 bg-green-50">Healthy</Badge>;
    if (healthFactor >= 1.2) return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Warning</Badge>;
    return <Badge variant="destructive">At Risk</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (activePositions.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
        <p className="text-muted-foreground mb-6">
          Start by supplying collateral or borrowing assets.
        </p>
        <div className="flex gap-4 justify-center">
          {/* Fixed: Use onTabChange instead of Link navigation */}
          <Button 
            variant="outline"
            onClick={() => onTabChange?.('portfolio')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Supply Assets
          </Button>
          <Button
            onClick={() => onTabChange?.('borrow')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Borrow Assets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Aave Positions</h2>
          <p className="text-muted-foreground">Monitor and manage your DeFi positions on Aave Protocol</p>
        </div>
        <Button onClick={() => onTabChange?.('borrow')}>
          <Plus className="w-4 h-4 mr-2" />
          New Position
        </Button>
      </div>

      <div className="grid gap-4">
        {activePositions.map((position) => (
          <Card key={position.id} className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">{position.asset?.icon || position.collateralAsset.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {position.collateralAsset} Position
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Aave Protocol • {position.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  {healthFactor > 0 && getHealthFactorBadge(healthFactor)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Supplied</p>
                  <p className="font-semibold">{position.collateralAmount} {position.collateralAsset}</p>
                  <p className="text-xs text-muted-foreground">${position.collateralValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Borrowed</p>
                  <p className="font-semibold">
                    {position.borrowAmount > 0 ? `$${position.borrowAmountDisplay}` : 'None'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {position.borrowAmount > 0 ? `${position.borrowRate} APY` : 'No debt'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Supply APY</p>
                  <p className="font-semibold text-green-600">{position.supplyRate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Net APY</p>
                  <p className="font-semibold text-blue-600">
                    {position.borrowAmount > 0 ? '−5.3%' : position.supplyRate}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  Supply More
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Withdraw
                </Button>
                {position.borrowAmount > 0 ? (
                  <Button variant="outline" size="sm" className="flex-1">
                    Repay
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1">
                    Borrow
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoansOverview;