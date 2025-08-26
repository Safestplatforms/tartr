import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import CollateralStep from "@/components/platform/CollateralStep";
import LoanTermsStep from "@/components/platform/LoanTermsStep";
import ReviewStep from "@/components/platform/ReviewStep";

const LoanApplication = () => {
  const [searchParams] = useSearchParams();
  const loanAmount = searchParams.get('amount') || '1000';
  const selectedAsset = searchParams.get('asset') || 'USDC';  // Extract asset from URL
  const planName = searchParams.get('plan') || 'Standard';
  
  // Thirdweb wallet connection
  const account = useActiveAccount();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    loanAmount: parseInt(loanAmount),
    asset: selectedAsset,  // Add asset to application data
    planName,
    collateral: {
      asset: '',
      amount: 0,
      value: 0,
      sufficient: false
    },
    terms: {
      duration: 12,
      apr: '7.2%'
    }
  });

  const steps = [
    { id: 1, name: 'Collateral', description: 'Select and deposit collateral' },
    { id: 2, name: 'Terms', description: 'Review loan terms' },
    { id: 3, name: 'Review', description: 'Final review and submit' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateApplicationData = (data: Partial<typeof applicationData>) => {
    setApplicationData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/platform" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Platform</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-foreground">tartr</span>
              <Badge variant="secondary">Loan Application</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Wallet Connection Status & Widget */}
            <div className="flex items-center space-x-3">
              {account ? (
                <>
                <ConnectButton 
                    client={client}
                    wallets={wallets}
                    theme="dark"
                    connectButton={{
                      label: "Switch Wallet",
                      style: {
                        fontSize: "14px",
                        height: "36px",
                        minWidth: "120px"
                      }
                    }}
                    
                  />
                </>
              ) : (
                <>
              <ConnectButton 
                    client={client}
                    wallets={wallets}
                    theme="dark"
                    connectButton={{
                      label: "Connect Wallet",
                      style: {
                        fontSize: "14px",
                        height: "36px",
                        minWidth: "140px",
                        backgroundColor: "#3b82f6",
                        color: "white"
                      }
                    }}
                    
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">
                ${parseInt(loanAmount).toLocaleString()} {selectedAsset} Loan Application
              </h1>
              <p className="text-muted-foreground">
                Complete your application in {steps.length} simple steps
              </p>
            </div>

            <div className="mb-6">
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.id}
                    </div>
                    <div className="text-center mt-2">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Wallet Connection Check */}
          {!account ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-8 h-8 text-orange-600 transform rotate-45" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wallet Connection Required</h3>
                <p className="text-muted-foreground mb-6">
                  To continue with your loan application, please connect your wallet using the "Connect Wallet" button above.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Your wallet is needed to:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Supply collateral to secure your loan</li>
                    <li>• Execute the borrow transaction</li>
                    <li>• Receive your loan funds</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <CollateralStep 
                  applicationData={applicationData}
                  onUpdate={updateApplicationData}
                  onNext={nextStep}
                />
              )}
              
              {currentStep === 2 && (
                <LoanTermsStep 
                  applicationData={applicationData}
                  onUpdate={updateApplicationData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {currentStep === 3 && (
                <ReviewStep 
                  applicationData={applicationData}
                  onPrev={prevStep}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LoanApplication;