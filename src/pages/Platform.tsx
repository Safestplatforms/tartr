import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import LoanSlider from "@/components/platform/LoanSlider";
import LoansOverview from "@/components/platform/LoansOverview";
import PortfolioTab from "@/components/platform/PortfolioTab";
import RatesTab from "@/components/platform/RatesTab";
import { PlatformSidebar } from "@/components/platform/PlatformSidebar";

const Platform = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("portfolio"); 
  const account = useActiveAccount();
  
  const isWalletConnected = !!account;

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['loans', 'borrow', 'portfolio', 'rates'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const renderContent = () => {
    if (!isWalletConnected) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              To access the tartr platform and start borrowing against your crypto assets, please connect your wallet.
            </p>
            <div className="flex justify-center">
              <ConnectButton
                client={client}
                wallets={wallets}
                connectModal={{ size: "compact" }}
                connectButton={{
                  style: {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    fontSize: "16px",
                    fontWeight: "500",
                  }
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "loans":
        return <LoansOverview onTabChange={setActiveTab} />;
      case "borrow":
        return <LoanSlider />;
      case "portfolio":
        return <PortfolioTab />;
      case "rates":
        return <RatesTab />;
      default:
        return <LoansOverview onTabChange={setActiveTab} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "loans":
        return "My Loans";
      case "borrow":
        return "New Loan";
      case "portfolio":
        return "Portfolio";
      case "rates":
        return "Interest Rates";
      default:
        return "Portfolio";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <PlatformSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isWalletConnected={isWalletConnected}
        />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-base md:text-lg font-semibold truncate">
                {getPageTitle()}
              </h1>
              
              <div className="flex items-center">
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  connectModal={{ size: "compact" }}
                  connectButton={{
                    style: {
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      minHeight: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
                  }}
                />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0">
            <div className="min-h-[100vh] flex-1">
              {renderContent()}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Platform;