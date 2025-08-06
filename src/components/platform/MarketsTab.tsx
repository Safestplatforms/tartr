
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const MarketsTab = () => {
  const marketData = [
    {
      asset: "BTC",
      name: "Bitcoin",
      price: "$98,450",
      change: "+2.5%",
      isPositive: true,
      borrowApy: "0%",
      supplyApy: "4.2%",
      totalBorrowed: "$2.4M",
      totalSupplied: "$8.1M"
    },
    {
      asset: "ETH",
      name: "Ethereum", 
      price: "$3,420",
      change: "-1.2%",
      isPositive: false,
      borrowApy: "0%",
      supplyApy: "3.8%",
      totalBorrowed: "$1.8M",
      totalSupplied: "$6.3M"
    },
    {
      asset: "USDC",
      name: "USD Coin",
      price: "$1.00",
      change: "+0.1%",
      isPositive: true,
      borrowApy: "8.5%",
      supplyApy: "6.2%",
      totalBorrowed: "$4.2M",
      totalSupplied: "$5.8M"
    },
    {
      asset: "USDT",
      name: "Tether",
      price: "$1.00",
      change: "0.0%",
      isPositive: true,
      borrowApy: "8.2%",
      supplyApy: "5.9%",
      totalBorrowed: "$3.6M",
      totalSupplied: "$5.1M"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>
            Current lending and borrowing rates across all supported assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.map((market) => (
              <div key={market.asset} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">{market.asset.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{market.asset}</h3>
                    <p className="text-sm text-muted-foreground">{market.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{market.price}</p>
                    <div className={`flex items-center space-x-1 ${market.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{market.change}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-muted-foreground">Supply APY</p>
                    <p className="font-medium text-green-600">{market.supplyApy}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-muted-foreground">Borrow APY</p>
                    <p className="font-medium text-blue-600">{market.borrowApy}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-muted-foreground">Total Supplied</p>
                    <p className="font-medium">{market.totalSupplied}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-muted-foreground">Total Borrowed</p>
                    <p className="font-medium">{market.totalBorrowed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketsTab;
