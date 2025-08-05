import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Borrow USDC & USDT
            <span className="block">Against Your Crypto</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Deposit BTC or ETH as collateral and borrow stablecoins instantly. 
            Keep your crypto, access liquidity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Borrow USDC
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              View Rates
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Growth Focused</h3>
              <p className="text-muted-foreground">
                Maximize your capital efficiency with competitive rates
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Audited</h3>
              <p className="text-muted-foreground">
                Built with security-first principles and battle-tested protocols
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant Access</h3>
              <p className="text-muted-foreground">
                Get liquidity in minutes, not days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;