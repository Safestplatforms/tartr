import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Zap, Globe } from "lucide-react";

const TartrVisaSection = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Instant Spending",
      description: "Use your crypto collateral to spend anywhere Visa is accepted"
    }, 
    {
      icon: Shield,
      title: "Secure & Protected", 
      description: "Advanced security features and fraud protection built-in"
    }, 
    {
      icon: Zap,
      title: "Real-time Conversion",
      description: "Automatic conversion from your collateral at competitive rates"
    }, 
    {
      icon: Globe,
      title: "Global Acceptance",
      description: "Accepted at millions of merchants worldwide"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content side - comes first on mobile */}
            <div className="order-2 lg:order-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
                Spend Your Crypto
                <span className="block text-primary mt-2">Anywhere with tartr Visa</span>
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Get instant access to a Visa debit card backed by your crypto collateral. 
                Spend at millions of merchants worldwide while keeping your crypto working for you.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button size="lg" className="text-lg px-8 py-4 h-auto">
                  Apply for Card
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  Learn More
                </Button>
              </div>

              {/* Features grid - compact for better mobile experience */}
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card visual side - original design with responsive sizing */}
            <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <div 
                  className="w-full bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 sm:p-6 lg:p-8 text-primary-foreground shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between"
                  style={{ aspectRatio: '1.6' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">tartr</h3>
                      <p className="text-primary-foreground/80 text-xs sm:text-sm lg:text-base">tartr world black edition</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm sm:text-base lg:text-lg opacity-80 font-semibold">VISA</div>
                    </div>
                  </div>
                  
                  <div className="my-2 sm:my-4">
                    <div className="text-sm sm:text-base lg:text-lg tracking-wider font-mono">
                      •••• •••• •••• 1234
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80 mb-1">VALID THRU</p>
                      <p className="text-sm sm:text-base">12/37</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80 mb-1">JOHN SENA</p>
                      <p className="text-sm sm:text-base">John Sena</p>
                    </div>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl -z-10 blur-xl"></div>
              </div>
            </div>
          </div>

          {/* Benefits section */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            <Card className="border border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">No Credit Check</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get approved based on your crypto collateral, not your credit score
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Instant Approval</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get your virtual card instantly and physical card within 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary/20 transition-colors sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Global Access</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Use your card worldwide with competitive foreign exchange rates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TartrVisaSection;