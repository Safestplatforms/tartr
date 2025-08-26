import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

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
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            Platform Growth
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands who trust tartr with their assets
          </p>
        </div>

        {/* Improved responsive grid - single column on small mobile, 2 columns on mobile, 4 on larger screens */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-4 sm:p-6 text-center">
                {/* Trend indicator - Better mobile sizing */}
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-destructive" />
                  )}
                  <span className={`text-sm sm:text-base font-medium ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                {/* Main stat value - Responsive typography */}
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                  {stat.value}
                </p>
                
                {/* Label - Better line height */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional context for better UX on mobile */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Real-time metrics showing the growth and adoption of the tartr platform
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;