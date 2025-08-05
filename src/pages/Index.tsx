import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BorrowSection from "@/components/BorrowSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <BorrowSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
