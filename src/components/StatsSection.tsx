import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      label: "Total Value Locked",
      value: "$12.4M",
      change: "+23.1%",
      trend: "up"
    },
    {
      label: "Active Loans",
      value: "1,247",
      change: "+15.2%", 
      trend: "up"
    },
    {
      label: "Average APY",
      value: "4.0%",
      change: "-0.3%",
      trend: "down"
    },
    {
      label: "Users",
      value: "2,891",
      change: "+42.8%",
      trend: "up"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Platform Growth
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands who trust tartr with their assets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-border">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`} />
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;