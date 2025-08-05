const Footer = () => {
  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-foreground">tartr</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Deposit crypto as collateral and borrow stablecoins instantly with the most trusted lending platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Borrow</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Markets</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Portfolio</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Audits</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Discord</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Telegram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 tartr. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;