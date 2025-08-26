import { Shield, Lock, Eye, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SecurityTrust = () => {
  const features = [
    {
      icon: Shield,
      title: "Smart Contract Audited",
      description: "Our smart contracts have been audited by leading security firms to ensure your funds are protected."
    },
    {
      icon: Lock,
      title: "Non-Custodial",
      description: "You maintain full control of your assets. We never hold your private keys or have access to your funds."
    },
    {
      icon: Eye,
      title: "Transparent & Open",
      description: "All transactions are recorded on-chain. View our protocol metrics and smart contract code anytime."
    },
    {
      icon: Award,
      title: "Insurance Protected",
      description: "Additional protection through leading DeFi insurance protocols covering smart contract risks."
    }
  ];

  const stats = [
    { value: "$50M+", label: "Total Value Locked" },
    { value: "99.9%", label: "Uptime" },
    { value: "0", label: "Security Incidents" },
    { value: "10K+", label: "Active Users" }
  ];

  return (
    <section id="security" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            Security & Trust
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your security is our priority. Built with industry-leading security practices.
          </p>
        </div>

        {/* Security Features - Improved responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/50 hover:border-primary/20 transition-colors group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">{feature.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Stats - Better mobile layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-lg hover:bg-background/50 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators - Improved mobile layout */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Trusted by leading organizations</p>
          
          {/* Responsive partner logos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-3xl mx-auto opacity-60">
            <div className="flex items-center justify-center p-3 sm:p-4">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground">CertiK</div>
            </div>
            <div className="flex items-center justify-center p-3 sm:p-4">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground">OpenZeppelin</div>
            </div>
            <div className="flex items-center justify-center p-3 sm:p-4">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground">Nexus Mutual</div>
            </div>
            <div className="flex items-center justify-center p-3 sm:p-4">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground">Chainlink</div>
            </div>
          </div>

          {/* Additional trust messaging for mobile */}
          <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Our security infrastructure has been battle-tested and approved by the DeFi community's most trusted security partners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;