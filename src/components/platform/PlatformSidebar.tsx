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
import { 
  CreditCard, 
  Plus, 
  PieChart, 
  ArrowLeft, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  Shield,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAaveData } from "@/hooks/useAaveData";

interface PlatformSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isWalletConnected: boolean;
}

const menuItems = [
  {
    id: "portfolio",
    title: "Portfolio",
    icon: PieChart,
  },
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
    id: "rates",
    title: "Markets",
    icon: BarChart3,
  },
];

export function PlatformSidebar({ activeTab, onTabChange, isWalletConnected }: PlatformSidebarProps) {
  const { 
    totalValue, 
    maxBorrowable, 
    aaveBalances, 
    isLoading, 
    healthFactor, 
    totalSupplied, 
    totalBorrowed 
  } = useAaveData();

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 1.5) return "text-green-600";
    if (hf >= 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthFactorBadge = (hf: number) => {
    if (hf >= 1.5) return { text: "Healthy", color: "border-green-200 text-green-700 bg-green-50" };
    if (hf >= 1.2) return { text: "Warning", color: "border-yellow-200 text-yellow-700 bg-yellow-50" };
    return { text: "At Risk", color: "border-red-200 text-red-700 bg-red-50" };
  };

  const hasActivePositions = totalSupplied > 0 || totalBorrowed > 0;
  const healthBadge = healthFactor > 0 ? getHealthFactorBadge(healthFactor) : null;

  return (
    <Sidebar variant="sidebar" className="border-r">
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
          <span className="text-xl font-semibold text-foreground">Tartr</span>
          <Badge variant="secondary">Platform</Badge>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        {/* Aave Position Widget */}
        {isWalletConnected && (
          <div className="p-3 md:p-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Position</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                    Connected
                  </Badge>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-xs text-muted-foreground mt-2">Loading Tartr data...</div>
                  </div>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    {/* Total Portfolio Value */}
                    <div>
                      <div className="text-base md:text-lg font-bold text-primary">
                        ${totalValue.toFixed(2).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Portfolio Value</div>
                    </div>
                    
                    {/* Available to Borrow */}
                    <div>
                      <div className="text-base md:text-lg font-bold text-green-600">
                        ${maxBorrowable.toFixed(2).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Available to Borrow</div>
                    </div>

                    {/* Aave Positions */}
                    {hasActivePositions ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Supplied:</span>
                          <span className="font-medium text-blue-600">${totalSupplied.toFixed(2)}</span>
                        </div>
                        {totalBorrowed > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Borrowed:</span>
                            <span className="font-medium text-orange-600">${totalBorrowed.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-start space-x-1 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>No active Tartr positions</span>
                      </div>
                    )}

                    {/* Health Factor */}
                    {healthFactor > 0 && healthBadge && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Health:</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`text-xs font-medium ${getHealthFactorColor(healthFactor)}`}>
                            {healthFactor.toFixed(2)}
                          </span>
                          <Badge variant="outline" className={`text-xs ${healthBadge.color}`}>
                            {healthBadge.text}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                      {/* Asset Breakdown - Clean Version */}
                      {Object.keys(aaveBalances).length > 0 && (
                        <div className="space-y-3">
                          {/* Supplied Assets */}
                          {Object.entries(aaveBalances).some(([_, data]) => (data.supplyBalance * data.price) > 0.5) && (
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground border-t pt-2 flex items-center space-x-1">
                                <span>Supplied Assets:</span>
                              </div>
                              {Object.entries(aaveBalances).slice(0, 3).map(([crypto, data]) => {
                                const totalAssetValue = (data.supplyBalance || 0) * data.price;
                                if (totalAssetValue > 0.5) {
                                  return (
                                    <div key={crypto} className="flex justify-between text-xs">
                                      <span className="font-medium text-green-700">{crypto}</span>
                                      <span className="text-green-600">${totalAssetValue.toFixed(2)}</span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          )}

                          {/* Borrowed Assets */}
                          {Object.entries(aaveBalances).some(([_, data]) => {
                            const borrowAmount = data.borrowBalance || 0;
                            return (borrowAmount * data.price) > 0.1;
                          }) && (
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground border-t pt-2 flex items-center space-x-1">
                                <span>Borrowed Assets:</span>
                              </div>
                              {Object.entries(aaveBalances).map(([crypto, data]) => {
                                const borrowBalance = data.borrowBalance || 0;
                                const totalBorrowedValue = borrowBalance * data.price;
                                
                                if (totalBorrowedValue > 0.1) {
                                  return (
                                    <div key={crypto} className="flex justify-between text-xs">
                                      <span className="font-medium text-orange-700">{crypto}</span>
                                      <span className="text-orange-600">-${totalBorrowedValue.toFixed(2)}</span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          )}

                          {/* Optional: Net Position Summary */}
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground border-t pt-2">
                              Net Position:
                            </div>
                            {(() => {
                              const totalSupplied = Object.values(aaveBalances).reduce((sum, data) => 
                                sum + (data.supplyBalance * data.price), 0
                              );
                              const totalBorrowed = Object.values(aaveBalances).reduce((sum, data) => 
                                sum + (data.borrowBalance * data.price), 0
                              );
                              const netPosition = totalSupplied - totalBorrowed;
                              
                              return (
                                <div className="flex justify-between text-xs font-medium">
                                  <span>Total Net Value:</span>
                                  <span className={netPosition >= 0 ? "text-green-600" : "text-red-600"}>
                                    {netPosition >= 0 ? "+" : ""}${netPosition.toFixed(2)}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

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
                  <span>Connect wallet to access Tartr</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
      </SidebarContent>
    </Sidebar>
  );
}