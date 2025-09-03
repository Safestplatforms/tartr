import { Button } from "@/components/ui/button";
import { 
  Home,
  ArrowUpDown,
  Plus,
  Coins,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isWalletConnected: boolean;
}

const MobileBottomNav = ({ activeTab, onTabChange, isWalletConnected }: MobileBottomNavProps) => {
  const menuItems = [
    {
      id: "dashboard",
      title: "Home",
      icon: Home,
    },
    {
      id: "send-receive",
      title: "Transfer",
      icon: ArrowUpDown,
    },
    {
      id: "borrow",
      title: "New Loan",
      icon: Plus,
      highlight: true, // Center button with different styling
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

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around py-2 px-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => isWalletConnected && onTabChange(item.id)}
            disabled={!isWalletConnected}
            className={cn(
              "flex flex-col items-center space-y-1 h-14 px-3 rounded-2xl transition-all",
              item.highlight && "bg-blue-500 text-white hover:bg-blue-600 scale-110",
              !item.highlight && activeTab === item.id && "text-primary bg-primary/10",
              !isWalletConnected && "opacity-50 cursor-not-allowed"
            )}
          >
            <item.icon className={cn(
              "h-3 w-3",
              item.highlight ? "text-white" : activeTab === item.id ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs font-medium",
              item.highlight ? "text-white" : activeTab === item.id ? "text-primary" : "text-muted-foreground"
            )}>
              {item.title}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;