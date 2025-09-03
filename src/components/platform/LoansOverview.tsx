import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Eye, Loader2, Shield } from "lucide-react";
import { useAaveData } from "@/hooks/useAaveData";
import { useAaveTransactions } from "@/hooks/useAaveTransactions";
import { SUPPORTED_ASSETS } from "@/lib/aave/config";
import { toast } from "sonner";

interface LoansOverviewProps {
  onTabChange?: (tab: string) => void;
}

const LoansOverview = ({ onTabChange }: LoansOverviewProps) => {
  const navigate = useNavigate();
  const { 
    aaveBalances, 
    totalSupplied, 
    totalBorrowed, 
    healthFactor, 
    isLoading 
  } = useAaveData();

  const [actionLoading, setActionLoading] = useState<{type: string, asset: string} | null>(null);

  // Create loan positions from real Aave data - show any position with supplied collateral if there's any borrowing
  const activeLoans = totalBorrowed > 0 ? 
    Object.entries(aaveBalances)
      .filter(([symbol, data]) => data.supplyBalance > 0) // Show any collateral positions when there's borrowing
      .map(([symbol, data]) => {
        const collateralValue = data.supplyBalance * data.price;
        const ltv = totalSupplied > 0 ? (totalBorrowed / totalSupplied) * 100 : 0;
        
        // Mock APR for display (you can replace with real data)
        const mockAPR = symbol === 'ETH' ? 4.5 : symbol === 'WBTC' ? 3.8 : 5.2;
        
        // Simple liquidation price calculation
        const liquidationThreshold = 0.80; // 80% threshold
        const liquidationPrice = data.supplyBalance > 0 ? 
          (totalBorrowed / (data.supplyBalance * liquidationThreshold)) : 0;
        
        return {
          id: symbol,
          collateralAsset: symbol,
          collateralAmount: data.supplyBalance,
          borrowValue: totalBorrowed, // Use total borrowed across all assets
          borrowAsset: 'Mixed', // Could be multiple assets
          ltv: ltv,
          liquidationPrice: liquidationPrice,
          apr: mockAPR,
          healthFactor: healthFactor
        };
      }) : [];

  // Button handlers
  const handleAddCollateral = (symbol: string) => {
    onTabChange?.('portfolio');
    toast.info(`Navigate to Portfolio to add more ${symbol} collateral`);
  };

  const handleRepay = (symbol: string) => {
    onTabChange?.('portfolio');
    toast.info(`Navigate to Portfolio to repay your ${symbol} loan`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading Loans Data...</p>
        </div>
      </div>
    );
  }

  if (activeLoans.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Active Loans</h2>
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Loans</h3>
          <p className="text-muted-foreground mb-6">
            Supply collateral and borrow assets to start earning.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => onTabChange?.('portfolio')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Supply Assets
            </Button>
            <Button
              onClick={() => onTabChange?.('borrow')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Borrow Assets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Loans Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mt-2 text-foreground">Active Loans</h2>
        
        <div className="space-y-4">
          {activeLoans.map((loan) => (
            <div key={loan.id} className="border border-border rounded-2xl p-6 bg-card">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                {/* Collateral */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Collateral</p>
                  <p className="text-lg font-semibold">
                    {loan.collateralAmount.toFixed(6)} {loan.collateralAsset}
                  </p>
                </div>

                {/* Borrowed */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Borrowed</p>
                  <p className="text-lg font-semibold">
                    ${loan.borrowValue.toLocaleString()}
                  </p>
                </div>

                {/* LTV with Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">LTV</span>
                    <span className="text-sm font-semibold">{loan.ltv.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        loan.ltv < 50 ? 'bg-blue-500' : 
                        loan.ltv < 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(loan.ltv, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Health Factor */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Health Factor</p>
                  <p className={`text-lg font-semibold ${
                    loan.healthFactor >= 2.0 ? 'text-green-600' :
                    loan.healthFactor >= 1.5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {loan.healthFactor.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-border gap-4">
                <div className="flex items-center space-x-6 text-sm">
                  <span className="font-medium">{loan.apr}% APR</span>
                  <span className="text-muted-foreground">
                    Liquidation: ${loan.liquidationPrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddCollateral(loan.collateralAsset)}
                    disabled={actionLoading?.type === 'supply'}
                  >
                    Add Collateral
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRepay(loan.collateralAsset)}
                    disabled={actionLoading?.type === 'repay'}
                  >
                    Repay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Management Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Risk Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Healthy */}
          <div className={`rounded-2xl p-6 text-center ${
            healthFactor >= 2.0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className={`text-2xl font-bold mb-2 ${
              healthFactor >= 2.0 ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              Healthy
            </h3>
            <p className="text-sm text-muted-foreground">
              Health Factor {'>'}= 2.0
            </p>
          </div>

          {/* Caution */}
          <div className={`rounded-2xl p-6 text-center ${
            healthFactor >= 1.5 && healthFactor < 2.0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className={`text-2xl font-bold mb-2 ${
              healthFactor >= 1.5 && healthFactor < 2.0 ? 'text-yellow-600' : 'text-muted-foreground'
            }`}>
              Caution
            </h3>
            <p className="text-sm text-muted-foreground">
              Health Factor 1.5-2.0
            </p>
          </div>

          {/* At Risk */}
          <div className={`rounded-2xl p-6 text-center ${
            healthFactor < 1.5 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className={`text-2xl font-bold mb-2 ${
              healthFactor < 1.5 ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              At Risk
            </h3>
            <p className="text-sm text-muted-foreground">
              Health Factor  {'<'}1.5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansOverview;