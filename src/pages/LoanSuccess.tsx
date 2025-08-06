import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

const LoanSuccess = () => {
  const [searchParams] = useSearchParams();
  const loanAmount = searchParams.get('amount') || '10000';
  const planName = searchParams.get('plan') || 'Growth';
  
  // Generate a mock loan ID for the details page
  const loanId = `TL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  useEffect(() => {
    // Create confetti effect
    const createConfetti = () => {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const confettiCount = 50;

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}vw;
          animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
          z-index: 1000;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
    };

    // Add confetti animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);

    createConfetti();
    
    // Clean up
    return () => {
      style.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center animate-scale-in">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Loan Approved! 🎉
            </h1>
            <p className="text-muted-foreground">
              Your loan application has been successfully submitted and approved
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Badge className="bg-primary text-primary-foreground">
                {planName} Plan
              </Badge>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              ${parseInt(loanAmount).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Will be deposited within 24 hours
            </div>
          </div>

          <div className="space-y-3 mb-6 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Application ID</span>
              <span className="font-medium">TL-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time</span>
              <span className="font-medium">0-24 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-green-600">Approved ✓</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/platform">
              <Button className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Return to Platform
              </Button>
            </Link>
            <Link to={`/platform/loan/${loanId}`}>
              <Button variant="outline" className="w-full" size="sm">
                View Loan Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            You'll receive an email confirmation shortly with all the details
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanSuccess;
