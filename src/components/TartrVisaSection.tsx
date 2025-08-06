import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Zap, Globe } from "lucide-react";
const TartrVisaSection = () => {
  const features = [{
    icon: CreditCard,
    title: "Instant Spending",
    description: "Use your crypto collateral to spend anywhere Visa is accepted"
  }, {
    icon: Shield,
    title: "Secure & Protected",
    description: "Advanced security features and fraud protection built-in"
  }, {
    icon: Zap,
    title: "Real-time Conversion",
    description: "Automatic conversion from your collateral at competitive rates"
  }, {
    icon: Globe,
    title: "Global Acceptance",
    description: "Accepted at millions of merchants worldwide"
  }];
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Card visual with fixed dimensions */}
            <div className="relative flex justify-center">
              {/* Card container with fixed aspect ratio (credit card proportions) */}
              <div className="relative w-80 h-50" style={{
              aspectRatio: '1.6'
            }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">tartr</h3>
                      <p className="text-primary-foreground/80 text-sm">tartr world black edition</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-80 font-semibold">VISA</div>
                    </div>
                  </div>
                  
                  <div className="my-4">
                    <div className="text-base tracking-wider font-mono">
                      •••• •••• •••• 1234
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80 mb-1">VALID THRU</p>
                      <p className="text-sm">12/37</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 mb-1">JOHN SENA</p>
                      <p className="text-sm">John Sena</p>
                    </div>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl -z-10 blur-xl"></div>
              </div>
            </div>

            {/* Right side - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Spend Your Crypto
                <span className="block">Anywhere with tartr Visa</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get instant access to a Visa debit card backed by your crypto collateral. 
                Spend at millions of merchants worldwide while keeping your crypto working for you.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>)}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Apply for Card
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Credit Check</h3>
                <p className="text-muted-foreground">
                  Get approved based on your crypto collateral, not your credit score
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Instant Approval</h3>
                <p className="text-muted-foreground">
                  Get your virtual card instantly and physical card within 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Global Access</h3>
                <p className="text-muted-foreground">
                  Use your card worldwide with competitive foreign exchange rates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default TartrVisaSection;