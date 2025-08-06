
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";
import LoanSlider from "@/components/platform/LoanSlider";
import LoansOverview from "@/components/platform/LoansOverview";
import PortfolioTab from "@/components/platform/PortfolioTab";
import { PlatformSidebar } from "@/components/platform/PlatformSidebar";

const Platform = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("loans");

  const handleConnectWallet = () => {
    // This would typically open a wallet connection modal
    setIsWalletConnected(true);
  };

  const renderContent = () => {
    if (!isWalletConnected) {
      return (
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
      );
    }

    switch (activeTab) {
      case "loans":
        return <LoansOverview />;
      case "borrow":
        return <LoanSlider />;
      case "portfolio":
        return <PortfolioTab />;
      default:
        return <LoansOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PlatformSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isWalletConnected={isWalletConnected}
        />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="border-b border-border bg-background">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
                <SidebarTrigger />
                <h1 className="text-base md:text-lg font-semibold truncate">
                  {activeTab === "loans" && "My Loans"}
                  {activeTab === "borrow" && "New Loan"}
                  {activeTab === "portfolio" && "Portfolio"}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                {isWalletConnected ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs md:text-sm text-muted-foreground hidden sm:block">0x1234...5678</span>
                  </div>
                ) : (
                  <Button onClick={handleConnectWallet} size="sm" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                    <Wallet className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Platform;
