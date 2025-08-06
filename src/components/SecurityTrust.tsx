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
    <section id="security" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Security & Trust
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your security is our priority. Built with industry-leading security practices.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/50 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Trusted by leading organizations</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold">CertiK</div>
            <div className="text-2xl font-bold">OpenZeppelin</div>
            <div className="text-2xl font-bold">Nexus Mutual</div>
            <div className="text-2xl font-bold">Chainlink</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;