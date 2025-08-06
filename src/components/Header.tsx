import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-foreground">tartr</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#assets" className="text-muted-foreground hover:text-foreground transition-colors">
            Assets
          </a>
          <a href="#borrow" className="text-muted-foreground hover:text-foreground transition-colors">
            Borrow
          </a>
          <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
            Security
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center">
          <Link to="/platform">
            <Button variant="outline" size="sm" className="text-sm px-3 py-2 md:text-base md:px-4 md:py-2">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;