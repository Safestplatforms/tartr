
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BorrowSection from "@/components/BorrowSection";
import TartrVisaSection from "@/components/TartrVisaSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <BorrowSection />
        <TartrVisaSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
