import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import LoanSlider from "@/components/platform/LoanSlider";
import LoansOverview from "@/components/platform/LoansOverview";
import PortfolioTab from "@/components/platform/PortfolioTab";
import { PlatformSidebar } from "@/components/platform/PlatformSidebar";

const Platform = () => {
  const [activeTab, setActiveTab] = useState("loans");
  const { primaryWallet } = useDynamicContext();
  
  const isWalletConnected = !!primaryWallet;

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
            <DynamicWidget />
          </div>
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
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">
                  {activeTab === "loans" && "My Loans"}
                  {activeTab === "borrow" && "New Loan"}
                  {activeTab === "portfolio" && "Portfolio"}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <DynamicWidget />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Platform;