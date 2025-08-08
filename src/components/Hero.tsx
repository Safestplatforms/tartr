import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import GeometricBackground from "./GeometricBackground";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-background to-background/50 overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Unlock Your Crypto's
            <span className="text-primary block">Potential</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            Deposit BTC & ETH as collateral to borrow USDC & USDT. 
            Simple, secure, and instant crypto lending platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in [animation-delay:400ms]">
            <Link to="/platform">
              <Button size="lg" className="px-8 py-3 text-lg hover-scale">
                Start now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact-sales">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg hover-scale">
                Contact Sales
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in [animation-delay:600ms]">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Loans</h3>
              <p className="text-sm text-muted-foreground">Get USDC/USDT loans in seconds</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Safe</h3>
              <p className="text-sm text-muted-foreground">Your crypto is protected by smart contracts</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Competitive Rates</h3>
              <p className="text-sm text-muted-foreground">Low interest rates and flexible terms</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
