
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Plus, PieChart, ArrowLeft, Wallet, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWalletBalance } from "@/hooks/useWalletBalance";

interface PlatformSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isWalletConnected: boolean;
}

const menuItems = [
  {
    id: "loans",
    title: "My Loans",
    icon: CreditCard,
  },
  {
    id: "borrow",
    title: "New Loan",
    icon: Plus,
  },
  {
    id: "portfolio",
    title: "Portfolio",
    icon: PieChart,
  },
];

export function PlatformSidebar({ activeTab, onTabChange, isWalletConnected }: PlatformSidebarProps) {
  const { totalValue, maxBorrowable, balances, isLoading } = useWalletBalance();
  return (
    <Sidebar className="w-64 md:w-72">
      <SidebarHeader className="border-b border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-semibold text-foreground">tartr</span>
          <Badge variant="secondary">Platform</Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Wallet Widget */}
        {isWalletConnected && (
          <div className="p-3 md:p-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Wallet</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                    Connected
                  </Badge>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    <div>
                      <div className="text-base md:text-lg font-bold text-primary">
                        ${totalValue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Portfolio Value</div>
                    </div>
                    
                    <div>
                      <div className="text-base md:text-lg font-bold text-green-600">
                        ${maxBorrowable.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Available to Borrow</div>
                    </div>

                    {maxBorrowable === 0 && (
                      <div className="flex items-start space-x-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>Add crypto to start borrowing</span>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      {Object.entries(balances).slice(0, 3).map(([crypto, amount]) => (
                        <div key={crypto} className="flex justify-between text-xs">
                          <span className="font-medium">{crypto}:</span>
                          <span>{amount.toFixed(crypto.includes('USD') ? 0 : 4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    disabled={!isWalletConnected}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isWalletConnected && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                  <Wallet className="w-4 h-4" />
                  <span>Connect wallet to access</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
