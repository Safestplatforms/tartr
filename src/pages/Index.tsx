
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import BorrowSection from "@/components/BorrowSection";
import SecurityTrust from "@/components/SecurityTrust";
import TartrVisaSection from "@/components/TartrVisaSection";
import StatsSection from "@/components/StatsSection";
import FinanceUnlocked from "@/components/FinanceUnlocked";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <BorrowSection />
        <SecurityTrust />
        <FinanceUnlocked />
        <TartrVisaSection />
        <StatsSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
