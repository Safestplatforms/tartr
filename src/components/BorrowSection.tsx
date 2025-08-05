import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BorrowSection = () => {
  const assets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      icon: "₿",
      apy: "4.2%",
      available: "$2.4M",
      ltv: "75%",
      status: "Active"
    },
    {
      name: "Ethereum", 
      symbol: "ETH",
      icon: "Ξ",
      apy: "3.8%",
      available: "$1.8M",
      ltv: "80%",
      status: "Active"
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="borrow">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Available Assets
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose your collateral and start borrowing today
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {assets.map((asset) => (
              <Card key={asset.symbol} className="border border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xl font-bold">
                          {asset.icon}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{asset.name}</CardTitle>
                        <p className="text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {asset.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Borrow APY</p>
                      <p className="text-lg font-semibold text-foreground">{asset.apy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Available</p>
                      <p className="text-lg font-semibold text-foreground">{asset.available}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Max LTV</p>
                      <p className="text-lg font-semibold text-foreground">{asset.ltv}</p>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">
                        Borrow {asset.symbol}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BorrowSection;