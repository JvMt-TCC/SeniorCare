import { ReactNode, useState } from "react";
import { Bell, Clock } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import FixedChat from "./FixedChat";
import NotificationsModal from "./NotificationsModal";
import AlarmModal from "./AlarmModal";
import { Button } from "./ui/button";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alarmsOpen, setAlarmsOpen] = useState(false);

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
            onClick={() => setNotificationsOpen(true)}
            className="relative"
          >
            <Bell size={24} />
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