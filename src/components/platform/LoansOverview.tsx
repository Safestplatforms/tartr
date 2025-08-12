import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, AlertTriangle, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";

const LoansOverview = () => {
  const { 
    aaveBalances, 
    totalSupplied, 
    totalBorrowed, 
    healthFactor, 
    isLoading 
  } = useAaveData();

  const { repayState, withdrawState } = useAaveTransactions();

  // Helper function to get health factor color
  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 1.5) return 'text-green-600';
    if (healthFactor >= 1.2) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get health factor badge
  const getHealthFactorBadge = (healthFactor: number) => {
    const status = healthFactor >= 1.5 ? 'Healthy' : healthFactor >= 1.2 ? 'Warning' : 'At Risk';
    const colorClass = getHealthFactorColor(healthFactor);
    
    return (
      <Badge className={`${colorClass} bg-opacity-10`}>
        {status}
      </Badge>
    );
  };

  // Generate active positions from real Aave data
  const activePositions = Object.entries(aaveBalances)
    .filter(([symbol, data]) => data.supplyBalance > 0 || data.borrowBalance > 0)
    .map(([symbol, data], index) => {
      const asset = SUPPORTED_ASSETS[symbol as keyof typeof SUPPORTED_ASSETS];
      // Convert borrowAmount to number for proper comparison
      const borrowAmountNum = Number(data.borrowBalance.toFixed(2));
      
      return {
        id: `aave-${symbol.toLowerCase()}-${index}`,
        collateralAsset: symbol,
        collateralAmount: data.supplyBalance.toFixed(4),
        collateralValue: data.supplyBalance * data.price,
        borrowAsset: "USDC", // For display purposes
        borrowAmount: borrowAmountNum, // This is now a number
        borrowAmountDisplay: data.borrowBalance.toFixed(2), // For display
        borrowValue: data.borrowBalance * data.price,
        healthFactor: healthFactor,
        apy: symbol === 'ETH' ? "3.2%" : symbol === 'WBTC' ? "2.8%" : "8.5%",
        status: "active",
        supplyRate: "2.5%",
        borrowRate: borrowAmountNum > 0 ? "5.2%" : "0%",
        asset: asset
      };
    });

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
          <Link to="/platform?tab=portfolio">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Supply Assets
            </Button>
          </Link>
          <Link to="/platform?tab=borrow">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Borrow Assets
            </Button>
          </Link>
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
        <Link to="/platform?tab=borrow">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Position
          </Button>
        </Link>
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

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Supplied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalSupplied.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Earning yield on Aave</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              ${totalBorrowed.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Outstanding debt</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getHealthFactorColor(healthFactor)}`}>
              {healthFactor > 0 ? healthFactor.toFixed(2) : '∞'}
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <AlertTriangle className={`w-3 h-3 ${
                healthFactor >= 1.5 ? 'text-green-600' : healthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <span className={healthFactor >= 1.5 ? 'text-green-600' : healthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'}>
                {healthFactor >= 1.5 ? 'Healthy' : healthFactor >= 1.2 ? 'Warning' : 'At Risk'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoansOverview;