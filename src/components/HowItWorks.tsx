import { ArrowRight, Wallet, DollarSign, RefreshCw } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Deposit Collateral",
      description: "Connect your wallet and deposit BTC or ETH as collateral to secure your loan."
    },
    {
      icon: DollarSign,
      title: "Borrow Instantly",
      description: "Choose your loan amount and receive USDC or USDT instantly to your wallet."
    },
    {
      icon: RefreshCw,
      title: "Repay & Withdraw",
      description: "Repay your loan anytime to unlock your collateral and maintain your credit."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with crypto lending in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 z-10">
                  <ArrowRight className="w-6 h-6 text-primary/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;