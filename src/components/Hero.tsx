import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import GeometricBackground from "./GeometricBackground";

const Hero = () => {
  const navigate = useNavigate();
  const account = useActiveAccount();

  // Redirect to platform when wallet connects
  useEffect(() => {
    if (account) {
      navigate('/platform');
    }
  }, [account, navigate]);

  return (
    <section className="relative min-h-screen flex items-center py-12 px-4 bg-gradient-to-b from-background to-background/50 overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto text-center relative z-10 w-full">
        <div className="max-w-5xl mx-auto">
          {/* Main headline - Better responsive typography */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in leading-tight">
            Unlock Your Crypto's
            <span className="text-primary block mt-2">Potential</span>
          </h1>
          
          {/* Subtitle - Better line height and spacing */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground md:mt-16 mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in [animation-delay:200ms] leading-relaxed px-4">
            Deposit BTC & ETH as collateral to borrow USDC & USDT. 
            Simple, secure, and instant crypto lending platform.
          </p>
          
          {/* CTA Buttons - Better mobile layout */}
          <div className="flex md:flex-row flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 animate-fade-in [animation-delay:400ms] px-4">
            <ConnectButton
              client={client}
              wallets={wallets}
              connectModal={{ 
                size: "compact",
                title: "Get Started with tartr"
              }}
              connectButton={{
                label: "Start now",
                style: {
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  borderRadius: "6px",
                  padding: "12px 32px",
                  fontSize: "18px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }
              }}
            />
            <Link to="/contact-sales">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg hover-scale">
                Contact Sales
              </Button>
            </Link>
          </div>

          {/* Feature highlights - Improved responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto animate-fade-in [animation-delay:600ms] px-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">Instant Loans</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Get USDC/USDT loans in seconds</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">Secure & Safe</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Your crypto is protected by smart contracts</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">Competitive Rates</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Low interest rates and flexible terms</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;