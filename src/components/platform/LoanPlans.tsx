
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const LoanPlans = () => {
  const loanPlans = [
    {
      name: "Starter",
      description: "Perfect for first-time borrowers",
      maxLoanAmount: "$5,000",
      apr: "8.5%",
      loanTerm: "6-12 months",
      collateralRatio: "150%",
      features: [
        "Basic collateral support (BTC, ETH)",
        "Standard processing time",
        "Email support",
        "Mobile app access"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Growth",
      description: "For regular crypto borrowers",
      maxLoanAmount: "$25,000",
      apr: "7.2%",
      loanTerm: "6-18 months",
      collateralRatio: "140%",
      features: [
        "Extended collateral support",
        "Priority processing",
        "24/7 chat support",
        "Advanced analytics",
        "Lower liquidation risk"
      ],
      popular: true,
      buttonText: "Choose Growth"
    },
    {
      name: "Professional",
      description: "For serious crypto investors",
      maxLoanAmount: "$100,000",
      apr: "6.8%",
      loanTerm: "12-24 months",
      collateralRatio: "130%",
      features: [
        "All supported cryptocurrencies",
        "Instant processing",
        "Dedicated account manager",
        "Custom loan terms",
        "Institutional-grade security",
        "Tax reporting tools"
      ],
      popular: false,
      buttonText: "Go Professional"
    },
    {
      name: "Enterprise",
      description: "For institutional clients",
      maxLoanAmount: "$1,000,000+",
      apr: "5.5%",
      loanTerm: "12-36 months",
      collateralRatio: "120%",
      features: [
        "Unlimited collateral options",
        "White-glove service",
        "Custom API integration",
        "Regulatory compliance",
        "Multi-signature support",
        "Bulk operations",
        "Custom reporting"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Loan Plan</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select the perfect plan for your crypto lending needs. All plans include our core security features and multi-asset collateral support.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {loanPlans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Most Popular</span>
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{plan.description}</p>
              <div className="mt-4">
                <div className="text-3xl font-bold text-foreground">{plan.maxLoanAmount}</div>
                <div className="text-sm text-muted-foreground">Maximum loan amount</div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">APR from</div>
                  <div className="font-semibold text-lg">{plan.apr}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Loan term</div>
                  <div className="font-semibold">{plan.loanTerm}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Min. collateral ratio</div>
                  <div className="font-semibold">{plan.collateralRatio}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Features included:</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-muted-foreground text-sm">
          All plans include: Multi-asset collateral support • Real-time liquidation protection • Insurance coverage up to $250k
        </p>
      </div>
    </div>
  );
};

export default LoanPlans;
