import { Activity, Globe, Zap, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FinanceUnlocked = () => {
  const features = [
    {
      icon: Activity,
      title: "Health Factor",
      description: "Real-time monitoring of your loan health with smart alerts to prevent liquidation risks."
    },
    {
      icon: Globe,
      title: "Multi-Network",
      description: "Support for Bitcoin, Ethereum, and other major blockchain networks in one platform."
    },
    {
      icon: Zap,
      title: "Instant Liquidity",
      description: "Access funds immediately without waiting periods or complex approval processes."
    },
    {
      icon: UserCheck,
      title: "No Credit Checks",
      description: "Your crypto is your credit. No traditional credit history or income verification required."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            Finance <span className="text-primary">Unlocked</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of decentralized finance with advanced features designed for modern crypto users
          </p>
        </div>

        {/* Improved responsive grid - better mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover-scale border-muted/50 hover:border-primary/20 transition-all duration-300 group h-full"
            >
              <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col">
                {/* Icon container - responsive sizing */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <feature.icon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-primary" />
                </div>
                
                {/* Title - responsive typography */}
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                  {feature.title}
                </h3>
                
                {/* Description - responsive text and flexible height */}
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional call to action for mobile */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join the next generation of DeFi users who are unlocking the full potential of their crypto assets
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinanceUnlocked;