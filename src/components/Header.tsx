import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-semibold text-foreground">tartr</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#borrow" className="text-muted-foreground hover:text-foreground transition-colors">
            Borrow
          </a>
          <a href="#markets" className="text-muted-foreground hover:text-foreground transition-colors">
            Markets
          </a>
          <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
            Portfolio
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="outline">Connect Wallet</Button>
          <Button>Launch App</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;