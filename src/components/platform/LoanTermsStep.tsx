
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

interface LoanTermsStepProps {
  applicationData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LoanTermsStep = ({ applicationData, onUpdate, onNext, onPrev }: LoanTermsStepProps) => {
  const [loanDuration, setLoanDuration] = useState([12]);
  
  const getAPRForDuration = (months: number) => {
    if (months <= 6) return '8.5%';
    if (months <= 12) return '7.2%';
    if (months <= 18) return '6.8%';
    return '5.5%';
  };

  const apr = getAPRForDuration(loanDuration[0]);
  const monthlyPayment = (applicationData.loanAmount * (parseFloat(apr) / 100 / 12) * Math.pow(1 + parseFloat(apr) / 100 / 12, loanDuration[0])) / (Math.pow(1 + parseFloat(apr) / 100 / 12, loanDuration[0]) - 1);
  const totalPayment = monthlyPayment * loanDuration[0];
  const totalInterest = totalPayment - applicationData.loanAmount;

  const liquidationPrice = applicationData.loanAmount / (applicationData.collateral.amount * 1.15); // 115% liquidation threshold

  const handleDurationChange = (value: number[]) => {
    setLoanDuration(value);
    onUpdate({
      terms: {
        duration: value[0],
        apr: getAPRForDuration(value[0])
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Configure Your Loan Terms</h2>
        <p className="text-muted-foreground">
          Customize your loan duration and review the terms before proceeding
        </p>
      </div>

      {/* Loan Duration Slider */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {loanDuration[0]} months
            </div>
            <div className="text-muted-foreground">Loan term</div>
          </div>
          
          <div className="px-4">
            <Slider
              value={loanDuration}
              onValueChange={handleDurationChange}
              max={36}
              min={3}
              step={3}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>3 months</span>
              <span>36 months</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Loan Summary
            <Badge variant="secondary">{apr} APR</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-semibold">${applicationData.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">${monthlyPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-semibold">${totalInterest.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collateral</span>
                <span className="font-semibold">
                  {applicationData.collateral.amount.toFixed(4)} {applicationData.collateral.asset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collateral Value</span>
                <span className="font-semibold">${applicationData.collateral.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Repayment</span>
                <span className="font-semibold">${totalPayment.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Information */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Risk Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium">Liquidation Price</div>
                <div className="text-orange-700">${liquidationPrice.toFixed(2)} per {applicationData.collateral.asset}</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium">Liquidation Threshold</div>
                <div className="text-orange-700">115% collateral ratio</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium">Current Health</div>
                <div className="text-green-600 font-medium">Safe (140% ratio)</div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-orange-700">
            Your collateral will be automatically liquidated if its value falls below 115% of your loan amount. 
            Monitor market conditions and consider adding more collateral if needed.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Collateral
        </Button>
        <Button onClick={onNext} size="lg">
          Review & Submit
        </Button>
      </div>
    </div>
  );
};

export default LoanTermsStep;
