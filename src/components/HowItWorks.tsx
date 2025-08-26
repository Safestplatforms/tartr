import { ArrowRight, ArrowDown, Wallet, DollarSign, RefreshCw } from "lucide-react";

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
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get started with crypto lending in three simple steps
          </p>
        </div>

        {/* Responsive step layout */}
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Vertical layout with down arrows */}
          <div className="block md:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center px-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-2">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
                
                {/* Down arrow for mobile - only between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-6 mb-2">
                    <ArrowDown className="w-6 h-6 text-primary/60" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: Horizontal layout with right arrows */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center px-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary text-primary-foreground text-2xl lg:text-3xl font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Right arrow for desktop - only between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 lg:top-10 -right-3 lg:-right-4 z-10">
                    <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 text-primary/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to action - Better mobile layout */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16 px-4">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Ready to get started?
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base min-w-[160px]">
            Start Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;