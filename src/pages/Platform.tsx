
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, TrendingUp, PieChart, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import BorrowTab from "@/components/platform/BorrowTab";
import MarketsTab from "@/components/platform/MarketsTab";
import PortfolioTab from "@/components/platform/PortfolioTab";

const Platform = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    // This would typically open a wallet connection modal
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-foreground">tartr</span>
              <Badge variant="secondary">Platform</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isWalletConnected ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">0x1234...5678</span>
              </div>
            ) : (
              <Button onClick={handleConnectWallet} className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isWalletConnected ? (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-6">
              To access the tartr platform and start borrowing against your crypto assets, please connect your wallet.
            </p>
            <Button onClick={handleConnectWallet} size="lg">
              Connect Wallet to Continue
            </Button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to tartr Platform</h1>
              <p className="text-muted-foreground">
                Manage your crypto lending, borrowing, and portfolio all in one place.
              </p>
            </div>

            <Tabs defaultValue="borrow" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="borrow" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Borrow</span>
                </TabsTrigger>
                <TabsTrigger value="markets" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Markets</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4" />
                  <span>Portfolio</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="borrow" className="mt-6">
                <BorrowTab />
              </TabsContent>
              
              <TabsContent value="markets" className="mt-6">
                <MarketsTab />
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-6">
                <PortfolioTab />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default Platform;
