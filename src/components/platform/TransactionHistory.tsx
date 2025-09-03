import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowUpDown,
  RefreshCw,
  Send,
  Download
} from "lucide-react";

const TransactionHistory = () => {
  // Mock transaction data matching the design
  const transactions = [
    {
      id: 1,
      type: 'Supply ETH',
      category: 'Supply',
      description: 'Supply Etherium',
      timestamp: '1/15/2024 02:32 PM',
      status: 'Confirmed',
      amount: '+0.00007 ETH',
      value: '+$2.50',
      fee: '$0.38'
    },
    {
      id: 2,
       type: 'Borrow USDC',
      category: 'Borrow',
      description: 'Borrow USDC',
      timestamp: '1/15/2024 02:32 PM',
      status: 'Confirmed',
      amount: '+1.50 USDC',
      value: '+$1.50',
      fee: '$0.22'
    },
    {
      id: 3,
       type: 'Repay USDC',
      category: 'Repay',
      description: 'Repay USDC',
      timestamp: '1/15/2024 02:32 PM',
      status: 'Confirmed',
      amount: '+1.20 USDC',
      value: '+$1.20',
      fee: '$0.28'
    },
    {
       type: 'Supply ETH',
      category: 'Supply',
      description: 'Supply Etherium',
      timestamp: '1/15/2024 02:32 PM',
      status: 'Confirmed',
      amount: '+0.00007 ETH',
      value: '+$2.50',
      fee: '$0.38'
    },
    {
       type: 'Supply ETH',
      category: 'Supply',
      description: 'Supply Etherium',
      timestamp: '1/15/2024 02:32 PM',
      status: 'Confirmed',
      amount: '+0.00007 ETH',
      value: '+$2.50',
      fee: '$0.38'
    }
  ];

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'Supply':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Borrow':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'Repay':
        return <ArrowUpDown className="w-4 h-4 text-blue-600" />;
      case 'receive':
        return <Download className="w-4 h-4 text-green-600" />;
      case 'send':
        return <Send className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        className={`text-xs ${
          status === 'Confirmed' 
            ? 'bg-green-100 text-green-700 border-green-300' 
            : 'bg-yellow-100 text-yellow-700 border-yellow-300'
        }`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Transaction History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 ">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center border rounded-2xl justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {getTransactionIcon(tx.category)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{tx.type}</span>
                    {getStatusBadge(tx.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>{tx.description}</div>
                    <div>{tx.timestamp}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-medium ${
                  tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.amount}
                </div>
                <div className="text-sm text-muted-foreground">
                  {tx.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  Fee: {tx.fee}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;