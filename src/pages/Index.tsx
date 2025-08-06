
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import SupportedAssets from "@/components/SupportedAssets";
import BorrowSection from "@/components/BorrowSection";
import SecurityTrust from "@/components/SecurityTrust";
import TartrVisaSection from "@/components/TartrVisaSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SupportedAssets />
        <BorrowSection />
        <SecurityTrust />
        <TartrVisaSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
