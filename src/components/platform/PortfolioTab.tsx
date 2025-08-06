
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, AlertTriangle } from "lucide-react";

const PortfolioTab = () => {
  const portfolioSummary = {
    totalCollateral: 147500,
    totalBorrowed: 85000,
    netWorth: 62500,
    healthFactor: 1.73
  };

  const activeLoans = [
    {
      id: "1",
      collateralAsset: "BTC",
      collateralAmount: "1.5",
      borrowAsset: "USDC",
      borrowAmount: "50000",
      healthFactor: 1.85,
      apy: "8.5%",
      status: "healthy"
    },
    {
      id: "2", 
      collateralAsset: "ETH",
      collateralAmount: "10.2",
      borrowAsset: "USDT",
      borrowAmount: "35000",
      healthFactor: 1.62,
      apy: "8.2%",
      status: "healthy"
    }
  ];

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 1.5) return "text-green-600";
    if (healthFactor >= 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 1.5) return <Badge variant="secondary" className="text-green-600 bg-green-50">Healthy</Badge>;
    if (healthFactor >= 1.2) return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Warning</Badge>;
    return <Badge variant="destructive">At Risk</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collateral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${portfolioSummary.totalCollateral.toLocaleString()}</p>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+5.2%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${portfolioSummary.totalBorrowed.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">57.6% of collateral</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${portfolioSummary.netWorth.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Available to borrow</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getHealthFactorColor(portfolioSummary.healthFactor)}`}>
              {portfolioSummary.healthFactor}
            </p>
            {getHealthFactorBadge(portfolioSummary.healthFactor)}
          </CardContent>
        </Card>
      </div>

      {/* Active Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>
            Manage your open borrowing positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-semibold">
                      {loan.collateralAsset} → {loan.borrowAsset}
                    </div>
                    {getHealthFactorBadge(loan.healthFactor)}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Repay</Button>
                    <Button variant="outline" size="sm">Add Collateral</Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Collateral</p>
                    <p className="font-medium">{loan.collateralAmount} {loan.collateralAsset}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Borrowed</p>
                    <p className="font-medium">${parseFloat(loan.borrowAmount).toLocaleString()} {loan.borrowAsset}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Health Factor</p>
                    <p className={`font-medium ${getHealthFactorColor(loan.healthFactor)}`}>
                      {loan.healthFactor}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interest Rate</p>
                    <p className="font-medium">{loan.apy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span>Risk Management</span>
          </CardTitle>
          <CardDescription>
            Monitor and manage your portfolio risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Health Factor</span>
              <span className={`font-medium ${getHealthFactorColor(portfolioSummary.healthFactor)}`}>
                {portfolioSummary.healthFactor}
              </span>
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Your health factor indicates the safety of your loans:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Above 1.5: Healthy position</li>
                <li>1.2-1.5: Monitor closely</li>
                <li>Below 1.2: Risk of liquidation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;
