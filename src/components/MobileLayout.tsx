import { ReactNode, useState, useEffect } from "react";
import { Bell, Clock } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import FixedChat from "./FixedChat";
import NotificationsModal from "./NotificationsModal";
import AlarmModal from "./AlarmModal";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAlarms } from "@/contexts/AlarmContext";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { user } = useAuth();
  const { alarms } = useAlarms();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alarmsOpen, setAlarmsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

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
      {/* Header com ícones */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b pt-safe-top">
        <div className="flex justify-end items-center px-4 py-3 space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAlarmsOpen(true)}
            className="relative"
          >
            <Clock size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenNotifications}
            className="relative"
          >
            <Bell size={24} />
            {hasNewNotifications && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full border-2 border-background animate-pulse" />
            )}
          </Button>
        </div>
      </div>

      <main className="pb-24 px-4 pt-20 fade-in min-h-screen mobile-scroll">
        {children}
      </main>
      
      <FixedChat />
      <BottomNavigation />
      
      <NotificationsModal 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
      <AlarmModal 
        open={alarmsOpen} 
        onOpenChange={setAlarmsOpen} 
      />
    </div>
  );
};

export default MobileLayout;