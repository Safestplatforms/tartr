import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Shield, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ReviewStepProps {
  applicationData: any;
  onPrev: () => void;
}

const ReviewStep = ({ applicationData, onPrev }: ReviewStepProps) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Simulate loan application submission
    toast.success("Processing your application...", {
      description: "Please wait while we approve your loan.",
    });
    
    // Navigate to success page with loan details
    setTimeout(() => {
      navigate(`/platform/success?amount=${applicationData.loanAmount}&plan=${applicationData.planName}`);
    }, 1500);
  };

  const monthlyPayment = (applicationData.loanAmount * (parseFloat(applicationData.terms.apr) / 100 / 12) * Math.pow(1 + parseFloat(applicationData.terms.apr) / 100 / 12, applicationData.terms.duration)) / (Math.pow(1 + parseFloat(applicationData.terms.apr) / 100 / 12, applicationData.terms.duration) - 1);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Your Application</h2>
        <p className="text-muted-foreground">
          Please review all details before submitting your loan application
        </p>
      </div>

      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Loan Details
            <Badge className="bg-primary text-primary-foreground">
              {applicationData.planName} Plan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-semibold">${applicationData.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">APR</span>
                <span className="font-semibold">{applicationData.terms.apr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">{applicationData.terms.duration} months</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">${monthlyPayment.toFixed(2)}</span>
              </div>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features & Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Multi-asset collateral support</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">24/7 customer support</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Insurance coverage up to $250k</span>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm">No prepayment penalties</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Terms */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-amber-800">Important Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-amber-800">
          <p>• Your collateral will be held in a secure smart contract until loan repayment</p>
          <p>• Liquidation may occur if collateral value falls below 115% of loan amount</p>
          <p>• Interest is calculated daily and compounded monthly</p>
          <p>• Early repayment is allowed without penalties</p>
          <p>• All transactions are recorded on the blockchain for transparency</p>
        </CardContent>
      </Card>

      <Separator />

      {/* Final Agreement */}
      <div className="bg-muted/30 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">Ready to Submit?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          By submitting this application, you agree to our terms of service and privacy policy. 
          Your loan will be processed within 24 hours.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={onPrev}>
            Back to Terms
          </Button>
          <Button onClick={handleSubmit} size="lg" className="px-8">
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
