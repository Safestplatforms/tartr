import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Shield, DollarSign, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { toast } from "sonner";

interface ReviewStepProps {
  applicationData: any;
  onPrev: () => void;
}

const ReviewStep = ({ applicationData, onPrev }: ReviewStepProps) => {
  const navigate = useNavigate();
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { 
    totalSupplied, 
    maxBorrowable, 
    healthFactor, 
    isLoading: dataLoading 
  } = useAaveData();
  
  const { borrow, borrowState } = useAaveTransactions();

  // Extract loan details
  const loanAmount = applicationData.loanAmount;
  const borrowAsset = applicationData.asset || applicationData.selectedAsset || 'USDC';
  const collateral = applicationData.collateral;
  const terms = applicationData.terms;

  // Validation checks
  const hasCollateral = totalSupplied >= (loanAmount * 1.4); // 140% collateral ratio
  const canBorrow = loanAmount > 0 && loanAmount <= maxBorrowable;
  const healthFactorSafe = healthFactor > 1.2 || healthFactor === 0; // 0 means infinite (no debt)

  // Calculate loan details
  const monthlyInterestRate = (parseFloat(terms.apr.replace('%', '')) / 100) / 12;
  const monthlyPayment = loanAmount > 0 ? 
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, terms.duration)) / 
    (Math.pow(1 + monthlyInterestRate, terms.duration) - 1) : 0;
  
  const totalPayment = monthlyPayment * terms.duration;
  const totalInterest = totalPayment - loanAmount;

  // Handle actual borrow transaction
  const handleSubmit = async () => {
    if (!hasCollateral) {
      toast.error('Insufficient collateral for this loan amount');
      return;
    }

    if (!canBorrow) {
      toast.error('Cannot borrow this amount. Please check your borrowing capacity.');
      return;
    }

    if (!healthFactorSafe) {
      toast.error('Health factor too low. Add more collateral before borrowing.');
      return;
    }

    setIsExecuting(true);

    try {
      console.log('Executing borrow transaction:', {
        asset: borrowAsset,
        amount: loanAmount,
        collateral: totalSupplied,
        healthFactor: healthFactor
      });

      // Execute the actual borrow transaction
      await borrow(borrowAsset, loanAmount);

    } catch (error) {
      console.error('Borrow transaction failed:', error);
      toast.error('Transaction failed. Please try again.');
      setIsExecuting(false);
    }
  };

  // Monitor borrow state changes
  useEffect(() => {
    if (borrowState.txHash && !borrowState.isLoading) {
      // Transaction successful
      console.log('Borrow transaction successful:', borrowState.txHash);
      toast.success('Loan approved and funds transferred!', {
        description: `${loanAmount} ${borrowAsset} has been sent to your wallet.`,
        action: {
          label: "View Transaction",
          onClick: () => window.open(`https://etherscan.io/tx/${borrowState.txHash}`, '_blank'),
        },
      });

      // Redirect to success page after short delay
      setTimeout(() => {
        navigate(`/platform/success?amount=${loanAmount}&asset=${borrowAsset}&txHash=${borrowState.txHash}`);
      }, 2000);
    } else if (borrowState.error && !borrowState.isLoading) {
      console.error('Borrow error:', borrowState.error);
      toast.error(`Transaction failed: ${borrowState.error}`);
      setIsExecuting(false);
    }
  }, [borrowState.txHash, borrowState.error, borrowState.isLoading, loanAmount, borrowAsset, navigate]);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading loan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Your Loan</h2>
        <p className="text-muted-foreground">
          Please review all details before confirming your loan transaction
        </p>
      </div>

      {/* Pre-transaction Checks */}
      {!hasCollateral || !canBorrow || !healthFactorSafe ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Cannot Proceed</div>
                <div className="text-sm text-red-600">
                  {!hasCollateral && "Insufficient collateral. "}
                  {!canBorrow && "Loan amount exceeds borrowing capacity. "}
                  {!healthFactorSafe && "Health factor too low. "}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Ready to Proceed</div>
                <div className="text-sm text-green-600">
                  All requirements met. Your loan will be processed immediately.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Loan Details
            <Badge className="bg-primary text-primary-foreground">
              {applicationData.planName || 'Standard'} Loan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-semibold">${loanAmount.toLocaleString()} {borrowAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="font-semibold">{terms.apr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Term</span>
                <span className="font-semibold">{terms.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">${monthlyPayment.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-semibold">${totalInterest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Repayment</span>
                <span className="font-semibold">${totalPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Collateral</span>
                <span className="font-semibold">${totalSupplied.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Health Factor</span>
                <span className={`font-semibold ${
                  healthFactor >= 1.5 ? 'text-green-600' : 
                  healthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {healthFactor > 100 ? '∞' : healthFactor.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      {(borrowState.isLoading || isExecuting) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">Processing Loan Transaction</div>
                <div className="text-sm text-blue-600">
                  {borrowState.step || 'Preparing to borrow funds...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Error */}
      {borrowState.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Transaction Failed</div>
                <div className="text-sm text-red-600">{borrowState.error}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {borrowState.txHash && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Transaction Successful!</div>
                  <div className="text-sm text-green-600">
                    {loanAmount} {borrowAsset} has been sent to your wallet.
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://etherscan.io/tx/${borrowState.txHash}`, '_blank')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Transaction
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Variable interest rate</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Secured by your collateral</span>
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
          <p>• Liquidation may occur if collateral value falls below 110% of loan amount</p>
          <p>• Interest accrues continuously based on current market rates</p>
          <p>• You can repay your loan at any time without penalties</p>
          <p>• All transactions are recorded on the Ethereum blockchain</p>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="bg-muted/30 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">Ready to Get Your Loan?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          By confirming this transaction, you agree to borrow {loanAmount} {borrowAsset} against your collateral. 
          The funds will be sent to your wallet immediately upon confirmation.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onPrev}
            disabled={isExecuting || borrowState.isLoading}
          >
            Back to Terms
          </Button>
          <Button 
            onClick={handleSubmit} 
            size="lg" 
            className="px-8"
            disabled={!hasCollateral || !canBorrow || !healthFactorSafe || isExecuting || borrowState.isLoading}
          >
            {isExecuting || borrowState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Loan...
              </>
            ) : borrowState.txHash ? (
              'Loan Completed!'
            ) : (
              `Confirm & Get ${loanAmount} ${borrowAsset}`
            )}
          </Button>
        </div>

        {(!hasCollateral || !canBorrow || !healthFactorSafe) && (
          <p className="text-xs text-red-600 mt-3">
            Cannot proceed: Please resolve the issues shown above before confirming your loan.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;