import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { FarmerProtectedRoute } from "./components/FarmerProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import ResidueListingPage from "./pages/farmer/ResidueListingPage";
import PaymentRecordsPage from "./pages/farmer/PaymentRecordsPage";
import FarmerProfilePage from "./pages/farmer/FarmerProfilePage";
import PanchayatManagePage from "./pages/panchayat/ManagePage";
import "./lib/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="grameen-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<AboutUs />} />
              {/* Panchayat Routes */}
              <Route path="/panchayat/manage" element={<PanchayatManagePage />} />
              {/* Farmer Routes */}
              <Route path="/farmer/residue-listing" element={
                <FarmerProtectedRoute>
                  <ResidueListingPage />
                </FarmerProtectedRoute>
              } />
              <Route path="/farmer/payment-records" element={
                <FarmerProtectedRoute>
                  <PaymentRecordsPage />
                </FarmerProtectedRoute>
              } />
              <Route path="/farmer/profile" element={
                <FarmerProtectedRoute>
                  <FarmerProfilePage />
                </FarmerProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
