
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import CollateralStep from "@/components/platform/CollateralStep";
import LoanTermsStep from "@/components/platform/LoanTermsStep";
import ReviewStep from "@/components/platform/ReviewStep";

const LoanApplication = () => {
  const [searchParams] = useSearchParams();
  const loanAmount = searchParams.get('amount') || '10000';
  const planName = searchParams.get('plan') || 'Growth';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    loanAmount: parseInt(loanAmount),
    planName,
    collateral: {
      asset: '',
      amount: 0,
      value: 0
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
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">0x1234...5678</span>
          </div>
        </div>
      </header>

      {/* Progress Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">
                ${parseInt(loanAmount).toLocaleString()} {planName} Loan Application
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
        </div>
      </main>
    </div>
  );
};

export default LoanApplication;
