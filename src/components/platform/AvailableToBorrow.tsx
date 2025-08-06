
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const AvailableToBorrow = () => {
  // Mock data - in a real app, this would come from the user's wallet and loan positions
  const borrowingData = {
    totalCollateralValue: 147500,
    currentBorrowed: 85000,
    maxBorrowable: 110625, // 75% of collateral value
    availableToBorrow: 25625, // maxBorrowable - currentBorrowed
    utilizationRate: 76.9, // (currentBorrowed / maxBorrowable) * 100
    healthFactor: 1.73
  };

  const getUtilizationColor = (rate: number) => {
    if (rate < 60) return "text-green-600";
    if (rate < 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getUtilizationBgColor = (rate: number) => {
    if (rate < 60) return "bg-green-500";
    if (rate < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Main Available to Borrow Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Available to Borrow</span>
            </CardTitle>
            <Badge variant="outline" className="bg-background">
              Health Factor: {borrowingData.healthFactor}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              ${borrowingData.availableToBorrow.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              Maximum additional amount you can borrow
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button size="lg" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Borrow Now</span>
            </Button>
            <Button variant="outline" size="lg">
              Add Collateral
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Borrowing Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Collateral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${borrowingData.totalCollateralValue.toLocaleString()}
            </p>
            <div className="flex items-center space-x-1 text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+5.2% today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Currently Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${borrowingData.currentBorrowed.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Across {2} active loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Max Borrowable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${borrowingData.maxBorrowable.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              75% of collateral value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Borrowing Utilization</span>
            <span className={`text-sm font-medium ${getUtilizationColor(borrowingData.utilizationRate)}`}>
              {borrowingData.utilizationRate.toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={borrowingData.utilizationRate} 
            className="h-3 mb-3"
            style={{
              background: `linear-gradient(to right, ${getUtilizationBgColor(borrowingData.utilizationRate)} ${borrowingData.utilizationRate}%, hsl(var(--muted)) ${borrowingData.utilizationRate}%)`
            }}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Conservative (&lt;60%)</span>
            <span>Moderate (60-80%)</span>
            <span>High Risk (&gt;80%)</span>
          </div>
          
          {borrowingData.utilizationRate > 80 && (
            <div className="flex items-center space-x-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">
                High utilization rate. Consider adding more collateral to reduce liquidation risk.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableToBorrow;
