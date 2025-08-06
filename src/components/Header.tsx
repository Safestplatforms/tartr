import { Button } from "@/components/ui/button";
const Header = () => {
  return <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          
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

        <div className="flex items-center">
          <Button variant="outline">Connect Wallet</Button>
        </div>
      </div>
    </header>;
};
export default Header;