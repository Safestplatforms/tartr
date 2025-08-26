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
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30" id="borrow">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            Collateral Assets
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Deposit crypto collateral to borrow USDC or USDT
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4 sm:gap-6">
            {collateralAssets.map((asset) => (
              <Card key={asset.symbol} className="border border-border hover:border-primary/20 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground text-xl sm:text-2xl font-bold">
                          {asset.icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl truncate">{asset.name}</CardTitle>
                        <p className="text-muted-foreground text-sm sm:text-base">Collateral • {asset.borrowAssets}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 self-start sm:self-center whitespace-nowrap">
                      {asset.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mobile-first responsive grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    <div className="text-center xs:text-left">
                      <p className="text-sm text-muted-foreground mb-1">Borrow APY</p>
                      <p className="text-lg sm:text-xl font-semibold text-foreground">{asset.borrowApy}</p>
                    </div>
                    <div className="text-center xs:text-left">
                      <p className="text-sm text-muted-foreground mb-1">Available to Borrow</p>
                      <p className="text-lg sm:text-xl font-semibold text-foreground">{asset.availableToBorrow}</p>
                    </div>
                    <div className="text-center xs:text-left">
                      <p className="text-sm text-muted-foreground mb-1">Max LTV</p>
                      <p className="text-lg sm:text-xl font-semibold text-foreground">{asset.ltv}</p>
                    </div>
                    <div className="col-span-1 xs:col-span-2 lg:col-span-1 flex items-end">
                      <Button className="w-full text-sm sm:text-base py-2 sm:py-3 min-h-[44px]">
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