import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BorrowSection = () => {
  const collateralAssets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      icon: "₿",
      borrowApy: "4.2%",
      availableToBorrow: "$2.4M",
      ltv: "75%",
      status: "Active",
      borrowAssets: "USDC, USDT"
    },
    {
      name: "Ethereum", 
      symbol: "ETH",
      icon: "Ξ",
      borrowApy: "3.8%",
      availableToBorrow: "$1.8M",
      ltv: "80%",
      status: "Active",
      borrowAssets: "USDC, USDT"
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="borrow">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Collateral Assets
          </h2>
          <p className="text-muted-foreground text-lg">
            Deposit crypto collateral to borrow USDC or USDT
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {collateralAssets.map((asset) => (
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
                        <p className="text-muted-foreground">Collateral • {asset.borrowAssets}</p>
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
                      <p className="text-lg font-semibold text-foreground">{asset.borrowApy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Available to Borrow</p>
                      <p className="text-lg font-semibold text-foreground">{asset.availableToBorrow}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Max LTV</p>
                      <p className="text-lg font-semibold text-foreground">{asset.ltv}</p>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">
                        Use as Collateral
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