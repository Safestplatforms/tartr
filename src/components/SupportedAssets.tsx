import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SupportedAssets = () => {
  const collateralAssets = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      apy: "0.5%",
      trend: "up",
      ltv: "75%",
      icon: "₿"
    },
    {
      symbol: "ETH", 
      name: "Ethereum",
      apy: "1.2%",
      trend: "up",
      ltv: "80%",
      icon: "Ξ"
    }
  ];

  const borrowAssets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      rate: "8.5%",
      trend: "down",
      available: "$2.5M",
      icon: "$"
    },
    {
      symbol: "USDT",
      name: "Tether USD", 
      rate: "8.8%",
      trend: "up",
      available: "$1.8M",
      icon: "$"
    }
  ];

  return (
    <section id="assets" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Supported Assets
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deposit your crypto and borrow stablecoins with competitive rates
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Collateral Assets */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Collateral Assets
            </h3>
            <div className="space-y-4">
              {collateralAssets.map((asset) => (
                <Card key={asset.symbol} className="border border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{asset.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{asset.symbol}</h4>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg font-bold">{asset.apy}</span>
                          {asset.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">APY</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max LTV</span>
                        <span className="font-medium">{asset.ltv}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Borrow Assets */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Borrow Assets
            </h3>
            <div className="space-y-4">
              {borrowAssets.map((asset) => (
                <Card key={asset.symbol} className="border border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{asset.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{asset.symbol}</h4>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg font-bold">{asset.rate}</span>
                          {asset.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-red-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">{asset.available}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportedAssets;