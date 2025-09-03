import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowUpDown,
  DollarSign,
  RefreshCw,
  Clock,
  ExternalLink,
  Eye,
  Send,
  Download,
  ShoppingCart,
  PieChart,
  BarChart3
} from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import PortfolioTab from "@/components/platform/PortfolioTab";
import RatesTab from "@/components/platform/RatesTab";
import TransactionHistory from "@/components/platform/TransactionHistory";

// Dashboard Component with vertical sections
const Dashboard = () => {
  const { totalValue, totalSupplied, totalBorrowed, healthFactor, isLoading } = useAaveData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Portfolio Section */}
      <section className="space-y-4">
        <PortfolioTab />
      </section>

      {/* 2. Market Rates Section */}
      <section className="space-y-4">
        <RatesTab />
      </section>

      {/* 3. Transaction History Section */}
      <section className="space-y-4">
        <TransactionHistory />
      </section>

      {/* Bottom spacing */}
      <div className="pb-8" />
    </div>
  );
};

export default Dashboard;