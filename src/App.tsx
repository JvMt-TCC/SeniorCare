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
import MeusEventosPage from "./pages/MeusEventosPage";
import SaudePage from "./pages/SaudePage";
import MedicamentoDetailPage from "./pages/MedicamentoDetailPage";
import LocalCuidadoDetailPage from "./pages/LocalCuidadoDetailPage";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import PrivacyTermsPage from "./pages/PrivacyTermsPage";
import MobileLayout from "./components/MobileLayout";
import NotFound from "./pages/NotFound";
import { TaskProvider } from "./contexts/TaskContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AlarmProvider } from "./contexts/AlarmContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sugestoes" element={<SugestoesPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/meus-eventos" element={<MeusEventosPage />} />
        <Route path="/saude" element={<SaudePage />} />
        <Route path="/saude/medicamentos/:id" element={<MedicamentoDetailPage />} />
        <Route path="/saude/locais/:id" element={<LocalCuidadoDetailPage />} />
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
