
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
import { CreditCard, Plus, PieChart, ArrowLeft, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Sidebar className="w-64">
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
