import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";

const Header = () => {
  const navigate = useNavigate();
  const account = useActiveAccount();

  // Redirect to platform when wallet connects
  useEffect(() => {
    if (account) {
      navigate('/platform');
    }
  }, [account, navigate]);

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
         <ConnectButton
          client={client}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          connectButton={{
            style: {
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "6px 10px",
              fontSize: "18px",
              fontWeight: "500",
            }
          }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;