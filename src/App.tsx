import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SugestoesPage from "./pages/SugestoesPage";
import CalendarioPage from "./pages/CalendarioPage";
import MensagensPage from "./pages/MensagensPage";
import PerfilPage from "./pages/PerfilPage";
import EventDetailPage from "./pages/EventDetailPage";
import LoginPage from "./pages/LoginPage";
import PrivacyTermsPage from "./pages/PrivacyTermsPage";
import MobileLayout from "./components/MobileLayout";
import NotFound from "./pages/NotFound";
import { TaskProvider } from "./contexts/TaskContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AlarmProvider } from "./contexts/AlarmContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sugestoes" element={<SugestoesPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/mensagens" element={<MensagensPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
        <Route path="/evento/:id" element={<EventDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MobileLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AlarmProvider>
          <TaskProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TaskProvider>
        </AlarmProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
