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
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Finance <span className="text-primary">Unlocked</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of decentralized finance with advanced features designed for modern crypto users
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale border-muted/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinanceUnlocked;