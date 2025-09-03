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
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  ArrowLeft, 
  Wallet, 
  Shield,
  ChevronRight,
  Home,
  Banknote,
  ArrowUpDown,
  Coins
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlatformSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isWalletConnected: boolean;
}

const menuItems = [
  {
    id: "dashboard", // Changed from "portfolio" to "dashboard"
    title: "Dashboard",
    icon: Home,
  },
  {
    id: "borrow",
    title: "New Loan",
    icon: Banknote,
  },
  {
    id: "send-receive",
    title: "Send/Receive",
    icon: ArrowUpDown,
  },
  {
    id: "loans",
    title: "Loans",
    icon: Coins,
  },
  {
    id: "card",
    title: "Card",
    icon: CreditCard,
  },
];

export function PlatformSidebar({ activeTab, onTabChange, isWalletConnected }: PlatformSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r-0 shadow-xl backdrop-blur-xl bg-sidebar/95 supports-[backdrop-filter]:bg-sidebar/80">
      <SidebarHeader className="p-5 border-b border-sidebar-border/50">
        <Link to="/" className="flex items-center gap-3 mb-2 cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          {open && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-black">Tartr</h2>
              <p className="text-xs text-sidebar-foreground/70">Secure DeFi Platform</p>
            </div>
          )}
        </Link>
    </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn("px-2 text-sidebar-foreground/70", !open && "sr-only")}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    disabled={!isWalletConnected}
                    className={cn(
                      "group w-full h-11 px-3 rounded-xl transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 glass-shimmer"
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                      !isWalletConnected && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-200",
                      activeTab === item.id 
                        ? "text-primary-foreground drop-shadow-sm" 
                        : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                    )} />
                    {open && (
                      <>
                        <span className="font-medium">{item.title}</span>
                        {activeTab === item.id && (
                          <ChevronRight className="ml-auto h-4 w-4 text-primary-foreground/70" />
                        )}
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isWalletConnected && open && (
          <div className={cn(
            "glass-shimmer-slow rounded-xl p-4 bg-sidebar-accent/20 border border-sidebar-border/30",
            "backdrop-blur-sm mt-4"
          )}>
            <div className="flex items-center space-x-2 text-sidebar-foreground/70">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Connect wallet to access platform</span>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className={cn(
          "glass-shimmer-slow rounded-xl p-4 bg-sidebar-accent/30 border border-sidebar-border/30",
          "backdrop-blur-sm"
        )}>
          <div className="flex items-center space-x-3 mb-3">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse shadow-lg",
              isWalletConnected ? "bg-emerald-500 shadow-emerald-500/50" : "bg-orange-500 shadow-orange-500/50"
            )} />
            {open && (
              <span className="text-sm font-semibold text-sidebar-foreground">Wallet Status</span>
            )}
          </div>
          {open && (
            <>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className={cn(
                  "h-4 w-4 drop-shadow-sm",
                  isWalletConnected ? "text-emerald-500" : "text-orange-500"
                )} />
                <span className="text-sm font-medium text-sidebar-foreground">
                  {isWalletConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
                {isWalletConnected 
                  ? "Ready for DeFi transactions" 
                  : "Connect to start trading"
                }
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-sidebar-foreground/60">Network</span>
                <span className={cn(
                  "text-xs font-medium",
                  isWalletConnected ? "text-emerald-500" : "text-sidebar-foreground/60"
                )}>
                  {isWalletConnected ? "Mainnet" : "Not Connected"}
                </span>
              </div>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}