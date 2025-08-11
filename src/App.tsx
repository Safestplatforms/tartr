import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import Index from "./pages/Index";
import Platform from "./pages/Platform";
import ContactSales from "./pages/ContactSales";
import LoanApplication from "./pages/LoanApplication";
import LoanSuccess from "./pages/LoanSuccess";
import LoanDetails from "./pages/LoanDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThirdwebProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/contact-sales" element={<ContactSales />} />
            <Route path="/platform/apply" element={<LoanApplication />} />
            <Route path="/platform/success" element={<LoanSuccess />} />
            <Route path="/platform/loan/:loanId" element={<LoanDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThirdwebProvider>
);

export default App;