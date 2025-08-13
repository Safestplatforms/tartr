import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import LoanSlider from "@/components/platform/LoanSlider";
import LoansOverview from "@/components/platform/LoansOverview";
import PortfolioTab from "@/components/platform/PortfolioTab";
import { PlatformSidebar } from "@/components/platform/PlatformSidebar";

const Platform = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("portfolio"); 
  const account = useActiveAccount();
  
  const isWalletConnected = !!account;

  // Read URL query parameter on mount to set initial tab
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['loans', 'borrow', 'portfolio'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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
                  padding: "6px 10px",
                  fontSize: "18px",
                  fontWeight: "500",
                }
              }}
            />
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
      default:
        return <LoansOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-background">
        {/* Layout Container */}
        <div className="flex h-screen">
          {/* Sidebar */}
          <PlatformSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            isWalletConnected={isWalletConnected}
          />
          
          {/* Main Content - No SidebarInset, just proper margin */}
          <div className="flex-1 flex flex-col min-w-0 md:ml-0">
            {/* Header */}
            <header className="border-b border-border bg-background z-10">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-lg font-semibold">
                    {activeTab === "loans" && "My Loans"}
                    {activeTab === "borrow" && "New Loan"}
                    {activeTab === "portfolio" && "Portfolio"}
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4">
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
                        padding: "6px 10px",
                        fontSize: "18px",
                        fontWeight: "500",
                      }
                    }}
                  />
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Platform;