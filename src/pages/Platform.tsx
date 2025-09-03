import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Menu, Bell, Sun } from "lucide-react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import LoanSlider from "@/components/platform/LoanSlider";
import LoansOverview from "@/components/platform/LoansOverview";
import PortfolioTab from "@/components/platform/PortfolioTab";
import RatesTab from "@/components/platform/RatesTab";
import Dashboard from "@/components/platform/Dashboard";
import TransactionHistory from "@/components/platform/TransactionHistory";
import { PlatformSidebar } from "@/components/platform/PlatformSidebar";
import MobileBottomNav from "@/components/platform/MobileBottomNav";

const Platform = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const account = useActiveAccount();
  
  const isWalletConnected = !!account;

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['loans', 'borrow', 'portfolio', 'rates', 'dashboard', 'transactions', 'send-receive', 'card'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const renderContent = () => {
    if (!isWalletConnected) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
          <div className="max-w-md mx-auto text-center">
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
      case "dashboard":
        return <Dashboard />;
      case "loans":
        return <LoansOverview onTabChange={setActiveTab} />;
      case "borrow":
        return <LoanSlider />;
      case "portfolio":
        return <PortfolioTab />;
      case "rates":
        return <RatesTab />;
      case "transactions":
        return <TransactionHistory />;
      case "send-receive":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Send/Receive</h2>
            <p className="text-muted-foreground">Transfer functionality coming soon...</p>
          </div>
        );
      case "card":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Tartr Visa Card</h2>
            <p className="text-muted-foreground">Card features coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "loans":
        return "My Loans";
      case "borrow":
        return "New Loan";
      case "portfolio":
        return "Portfolio";
      case "rates":
        return "Interest Rates";
      case "transactions":
        return "Transaction History";
      case "send-receive":
        return "Send/Receive";
      case "card":
        return "Tartr Card";
      default:
        return "Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <PlatformSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            isWalletConnected={isWalletConnected}
          />
        </div>
        
        <SidebarInset className="flex-1">
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold text-foreground">Tartr</span>
              </div>
              
              <div className="flex items-center space-x-2">
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
            </div>
          </div>

          {/* Desktop Header */}
          <header className="hidden md:flex sticky top-0 z-30 h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
            <SidebarTrigger className="-ml-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
              
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
          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {renderContent()}
          </div>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isWalletConnected={isWalletConnected}
        />
      </div>
    </SidebarProvider>
  );
};

export default Platform;