
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Wallet,
  Calendar,
  DollarSign,
  Info
} from "lucide-react";

const LoanDetails = () => {
  const { loanId } = useParams();

  // Mock loan data - in a real app, this would come from an API
  const loanData = {
    id: loanId || "TL-ABC123DEF",
    amount: 25000,
    asset: "USDC",
    collateral: {
      asset: "ETH",
      amount: 12.5,
      value: 35000
    },
    apr: "7.2%",
    duration: 12,
    healthFactor: 1.68,
    status: "Active",
    nextPayment: {
      amount: 2250.50,
      dueDate: "2024-09-06"
    },
    totalRepaid: 4501.00,
    remainingBalance: 22750,
    liquidationPrice: 2173.91,
    currentCollateralPrice: 2800,
    startDate: "2024-07-06",
    maturityDate: "2025-07-06"
  };

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 1.5) return "text-green-600";
    if (healthFactor >= 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 1.5) return <Badge className="bg-green-100 text-green-700 border-green-200">Healthy</Badge>;
    if (healthFactor >= 1.2) return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Warning</Badge>;
    return <Badge variant="destructive">At Risk</Badge>;
  };

  const repaymentProgress = ((loanData.amount - loanData.remainingBalance) / loanData.amount) * 100;
  const collateralBuffer = ((loanData.collateral.value / loanData.remainingBalance) - 1) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/platform">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Loan Details</h1>
              <p className="text-muted-foreground">Loan ID: {loanData.id}</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200 text-lg px-3 py-1">
            {loanData.status}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Loan Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Original Amount</p>
                      <p className="text-2xl font-bold">${loanData.amount.toLocaleString()} {loanData.asset}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining Balance</p>
                      <p className="text-xl font-semibold text-primary">${loanData.remainingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-medium">{loanData.apr} APR</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Term</p>
                      <p className="text-lg font-medium">{loanData.duration} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="text-lg font-medium">{loanData.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Maturity Date</p>
                      <p className="text-lg font-medium">{loanData.maturityDate}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Repayment Progress</span>
                    <span className="text-sm font-medium">{repaymentProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={repaymentProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Collateral Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Collateral Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Collateral Asset</p>
                    <p className="text-xl font-semibold">{loanData.collateral.amount} {loanData.collateral.asset}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                    <p className="text-xl font-semibold">${loanData.collateral.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-xl font-semibold">${loanData.currentCollateralPrice}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Collateral Buffer</span>
                    <span className="text-sm font-medium text-green-600">+{collateralBuffer.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your collateral is worth {collateralBuffer.toFixed(1)}% more than the minimum required
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Next Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${loanData.nextPayment.amount}</p>
                    <p className="text-muted-foreground">Due on {loanData.nextPayment.dueDate}</p>
                  </div>
                  <Button size="lg">
                    Make Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Factor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Health Factor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getHealthFactorColor(loanData.healthFactor)}`}>
                  {loanData.healthFactor}
                </div>
                {getHealthFactorBadge(loanData.healthFactor)}
                <p className="text-sm text-muted-foreground mt-3">
                  Your loan is in good health. Keep monitoring market conditions.
                </p>
              </CardContent>
            </Card>

            {/* Risk Information */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Risk Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Liquidation Price</span>
                    <span className="font-semibold text-red-600">${loanData.liquidationPrice}</span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">
                    If {loanData.collateral.asset} falls below this price, liquidation may occur
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price Cushion</span>
                    <span className="font-semibold text-green-600">
                      ${(loanData.currentCollateralPrice - loanData.liquidationPrice).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {loanData.collateral.asset} can drop this much before liquidation risk
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Add Collateral
                </Button>
                <Button className="w-full" variant="outline">
                  Partial Repayment
                </Button>
                <Button className="w-full" variant="outline">
                  Download Statement
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Need Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Have questions about your loan? Our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
