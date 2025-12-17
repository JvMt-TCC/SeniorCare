import { ReactNode, useState, useEffect } from "react";
import { Bell, User, Bookmark, Calendar as CalendarIcon, AlertTriangle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import NotificationsModal from "./NotificationsModal";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAlarms } from "@/contexts/AlarmContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { user, profile } = useAuth();
  const { alarms } = useAlarms();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
    setEmergencyOpen(false);
  };

  // Verificar notificações não lidas
  useEffect(() => {
    const checkNotifications = async () => {
      if (!user) return;

      // Verificar pedidos de amizade pendentes
      const { data: requests } = await supabase
        .from('friendship_requests')
        .select('id')
        .eq('to_user_id', user.id)
        .eq('status', 'pending');

      const pendingCount = requests?.length || 0;
      setPendingRequestsCount(pendingCount);

      // Verificar se há alarmes ativos
      const activeAlarms = alarms.filter(alarm => alarm.isActive).length;

      // Mostrar badge se houver pedidos pendentes ou alarmes ativos
      setHasNewNotifications(pendingCount > 0 || activeAlarms > 0);
    };

    checkNotifications();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, alarms]);

  // Resetar indicador quando abrir o modal de notificações
  const handleOpenNotifications = () => {
    setNotificationsOpen(true);
    setHasNewNotifications(false);
  };

  return (
    <div className="mobile-container">
      {/* Header com safe areas do iOS */}
      <div 
        className="fixed top-0 left-0 right-0 z-40 bg-background/98 backdrop-blur-md border-b border-border/50 shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex justify-center items-center px-4 py-2">
          {/* Todos os ícones centralizados em uma linha */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/perfil')}
              className="h-11 w-11 hover:bg-primary-soft/50"
            >
              <User size={24} className="text-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/meus-eventos')}
              className="h-11 w-11 hover:bg-primary-soft/50"
            >
              <Bookmark size={24} className="text-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEmergencyOpen(true)}
              className="h-11 w-11 hover:bg-destructive/10 text-destructive"
            >
              <AlertTriangle size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/calendario')}
              className="h-11 w-11 hover:bg-primary-soft/50"
            >
              <CalendarIcon size={24} className="text-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenNotifications}
              className="relative h-11 w-11 hover:bg-primary-soft/50"
            >
              <Bell size={24} className="text-foreground" />
              {hasNewNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <main 
        className="pb-24 px-4 fade-in min-h-screen mobile-scroll"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4rem)' }}
      >
        {children}
      </main>
      
      <BottomNavigation />
      
      <NotificationsModal 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
      
      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-destructive">
              Emergência
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={() => handleEmergencyCall("192")}
              className="w-full h-20 text-lg bg-destructive hover:bg-destructive/90"
              size="lg"
            >
              <Phone className="mr-2" size={24} />
              Ligar para SAMU (192)
            </Button>

            {profile?.trusted_contact_phone && (
              <Button
                onClick={() => handleEmergencyCall(profile.trusted_contact_phone!)}
                className="w-full h-20 text-lg"
                variant="outline"
                size="lg"
              >
                <Phone className="mr-2" size={24} />
                Ligar para {profile.trusted_contact_name || "Contato de Confiança"}
              </Button>
            )}

            {!profile?.trusted_contact_phone && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Adicione um contato de confiança nas configurações do seu perfil
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileLayout;