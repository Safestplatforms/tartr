
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const LoansOverview = () => {
  const activeLoans = [
    {
      id: "TL-ABC123DEF",
      collateralAsset: "BTC",
      collateralAmount: "1.5",
      collateralValue: 45000,
      borrowAsset: "USDC",
      borrowAmount: "25000",
      healthFactor: 1.85,
      apy: "7.2%",
      status: "healthy",
      nextPayment: "2024-09-06",
      paymentAmount: 2250.50
    },
    {
      id: "TL-DEF456GHI", 
      collateralAsset: "ETH",
      collateralAmount: "10.2",
      collateralValue: 28560,
      borrowAsset: "USDC",
      borrowAmount: "18000",
      healthFactor: 1.62,
      apy: "6.8%",
      status: "healthy",
      nextPayment: "2024-09-12",
      paymentAmount: 1530.00
    }
  ];

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 1.5) return "text-green-600";
    if (healthFactor >= 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthFactorBadge = (status: string) => {
    return <Badge variant="secondary" className="text-green-600 bg-green-50">Healthy</Badge>;
  };

  if (activeLoans.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Active Loans</h3>
        <p className="text-muted-foreground mb-6">
          You don't have any active loans yet. Start by creating your first loan.
        </p>
        <Button>Create New Loan</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Active Loans</h2>
          <p className="text-muted-foreground">Monitor and manage your borrowing positions</p>
        </div>
        <Button>Create New Loan</Button>
      </div>

      <div className="grid gap-4">
        {activeLoans.map((loan) => (
          <Card key={loan.id} className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold">
                    {loan.collateralAsset} → {loan.borrowAsset}
                  </div>
                  {getHealthFactorBadge(loan.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/platform/loan/${loan.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Loan Amount</p>
                  <p className="font-semibold">${parseFloat(loan.borrowAmount).toLocaleString()} {loan.borrowAsset}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Collateral</p>
                  <p className="font-semibold">{loan.collateralAmount} {loan.collateralAsset}</p>
                  <p className="text-xs text-muted-foreground">${loan.collateralValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Health Factor</p>
                  <p className={`font-semibold ${getHealthFactorColor(loan.healthFactor)}`}>
                    {loan.healthFactor}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Interest Rate</p>
                  <p className="font-semibold">{loan.apy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Next Payment</p>
                  <p className="font-semibold">${loan.paymentAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{loan.nextPayment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${activeLoans.reduce((sum, loan) => sum + parseFloat(loan.borrowAmount), 0).toLocaleString()} USDC
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collateral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${activeLoans.reduce((sum, loan) => sum + loan.collateralValue, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getHealthFactorColor(1.73)}`}>
              1.73
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <AlertTriangle className="w-3 h-3 text-green-600" />
              <span className="text-green-600">Healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoansOverview;
