import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does crypto-backed lending work?",
      answer: "You deposit your crypto assets as collateral and borrow stablecoins against them. Your crypto remains in a secure smart contract while you access liquidity without selling your holdings."
    },
    {
      question: "What happens if my collateral value drops?",
      answer: "If your loan-to-value ratio exceeds the liquidation threshold (typically 80%), your collateral may be partially liquidated to maintain the required ratio. You'll receive notifications before this happens."
    },
    {
      question: "How quickly can I get my loan?",
      answer: "Loans are processed instantly once your transaction is confirmed on the blockchain. There's no credit check or approval process - just deposit collateral and borrow immediately."
    },
    {
      question: "What are the interest rates?",
      answer: "Interest rates are dynamic and based on supply and demand. Current rates start from 3.5% APY for USDC and 4.2% APY for USDT, with competitive rates that adjust automatically."
    },
    {
      question: "Can I repay my loan early?",
      answer: "Yes, you can repay your loan at any time without penalties. Interest is calculated based on the actual borrowing period, so early repayment saves you money."
    },
    {
      question: "What crypto assets can I use as collateral?",
      answer: "We currently support Bitcoin (BTC) and Ethereum (ETH) as collateral. More assets will be added based on community demand and security assessments."
    },
    {
      question: "Is my crypto safe?",
      answer: "Yes, your assets are secured in audited smart contracts. We use multi-signature wallets, regular security audits, and insurance coverage to protect user funds."
    },
    {
      question: "Do I need to complete KYC?",
      answer: "For loans under $10,000, no KYC is required. Larger loans may require identity verification to comply with regulatory requirements in your jurisdiction."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our crypto lending platform
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;